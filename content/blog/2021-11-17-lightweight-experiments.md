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

* Data and models aren't easily tracked with Git.
* There are too many experiments to track with any Git branching workflow.
* Machine learning pipelines take too long to reproduce on the fly.

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
   artifacts, running it again from scratch. If anything is not logged,
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
| ---------- |-------------|--------------------|---------------------|
| First      | None        | One file at a time | Locks               |
| Second     | Centralized | Multi-file         | Merge before commit |
| Third      | Distributed | Changesets         | Commit before merge |

See also https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control.

Now let's compare to experiment tracking:

| Generation | Platform                   | Logging        | Organization | Reproducibility | Collaboration |
| ---------- |----------------------------|----------------|--------------|-----------------|---------------|
| First      | Spreadsheet, notebook      | Scalar values  | None         | None            | None          |
| Second     | API + database + dashboard | Multi-artifact | Labels       | Manual          | Centralized   |
| Third      | DVC + Git                  | Changesets     | Git-based    | Automatic       | Distributed   |

Issues with the previous generation of experiment tracking tools parallel those
in the history of version control. DVC experiments borrow ideas from version
control and apply them to experiment tracking.

# Start Versioning Experiments

To get started, initialize DVC in your Git repo:

```
$ dvc init
```

Any experiment parameters may be recorded as YAML in `params.yaml`:

```
alpha: 0.5
```

This keeps your parameters separate from your code in a readable plain-text
file. To avoid repetition and ensure your code and parameters are in sync, setup
your code to read parameters from this file.

Experiment metrics may be recorded as JSON in `metrics.json`:

```
{"acc": 0.8}
```

Similarly, setup your code to write metrics to this file to avoid repetition and
ensure code and metrics are in sync.

DVC can compare between any Git commits using the `dvc exp show` table. Try
comparing the last 5 commits:

```
$ dvc exp show -n 5
INSERT TABLE HERE
```

Or compare every branch in your repo:

```
$ dvc exp show -a
INSERT TABLE HERE
```

This is a nice start, but it can get noisy and messy to have to commit every
experiment to Git and keep them all organized. DVC can do that for you.

Save results from any experiment:

```
$ dvc exp save
```

DVC will save not only those parameters and metrics, but everything in your
repo. Without having to commit changes to Git, you can modify your project, run
another experiment, and save all the results in DVC.

Save a few more experiments and compare them:

```
$ dvc exp show
INSERT TABLE HERE
```

Now we have all our parameters and metrics in readable files, we can save our
entire repo easily, and we can organize and compare all our experiments.

However, we still might have some pain points like:

- How to ensure the codebase and experiment results are in sync?
- How to track large artifacts like your data and models that don't fit well
  into Git?

If you tell DVC how your project is organized, it can manage your entire
experiment lifecycle and ensure that everything is executed and recorded the way
you expect.

Let's try it:

```
$ dvc exp init -i
```

Now let's run an experiment using DVC:

```
$ dvc exp run
```

This will run your command, track your data, and save the results all in one to
save you from having to manage all of these steps yourself and ensure a
consistent workflow.

You can even update parameters directly in the command:

```
$ dvc exp run --set-param alpha=0.6
```

See all of these experiments the same way as before:

```
$ dvc exp show
```

What do you when you decide which experiment is best? DVC can create a Git
branch from any experiment:

```
$ dvc exp branch exp-??? branch-???
```

Now you have the full Git history of that experiment in Git, and you can merge
it, refine it, and otherwise incorporate it back into your usual Git workflow.

# What next?
