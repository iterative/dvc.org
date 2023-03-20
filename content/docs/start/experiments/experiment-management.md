---
title: 'Get Started: Experiment Management'
description:
  'Get started with managing experiments with DVC. Manage your experiments and
  share them with others using software engineering best practices.'
---

# Get Started: Experiment Management

After having compared all the experiments, you still need to agree on which one
is the best and manage the remaining candidates. <abbr>DVC Experiments</abbr>
are fully compatible with Git workflows, so you can manage the experiments using
software engineering best practices.

## Sharing

Unless you have enabled
[Studio Live Experiments](/doc/studio/user-guide/projects-and-experiments/live-metrics-and-plots),
the <abbr>DVC experiments</abbr> only exist in your repo and people can't manage
or view them from other machines.

You can share an experiment with others from your machine:

<toggle>

<tab title="DVC CLI">

You can use `dvc exp push`, providing the names of the git remote and the
experiment:

```cli
$ dvc exp push origin "soupy-leak"
```

People from other machines can then retrieve it using `dvc exp pull`:

```cli
$ dvc exp pull origin "soupy-leak"
```

</tab>

<tab title="VSCode Extension">

You can right-click on the experiment row and select the `Share to Studio`
action:

![VSCode Share to Studio](/img/vscode-sharing.gif)

</tab>

</toggle>

<admon type="info">

Learn more about
[Sharing Experiments](/doc/user-guide/experiment-management/sharing-experiments)

</admon>

## Persisting

Once you have agreed on the best experiment, you can create a git branch and
manage it using regular Git workflows:

<toggle>

<tab title="DVC CLI">

You can use `dvc exp branch`, providing the name of the experiment and the
future branch:

```cli
$ dvc exp branch "soupy-leak" "soupy-leak"
```

</tab>

<tab title="VSCode Extension">

You can right-click on the experiment row and select the `Create a new Branch`
action:

![VSCode Create a new Branch](/img/vscode-branch.gif)

</tab>

</toggle>

This allows you to use software engineering best practices to manage
experiments, like creating
[Pull Requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests):

```cli
$ gh pr create -H soupy-leak --title "Experiment: soupy-leak"
```

<admon type="info">

Learn more about
[Persisting Experiments](/doc/user-guide/experiment-management/persisting-experiments)

</admon>

## Cleaning

After deciding on which experiments to persist, you might want to remove those
that you no longer want to keep:

<toggle>

<tab title="DVC CLI">

You can use `dvc exp remove` to manually remove experiment(s) using their names:

```cli
$ dvc exp remove bifid-says potty-sash
```

</tab>

<tab title="VSCode Extension">

You can select multiple experiment rows and use the `Remove selected rows`
action:

![VSCode Remove selected rows](/img/vscode-remove.gif)

</tab>

</toggle>

<admon type="info">

Learn more about
[Cleaning Experiments](/doc/user-guide/experiment-management/cleaning-experiments)

</admon>
