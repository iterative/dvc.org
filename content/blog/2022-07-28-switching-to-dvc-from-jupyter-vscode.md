---
title: Converting a Jupyter Notebook to a DVC Project
date: 2022-07-28
description: >
  Working with notebooks is common in machine learning. That's why we're
  covering some tools that make it easy to do more with a complex project.
descriptionLong: >
  Once you've run some experiments in a Jupyter notebook, you know that you
  can't save each experiment. Now, if you're using the Jupyter VSCode extension,
  we can show you how to make those experiments reproducible with the addition
  of the DVC VSCode extension.
picture: 2022-07-28/jupyter-to-dvc.png
pictureComment: Using the DVC VSCode Extension with a Jupyter Notebook
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/syncing-data-to-aws-s3/1192
tags:
  - MLOps
  - DVC
  - Git
  - VSCode
  - Juptyer Notebooks
---

For many machine learning engineers, the starting point of a project is a
Jupyter notebook. This is fine for running a few experiments, but there comes a
point where you need to scale the project to accomodate hundreds or even
thousands more experiments. It will also be important to track the experiments
you run so that when you find an exceptional model, you'll be able to reproduce
it and get it ready for production.

In this tutorial, we're going to run a few experiments in our Juptyer notebook
in VSCode. Then we'll convert it to DVC to make reproducible experiments and use
the DVC VSCode extension to run new experiments and compare them all.
[Here's the project](https://github.com/iterative/stale-model-example/tree/jupyter-to-dvc)
we'll be working with.

## Start training with the notebook

Many times you'll start an ML project with a few cells in a notebook just to
test out some thoughts you might have. So you might have a simple notebook where
you set some hyperparameters, load your data, train a model and evaluate its
metrics, and then save the model. That's what we're doing in the
`bicycle_experiments.ipynb` file.

So we have all of the cells in place and start running experiments. This is
usually fine for training models for a while. Although there will eventually be
a point where you are powering through experiments for the day and you want to
compare metrics across experiments. You might also end up with a great model,
but you have no idea what code you used or which data was used to train this
model.

That makes reproducing the experiment impossible and you're left with a model
you may not be able to use in production. Once you reach the point where you are
trying to reproduce models or compare metrics from multiple experiments, it
might make sense to look at a data versioning and model experiment tracking tool
like DVC.

## Refactor the notebook to use DVC

You can take your existing Jupyter notebooks and break them out in files and
stages that DVC tracks for you. First, make sure that you have the following
files to define the main steps in your experimentation. The `train.py` file to
define the process that takes in data and saves the model for testing. The
`evaluate.py` file to define the testing script that will record the resulting
metrics.

## Look at metrics from experiments

## Conclusion

When your project gets to the point you need to go back to old experiments, it's
probably time to start using something more complex than Jupyter notebooks.
