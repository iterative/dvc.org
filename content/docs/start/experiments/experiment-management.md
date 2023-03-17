---
title: 'Get Started: Experiment Management'
description:
  'Get started with managing experiments with DVC. Manage your experiments and
  share them with others using the workflow that best suits your needs.'
---

# Get Started: Experiment Management

After having compared all the experiments, ML Practitioners still need to agree
on which one is the best and manage the remaining candidates.

<abbr>DVC Experiments</abbr> are fully compatible with Git workflows, so you can
manage the experiments using the workflow that best suits your needs.

## Sharing

Unless you have enabled
[Studio Live Experiments](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots),
the DVC experiments only exist in your repo and people can't manage or view them
from other machines.

To share an experiment with others, you can use `dvc exp push`, providing the
names of the git remote and the experiment:

TODO: VSCode sharing?

```cli
$ dvc exp push origin "soupy-leak"
```

People from other machines can then retrieve it using `dvc exp pull`:

```cli
$ dvc exp pull origin "soupy-leak"
```

## Persisting

After you have decided which experiment is the best, you can use `dvc exp apply`
to bring the experiment into your <abbr>workspace</abbr>:

```cli
$ dvc exp apply "soupy-leak"
$ git commit -am "Applied experiment: soupy-leak"
```

Alternatively, you can use `dvc exp branch` to create a git branch from the
experiment. This can be more useful in different workflows, like managing the
experiments via Pull Requests:

```cli
$ dvc exp branch "soupy-leak" "soupy-leak"
$ gh pr create -H soupy-leak --title "Experiment: soupy-leak"
```

## Cleaning

You can use `dvc exp remove` to manually remove the experiment(s) that you no
longer want to keep:

```cli
$ dvc exp remove bifid-says potty-sash
```
