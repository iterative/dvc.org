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
monitor every code change you make, note any differences in your data, and keep
up with hyperparameter value updates.

This means it's important for you to be able to track all of these changes so
you can reproduce your experiments without wondering which changes gave you the
best model. Having reproducibility in your training gives you the ability to go
back to any point in your process to see which changes gave you the best
results.

In this tutorial, we're going to go through an example of hyperparameter tuning
with reproducibility using DVC. You can add this to any existing project you're
working on or start from a fresh project.

## Background on Hyperparameters

Before jumping straight into training and experiments, let's briefly go over
some background on hyperparameters. Hyperparameters are the values that define
your model. This includes things like the number of layers in a neural network
or the learning rate for gradient descent.

These parameters are different from model parameters because we can't get them
from training our model. They are used to _create_ the model we train with.
Optimizing these values means running training steps for different kinds of
models to see how accurate the results are. We can get the best model from
iterating through different hyperparameters values and seeing how they effect
our accuracy.

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
- Sharing experiments with other engineers on different machines
- Track experiments and results in your Git repo and compare from the command
  line - no need for other services to retrieve your experiments or compare
  results.
- Version the entire pipeline (including data, code, and commands run) - detect
  changes to dependencies and only re-run the impacted steps.

For hyperparameter tuning, this means you can play with values and code changes
without losing track of which changes made the best model and also have other
engineers take a look. We'll do an example of this with grid search in DVC
first.

## Working with DVC

Using grid search in hyperparameter tuning means you have an exhaustive list of
hyperparameter values you want to cycle through. Grid search will cover every
combination of those hyperparameter values.

