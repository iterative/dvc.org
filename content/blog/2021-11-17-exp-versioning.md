---
title: Don't Just Track Your Experiments, Version Them
date: 2021-11-17
description: >
  Versioning ML experiments in DVC helps you log, organize, and reproduce
  experiments easier than ever.
descriptionLong: >
  When you are iterating quickly over lots of ML experiments, it's hard to keep
  track. With DVC, you can easily save, compare, and reproduce all your
  experiments with minimal setup.
picture: ???
pictureComment: Keep your experiments from floating away
author: dave_berenbaum
commentsUrl: https://discuss.dvc.org/t/lightweight-experiments/???
tags:
  - MLOps
  - DVC
  - Experiments
  - Experiment Tracking
  - Experiment Versioning
---

# Experiment Tracking Needs

When you are experimenting on an ML project, you need to track adjustments to
hyperparameters, preprocessing code, algorithms, data, etc. You might think you
are headed in the right direction only to realize you overlooked something and
need to go back in a direction you had previously abandoned.

These are problems that have been solved in the past with version control, but
typical software version control tools like Git aren't enough for ML
experimentation:

- Data and models aren't easily tracked with Git.
- There are too many experiments to track with any Git branching workflow.
- Machine learning pipelines take too long to reproduce on the fly.

When tracking ML experiments, you need to:

1. Log experiment information.
2. Organize and compare experiments.
3. Reproduce experiments.

# History of Experiment Tracking

Back in the old days of the 2010's, you would have had to track all this
yourself, using a notebook, spreadsheet, or some custom solution. With respect
to the needs mentioned above, you would:

1. Choose what parameters and metrics to log and when to record them. No easy
   way to log anything besides scalar values.
2. Organize and compare experiments on your own. Spreadsheets might enable
   categorization and sorting.
3. Reproduce experiments using existing version control practices.

Experiment tracking tools were developed to better address these needs. They
provide you with an API to log experiment information, a database to store it,
and a dashboard to compare and visualize. These tools meet a lot of the
immediate needs for tracking:

1. Log different types of artifacts.
2. Compare experiment differences in a dashboard, and add labels to organize.
3. Collect logged artifacts to reproduce the experiment.

However, as projects grow, these experiment tracking tools leave a lot up to
you:

1. You need to decide what is important to log. Much of the information is the
   same between experiments, and it's not clear what changed in each.
2. You need to keep experiments organized, and you may need to drop experiments
   that are outdated or otherwise irrelevant.
3. You need to set up a process to reproduce an experiment from the logged
   artifacts, running it again from scratch. If any input is not logged,
   reproducibility is lost.

# Experiment Versioning in DVC

How does DVC help?

1. Log experiments end to end (commands, inputs, and outputs) and track changes
   introduced by each experiment.
2. Associate experiments with Git commits, branches, and tags from which they
   derive. Organize locally and choose what to share.
3. Reproduce any previous experiment with a single command. Cache previous runs
   and results to reduce duplicate compute time and storage space.

We call this "experiment versioning," and we believe it's the next generation of
tracking your experiments.

We can learn from software version control even though it is not enough by
itself to track ML experiments. Let's look at a history of version control (from
https://ericsink.com/vcbe/html/history_of_version_control.html):

| Generation | Networking  | Operations         | Concurrency         |
| ---------- | ----------- | ------------------ | ------------------- |
| First      | None        | One file at a time | Locks               |
| Second     | Centralized | Multi-file         | Merge before commit |
| Third      | Distributed | Changesets         | Commit before merge |

See also https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control.

Now let's compare to experiment tracking:

| Generation | Platform                   | Logging        | Organization | Reproducibility | Collaboration |
| ---------- | -------------------------- | -------------- | ------------ | --------------- | ------------- |
| First      | Spreadsheet, notebook      | Scalar values  | None         | None            | None          |
| Second     | API + database + dashboard | Multi-artifact | Labels       | Manual          | Centralized   |
| Third      | DVC + Git                  | Changesets     | Git-based    | Automatic       | Distributed   |

Issues with the previous generation of experiment tracking tools parallel those
in the history of version control. DVC experiments borrow ideas from version
control and apply them to experiment tracking.

# Start Versioning Experiments

You can start experimenting from any Git repo.

