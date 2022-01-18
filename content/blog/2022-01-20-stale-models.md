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

Here's the scenario we'll be going through. You have a model that you've trained
and deployed to production and it's been doing a great job helping driving
business decisions. You know that you have new data coming in every few weeks so
you ocassionally check that your model's predictions still make sense.

Eventually you notice that there is a difference in the model's performance.
That's when you use your monitoring tools to see if there was any data drift
happening. Once you see that there is some data drift, then you take the new
data from production and update your model.

So we'll start by cloning
[this repo for the project](https://github.com/iterative/stale-model-example).
This project is a simple image classifier based on the AlexNet model for images
of cats and dogs.

Next we need the dataset we'll be working with. You can take a look at the `dvc`
file in
[this data registry](https://github.com/iterative/dataset-registry/tree/master/blog).
To get the data on your local machine, run the following command:

```dvc
$ dvc get https://github.com/iterative/dataset-registry blog/cats-dogs
```

You'll notice that there is a model already in this project. This represents an
existing model that's on production. This model has been trained on the cats and
dogs dataset. Now we're finding out there are new images in the production data
and we need to update our model to account for this data drift.

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