We're going to show how grid search works with DVC on an NLP project. You can
[get the code we're working with in this repo](https://github.com/iterative/example-get-started).
It already has DVC set up, but you can check out
[the Get Started docs](https://dvc.org/doc/start) if you want to know how the
DVC pipeline was created.

### Run an experiment

First make sure you're in a virtual environment with a command similar to this.

```dvc
$ python -m venv .venv
```

After you've cloned the repo, install all of the dependencies with this command.

`pip install -r requirements.txt`

You should be able to open your terminal and run an experiment with the
following command.

`dvc exp run`

This will trigger the training process to run and it will record the precision
of your model. You can check out the results of your experiment with the
following command.

`dvc exp show --no-timestamp --include-params train.n_est,train.min_split`

_We're adding a few options here to make the table view clearer. We aren't
showing timestamps and we're only looking at two hyperparameter values. You can
run `dvc exp show` without the options to see the entire table._

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

### Start tuning with grid search

Now that you've seen how to run an experiment, we're going to write a small
script to automate grid search for us using DVC. We'll do this by creating
queues.

A queue is how DVC allows us to create experiments that won't be run until
later. That way we can cycle through multiple hyperparameters quickly instead of
manually updating a config file with new hyperparameter values for each
experiment run. The command syntax for creating queues looks like this:

```dvc
dvc exp run --queue -set-param train.min_split=8
```

In the example queue above, we're updating the `train.min_split` value that's
inside of the `params.yaml` file. This file holds all of the hyperparameter
values and is where DVC looks to determine if any values have changed. With the
command above, we're automatically updating that value in the `params.yaml`
using a queued experiment.

Now we can make the script. You can add a new file to the `src` directory called
`tuning.py`. Inside of the file, add the following code.

```python
import itertools
import subprocess
import random

# Automated grid search experiments
param_grid = {
    "n_est_values": [250, 300, 350, 400, 450, 500],
    "min_split_values": [8, 16, 32, 64, 128, 256]
}
param_combos = [dict(zip(param_grid.keys(), v)) for v in itertools.product(*param_grid.values())]

for params in param_combos:
  subprocess.run(["dvc", "exp", "run", "--queue", "-S", f"train.n_est={params['n_est_values']}", "-S", f"train.min_split={params['min_split_values']}"])
```

This is a simple grid search. We have two hyperparameters we want to tune:
`n_est` and `min_split`. So we have arrays with a few values in them to mimic
the exhaustive search a grid search can handle. Then we loop through the values
and create queued experiments for them using `subprocess`.

You can run this script now and generate your queue with this command.

`python src/tuning.py`

You'll see some outputs in the terminal telling you that your experiments have
been queued. Then you can run them all with the following command.

```dvc
dvc exp run --run-all
```

This will run every experiment that has been queued. Once all of those have run,
take a look at your metrics for each experiment.

```dvc
dvc exp show
```

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
num_exps = 10

for _ in range(num_exps):
    params = {
        "rand_n_est_value": random.randint(250, 500),
        "rand_min_split_value": random.choice([8, 16, 32, 64, 128, 256])
    }
    subprocess.run(["dvc", "exp", "run", "--queue", "-S",
                   f"train.n_est={params['rand_n_est_value']}", "-S", f"train.min_split={params['rand_min_split_value']}"])
```

This random search could be far more complex with a Gaussian or Bayesian
distribution to handle the hyperparameter value selections, but we're keeping it
super simple by choosing random numbers to focus on reproducibility. This will
generate ten experiments with random values for each hyperparameter.

You can run these new experiments with `dvc exp run --run-all` and then take a
look at the results with `dvc exp show`. Your table should look something like
this.

```bash
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃ avg_prec ┃ roc_auc ┃ train.min_split ┃ train.n_est ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━┩
│ workspace               │ -            │ 0.51682  │ 0.93819 │ 64              │ 175         │
│ ├── d075700 [exp-d1a08] │ 02:00 PM     │ 0.55283  │ 0.93396 │ 16              │ 450         │
│ ├── ab1e718 [exp-3ad29] │ 02:00 PM     │ 0.54889  │ 0.93361 │ 32              │ 450         │
│ ├── 35cb92c [exp-4edb8] │ 02:00 PM     │ 0.53681  │ 0.93608 │ 64              │ 450         │
│ ├── f0f44e8 [exp-dc6c7] │ 02:00 PM     │ 0.53642  │ 0.93525 │ 128             │ 450         │
│ ├── f72003e [exp-8a616] │ 02:00 PM     │ 0.53295  │ 0.93445 │ 256             │ 450         │
│ ├── ec7412f [exp-d9be9] │ 02:00 PM     │ 0.55759  │ 0.93662 │ 8               │ 500         │
│ ├── ec679bd [exp-fcbbb] │ 01:59 PM     │ 0.55663  │ 0.93458 │ 16              │ 500         │
│ ├── e4ee5d2 [exp-46e22] │ 01:59 PM     │ 0.55034  │ 0.93511 │ 32              │ 500         │
│ ├── 70d8bd6 [exp-7a9c0] │ 01:59 PM     │ 0.53798  │ 0.93688 │ 64              │ 500         │
│ ├── 20b4384 [exp-cf185] │ 01:59 PM     │ 0.5388   │ 0.9361  │ 128             │ 500         │
│ ├── 625c8e8 [exp-2dbca] │ 01:59 PM     │ 0.53002  │ 0.93545 │ 256             │ 500         │
│ ├── cc2145e [exp-fc010] │ 01:59 PM     │ 0.54061  │ 0.93757 │ 64              │ 300         │
│ ├── e55fb54 [exp-be8d1] │ 01:59 PM     │ 0.5371   │ 0.93637 │ 64              │ 471         │
│ ├── cd2594c [exp-6e703] │ 01:59 PM     │ 0.53744  │ 0.93653 │ 64              │ 468         │
│ ├── 0a9e6d5 [exp-87563] │ 01:59 PM     │ 0.5296   │ 0.93564 │ 256             │ 476         │
│ ├── a9cef73 [exp-a419a] │ 01:59 PM     │ 0.5542   │ 0.93437 │ 32              │ 298         │
│ ├── 064712e [exp-2b641] │ 01:59 PM     │ 0.54498  │ 0.93335 │ 32              │ 352         │
│ ├── e757262 [exp-b8014] │ 01:59 PM     │ 0.53701  │ 0.93625 │ 64              │ 446         │
│ ├── 2d2dacb [exp-8f420] │ 01:59 PM     │ 0.52887  │ 0.93612 │ 128             │ 417         │
│ ├── 2ca648e [exp-16e93] │ 01:58 PM     │ 0.53519  │ 0.93708 │ 128             │ 280         │
│ ├── 19906b5 [exp-5385e] │ 01:58 PM     │ 0.55489  │ 0.93678 │ 8               │ 279         │
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
