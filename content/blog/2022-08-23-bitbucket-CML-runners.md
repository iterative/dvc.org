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

- Provision an AWS EC2 instance from a Bitbucket pipeline
- Train a machine learning model on the provisioned instance
- Export the resulting model to our Bitbucket repository
