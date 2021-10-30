---
title: Don't Just Track Your Experiments, Version Them
date: 2021-11-17
description: >
  Versioning ML experiments in DVC helps you log, organize, and reproduce
  experiments easier than ever.
descriptionLong: >
  With DVC experiments, you can take ML experiment tracking to the next level,
  making it easy and powerful to save, compare, and reproduce experiments at
  scale.
picture: ???
pictureComment: Keep your experiments from floating away
author: dave_berenbaum
commentsUrl: https://discuss.dvc.org/t/exp-versioning/???
tags:
  - MLOps
  - DVC
  - Experiments
  - Experiment Tracking
  - Experiment Versioning
---

Traditional software version control is not enough for tracking machine learning
experiments. Over the last few years, experiment tracking has come a long way,
but there are parallels to problems from earlier generations of version control.
That's why "experiment versioning" in DVC tracks experiments by building on
modern version control practices.

# Experiment Tracking Needs

When tracking ML experiments, you need to:

- Log experiment information.
- Organize and compare experiments.
- Reproduce experiments.

Tracking data, comparing versions, and enabling reproducibility are already
addressed by version control. Unfortunately, traditional version control tools
like Git don't work well for ML experimentation because:

- Data and models aren't easily tracked with Git.
- There are too many experiments to track with any branching workflow.
- Machine learning pipelines take too long to reproduce on the fly.

# History of Experiment Tracking

Back in the old days of the 2010's, you would have had to track all this
yourself, using a notebook, spreadsheet, or some custom solution. This limits
you to scalar parameters and metrics, and leaves a lot of room for human error
(forgetting to log a particular value or a whole experiment, or writing down the
wrong value). Organizing and comparing experiments was limited to sorting
spreadsheets. Reproducing experiments was still left to traditional version
control, if that was even used.

Experiment tracking tools were developed to better address experiment tracking
needs. They provide you with an API to log experiment information, a database to
store it, and a dashboard to compare and visualize. You can log all types of
artifacts, label and compare experiments in a dashboard, and collect logged
artifacts to reproduce the experiment.

However, as projects grow, these experiment tracking tools leave a lot up to
you and start to feel cumbersome:

- You need to decide what is important to log. Much of the information is the
  same between experiments, and it's not clear what changed in each.
- You need to keep experiments organized, you need to manage who has access to
  them, and you may need to drop experiments that are outdated or otherwise
  irrelevant.
- You need to set up a process to reproduce an experiment from the logged
  artifacts, running it again from scratch. If any input is not logged,
  reproducibility is lost.

# Experiment Versioning in DVC

How does DVC help?

- Log experiments end to end (commands, inputs, and outputs) and track changes
  introduced by each experiment.
- Associate experiments with Git commits, branches, and tags from which they
  derive. Organize locally and choose what to share.
- Reproduce any previous experiment with a single command. Cache previous runs
  and results to reduce duplicate compute time and storage space.

We believe this is the next generation of tracking experiments. Let's look at a
history of version control (from
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

Centralized services made it hard to collaborate in the previous generation of
version control. With experiment tracking, it's hard now to stay organized on a
team project. If you start locally, it's not easy to later share your results
with the team. Even if you start as a team, you may be sifting through
experiments from others or spending time cleaning up experiments you never meant
for others to see. What happens if the server goes down or if you have sensitive
data that you need to self-host but don't know how?

Similarly, treating each experiment as an independent collection of artifacts
repeats the same old version control mistakes. This results in a piecemeal view
of the project that's difficult to reconstruct, wastes space by duplicating
unchanged artifacts, and has no concept of what has actually changed.

DVC experiments borrow from modern version control and apply its principles and
technology to experiment tracking.

# Start Versioning Experiments

You can start experimenting from any Git repo. If you tell DVC how your project
is organized, it can manage your entire experiment lifecycle and ensure that
everything is recorded and synced with your Git history.

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

DVC treats experiments as code. Rather than log parameters and metrics with API
calls, DVC expects them to be saved in files. This might mean a little more work
to set up your code to read parameters from a YAML file or write metrics to a
JSON file. However, once you set up your repo in this structure, you start to
see the benefits of DVC:

- Experiment information lives in readable files that are always available even
  without DVC, and your code stays clean.
- Your code and experiments stay connected in the repo, and you can take
  advantage of all of the features of Git, like diffing and branching.
- Your entire experiment is codified. Notice that the command above generated a
  `dvc.yaml` file that tracks the experiment pipeline and all its inputs and
  outputs.

Of course, you could do all this yourself in Git. Since we have established that
code version control is insufficient for experiments, DVC adds features specific
to ML needs.

Large data and models are tracked in your own storage yet are Git-compatible.
For example, the above command tracks the `models` folder in DVC, making Git
ignore it yet storing and versioning it for you so that you can back up versions
anywhere and check them out alongside your experiment code.

Experiments are tracked by DVC so you don't need to create commits or branches
for each one, yet they are also Git compatible and can be converted into Git
branches or merged into your existing ones.

```
$ dvc exp show
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃   loss ┃    acc ┃ train.epochs ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │ 3.8639 │ 0.7102 │ 10           │ 16               │
│ added-data              │ Sep 04, 2021 │      - │      - │ 10           │ 16               │
│ ├── b15858d [exp-b5ad8] │ 10:17 PM     │ 3.8639 │ 0.7102 │ 10           │ 16               │
│ └── dddabdd [exp-d3d64] │ 04:45 PM     │ 4.1705 │ 0.7114 │ 10           │ 32               │
└─────────────────────────┴──────────────┴────────┴────────┴──────────────┴──────────────────┘
$ dvc exp branch exp-d3d64 conv-units-32
Git branch 'conv-units-32' has been created from experiment 'exp-d3d64'.
To switch to the new branch run:

        git checkout conv-units-32
```

Reproducing experiments will check for cached inputs and outputs and skip
recomputing data that's been generated before.

```
$ dvc exp run
'data/images.dvc' didn't change, skipping
Stage 'default' didn't change, skipping

Reproduced experiment(s): exp-44136
Experiment results have been applied to your workspace.

To promote an experiment to a Git branch run:

        dvc exp branch <exp> <branch>
```

# What Next?

Experiment versioning is still in its early days. Look out for future
announcements about:

- Deep learning challenges like live monitoring, checkpointing, and iterative
  training.
- Visualizing and comparing experiment results in other tools like VSCode and
  Studio.
- Orchestrating experiments on other machines.

What do you want to see for the next generation of experiment tracking? Try out
experiment versioning, share your thoughts, and help build the future of ML
developer tools.
