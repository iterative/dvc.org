---
title: Tuning Hyperparameters with Reproducible Experiments
date: 2021-07-06
description: |
  It's easy to lose track of which changes gave you the best result when you start exploring multiple model architectures. Tracking the changes in your hyperparameter values, along with code and data changes, will help you build a more efficient model by giving you an exact reproduction of the conditions that made the model better.

descriptionLong: |
  Since hyperparameter tuning is a common task in ML, it's important to know the values and changes that lead to the model you want to push to production. When you add reproducibility to your project with DVC, you'll be able to track all of the changes you make that give you the optimum model.

picture: 2021-07-06/tuning-hyperparams.png
pictureComment: Tuning Hyperparameters with Reproducible Experiments
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/utilizing-custom-git-references-in-dvc/727
tags:
  - MLOps
  - Git
  - Experiments
  - Reproducibility
---

## Intro

When you're starting to build a new machine learning model and you're deciding
on the model architecture, there are a number of issues that arise. You have to
monitor every code change you make, any differences in your data, and any
hyperparameter value updates.

This makes it important for you to be able to track all of these changes so you
can reproduce your experiments without wondering how you got your model. Having
reproducibility in your training gives you the ability to go back to any point
in your process to see which values gave you the best results.

We're going to go through an example of hyperparameter tuning with
reproducibility using DVC. You can add this to any existing project you're
working on or start from a fresh project.

## Background on Hyperparameters

Before jumping straight into training and experiments, let's briefly go over
some background on hyperparameters. Hyperparameters are the values that define
your model. This includes things like the number of layers in a neural network
or the learning rate for gradient descent.

These parameters are different from model parameters because we can't get them
from training our model. They are used to _create_ the model. Optimizing these
means running training steps for different kinds of models to see how accurate
the results are. We can only get the best hyperparameters from iterating through
different values and seeing how they effect our accuracy.

That's why we do hyperparameter tuning. There are a couple common methods that
we'll do some code examples with: grid search and random search.

## Tuning with DVC

Let's start by talking about DVC a bit because we'll be using it to add
reproducibility to our tuning process. This is the tool we'll be using to track
changes in our data, code, and hyperparamters. With DVC, we can add some
automation to the tuning process and be able to reproduce it all if we find a
really good model.

A few things DVC makes easier to do include:

- Letting you make changes without worrying about finding them later
- Onboarding other engineers to a project
- You get a record of every change without a bunch of Git commits

For hyperparameter tuning, this means you can play with values and code changes
without losing track of which changes made the best model. We'll do an example
of this with grid search in DVC first.

## Grid Search

Using grid search in hyperparameter tuning means you have an exhaustive list of
hyperparameter values you want to cycle through. Grid search will cover every
combination of those hyperparameter values.

