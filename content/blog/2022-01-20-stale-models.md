---
title: Preventing Stale Models in Production
date: 2022-01-20
description: >
  Sharing experiments with teammates can help you build models more efficiently.
descriptionLong: >
  You can use DVC remotes to share experiments and their data across machines.
picture: 2022-01-20/stale-models.png
pictureComment: Preventing Stale Models in Production
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/stale-models/1002
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Collaboration
---

Machine learning engineers and data scientists face this problem all the time.
What happens when the model you've worked so hard to get to production becomes
stale? You usuallly have to figure out where the data drift started so you can
determine what input data has changed. Then you need to retrain the model with
this new dataset.

Retraining could involve a number of experiments across multiple datasets and it
would be helpful to be able to keep track of all of them. In this tutorial,
we'll walk through how using DVC can help you keep track of those experiments
and how this will speed up the time it takes to get a new model out to
production.

## Forking the project

We'll start by forking [this repo for the project]().

## Getting the data

The dataset we'll be working with can be found in
[this data registry](https://github.com/iterative/dataset-registry/tree/master/blog)
We'll be working with images of cats and dogs.

## Look at data drift

## Run experiment with new data

## Deploy new model to production

## Conclusion
