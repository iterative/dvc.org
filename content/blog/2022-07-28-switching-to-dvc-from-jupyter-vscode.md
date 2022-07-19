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
files to define the main steps in your experimentation, `train.py` and
`evaluate.py`.

The `train.py` file takes the `Get params`, `Load training data`, `Train model`,
and `Save model` cells from the notebook so that we can version all of the steps
in our training process. Then `evaluate.py` takes the `Set test variables`,
`Load model and test data`, `Get model predictions`,
`Calculate model performance metrics`, and `Save model performance metrics`
cells.

That's it! Now you have all of the steps that you executed in your Jupyter
notebook in a couple of files that you can easily edit and track across all of
your experiments. This is a great time to commit these changes to your Git repo
with the following commands:

```cli
$ git add train.py evaluate.py
$ git commit -m "converted notebook to DVC project
```

## Look at metrics from experiments

Now can create a DVC pipeline that executes these scripts to get the metrics for
your experiments. If you look in the project's `dvc.yaml`, you'll see the stages
we execute on an experiment run.

```yaml
stages:
  train:
    cmd: python src/train.py ./data/ ./models/model.pkl
    deps:
      - ./data/train.pkl
      - ./src/train.py
    params:
      - train.seed
      - train.n_est
      - train.min_split
    outs:
      - ./models/model.pkl
  evaluate:
    cmd:
      python ./src/evaluate.py ./models/model.pkl ./data scores.json prc.json
      roc.json
    deps:
      - ./data
      - ./models/model.pkl
      - ./src/evaluate.py
    metrics:
      - scores.json:
          cache: false
    plots:
      - prc.json:
          cache: false
          x: recall
          y: precision
      - roc.json:
          cache: false
          x: fpr
          y: tpr
```

This runs everything in the same order that the Jupyter notebook did with a
trackable structure. Now when you run `dvc exp run` to conduct an experiment,
you can check out your metrics with either the CLI command `dvc exp show` or
with the DVC VSCode extension.

```dvctable
─────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  neutral:**Experiment**                neutral:**Created**        metric:**avg_prec**   metric:**roc_auc**   param:**train.seed**   param:**train.n_est**   param:**train.min_split**   >
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────>
  **workspace**                 **-**               **0.76681**   **0.38867**   **20210428**     **300**           **75**                >
  **jupyter-to-dvc**            **Jul 18, 2022**    **0.76681**   **0.38867**   **20210428**     **300**           **75**                >
  └── 4a070a7 [exp-b8925]   Jul 18, 2022    0.76681   0.38867   20210428     300           75                >
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────>
```

_with CLI tool_

![metrics in DVC VSCode extension]()

_with DVC VSCode extension_

## Conclusion

In this post, we covered how to convert your Jupyter notebook into a DVC
project. When your project gets to the point you need to go back to old
experiments, it's probably time to consider using something more complex than
Jupyter notebooks. Keeping track of data versions across experiments along with
the code that was used to run them can get messy quickly so it's good to know
about tools that can make it easier for you.
