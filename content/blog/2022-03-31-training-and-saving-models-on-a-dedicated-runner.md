---
title: Training and saving models with CML on a dedicated AWS EC2 runner
date: 2022-03-31
description:
  In this guide we will show how you can use CML to automatically retrain a
  model and save its outputs to your Github repository using a provisioned AWS
  EC2 runner.
descriptionLong: |
  We can use CML to automatically retrain models whenever data, model code,
  or parameters change. In this guide we show how to create a pipeline that
  provisions an AWS EC2 instance to retrain a model and save the output on
  a regular basis. This way we can prevent drift by ensuring that our model
  always uses the latest input data.
picture: 2015-05-01/post-image.jpeg
# pictureComment: Some _Comment_ (supports _basic_ [Markdown](link))
author: rob_dewit
# commentsUrl: https://discuss.dvc.org/t/february-22-community-gems/1078
tags:
  - CML
  - Git
  - Pipelines
  - Dedicated runners
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
CI/CD pipeline (e.g. GitHub Workflows), the runners used for this generally
don’t have a lot of processing power. Therefore it makes more sense to provision
a dedicated runner that is tailored to our computing needs.

At the end of this guide we will have set up a CML workflow that does the
following on a daily basis:

1. Provision an Amazon Web Services (AWS) EC2 instance
1. Train the model
1. Save the model and its metrics to a GitHub repository
1. Terminate the AWS EC2 instance

In a follow-up post we will expand upon this by using [DVC](https://dvc.org/) to
designate a remote storage for our resulting models. But let's focus on CML
first!

All files needed for this guide can be found in
[this repository](https://github.com/iterative/example_model_export_cml).

<admon type="info">
This guide can be followed on its own, but also as an extension to this <a href="https://cml.dev/doc/self-hosted-runners">example in the docs</a>.
</admon>

<admon type="tip">
We wil be using GitHub for our CI/CD and AWS for our computing resources. With slight modifications, you should be able to use Gitlab and Google Cloud or Microsoft Azure respectively.
</admon>

# Prerequisites

Before we begin, make sure you have the following things set up:

1. You have
   [created an AWS account](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
   (free tier suffices)
2. You have
   [created a `PERSONAL_ACCESS_TOKEN` on GitHub](<(https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)>)
3. You have
   [created an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` on AWS](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html)
4. You have
   [added the `PERSONAL_ACCES_TOKEN`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` as GitHub secrets](<(https://docs.github.com/en/actions/security-guides/encrypted-secrets)>)

It also helps to clone
[the template repository for this tutorial](https://github.com/iterative/example_model_export_cml).

# Training a model and saving it

To kick off, we will adapt `train.py` from the
[CML getting started guide](https://cml.dev/doc/start/github). Here we create a
simple `RandomForestClassifier()` based on some generated data. We then use the
model to make some predictions and plot those predictions in a confusion matrix.

While running the script the model is kept in memory, meaning it is discarded as
soon as the script finishes. In order to save the model for later, we need to
dump it as a binary file. We do so with `joblib.dump()`. Later we can read the
model using `joblib.read()` when we need to.

<admon type="tip">
You can also use <code>pickle.dump()</code> if you prefer.
</admon>

The outputs of `train.py` are:

- `metrics.txt`: a file containing metrics on model performance (in this case
  accuracy)
- `confusion_matrix.png`: a plot showing the classification results of our model
- `random_forest.joblib`: the binary output of the trained model

All of these files are saved to the `model` directory.

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

# Train the model on a daily basis

Now that we have a script to train our model and save it as a file, let’s set up
our CI/CD to provision a runner and run the script. We define our workflow in
`cml.yaml` and save it in the `.github/workflows` directory. This way GitHub
will automatically go through the workflow whenever it is triggered. In this
case the triggers are a manual run and the daily schedule.

<admon type="info">
The name of the workflow doesn’t matter, as long as it’s a <code>.yaml</code> and
located in the <code>.github/workflows</code> directory. You can have multiple workflows
in there as well. You can learn more in the
<a href="https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions">documentation</a>
here.
</admon>

```yaml
name: CML
on: # Here we use two triggers: manually and daily at 08:00
  workflow_dispatch:
  schedule:
    - cron: '0 8 * * *'
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
          python get_data.py
          python train.py
```

<admon type="warn">
In this example we are using a <code>t2.micro</code> AWS EC2 instance. At the time of writing this is included in the AWS free tier. Make sure that you qualify for this free usage to prevent unexpected spending. When you specify a bulkier <code>cloud-type</code>, your expenses will rise.
</admon>

The workflow we defined first [provisions a runner](https://cml.dev/doc/ref/runner) on AWS, and then uses that
runner to train the model. After completing the training job, CML automatically
terminates the runner to prevent you from incurring further costs. Once the
runner is terminated, however, the model is lost along with it. Let's see how we
can save our model in the next step!

# Export the model to our Git repository

CML allows us to export the model from our runner to our Git repository. Let's
extend the training stage of our workflow by pushing `random_forest.joblib` to a
new experiment branch and creating a merge request.

[`cml pr`](https://cml.dev/doc/ref/pr) is the command that specifies which files should be included in the
pull request. The commands after that are used to generate a report in the
pull request that displays the confusion matrix and calculated metrics.

```yaml
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
        python get_data.py
        python train.py

        # Create pull request
        cml pr model/random_forest.joblib

        # Create CML report
        cat model/metrics.txt > report.md
        cml publish model/confusion_matrix.png --md >> report.md
        cml send-comment --pr --update report.md
```

Et voilà! We are now running a daily model training on an AWS EC2 instance and
saving the resulting model to our GitHub repository.

There is still some room for improvement, though. This approach works well when
our resulting model is small, but we wouldn't want to store large models in our
Git repository. In a follow-up post we will describe how we can use
[DVC](https://dvc.org/), another Iterative product, for storage when we're
dealing with larger files.

# Conclusions

There are many cases in which it's a good idea to retrain models periodically.
For example, you could be using the latest data available to you in order to
prevent model drift. CML allows you to automate this process.

In this guide, we explored how to set up CML for a daily training job using a
dedicated runner. We automatically provisioned this runner on AWS, exported the
resulting files to our Git repository, and terminated the runner to prevent
racking up our AWS bill.

In a follow-up post we will explore how to use DVC when the resulting model is
too large to store directly in our Git repository.

Another great extension of our CI/CD would be a `deploy` step to bring the
latest version of our model into production. This step might be conditional on
the performance of the model; we could decide to only start using it in
production if it performs better than previous iterations. All of this warrants
a guide of its own, however, so look out for that in the future! 😉
