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
We did so using CML and GitHub Actions. A [recent CML
release](https://github.com/iterative/cml/releases/tag/v0.16.0) incorporated
support for self-hosted runners in Bitbucket Pipelines: a good excuse to revisit
this topic and show how CML works in conjunction with Bitbucket's CI/CD.

In this guide, we will explore how to we can use CML to:

- Provision an EC2 instance on Amazon Web Services (AWS) from a Bitbucket
  pipeline
- Train a machine learning model on the provisioned instance
- Export the resulting model to our Bitbucket repository

This approach allows us to integrate our model (re)training into our CI/CD.
While we could use Bitbucket's own runners for our model training, those have
[their
limits](https://janosmiko.com/blog/2021-09-18-demystifying-bitbucket-pipelines-memory-limits/)
when it comes to memory, storage, and processing power. Self-hosted runners on
provisioned cloud instances let us work around these limitations: we can get a
runner with specifications that are tailored to our computing needs.

A major benefit to using CML is that it can provision spot instances. This way
we can leverage cloud resources at the cheapest possible rates.

# Before we start

If you want to follow along with this guide, it's probably worth taking a look
at the [Getting started section of the CML
docs](https://cml.dev/doc/start/bitbucket). The docs cover the following
prerequisite steps you'll need to take if you want to follow along with this
blogpost:

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

In this example we are provisioning a `t2.micro` [AWS EC2
instance](https://aws.amazon.com/ec2/instance-types/). At the time of writing
this is included in the AWS free tier. Make sure that you qualify for this free
usage to prevent unexpected spending. When you specify a bulkier
<code>cloud-type</code>, your expenses will rise.

</admon>
