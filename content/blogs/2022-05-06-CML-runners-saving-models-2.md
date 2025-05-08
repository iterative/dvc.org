---
title:
  Training and saving models with CML on a dedicated AWS EC2 runner (part 2)
date: 2022-05-06
description:
  Use CML to automatically retrain a model on a provisioned AWS EC2 instance and
  export the model to a DVC remote storage on Google Drive.
descriptionLong: >
  We can use CML to automatically retrain models whenever data, model code, or
  parameters change. In this guide we show how to create a pipeline that
  provisions an AWS EC2 instance to retrain a model and save the output on a
  regular basis. In this part 2 we cover how to export the model to a DVC remote
  on Google Drive.
picture: 2022-05-06/saving-models-2-cover.jpeg
author: rob_dewit
commentsUrl: https://discuss.dvc.org/t/training-and-saving-models-with-cml-on-a-self-hosted-aws-ec2-runner/1155
tags:
  - CML
  - DVC
  - Git
  - Pipelines
  - Self-hosted runners
  - Cloud training
  - AWS
  - Google Drive
  - Tutorial
---

In [part 1 of this guide](https://dvc.org/blog/CML-runners-saving-models-1) we
showed how you can use CML to provision an AWS EC2 instance to train your model
before saving the model to our Git repository. In doing so, we allowed ourselves
to terminate the training instance without losing our model altogether.

This worked perfectly fine for the simple model we trained, but this approach is
not optimal when dealing with larger models. GitHub starts warning you at 50MB
files and simply
[won't upload anything over 100MB](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
[GitLab similarly limits](https://docs.gitlab.com/ee/user/gitlab_com/index.html#account-and-limit-settings)
the size of files you can store in your repository. A beefy XGBoost model can
easily exceed 100MB and a neural network can go up into the gigabytes.

That means we cannot save these models directly to our repository. Luckily we
can look towards another one of Iterative's open-source tools:
[DVC](https://dvc.org). DVC includes a lot of features for managing machine
learning projects, such as ML pipelines, experiment tracking, and data
versioning. In this guide we will zoom in on just one of those features: remote
storage.

We can use DVC to save our model to a remote storage location, such as M3, HDFS,
an SFTP server, or even Google Drive. Much like Git tracks changes to your code,
DVC tracks changes to your data. It puts a reference to a specific version of
your data in the Git commit. That way your code is linked to a specific version
of your model, without containing the actual model.

In this part 2, we will show you how to save the model we trained in part 1 to a
DVC remote. At the end of this guide our CML workflow will be doing the folowing
on a daily basis:

1. Provision an Amazon Web Services (AWS) EC2 instance
1. Train the model
1. Save the model to a DVC remote storage on Google Drive
1. Save the model metrics to a GitHub repository
1. Create a merge request with the new outputs
1. Terminate the AWS EC2 instance

All files needed for this guide can be found in
[this repository](https://github.com/iterative/example_model_export_cml).

<admon type="tip">

We will be using Google Drive as our remote storage. With slight modifications,
however, you can also use other remotes such as AWS S3, GCP Cloud Storage, and
Azure Storage. Please
[refer to the DVC Docs](https://dvc.org/doc/command-reference/remote/add#supported-storage-types)
for more details.

</admon>

# Prerequisites

Make sure to have followed
[part 1 of this guide](https://dvc.org/blog/CML-runners-saving-models-1) and
have gotten CML up and running. The necessary files for all of this can be found
in [this repository](https://github.com/iterative/example_model_export_cml).
Additionally, set up the following things beforehand:

- [Install DVC](https://dvc.org/doc/install)
- [Set up a GCP project](https://dvc.org/doc/user-guide/setup-google-drive-remote#using-a-custom-google-cloud-project-recommended)
- [Enable the Google Drive API for your GCP project](https://console.cloud.google.com/apis/library/drive.googleapis.com)
- [Create a GCP service account and download the private key to a safe location](https://dvc.org/doc/user-guide/setup-google-drive-remote#using-service-accounts)
- [Create a Google Drive directory to save your model to](https://support.google.com/drive/answer/2375091?hl=en&co=GENIE.Platform%3DDesktop)
- [Grant the service account editor permissions to the Drive directory by sharing it with the service account's email address](https://support.google.com/drive/answer/7166529?hl=en&co=GENIE.Platform%3DDesktop)

# Setting up our DVC remote

When first using DVC in a project, you need to initialize DVC by running
`dvc init`. This will create the structure DVC uses to keep track of versioning,
and ensures Git will not be tracking the files in the DVC repository. Instead,
Git will henceforth include a list of references to those files. Make sure to
commit the initialization to Git.

Then, in order to start using DVC for versioning, we need to set up a remote.
This is where our model files will end up, while DVC keeps track of their
respective versions. Here we will be using Google Drive as our remote.

[The DVC user guide](https://dvc.org/doc/user-guide/setup-google-drive-remote#setup-a-google-drive-dvc-remote)
explains how to set up a remote on Google Drive. If you would rather use another
remote, you can
[find instructions here](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).
In that case make sure to also update the DVC dependency in `requirements.txt`.

While DVC doesn't require a service account to work, we do need one in the
set-up we're aiming for. That's because without a service account we will need
to authorize ourselves through a log-in page every time. Our self-hosted runner
would get stuck on this page because we cannot authorize ourselves there.

In order to let DVC access the Google Drive folder we created from our runner,
we need to add two more GitHub Actions secrets: `GDRIVE_CREDENTIALS_DATA` and
`GOOGLE_DRIVE_URI`. The first one should contain the private key we downloaded
when setting up our service account (i.e. the `.json` file). The second one
should be the [Drive URI](https://cloud.google.com/bigquery/external-data-drive)
to the directory we created in Google Drive (i.e. the sequence of random
characters at the end of our Google Drive URL).

# Export the model to a DVC remote

Now that we have set up the remote and made sure GitHub Actions has all the
details needed to access the remote, we can use the workflow below. In this
scenario, we train the model in the same way as in part 1, but we push it to the
DVC remote. A reference to the location of this file is added to the GitHub
repository (`model/random_forest.joblib.dvc`). The model itself is added to
`.gitignore` and not pushed to the repository.

The other files created in `train.py` are still pushed to an experiment branch
in GitHub. Afterwards a merge request is created.

```yaml
name: CML with DVC
on: # Here we use two triggers: manually and daily at 08:00
  workflow_dispatch:
  schedule:
    - cron: '0 8 * * *'
jobs:
  deploy-runner:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: iterative/setup-cml@v1
      - name: Deploy runner on EC2
        env:
          REPO_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          cml runner \
              --cloud=aws \
              --cloud-region=eu-west \
              --cloud-type=t2.micro \
              --labels=cml-runner \
              --single
  train-model:
    needs: deploy-runner
    runs-on: [self-hosted, cml-runner]
    timeout-minutes: 120 # 2h
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.x'
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - uses: iterative/setup-cml@v1
      - name: Train model
        env:
          REPO_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          GDRIVE_CREDENTIALS_DATA: ${{ secrets.GDRIVE_CREDENTIALS_DATA }}
        run: |
          cml ci
          pip install -r requirements.txt

          python get_data.py
          python train.py

          # Connect to your DVC remote storage and push the model to there
          dvc add model/random_forest.joblib # This automatically adds the model to your .gitignore
          dvc remote add -d -f myremote gdrive://${{ secrets.GOOGLE_DRIVE_URI }}
          dvc remote modify myremote gdrive_use_service_account true
          dvc push

          # Create pull request for the remaining files
          cml pr .

          # Create CML report
          cat model/metrics.txt > report.md
          cml publish model/confusion_matrix.png --md >> report.md
          cml send-comment --pr --update report.md
```

And that's it! We have broadly the same set-up as outlined in part 1 of this
guide, but we no longer use our GitHub repository for storing our model.
Instead, the model is now saved to Google Drive, which allows for much larger
models.

<admon type="tip">

In a situation where we retrain our model daily based on the most recent data,
it would make sense to also use DVC to keep track of the data used in each
training. We could, for example, use our runner to import our training data from
a table in our database and write both the data and the model to the DVC remote.
This is beyond the scope of this guide, but
[here you can find a repository that covers this](https://github.com/iterative/cml_dvc_case).

</admon>

<admon type="tip">

While we have achieved our goal of using DVC for our model storage, there are
some other DVC features we could benefit from as well. We could define a
reproducible pipeline to replace our manual `get_data.py` and `train.py` tasks.
[Here you can find](https://dvc.org/doc/start/data-pipelines) more information
on how to achieve this.

</admon>

# Conclusions

As we saw in [part 1 of this guide](/blog/CML-runners-saving-models-1), we can
use CML to automate a periodical retraining of our models on a self-hosted
runner. We were able to save the model to our GitHub repository, but that
approach has its limitations with regards to model size.

In this part 2 we worked around those limitations by saving our model to a DVC
remote instead. We set up Google Drive as our remote and adapted our CML
workflow to save our models there. All in all, we can now automatically
(re)train models using a self-hosted runner, track different model versions in
Git, and save models to a remote storage such as Google Drive for future
reference.

A great extension of our CI/CD would be a `deploy` step to bring the latest
version of our model into production. This step might be conditional on the
performance of the model; we could decide to only start using it in production
if it performs better than previous iterations. All of this warrants a guide of
its own, however, so look out for that in the future! 😉