We're going to show how grid search works with DVC on an NLP project. You can
[get the code we're working with in this repo](https://github.com/iterative/example-get-started).
It already has DVC set up, but you can check out
[the Get Started docs](https://dvc.org/doc/start) if you want to know how the
DVC pipeline was created.

### Run an experiment

After you've cloned the repo and installed all of the dependencies, you should
be able to open your terminal and run an experiment with the following command.

`dvc exp run`

This will trigger the training process to run and it will record the accuracy of
your model. You can check out the results of your experiment with the following
command.

`dvc exp show --no-timestamp --include-params train.n_est,train.min_split`

_We're adding a few options here to make the table view clearer. We aren't
showing timestamps and we're only looking at two hyperparameter values. You can
run `dvc exp show` to see the entire table._

This will produce a table similar to this.

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ avg_prec ┃ roc_auc ┃ train.n_est ┃ train.min_split ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.51682  │ 0.93819 │ 175         │ 64              │
│ master                  │ 0.56447  │ 0.94713 │ 100         │ 64              │
│ └── a1e8716 [exp-09074] │ 0.57333  │ 0.94801 │ 100         │ 32              │
└─────────────────────────┴──────────┴─────────┴─────────────┴─────────────────┘
```

### Start tuning

Now that you've seen how to run an experiment, we're going to write a small
script to automate grid search for us using DVC. We'll do this by creating
queues.

A queue is how DVC allows us to create experiments that won't be run until
later. That way we can cycle through multiple hyperparameters quickly instead of
manually updating a config file with new hyperparameter values for each
experiment run. The command syntax for creating queues looks like this:

`dvc exp run --queue -set-param train.min_split=8`

In the example queue above, we're updating the `train.min_split` value that's
inside of the `params.yaml` file. This file holds all of the hyperparameter
values and is where DVC looks to determine if any values have changed. With the
command above, we're automatically updating that value in the `params.yaml`
using a queued experiment.

Now we can make the script. You can add a new file to the `src` directory called
`tuning.py`. Inside of the file, add the following code.

```python
import subprocess
import random

# Automated grid search experiments
n_est_values = [250, 300, 350, 400, 450, 500]
min_split_values = [100, 110, 120, 130, 140, 150]

for val in n_est_values:
    subprocess.run(["dvc", "exp", "run", "--queue", "--set-param", f"train.n_est={val}"])

for val in min_split_values:
    subprocess.run(["dvc", "exp", "run", "--queue", "--set-param", f"train.min_split={val}"])
```

This is a simple grid search. We have two hyperparameters we want to tune:
`n_est` and `min_split`. So we have arrays with a few values in them to mimic
the exhaustive search a grid search can handle. Then we loop through the values
and create queued experiments for them using `subprocess`.

You can run this script now and generate your queue with this command.

`python src/tuning.py`

You'll see some outputs in the terminal telling you that your experiments have
been queued. Then you can run them all with the following command.

`dvc exp run --run-all`

This will run every experiment that has been queued. Once all of those have run,
take a look at your metrics for each experiment.

`dvc exp show`

Your table should look similar to this when you run `dvc exp show`.

```bash
table
```

Now you can see how your precision changed with each hyperparameter value
update. This is a quick implementation of grid search in DVC. You could read the
hyperparameter values from a different file or data source or make this tuning
script as fancy as you like. The main thing you need is the
`dvc exp run --queue -set-param <param>` command to execute when you add new
values.

### Random Search

Another commonly used method for tuning hyperparameters is random search. This
takes random values for hyperparameters and builds the model with them. It's not
an exhaustive search like grid search and it typically outperforms grid search,
especially when a small subset of the hyperparameters produce the biggest
difference in your model.

We're going to add an example of random search to the `tuning.py` file we
created for grid search. This will add queued experiments with the randomly
selected hyperparameter values. Add the following code to `tuning.py` below the
grid search implementation.

```python
# Automated random search experiments
rand_n_est_values = random.sample(range(250, 500), 10)
rand_min_split_values = random.sample(range(100, 150), 10)

for val in rand_n_est_values:
    subprocess.run(["dvc", "exp", "run", "--queue", "--set-param", f"train.n_est={val}"])

for val in rand_min_split_values:
    subprocess.run(["dvc", "exp", "run", "--queue", "--set-param", f"train.min_split={val}"])
```

This random search could be far more complex with a Gaussian or Bayesian
distribution to handle the hyperparameter values, but we're keeping it super
simple by choosing random numbers to focus on reproducibility. This will
generate ten experiments with random values for each hyperparameter.

You can run these new experiments with `dvc exp run --run-all` and then take a
look at the results with `dvc exp show`. Your table should look something like
this.

```bash
table
```

This shows the difference in the randomly selected values and the values from
grid search. You might find a better value with random search because it jumps
around a range of values which might hit the optimum faster than it would with a
grid search.

## Conclusion

With the comparison between grid search and random search, you can see how
reproducibility can help you find the best model for your project. You'll be
able to see all of the hyperparameter changes and code changes that created each
model. This gives you the ability to fine tune your model because you can go to
any experiment and resume training with different values, code, or data.
