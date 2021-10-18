---
title: Start Tracking Your Experiments in DVC
date: 2021-11-17
description: >
  It's easier than ever to keep track of ML experiments with DVC's new
  lightweight experiment tracking.
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
---

When you are iterating on an ML project, you try lots of different approaches.
You might adjust your hyperparameters, your preprocessing code, your algorithms,
your data, etc. You might think you are headed in the right direction only to
realize you overlooked something or need to go back in a direction you had
previously abandoned. How do you keep everything organized and make sure you can
compare, save, recover, and refine every experiment you run?

Experiments in DVC make it easy to robustly track all experiments with minimal
setup and intrusiveness. All you need is a Git repo.

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

Happy experimenting!
