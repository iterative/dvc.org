---
title: Preventing Stale Models in Production
date: 2022-01-27
description: >
  We're going to look at how you can prevent stale models from remaining in
  production when the data starts to differ from the training data.
descriptionLong: >
  Every model that gets deployed to production experiences some type of drift as
  the data on production starts to differ from the data the model was trained
  on. That's why we're going to look at how you can prevent stale models from
  remaining in production.
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
with some modifications to work with DVC.

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

Our project uses Evidently.ai and you can see all of the model and data drift
reports when you run the notebook for this project. Here's what they look like.

![image of the report showing the target drift]()

![image of the report showing the data drift]()

So we see at the end of Week 3 the model is in pretty bad shape. This is where
we can bring in DVC to help us get this stale model off of production faster.

## Run training experiments with new data

Since we already have DVC set up in this project, we can run as many experiments
as we need to and it will track which datasets we're working with, the code
changes that we make, and it'll let us look at all of the results from each
experiment in Studio.

Now we'll run a new experiment in the project with the following command:

```dvc
$ dvc exp run
```

This will give us a potential model to deploy to production. We can take a look
at the metrics with the following command:

```dvc
$ dvc exp show
```

Now you should see a table similar to this:

```dvctable
put table with single experiment here
```

Of course you'll likely run many more experiments to find a better model. Let's
say you update numerous things from the hyperparameters to the algorithm you're
using for a number of experiments. These experiments could produce a table that
looks similar to this:

```dvctable
put table with many experiments here
```

Since we have all of these experiments, this is a good time to share the results
with your coworkers.

## Viewing experiment results in DVC Studio

If you go to [DVC Studio](https://studio.iterative.ai/), you'll be prompted to
connect to your GitHub/GitLab account and you'll be able to choose the repo for
this project. Once you're connected, you should be able to see all of the
experiments you've pushed to your Git history.

![example of plots and results in DVC Studio]()

You can give others on your team access to this and they'll be able to run new
experiments and see the results right in the browser. This is a great tool to
use to discuss the next best steps in your model training before you're ready to
deploy.

## Deploy new model to production

The output of our training stage is the file for the `model.pt`. Now all we need
to do is get this to our production environment. That could be a web API that
returns results in real-time or you do some kind of batch prediction. Regardless
of how you deploy to production, you now have a model that's been updated to
account for the previous data drift.

## Conclusion

Now you just have to keep an eye on this new model to make sure that it does
stray too far from the results you expect. This is one of the processes you can
use to keep your production models from going stale. You could even automate
some parts of this process if you know what your thresholds are!
