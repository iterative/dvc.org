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

<admon type="info">

Learn more about
[Sharing Experiments](/doc/user-guide/experiment-management/sharing-experiments)

</admon>

## Persisting

You can use `dvc exp branch` to create a git branch from the experiment:

```cli
$ dvc exp branch "soupy-leak" "soupy-leak"
```

This allows you to manage experiments using common Git workflows, like creating
[Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests):

```cli
$ gh pr create -H soupy-leak --title "Experiment: soupy-leak"
```

<admon type="info">

Learn more about
[Persisting Experiments](/doc/user-guide/experiment-management/persisting-experiments)

</admon>

## Cleaning

You can use `dvc exp remove` to manually remove the experiment(s) that you no
longer want to keep:

```cli
$ dvc exp remove bifid-says potty-sash
```

<admon type="info">

Learn more about
[Cleaning Experiments](/doc/user-guide/experiment-management/cleaning-experiments)

</admon>