Rather than log parameters and metrics within your code, DVC expects them to be
saved in files. This keeps experiment information available inside your repo in
readable files, and it encourages separation between the code and its inputs and
outputs. Learn more about [parameters, metrics, and
plots](https://dvc.org/doc/start/metrics-parameters-plots).

For example, experiment parameters may be recorded as YAML in `params.yaml`:

```
train:
  epochs: 10
model:
  conv_units: 16
```

Setup your code to read parameters from this file.

Similarly, setup your code to write metrics to `metrics.json` like:

```
{"loss": 0.2442721426486969, "acc": 0.9097999930381775}
```

If you tell DVC how your project is organized, it can manage your entire
experiment lifecycle and ensure that everything is recorded and synced with your
Git history.

Let's try it:

```
$ dvc exp init -i
This command will guide you to set up a default stage in dvc.yaml.
See https://dvc.org/doc/user-guide/project-structure/pipelines-files.

DVC assumes the following workspace structure:
├── data
├── metrics.json
├── models
├── params.yaml
├── plots
└── src

Command to execute: python src/train.py
Path to a code file/directory [src, n to omit]: src/train.py
Path to a data file/directory [data, n to omit]: data/images/
Path to a model file/directory [models, n to omit]:
Path to a parameters file [params.yaml, n to omit]:
Path to a metrics file [metrics.json, n to omit]:
Path to a plots file/directory [plots, n to omit]: logs.csv
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
default:
  cmd: python src/train.py
  deps:
  - data/images/
  - src/train.py
  params:
  - model
  - train
  outs:
  - models
  metrics:
  - metrics.json:
      cache: false
  plots:
  - logs.csv:
      cache: false
Do you want to add the above contents to dvc.yaml? [y/n]: y

Created default stage in dvc.yaml. To run, use "dvc exp run".
See https://dvc.org/doc/user-guide/experiment-management/running-experiments.
```

Now let's run an experiment using DVC:

```
$ dvc exp run
'data/images.dvc' didn't change, skipping
Running stage 'default':
> python src/train.py
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
reshape (Reshape)            (None, 28, 28, 1)         0
_________________________________________________________________
conv2d (Conv2D)              (None, 26, 26, 32)        320
_________________________________________________________________
max_pooling2d (MaxPooling2D) (None, 13, 13, 32)        0
_________________________________________________________________
dropout (Dropout)            (None, 13, 13, 32)        0
_________________________________________________________________
flatten (Flatten)            (None, 5408)              0
_________________________________________________________________
dense (Dense)                (None, 128)               692352
_________________________________________________________________
dense_1 (Dense)              (None, 10)                1290
=================================================================
Total params: 693,962
Trainable params: 693,962
Non-trainable params: 0
_________________________________________________________________
Epoch 1/10
469/469 [==============================] - 6s 12ms/step - loss: 0.6587 - acc: 0.7683 - val_loss: 2.4129 - val_acc: 0.6837
Epoch 2/10
469/469 [==============================] - 5s 12ms/step - loss: 0.3561 - acc: 0.8732 - val_loss: 2.7177 - val_acc: 0.6912
Epoch 3/10
469/469 [==============================] - 5s 11ms/step - loss: 0.3087 - acc: 0.8886 - val_loss: 3.0699 - val_acc: 0.6915
Epoch 4/10
469/469 [==============================] - 5s 12ms/step - loss: 0.2833 - acc: 0.8966 - val_loss: 2.8051 - val_acc: 0.6974
Epoch 5/10
469/469 [==============================] - 5s 11ms/step - loss: 0.2633 - acc: 0.9020 - val_loss: 2.9231 - val_acc: 0.7011
Epoch 6/10
469/469 [==============================] - 5s 11ms/step - loss: 0.2439 - acc: 0.9103 - val_loss: 3.0498 - val_acc: 0.6998
Epoch 7/10
469/469 [==============================] - 5s 11ms/step - loss: 0.2309 - acc: 0.9151 - val_loss: 3.5543 - val_acc: 0.7076
Epoch 8/10
469/469 [==============================] - 5s 12ms/step - loss: 0.2181 - acc: 0.9196 - val_loss: 3.7224 - val_acc: 0.7069
Epoch 9/10
469/469 [==============================] - 5s 12ms/step - loss: 0.2107 - acc: 0.9207 - val_loss: 3.6612 - val_acc: 0.7100
Epoch 10/10
469/469 [==============================] - 5s 11ms/step - loss: 0.2009 - acc: 0.9233 - val_loss: 3.8639 - val_acc: 0.7102
79/79 [==============================] - 0s 4ms/step - loss: 3.8639 - acc: 0.7102
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'

To track the changes with git, run:

        git add logs.csv params.yaml metrics.json dvc.lock dvc.yaml src/train.py

Reproduced experiment(s): exp-b5ad8
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp> <branch>
```

This will run your command, track your data, and save the results all in one to
save you from having to manage all of these steps yourself and ensure a
reproducible workflow.

You can even update parameters directly in the command:

```
$ dvc exp run --set-param model.conv_units=32
```

You can compare experiments in your terminal:

```
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃   loss ┃    acc ┃ train.epochs ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 4.1705 │ 0.7114 │ 10           │ 32               │
│ added-data              │ Sep 04, 2021 │      - │      - │ 10           │ 16               │
│ ├── dddabdd [exp-d3d64] │ 04:45 PM     │ 4.1705 │ 0.7114 │ 10           │ 32               │
│ └── a6ae8d2 [exp-b5ad8] │ 04:40 PM     │ 3.8639 │ 0.7102 │ 10           │ 16               │
└─────────────────────────┴──────────────┴────────┴────────┴──────────────┴──────────────────┘
```

What do you when you decide which experiment is best? DVC can create a Git
branch from any experiment:

```
$ dvc exp branch exp-d3d64 conv-units-32
Git branch 'conv-units-32' has been created from experiment 'exp-d3d64'.
To switch to the new branch run:

        git checkout conv-units-32
```

Now you have the full Git history of that experiment in Git, and you can merge
it, refine it, and otherwise incorporate it back into your usual Git workflow.

# What next?
