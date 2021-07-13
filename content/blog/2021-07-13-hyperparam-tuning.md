---
title: Tuning Hyperparameters with Reproducible Experiments
date: 2021-07-13
description: |
  Using DVC, you'll be able to track the changes that give you an ideal model.

descriptionLong: |
  It's easy to lose track of which changes gave you the best result when you start exploring multiple model architectures. Tracking the changes in your hyperparameter values, along wzith code and data changes, will help you build a more efficient model by giving you an exact reproduction of the conditions that made the model better. We'll go through an example of grid search and random search using DVC.

picture: 2021-07-13/hyperparameters-july-website.png
pictureComment: Tuning Hyperparameters with Reproducible Experiments
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/tuning-hyperparameters-with-reproducible-experiments/821
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Reproducibility
---

## Intro

When you're starting to build a new machine learning model and you're deciding
on the model architecture, there are a number of issues that arise. You have to
monitor code changes you make, note any differences in the data you've used for
training, and keep up with hyperparameter value updates.

Being able to track all of these changes is important so that you can reproduce
your experiments without wondering which changes gave you the best model. You
can go back to any point in your experimenting process to see which changes gave
you the best results.

In this post, we're going to go through an example of hyperparameter tuning with
reproducibility using DVC. You can add this to any existing project you're
working on or start from a fresh project.

## Background on Hyperparameters

Before jumping straight into training and experiments, let's briefly go over
some background on hyperparameters.
[Hyperparameters](/doc/command-reference/params) are the values that define your
model. This includes things like the number of layers in a neural network or the
learning rate for gradient descent.

These parameters are different from model parameters because we can't get them
from training our model. They are used to _create_ the model we train with.
Optimizing these values means running training steps for different kinds of
models to see how accurate the results are. We can get the best model from
iterating through different hyperparameter values and seeing how they effect our
accuracy.

That's why we do hyperparameter tuning. There are a couple common methods that
we'll do some code examples with: grid search and random search.

## Tuning with DVC

Let's start by talking about DVC a bit because we'll be using it to add
reproducibility to our tuning process. This is the tool we'll be using to track
changes in our data, code, and hyperparameters. With DVC, we can add some
automation to the tuning process and be able to find and restore any really good
models that emerge.

A few things DVC makes easier to do:

- Letting you make changes without worrying about finding them later
- Onboarding other engineers to a project
- Sharing experiments with other engineers on different machines

For hyperparameter tuning, this means you can play with their values without
losing track of which changes made the best model and also have other engineers
take a look. We'll do an example of this with grid search in DVC first.

## Working with a DVC project

