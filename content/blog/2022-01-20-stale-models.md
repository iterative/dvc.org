---
title: Preventing Stale Models in Production
date: 2022-01-20
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

## Setting up the project

We'll be working with a project from
[Evidently.ai](https://evidentlyai.com/blog/tutorial-1-model-analytics-in-production)
that demonstrates what it would be like to work with a production model that
experiences data drift over time. We'll take this to the next level by adding
some automation with DVC and sharing the results with others on your team using
DVC Studio.

So we'll start by cloning
[this repo for the project](https://github.com/iterative/stale-model-example).
This project is based on the one created by
[Evidently.ai](https://github.com/evidentlyai/evidently/blob/main/examples/data_stories/bicycle_demand_monitoring.ipynb)
with some modifications to work with DVC.

The reason we're adding DVC and Studio to this project is to automate the way
our model evaluation pipeline runs and to be able to share and review the
results for each experiment run we do.

## Set up data drift reports

When the data in production starts to look different from the data that your
model was trained, this is called data drift. There are a number of tools that
help monitor for data drift like [evidently.ai](https://docs.evidentlyai.com/)
or [Aporia](https://docs.aporia.com/).

Our project uses Evidently.ai so we need to set up the reference to our ground
truth data and the model.

```python
# Show evidently snippet here
```

If we run this snippet with our current model and data, you'll see that the
performance of the model is good and that we have a low error.

## What happens with new production data

Since we feel pretty good about this model, we're going to deploy it to
production. After a week or two, we start getting new data. To start with, we
notice that bees are getting added to the data we need to classify.

So we take the new data and check it against our reference data. Here's what
that result might look like from the Evidently report.

![image of the report showing the data drift]()

You see that there's starting to be a change in the error that's showing our
model isn't as accurate as when we first deployed. That means we'll likely need
to re-train our model with the new data coming from production.

## Run experiment with new data

Since we already have DVC set up, we can run as many experiments as we need to
and it will track which datasets we're working with, the code changes that we
make, and it'll let us look at all of the results from each experiment together.
There is one update we need to make. Because the dataset now has three images it
needs to classify, our parameters need to reflect that.

In the `params.yaml` file, change the `num_classes` parameter to `3`. That way
our training script will account for all of the image classes.

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
say you update everything from the hyperparameters to the algorithm you're using
for a number of experiments. These experiments could produce a table that looks
similar to this:

```dvctable
put table with many experiments here
```

So you can see which model gives you the highest accuracy. We'll switch our
workspace to this particular experiment with the following command:

```dvc
$ dvc exp apply exp-#####
```

This is the best experiment we ran, so we want to use this model on production.

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
