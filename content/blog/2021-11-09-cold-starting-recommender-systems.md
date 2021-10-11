---
title: Cold Starting Recommender Systems
date: 2021-11-09
description: >
  Cold starting is common problem for recommender systems. The recommender
descriptionLong: >

picture: 2021-11-09/cold-start.png
author: milecia_mcgregor
commentsUrl:
tags:
  - Recommender systems
---

When you're building a model to make recommendations to users, you might not
have a lot of data to start with. For example, it's hard to recommend food to
user if you don't know anything about their preferences. This is a tricky
problem known as the [cold start problem](INSERT WIKI LINK HERE).

## Background on the cold start problem

There are a few different variations to the cold start problem.

- The new community issue: you might have a lot of items to recommend, but no
  user interaction to determine how to recommend the different options.
- The new user issue: when you have a new user sign up, you don't know anything
  about them so you can't recommend anything.
- The new item issue: when you have a new item to add to your recommender
  system, it has never been recommended before so it's hard to get the user
  interactions on it to properly recommend it.

The way you approach these issues is highly dependent on the type of recommender
system you want to make. There are some different systems:

- Collaborative filtering
- Content-based filtering
- Popular-based filtering

For this tutorial, we'll work on a content-based recommender system that has a
problem with recommending good movies for new users. We'll use different
multi-armed bandit algorithms to see which gives us the best results.

## Getting the project set up

First, start by cloning [this repo]() to your machine. It already has a DVC
pipeline initialized with a remote so that you can retrive the data we'll be
using.

The dataset we'll work with is from [Movie Lens](INSERT LINK HERE) and you can
get it straight from our data registry with the following command.

```dvc
dvc get SET UP THIS REMOTE
```

Then make sure to install all of the required libraries with this command:

```dvc
pip install -r requirements.txt
```

Now you have everything you need to get started running experiments.

## Understanding the project

We'll try three multi-armed bandit algorithms to see which gives us a better
recommender system for new users. We'll work with the [epsilon greedy](FIND LINK
FOR THIS), [Thompson sampling](FIND LINK FOR THIS), and [upper confidence
bound](FIND LINK FOR THIS) algorithms. Let's do a quick walkthrough of the files
before we start training.

If you take a look in the `recommender_sys.py` file, you'll see all of the code
for our machine learning problem. The `dvc.yaml` is where our pipeline details
are defined. You can manually add new stages in this file or you can use the
`dvc stage add` command with the options you need.

Then there's the `params.yaml` file. This is where all of our hyperparameter
values are stored and referenced in both the code and the DVC pipeline. If you
open this file, you'll see an `algorithm` hyperparameter. This is the main
hyperparameter we'll change to see how the different algorithms perform, but
feel free to change anything else here and see what happens!

### Running an experiment with Upper Confidence Bound

The first experiment we'll run on this cold start problem uses the upper
confidence bound algorithm. Since the DVC pipeline is already in place and we
have a stage defined, we can jump right into a training experiment. In your
terminal, run this command.

```dvc
$ dvc exp run
```

This will run an experiment and generate a few metrics files we can use to see
how training changes with different algorithms. Let's take a look at the metrics
from this experiment with this command.

```dvc
$ dvc exp show --no-timestamps
```

This will bring up a table similar to this in your terminal without timestamps.

```dvctable
INSERT TABLE HERE
```

It doesn't look like it did too bad. We don't want to stop here though so let's
update the algorithm we're working with and run another experiment.

### Running an experiment with Epsilon Greedy

To show you one of the ways we can update hyperparameters using DVC, we'll run
the following command.

```dvc
$ dvc exp run --set-param algorithm=EG
```

This will update the algorithm we're training with and execute a new experiment
all at the same time. So when this experiment is finished, run the following
command to check out the metrics table.

```dvc
$ dvc exp show --no-timestamp
```

You'll get a table with results similar to this.

```dvctable
INSERT TABLE HERE
```

There's a difference in the model performance between these two and it looks
like epsilon greedy is winning! That doesn't mean it's time to stop though. We
have one more algorithm to get through.

### Running an experiment with Thompson Sampling

The last experiment we'll run will be with the Thompson sampling algorithm.
Since you've seen how to update the hyperparameter through the command line,
let's just update the file this time. In your `params.yaml`, update the
`algorithm` value to `TS` and then run this command.

```dvc
$ dvc exp run
```

Now we have metrics for all of the algorithms to do a proper comparison. Open
the metrics table in your terminal by running this command.

```dvc
$ dvc exp show --no-timestamp
```

You should see a table similar to this with all three algorithms and their
respective metrics.

```dvctable
INSERT TABLE HERE
```

Now that we have all of the algorithms to compare, it still looks like epsilon
greedy performs the best. You can take a look at a plot of all the algorithms to
graphically see how they compare with the following command.

```dvc
$ dvc plots diff exp-123 exp-234 exp-345
```

## Conclusion

Trying to cold start recommender systems can seem like a daunting task, but it
doesn't have to be. You can come back and resume training from any of the
experiments you run because DVC makes every experiment reproducible and
sharable.

You could also take it a step further and do MLOps in the cloud with CML. You'll
be able to run experiments with your cloud resources _and_ be able to share the
model and code/data change that happened for each cloud experiment.

If you have any questions, feel free to ask in our [Discord community](INSERT
LINK HERE)!
