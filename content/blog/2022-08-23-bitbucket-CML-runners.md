---
title:
  Provision cloud instances for model training in Bitbucket Pipelines with CML
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
---

A while ago, [I wrote about](https://dvc.org/blog/CML-runners-saving-models-1)
training models on cloud instances and saving those models to a Git repository.
We did so using [CML and GitHub Actions](https://cml.dev/doc/start/github).
GitLab is also supported, and a [recent CML
release](https://github.com/iterative/cml/releases/tag/v0.16.0) incorporated
support for self-hosted runners in Bitbucket Pipelines: a good excuse to revisit
this topic and show how CML works in conjunction with Bitbucket's CI/CD.

Using CML to provision cloud instances for our model (re)training has a number
of benefits:

- Spot instances: CML can leverage cloud resources at the cheapest possible
  rates
- Auto-recovery: if a spot instance is terminated, CML will recover when spot
  instances become available again
- Auto-termination: CML automatically terminates instances once they are no
  longer being used, reducing idle time (and costs)
- Cloud abstraction: CML handles the interaction with our cloud provider,
  meaning we could switch providers by changing a single parameter

# What we'll be doing

In this guide, we will explore how we can use CML (re)train models from one of
our Bitbucket pipelines. We will:

1. Provision an EC2 instance on Amazon Web Services (AWS) from a Bitbucket
   pipeline
1. Train a machine learning model on the provisioned instance
1. Push the resulting model to our Bitbucket repository

While we could use Bitbucket's own runners for our model training, those have
[their
limits](https://janosmiko.com/blog/2021-09-18-demystifying-bitbucket-pipelines-memory-limits/)
when it comes to memory, storage, and processing power. Self-hosted runners on
CML-orchestrated cloud instances let us work around these limitations: we can
get a runner with specifications that are tailored to our computing needs.

Moreover, if our data is hosted by our cloud provider, using a runner on the
same cloud would be a logical approach to minimize data transfer costs and time.

<admon type="tip">

While we'll be using AWS in this guide, CML works just as well with [Google
Cloud](https://cloud.google.com/), [Microsoft
Azure](https://azure.microsoft.com/en-us/), and on-premise compute. Of course
CML would need the appropriate credentials, but otherwise it takes care of the
differing configuration for us. [Take a look at the documentation if you're
interested in using another cloud
provider](https://cml.dev/doc/self-hosted-runners#cloud-compute-resource-credentials).

</admon>

# Before we start

You can clone the repository for this guide
[here](https://bitbucket.org/iterative-ai/example_model_export_cml/src/main/).

If you want to follow along, it's probably worth taking a look at the [Getting
started section of the CML docs](https://cml.dev/doc/start/bitbucket) first. The
docs cover the following prerequisite steps you'll need to take if you want to
follow along with this blog post:

1. [Generate a `REPO_TOKEN` and set it as a repository
   variable](https://cml.dev/doc/self-hosted-runners?tab=Bitbucket#personal-access-token).
2. [Install the _Pull Request Commit Links app_ in your Bitbucket
   workspace](https://cml.dev/doc/ref/send-comment#bitbucket)

Additionally, you will need to take the following steps to allow Bitbucket to
provision AWS EC2 on your behalf:

1. [Create an `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` on
   AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-creds)
2. [Add the `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as repository
   variables](https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/)

<admon type="warn">

In this example, we will be provisioning an `m5.2xlarge` [AWS EC2
instance](https://aws.amazon.com/ec2/instance-types/). Be aware that this
instance is not included in the free tier, and Amazon will charge you for your
usage. To minimize cost, CML always terminates the instance upon completion of
the pipeline.

</admon>

# Implementing the CML Bitbucket pipeline

The main point of interest in the project repository is the
`bitbucket-pipelines.yml` file. Bitbucket will automatically recognize this file
as the one containing our pipeline configuration. In our case, we have defined
one pipeline (named `default`) that consists of two steps.

## Launch self-hosted runner

In the first step, we specify the runner we want to provision. We use CML as our
image, and configure a runner on an `m5.2xlarge` machine, based in the `us-west`
region. Of particular interest here is the `--cloud-spot` option, which ensures
that CML will provision a spot instance rather than an on-demand one.

At the time of writing, a spot instance costs $0.xx per hour, whereas an
on-demand instance costs $0.xx per hour. Profit!

```yaml
- step:
        image: iterativeai/cml:0-dvc2-base1
        script:
          - |
            cml runner \
                --cloud=aws \
                --cloud-region=us-west \
                --cloud-type=m5.2xlarge \ # TODO: change
                --cloud-spot \
                --reuse \
                --labels=cml
```

## Train model on self-hosted runner

The second step in our pipeline defines the model training task. We specify that
this step should run on the `[self.hosted, cml]` runner we provisioned above.
From here, our script defines the individual commands as we could also run them
in our local terminal.

```yaml
- step:
        runs-on: [self.hosted, cml]
        image: iterativeai/cml:0-dvc2-base1
        # GPU not yet supported, see https://github.com/iterative/cml/issues/1015
        script:
          - pip install -r requirements.txt
          - python get_data.py
          - python train.py
          # Create pull request
          - cml pr model/random_forest.joblib

          # Create CML report
          - cat model/metrics.txt > report.md
          - cml publish model/confusion_matrix.png --md --title="Confusion Matrix" >> report.md
          - cml send-comment --pr --update report.md
```

First, we install our requirements, and then we run our data loading and model
training scripts. At this point, our runner contains our newly trained model. We
need to take a few extra steps to do something with that model, however.
Otherwise, our results would be lost when CML terminates the instance upon
completion of our pipeline.

To save our model, we create a pull request with `cml pr`. We then also create a
CML report that displays the model performance in that pull request. `cml
publish` adds the confusion matrix created in `train.py` to the pull request,
and `cml send-comment` updates the description of the pull request to the
contents of `report.md` (i.e., our `metrics.txt`).

That's all there is to it! Once the pull request has been created, we can merge
it on Bitbucket. CML will automatically terminate the provisioned instance upon
completion of the pipeline, thus preventing us from racking up our AWS expenses.

# Conclusions

CML allows us to incorporate our model training into our Bitbucket CI/CD. We can
define a pipeline to provision a cloud instance that meets our requirements, and
then use that instance to train our model. The resulting model can be pushed to
our Git repository, along with an elaborate report on our model's performance.

