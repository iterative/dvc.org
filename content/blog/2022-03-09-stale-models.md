---
title: Preventing Stale Models in Production
date: 2022-03-09
description: >
  We're going to look at how you can prevent stale models from remaining in
  production when the data starts to differ from the training data.
descriptionLong: >
  Every model that gets deployed to production experiences some type of drift as
  the data on production starts to differ from the data the model was trained
  on. That's why we're going to look at how you can prevent stale models from
  remaining in production.
picture: 2022-03-09/stale-model-cover.png
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

What happens when the model you've worked so hard to get to production becomes
stale? Machine learning engineers and data scientists face this problem all the
time. You usuallly have to figure out where the data drift started so you can
determine what input data has changed. Then you need to retrain the model with
this new dataset.

Retraining could involve a number of experiments across multiple datasets and it
would be helpful to be able to keep track of all of them. In this tutorial,
we'll walk through how using DVC can help you keep track of those experiments
and how this will speed up the time it takes to get new models out to
production, preventing stale ones from lingering too long.

## Setting up the project

We'll be working with a project from
[Evidently.ai](https://evidentlyai.com/blog/tutorial-1-model-analytics-in-production)
that demonstrates what it would be like to work with a production model that
experiences data drift over time. We'll take this to the next level by adding
some automation with a DVC pipeline and share the results with others using DVC
Studio.

So we'll start by cloning
[this repo for the project](https://github.com/iterative/stale-model-example).
This project is based on the one created by
[Evidently.ai](https://github.com/evidentlyai/evidently/blob/main/examples/data_stories/bicycle_demand_monitoring.ipynb)
with some modifications to work with DVC and different datasets.

The reason we're adding DVC and Studio to this project is to automate the way
our model evaluation pipeline runs and to version our data as we get new data.
We'll be able to share and review the results for each experiment run we do. One
of the big problems in machine learning is collaboration, so making it easier to
share models, data, and results can save your team a lot of time and
frustration.

## Set up data drift reports

When the data in production starts to look different from the data that your
model was trained, this is called data drift. There are a number of tools that
help monitor for data drift like [evidently.ai](https://docs.evidentlyai.com/)
or [Aporia](https://docs.aporia.com/).

Since we're working with Evidently.ai, you can see target drift report when you
run the notebook for the initial project they made. Here's what it looks like.

![image of the report showing the target drift](https://thumb.tildacdn.com/tild6336-3231-4736-b136-646539326135/-/format/webp/4_week3_pred_actual.png)

So we see at the end of Week 3 the model is in pretty bad shape. This is where
we can bring in DVC to help us get this stale model off of production faster.

## Running a training experiment to get production up to date

We'll start by taking a year's worth of data and creating a new model. This
might give us a more accurate model to push to production than using weekly
data. So we'll take all of the data from 2011 and make our training and testing
datasets. Then we'll check this data into DVC so it can version it with the
following commands:

```dvc
$ dvc add data/train.pkl data/test.pkl
$ git add data/.gitignore data/train.pkl.dvc data/test.pkl.dvc
```

We add the `.dvc` files to Git to ensure that we are only checking in the
metadata for the datasets and not the entire dataset files. Now we can run the
entire MLOps pipeline with this command:

```dvc
$ dvc exp run
```

This will execute the commands we've defined in `dvc.yaml` and it will give us
the metrics to evaluate how good the model is. Let's take a look at the metrics
so far with the following command:

```dvc
$ dvc exp show --no-timestamp
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**train.seed** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.036667 │ 0.27808 │ 20210428   │ 375         │ 64              │
│ main                    │ 0.036667 │ 0.27808 │ 20210428   │ 375         │ 64              │
│ └── a7bf4c2 [exp-64d86] │ 0.036667 │ 0.27808 │ 20210428   │ 375         │ 64              │
└─────────────────────────┴──────────┴─────────┴────────────┴─────────────┴─────────────────┘
```

This model doesn't have the best metrics, so we can run more experiments to see
if tuning hyperparameters will help before we deploy this model to production.
Let's start by changing the value of the `train.n_est` hyperparameter. We'll run
several experiments with different values and it will produce a table similar to
this:

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**train.seed** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │  0.02414 │ 0.30173 │ 20210428   │ 383         │ 64              │
│ main                    │ 0.036667 │ 0.27808 │ 20210428   │ 375         │ 64              │
│ ├── e956e10 [exp-44136] │  0.02414 │ 0.30173 │ 20210428   │ 383         │ 64              │
│ ├── 2d6b678 [exp-e5c23] │  0.02414 │ 0.30173 │ 20210428   │ 383         │ 64              │
│ ├── a666ccb [exp-c85c3] │ 0.024785 │ 0.31598 │ 20210428   │ 390         │ 64              │
│ ├── f6803ec [exp-8ed24] │  0.09243 │ 0.22833 │ 20210428   │ 450         │ 64              │
│ ├── 764f164 [exp-124d4] │ 0.037312 │ 0.28734 │ 20210428   │ 400         │ 64              │
│ ├── 72e1ed4 [exp-94671] │  0.10855 │ 0.23134 │ 20210428   │ 250         │ 64              │
│ ├── 0e969ef [exp-a37ee] │  0.10315 │ 0.24219 │ 20210428   │ 300         │ 64              │
│ └── a7bf4c2 [exp-64d86] │ 0.036667 │ 0.27808 │ 20210428   │ 375         │ 64              │
└─────────────────────────┴──────────┴─────────┴────────────┴─────────────┴─────────────────┘
```

We've run a few experiments with a different hyperparameter value each time and
it looks like `exp-c85c3` is the best one out of them based on both average
precision and the ROC-AUC value. So we'll apply this experiment to our workspace
and choose this model as the one that will go to production. To apply the
experiment, we'll run the following command:

```dvc
$ dvc exp apply exp-c85c3
```

This will update the workspace with the exact code, data, and hyperparameters
that were used in that particular experiment. So we can commit these changes to
Git and we'll have a reference to everything we need for this exact model. Now
let's say we have deployed this to production and it's been a great model for
almost another year, then we start noticing data drift again.

## Running more training experiments with new data

That means it's time to update our dataset with the latest data from production
and that will include all of the data on bike sharing in 2012. DVC will note the
changes in the data and create a new version record for the updated data
automatically.

Next we'll run a new experiment in the project with the following command:

```dvc
$ dvc exp run
```

Then we can take a look at the metrics with the following command:

```dvc
$ dvc exp show
```

Since we cleared our workspace by pushing the changes to Git, we'll have a fresh
table to look at. Now you should see a table similar to this:

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**avg_prec** ┃ metric:**roc_auc** ┃ param:**train.seed** ┃ param:**train.n_est** ┃ param:**train.min_split** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │    0.644 │  0.4919 │ 20210428   │ 390         │ 64              │
│ main                    │    0.644 │  0.4919 │ 20210428   │ 390         │ 64              │
│ └── 806cc15 [exp-c3a02] │    0.644 │  0.4919 │ 20210428   │ 390         │ 64              │
└─────────────────────────┴──────────┴─────────┴────────────┴─────────────┴─────────────────┘
```

Having the updated dataset made a huge difference in the metrics and it looks
like this model is significantly better. Now that we have all of the experiments
with both the old and new datasets, this is a good time to share the results
with your coworkers and get some feedback.

## Viewing experiment results in DVC Studio

Because we already have DVC set up in this project, we can run as many
experiments as we need to and it will track which datasets we're working with,
the code changes that we make, and it'll let us look at all of the results from
each experiment in Studio.

If you go to [DVC Studio](https://studio.iterative.ai/), you'll be prompted to
connect to your GitHub/GitLab account and you'll be able to choose the repo for
this project. Once you're connected, you should be able to see all of the
experiments you've pushed to your Git history.

![example of plots and results in DVC Studio](/uploads/images/2022-03-09/stale_models_in_studio.png)

You can give others on your team access to this and they'll be able to run new
experiments and see the results right in the browser. This is a great tool to
use to discuss the next best steps in your model training before you're ready to
deploy.

## Deploy new model to production

The output of our training stage is the file for the `model.pt`. Now all we need
to do is get this to our production environment. That could be a web API that
returns results in real-time or you could do some kind of batch prediction.
Regardless of how you deploy to production, you now have a model that's been
updated to account for the previous data drift.

## Conclusion

Now you just have to keep an eye on this new model to make sure that it does
stray too far from the results you expect. This is one of the processes you can
use to keep your production models from going stale. You could even automate
some parts of this process if you know what your thresholds are!
