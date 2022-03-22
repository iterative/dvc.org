---
title: Training and saving models with CML on a dedicated AWS EC2 runner
date: 2022-03-31
description:
  In this guide we will show how you can use CML to automatically retrain a
  model and save its outputs using a provisioned AWS EC2 runner.
descriptionLong: |
  We can use CML to automatically retrain models whenever data, model code,
  or parameters change. In this guide we show how to create a pipeline that
  provisions an AWS EC2 instance to retrain a model and saves the output on
  a regular basis. This way we can prevent drift by ensuring that our model
  always uses the latest input data.
picture: 2015-05-01/post-image.jpeg
pictureComment: Some _Comment_ (supports _basic_ [Markdown](link))
author: rob_dewit
# commentsUrl: https://discuss.dvc.org/t/february-22-community-gems/1078
tags:
  - CML
  - DVC
  - DVC Remotes
  - Git
  - Pipelines
  - AWS
---

When you first develop a machine learning model, you will probably do so on your
local machine. You can easily change algorithms, parameters, and input data
right in your text editor, notebook, or terminal. Imagine you have a
long-running model for which you want to detect possible
[drift](https://en.wikipedia.org/wiki/Concept_drift), however. In that case it
would be beneficial to automatically retrain your model on a regular basis.

In this guide, we will show how you can use
[CML (Continuous Machine Learning)](https://cml.dev/) to do just that. CML is an
open-source library for implementing continuous integration and delivery (CI/CD)
in machine learning projects. This way we can define a pipeline to train a model
and keep track of various versions. Although we could do so directly in our
CI/CD pipeline, the runners used for this generally don’t have a lot of
processing power. Therefore it makes more sense to provision a dedicated runner
that is tailored to our computing needs.

At the end of this guide we will have set up the following:

- A workflow on GitHub actions to train a model every time we change data, model
  code, or parameters;
- Model training on an Amazon Web Services (AWS) instance that has been
  provisioned specifically for the training job;
- Automatic saving of trained models in your GitHub repository and/or a DVC
  remote, along with a report of their performance.

All files needed for this guide can be found in
[this repository](https://github.com/iterative/example_model_export_cml).

> 💡 This guide can be followed on its own, but also as an extension to this
> earlier guide:
> [https://cml.dev/doc/self-hosted-runners](https://cml.dev/doc/self-hosted-runners)

> 💡 We will be using [GitHub](https://github.com/) for our CI/CD and
> [AWS](https://github.com/) for our computing resources. With slight
> modifications, you should also be able to use
> [GitLab](https://about.gitlab.com/) and
> [Google Cloud](https://cloud.google.com/) or
> [Microsoft Azure](https://azure.microsoft.com/en-us/).

# Prerequisites

Before we begin, make sure you have the following things set up:

1. You have
   [created an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
   (free tier suffices);
2. You have created a `PERSONAL_ACCESS_TOKEN` on GitHub
   ([guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token));
3. You have created an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` on AWS
   ([guide](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html));
4. You have added the `PERSONAL_ACCES_TOKEN`, `AWS_ACCESS_KEY_ID`, and
   `AWS_SECRET_ACCESS_KEY` as GitHub secrets
   ([guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets)).

It also helps to clone the following repository:
https://github.com/RCdeWit/CML_train_and_export

<!-- <aside>
⚠️ Make sure to use GitHub secrets rather than copy paste these variables directly in your source. If you don’t, others can act on your behalf on AWS. GitHub will simply block your access token.

Guess how I managed to figure that last one out... 😅

</aside> -->

# Training a model and saving it

Now that we’re good to go, we will adapt `train.py` from the
[CML getting started guide](https://cml.dev/doc/start/github). Here we create a
simple `RandomForestClassifier()` based on some generated data. We then use the
model to make some predictions and plot those predictions in a confusion matrix.

While running the script the model is kept in memory, meaning it is discarded as
soon as the script finishes. In order to save the model for later, we need to
dump it as a binary file. We do so with `joblib.dump()`, and later we can read
the model using `joblib.read()`.

> 💡 You can also use `pickle.dump()` if you prefer.

The outputs of `train.py` are:

- `metrics.txt`: a file containing metrics on model performance;
- `confusion_matrix.png`: a summary of the prediction results of our model;
- `random_forest.joblib`: the binary output of the trained model.

All of these files are saved to the `model` directory on the AWS runner.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import plot_confusion_matrix
import matplotlib.pyplot as plt
import json
import os
import joblib
import numpy as np

# Read in data
X_train = np.genfromtxt("data/train_features.csv")
y_train = np.genfromtxt("data/train_labels.csv")
X_test = np.genfromtxt("data/test_features.csv")
y_test = np.genfromtxt("data/test_labels.csv")

# Fit a model
depth = 5
clf = RandomForestClassifier(max_depth=depth)
clf.fit(X_train,y_train)

# Calculate accuracy
acc = clf.score(X_test, y_test)
print(acc)

# Create model folder if it does not yet exist
if not os.path.exists('model'):
    os.makedirs('model')

# Write metrics to file
with open("model/metrics.txt", 'w+') as outfile:
        outfile.write("Accuracy: " + str(acc) + "\n")

# Plot confusion matrix
disp = plot_confusion_matrix(clf, X_test, y_test, normalize='true',cmap=plt.cm.Blues)
plt.savefig('model/confusion_matrix.png')

# Save the model
joblib.dump(clf, "model/random_forest.joblib")
```

# Train the model on a runner and export it

Now that we have a script to train our model and save it as a file, let’s set up
our CI/CD to provision a runner and run the script. We define our workflow in
`cml.yaml` and save it in the `.github/workflows` directory. This way GitHub
will automatically go through the workflow whenever it is triggered. In this
case the triggers are on push and on a daily schedule.

> 💡 The name of the workflow doesn’t matter, as long as it’s a `.yaml` and
> located in the `.github/workflows` directory. You can have multiple workflows
> in there as well.
> ([Documentation](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions))

The workflow we defined first provisions a runner on AWS and then uses that
runner to train the model. Once we have the outputs saved, we want to export
them out of the runner. That way we can simply discard the runner once we are
done training.

In this guide we will explore two options to export the model from the runner:

1. Push the model directly to a git repository;
2. Push the model to a DVC remote and reference that file in your git
   repository.

In both cases, the other files (`confusion_matrix.png` etc.) will be pushed
directly to the git repository. All of this is done in a dedicated `experiment`
branch and a merge request is automatically created.

## 1. Push the model directly to a git repository

If the model is small we might want to commit it to our repository
automatically. The following GitHub workflow deploys a runner on AWS, generates
some data, trains and saves a model (see `train.py`), pushes the results to a
new experiment branch, and creates a merge request for those results.

Using `cml pr "."` is the command that takes all of our files, pushes them to a
new branch, and creates a merge request. Because we saved the model as a binary
in `model/random_forest.joblib` this file is included in the merge request.

```yaml
name: CML
on: # Here we use three triggers; on push, on manual trigger, and daily at 08:00
  # push:
  workflow_dispatch:
  # schedule:
  #   - cron: '0 8 * * *'
jobs:
  deploy-runner:
    runs-on: ubuntu-latest
    steps:
      - uses: iterative/setup-cml@v1
      - uses: actions/checkout@v2
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
              --single
  train-model:
    needs: deploy-runner
    runs-on: [self-hosted]
    timeout-minutes: 120 # 2h
    container:
      image: docker://iterativeai/cml:0-dvc2-base1
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        env:
          REPO_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
        run: |
          cml ci
          pip install -r requirements.txt
          python train.py

          # Create pull request
          cml pr .

          # Create CML report
          cat model/metrics.txt > report.md
          cml publish model/confusion_matrix.png --md >> report.md
          cml send-comment --pr --update report.md
```

## 2. Push the model to a DVC remote and reference that file in your git repository

While the approach above works fine when the resulting model is small, we
ideally do not want to store large files in git. Therefore, if the model is
contained in a large file, we would prefer to save that file elsewhere. This is
where [DVC](https://dvc.org/) comes in.

Using DVC we can store the model on an external server (a _remote_) and only put
a reference to that file in GitHub. This way we can keep the contents of our git
repository light-weight, while still applying proper versioning to our larger
files (e.g. model and datasets).

You can take a look at [the DVC documentation](https://dvc.org/doc) for more
details.

> 💡 In a situation where we retrain our model daily based on the most recent
> data, it would make sense to also use DVC to keep track of the data used in
> each training. We could, for example, use our runner to import our training
> data from a table in our database and write both the data and the model to the
> DVC remote. This is beyond the scope of this guide, but
> [how to do so can be found here.](https://github.com/iterative/cml_dvc_case)

The first time you are using DVC for a project you need to run `dvc init` in the
project directory. Then, in order to start using DVC, you need to set up a
remote. This is where your model files will end up, while DVC keeps track of
their respective versions. DVC supports a plethora of remotes, including Amazon
S3, Microsoft Azure Blob Storage, and Google Cloud Storage. For this guide, we
will be using Google Drive as our remote.

You can follow
[this guide](https://dvc.org/doc/user-guide/setup-google-drive-remote#setup-a-google-drive-dvc-remote)
to set up Google Drive as your remote. Make sure to
[set up a GCP project](https://dvc.org/doc/user-guide/setup-google-drive-remote#using-a-custom-google-cloud-project-recommended)
and to
[use a service account](https://dvc.org/doc/user-guide/setup-google-drive-remote#using-service-accounts).

Once you have set up the storage remote and added the `GDRIVE_CREDENTIALS_DATA`
as a GitHub secret, you can use the workflow below. In this scenario, we train
the model in the same way as above, but we push it to the DVC remote. A
reference to the location of this file is added to the GitHub repository
(`model/random_forest.joblib.dvc`). The model itself is added to `.gitignore`
and not pushed to the repository.

The other files created in `train.py` are still pushed to an experiment branch
in GitHub. Afterwards a merge request is created.

```yaml
name: CML-with-DVC
on: # Here we use three triggers; on push, on manual trigger, and daily at 08:00
  # push:
  workflow_dispatch:
  # schedule:
  #   - cron: '0 8 * * *'
jobs:
  deploy-runner:
    runs-on: ubuntu-latest
    steps:
      - uses: iterative/setup-dvc@v1
      - uses: iterative/setup-cml@v1
      - uses: actions/checkout@v2
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
              --single
  train-model:
    needs: deploy-runner
    runs-on: [self-hosted]
    timeout-minutes: 120 # 2h
    container:
      image: docker://iterativeai/cml:0-dvc2-base1
    steps:
      - uses: actions/checkout@v2
      - name: Train model
        env:
          REPO_TOKEN: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
          GDRIVE_CREDENTIALS_DATA: ${{ secrets.GDRIVE_CREDENTIALS_DATA }}
        run: |
          cml ci
          pip install -r requirements.txt
          python train.py

          # Connect to your DVC remote storage and push the model to there
          dvc add model/random_forest.joblib # This automatically adds the model to your .gitignore

          # GDRIVE_CREDENTIALS_DATA is not read automatically when using a service account
          # Manually write it to creds.json and read that file
          echo -E '${{ secrets.GDRIVE_CREDENTIALS_DATA }}' > creds.json

          dvc remote add -d -f myremote gdrive://${{ secrets.GOOGLE_DRIVE_URI }}
          dvc remote modify myremote gdrive_use_service_account true
          dvc remote modify myremote --local gdrive_service_account_json_file_path creds.json

          dvc push

          # Either do this or add the file to your .gitignore
          # Just make sure not to push it to your repository
          rm creds.json

          # Create pull request for the remaining files
          cml pr .

          # Create CML report
          cat model/metrics.txt > model/report.md
          cml publish model/confusion_matrix.png --md >> model/report.md
          cml send-comment --pr --update report.md
```

# Conclusions

Using CML we can apply CI/CD principles to the (re)training of models. This way
we can automate the stuff needed to keep your models running, leaving you with
more time to do actual data science. Additionally, CML takes care of your
versioning for you and makes sure you can track your models over time.

In this guide, we explored how to set up CML with a dedicated runner on AWS. We
exported the model from the runner in two ways: by pushing it directly to a
GitHub repository and by pushing it to a DVC remote.

From here on out we could extend our CI/CD with a `deploy` step to bring the
latest version of our model into production. This step might be conditional on
the performance of the model; we could decide to only start using it in
production if it performs better than previous iterations. All of this warrants
a guide of its own, however, so look out for that in the future! 😉

# To fix/known issues:

- When merging the PR that was automatically created, a new CI/CD run is
  triggered.