We're going to be working with an existing NLP project. You can
[get the code we're working with in this repo](https://github.com/iterative/example-get-started).
It already has DVC set up, but you can check out
[the Get Started docs](https://dvc.org/doc/start) if you want to know how the
DVC pipeline was created.

First make sure you're in a virtual environment with a command similar to this.

```dvc
$ python -m venv .venv
```

After you've cloned the repo, install all of the dependencies with this command.

```
pip install -r requirements.txt
```

You should be able to open your terminal and run an experiment with the
following command.

```dvc
$ dvc exp run
```

This will trigger the training process to run and it will record the
[ROC-AUC](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.roc_auc_score.html)
of your model. You can check out the results of your experiment with the
following command.

```dvc
$ dvc exp show --no-timestamp --include-params train.n_est,train.min_split
```

_We're adding a few options here to make the table view clearer. We aren't
showing timestamps and we're only looking at two hyperparameter values. You can
run `dvc exp show` without the options to see the entire table._

This will produce a table similar to this.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ avg_prec ┃ roc_auc ┃ train.n_est ┃ train.min_split ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.51682  │ 0.93819 │ 175         │ 64              │
│ master                  │ 0.56447  │ 0.94713 │ 100         │ 64              │
│ └── a1e8716 [exp-09074] │ 0.57333  │ 0.94801 │ 100         │ 32              │
└─────────────────────────┴──────────┴─────────┴─────────────┴─────────────────┘
```

### Start tuning with grid search

Now that you've seen how to run an experiment, we're going to write a small
script to automate grid search for us using DVC. Using grid search in
hyperparameter tuning means you have an exhaustive list of hyperparameter values
you want to cycle through. Grid search will cover every combination of those
hyperparameter values.

We'll do this by creating queues. A queue is how DVC allows us to create
experiments that won't be run until later. That way we can cycle through
multiple hyperparameters quickly instead of manually updating a config file with
new hyperparameter values for each experiment run. The command syntax for
creating queues looks like this:

```dvc
$ dvc exp run --queue --set-param train.min_split=8
```

In the example queue above, we're updating the `train.min_split` value that's
inside of the `params.yaml` file. This file holds all of the hyperparameter
values and is where DVC looks to determine if any values have changed. With the
command above, we're automatically updating that value in the `params.yaml`
using a queued experiment.

Now we can make the script. You can add a new file to the `src` directory called
`grid_search.py`. Inside of the file, add the following code.

```python
import itertools
import subprocess

# Automated grid search experiments
n_est_values = [250, 300, 350, 400, 450, 500]
min_split_values = [8, 16, 32, 64, 128, 256]

# Iterate over all combinations of hyperparameter values.
for n_est, min_split in itertools.product(n_est_values, min_split_values):
    # Execute "dvc exp run --queue --set-param train.n_est=<n_est> --set-param train.min_split=<min_split>".
    subprocess.run(["dvc", "exp", "run", "--queue",
                    "--set-param", f"train.n_est={n_est}",
                    "--set-param", f"train.min_split={min_split}"])
```

This is a simple grid search. We have two hyperparameters we want to tune:
`n_est` and `min_split`. So we have arrays with a few values in them to mimic
the exhaustive search a grid search can handle. Then we loop through the values
and create queued experiments for them using `subprocess`.

You can run this script now and generate your queue with this command.

```python
$ python src/grid_search.py
```

You'll see some outputs in the terminal telling you that your experiments have
been queued. Then you can run them all with the following command.

```dvc
$ dvc exp run --run-all
```

This will run every experiment that has been queued. Once all of those have run,
take a look at your metrics for each experiment.

```dvc
$ dvc exp show --include-params=train.min_split,train.n_est --no-timestamp
```

Your table should look similar to this when you run the command above. We've
included the `--include-params` and `--no-timestamp` options to give us a table
that's easier to read.

```dvc
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┓
┃ Experiment              ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃ train.n_est ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━┩
│ workspace               │  0.52048 │  0.9032 │ 2               │ 50          │
│ master                  │  0.60405 │  0.9608 │ 64              │ 100         │
│ ├── 42a9260 [exp-f9e49] │  0.54846 │ 0.91206 │ 8               │ 250         │
│ ├── 0c288c1 [exp-c5713] │  0.54185 │ 0.93044 │ 16              │ 250         │
│ ├── 1c353e7 [exp-3f751] │  0.55319 │ 0.92868 │ 32              │ 250         │
│ ├── 60796ce [exp-55888] │  0.54404 │ 0.93304 │ 64              │ 250         │
│ ├── 219cf69 [exp-7a497] │  0.53845 │ 0.92718 │ 128             │ 250         │
│ ├── f509e5b [exp-82ef5] │  0.50472 │ 0.92853 │ 256             │ 250         │
│ ├── 1b53d09 [exp-3bed2] │  0.54946 │ 0.91384 │ 8               │ 300         │
│ ├── e1ca859 [exp-909bb] │   0.5484 │ 0.92869 │ 16              │ 300         │
│ ├── 37ba228 [exp-f1bdf] │  0.55312 │ 0.92852 │ 32              │ 300         │
│ ├── feb556b [exp-d8013] │  0.54658 │ 0.93048 │ 64              │ 300         │
│ ├── 749f791 [exp-26de4] │  0.53962 │ 0.92486 │ 128             │ 300         │
│ ├── 4e23773 [exp-9056d] │  0.51303 │ 0.92699 │ 256             │ 300         │
│ ├── 39e22d1 [exp-87876] │  0.54422 │ 0.91657 │ 8               │ 350         │
│ ├── ba81a66 [exp-23668] │  0.54991 │ 0.93008 │ 16              │ 350         │
│ ├── 1d2f576 [exp-87c15] │  0.55072 │ 0.92795 │ 32              │ 350         │
│ ├── f0953f9 [exp-1e8e5] │   0.5419 │ 0.92925 │ 64              │ 350         │
│ ├── b05f4b0 [exp-9b101] │  0.53563 │ 0.92575 │ 128             │ 350         │
│ ├── f339587 [exp-6cc38] │  0.51523 │ 0.92821 │ 256             │ 350         │
```

Now you can see how your precision changed with each hyperparameter value
update. This is a quick implementation of grid search in DVC. You could read the
hyperparameter values from a different file or data source or make this tuning
script as fancy as you like. The main thing you need is the
`dvc exp run --queue --set-param <param>` command to execute when you add new
values.

### Random search

Another commonly used method for tuning hyperparameters is random search. This
takes random values for hyperparameters and builds the model with them. It
usually takes less time than an exhaustive grid search and it can perform better
if run for a similar amount of time as a grid search.

We're going to add a example of random search in a new file called
`random_search.py` simialr to the file we created for grid search. This will add
queued experiments with the randomly selected hyperparameter values. Add the
following code to `random_search.py`.

```python
import subprocess
import random

# Automated random search experiments
num_exps = 10
random.seed(0)

for _ in range(num_exps):
    params = {
        "rand_n_est_value": random.randint(250, 500),
        "rand_min_split_value": random.choice([8, 16, 32, 64, 128, 256])
    }
    subprocess.run(["dvc", "exp", "run", "--queue",
                    "--set-param", f"train.n_est={params['rand_n_est_value']}",
                    "--set-param", f"train.min_split={params['rand_min_split_value']}"])
```

This search could be far more complex with Bayesian optimization to handle the
hyperparameter value selections, but we're keeping it super simple by choosing
random numbers to focus on reproducibility. This will generate ten experiments
with random values for each hyperparameter.

You can run these new experiments with `dvc exp run --run-all` and then take a
look at the results with
`dvc exp show --include-params=train.min_split,train.n_est --no-timestamp`. Your
table should look something like this.

```dvc
                                                                                    
┃ Experiment              ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃ train.n_est ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━┩
│ workspace               │  0.52048 │  0.9032 │ 2               │ 50          │
│ master                  │  0.60405 │  0.9608 │ 64              │ 100         │
│ ├── 0bc1cee [exp-8ecb5] │  0.54349 │ 0.93367 │ 64              │ 466         │
│ ├── 664ef89 [exp-f2970] │  0.54597 │ 0.93325 │ 64              │ 444         │
│ ├── e7aca60 [exp-7df7a] │   0.5564 │ 0.92834 │ 32              │ 260         │
│ ├── 3561232 [exp-342cc] │  0.54692 │ 0.92549 │ 128             │ 497         │
│ ├── c3a39ae [exp-76683] │  0.54317 │ 0.92996 │ 64              │ 374         │
│ ├── 86c4fd9 [exp-64e82] │  0.55184 │ 0.93014 │ 32              │ 485         │
│ ├── 50208a9 [exp-7e213] │  0.54068 │ 0.93276 │ 64              │ 497         │
│ ├── cf21185 [exp-53a8f] │  0.53634 │ 0.92569 │ 128             │ 341         │
│ ├── 735a673 [exp-86273] │  0.56368 │ 0.93011 │ 16              │ 478         │
│ ├── 13d0893 [exp-55c79] │  0.55131 │ 0.92963 │ 16              │ 379         │
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
