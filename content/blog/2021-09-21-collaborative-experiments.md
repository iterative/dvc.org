---
title: Running Collaborative Experiments
date: 2021-09-21
description: |
  Sharing experiments with teammates can help you build models more efficiently.
descriptionLong: |
  You can use DVC remotes to share experiments and their data across machines.
picture: 2021-09-21/collaborative-experiments.png
pictureComment: Running Collaborative Experiments
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/tuning-hyperparameters-with-reproducible-experiments/821
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Collaboration
---

## Intro

Sharing experiments for machine learning is something that commonly happens. You
might have a new engineer join the team and you want to get their workspace
ready quickly. There might be times when someone might have an idea they could
try on your model if they could access your current progress.

Setting up DVC remotes lets you share all of the data, code, and hyperparameters
associated with each experiment so anyone can pick up where you left off in the
training process. We'll go through an example of sharing an experiment with DVC
remotes.

## Getting the project

To follow along, you can fork [this repo]() as one of your own GitHub repos.
That way you'll have push and pull access when we start working with DVC. This
project already has DVC initialized and set up to run experiments, but if you
want to follow along with a project you're currently working on, make sure to
check out the steps to initialize a DVC pipeline in
[the Getting Started doc](https://dvc.org/doc/start).

## Setting up your DVC remotes

When you want to share the progress you've made with training your model, that
usually means you need to find a way to bundle the code, data, and
hyperparameters. This could be a complicated process if you're working with GBs
worth of data or you have a large number of hyperparameters.

That's one of the uses for DVC and why we'll be working with remotes. To start
with, make sure your GitHub remote is configured correctly. It should use the
SSH version of the URL. This is so DVC can authenticate the pushes and pulls
from GitHub it needs as part of experiment sharing.

The way DVC works is by storing custom Git refs in your repo with metadata that
defines the experiment. You can learn more about how DVC uses custom Git refs in
[this post](https://dvc.org/blog/experiment-refs).

Next, you'll need to set up a remote to your data location. This could be an AWS
S3 bucket, a Google Drive, or Blob Storage in Azure. For this example, we'll be
using a Google Drive folder as the remote to handle data storage.

Now that you know what we're doing, let's run the command to set up our DVC
remote.

```dvc
dvc remote add -d cloud_remote gdrive://1k6aUYWphOulJlXgq4XbfKExWGyymTpEl
```

This adds the remote storage for DVC to track and now we'll be able to push and
pull the exact code and data to reproduce any experiment from end to end. With
your Git remote and DVC remote in place, you can start pulling data and
experiments from the cloud to your local machine.

You can learn more about the Google Drive setup in
[the docs](https://dvc.org/doc/command-reference/remote/add). The main thing you
need to know is that you need the folder id for the remote location you want to
set up. You can find that id in the URL for that folder. It'll look similar to
this.

```dvc
https://drive.google.com/drive/folders/1k6aUYWphOulJlXgq4XbfKExWGyymTpEl?usp=sharing
```

## Pulling experiments

If you're picking up an existing project, there will likely already be
experiments present in the repo for you to take a look at. To pull an experiment
to your local machine to start new experiments from, you'll need an experiment
ID for the following command.

```dvc
dvc exp pull origin exp-f3867
```

## Pushing experiments

Now that you've pulled down an existing experiment and run your own experiments
based off of it, you can push these new experiments to the remote. DVC handles
both the GitHub and data storage pushes with this command.

```dvc
dvc exp push origin exp-p4202
```

## Listing your remote experiments

Since you have a few experiments in your remotes, it might help to know what you
have available. You can take a look at all of the experiments with the following
command.

```dvc
dvc exp list origin --all
```

## Conclusion

It's a lot easier to get help from someone on a project when you can share
everything with them. When you use DVC, you can bundle your data and code
changes for each experiment and push those to a remote for somebody else to
check out.
