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

## Pulling experiments

## Pushing experiments

## Listing your remote experiments

## Conclusion
