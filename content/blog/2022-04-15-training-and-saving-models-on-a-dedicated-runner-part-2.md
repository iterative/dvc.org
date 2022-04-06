---
title:
  Training and saving models with CML on a dedicated AWS EC2 runner (part 2)
date: 2022-03-31
description:
  In part 1 of this guide we showed how you can use CML to automatically retrain
  a model and save its outputs to your Github repository using a provisioned AWS
  EC2 runner. We will now expand upon this guide by using DVC to save our model
  to a remote storage.
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
  - DVC
  - Git
  - Pipelines
  - Dedicated runners
  - AWS
---

In part 1 of this guide we showed how you can use CML to provision an AWS EC2
instance to train your model before saving the model to our Git repository. In
doing so, we allowed ourselves to terminate the training instance without losing
our model altogether.

This worked perfectly fine for the simple model we trained, but this approach is
not optimal when dealing with larger models. GitHub starts warning you at 50MB
files and simply
[won't upload anything over 100MB](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).
[GitLab similarly limits](https://docs.gitlab.com/ee/user/gitlab_com/index.html#account-and-limit-settings)
the size of files you can store in your repository. A beefy XGBoost model can
easily exceed 100MB and a neural network can go up into the gigabytes.

That means we wouldn't be able to save these models to our repository. Luckily
we can look towards another one of Iterative's open-source tools:
[DVC](https://dvc.org). DVC includes a lot of features for managing machine
learning projects, such as ML pipelines and experiment tracking. In this guide
we will zoom in on just one of those features: data versioning.

We can use DVC to save our model to a remote storage, such as M3, HDFS, an SFTP
server, or even Google Drive. Much like Git tracks changes to your code, DVC
tracks changes to your data. It puts a reference to a specific version of your
data in the Git commit. That way your code is linked to a specific version of
your model, without containing the actual model.

In this part 2, we will show you how to save the model we trained in part 1 to a
DVC remote storage.

All files needed for this guide can be found in
[this repository](https://github.com/iterative/example_model_export_cml).

<admon type="tip">
We will be using Google Drive as our remote storage. With slight modifications, however, you can also use other remotes such as M3, GCP Cloud Storage, and Azure Storage.
</admon>

# Prerequisites

Make sure to have followed part 1 of this guide and gotten CML up and running.
Additionally, set up the following things beforehand:
