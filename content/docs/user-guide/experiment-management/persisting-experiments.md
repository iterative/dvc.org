# Persisting Experiments

DVC Experiments run outside of the regular Git workflow for faster iteration and
to avoid polluting your <abbr>repository</abbr>'s history. Once experiments are
good enough to keep or distribute, you may want to store them persistently as
Git commits.

## Create a Git branch from an experiment

You can use `dvc exp branch` to create a new branch from an experiment, and keep
all its code and artifacts separate from your current <abbr>workspace</abbr>.

```dvc
$ dvc exp show --include-params=my_param
```

```dvctable
 ─────────────────────────────────────────────────────────
  neutral:**Experiment**             neutral:**Created**            metric:**auc**   param:**my_param**
 ─────────────────────────────────────────────────────────
  workspace              -              0.61314   3
  new-experiments        Oct 19, 2020   0.61314   3
  ├── exp-e6c97          Oct 20, 2020   0.69830   2
  └── exp-1df77          Oct 22, 2020   0.51676   1
 ─────────────────────────────────────────────────────────
```

Suppose you want to continue to work on `exp-e6c97` in a separate branch. You
can create a new Git branch by specifying the experiment and giving a new name
for it:

```dvc
$ dvc exp branch exp-e6c97 my-branch
Git branch 'my-branch' has been created from experiment 'exp-e6c97'.
To switch to the new branch run:
        git checkout my-branch
```

Note that DVC doesn't switch into the new branch. You can create one or more
branches from the existing experiments, and switch into any one manually like
this:

```dvc
$ git checkout my-branch
$ dvc checkout
```

Your workspace now contains all the files from the experiment.

## Bring experiment results to your workspace

Typically, `dvc exp run` leaves the experiment results in your workspace for
convenience. However, you may have run multiple experiments and wish to go back
to a specific one. In this case, you can restore a previous experiment's results
with `dvc exp apply`. Let's see an example:

```dvc
$ dvc exp show --include-params=my_param
```

```dvctable
 ───────────────────────────────────────────────────────────
  neutral:**Experiment**              neutral:**Created**            metric:**auc**   param:**my_param**
 ───────────────────────────────────────────────────────────
  workspace               -              0.61314   3
  new-experiments         Oct 19, 2020   0.61314   3
  ├── exp-e6c97           Oct 20, 2020   0.69830   2
  └── exp-1df77           Oct 22, 2020   0.51676   1
 ───────────────────────────────────────────────────────────
```

The results found in the workspace are shown in the respective row. When you
want to bring another experiment to the workspace, you can reference it using
it's name, e.g.:

```dvc
$ dvc exp apply exp-e6c97
Changes for experiment 'exp-e6c97' have been applied...
```

⚠️ Conflicting changes in the workspace are overwritten unless `--no-force` is
used.

> Note that `dvc exp apply` requires your project version (Git `HEAD`) to be the
> same as when the experiment was run.

Now, if you list the experiments again with `dvc exp show`, you'll see that the
workspace contains the results of `exp-e6c97`.

You can use standard Git commands (e.g. `git add/commit/push`) to version this
experiment directly in the <abbr>repository</abbr>. DVC-tracked data and
artifacts are already in the DVC cache, and the rest (params, code and config
files, etc.) can be stored in Git.

> Please note that you need to `dvc push` in order to share or backup the DVC
> cache contents.

## Organization patterns

It's up to you to decide how to organize completed experiments. Here are the
main alternatives:

<toggle>
<tab title="Git tags and branches">

Use the repo's "time dimension" to distribute your experiments. This makes the
most sense for experiments that build on each other. Git-based experiment
structures are especially helpful along with Git history exploration tools [like
GitHub].

[like github]:
  https://docs.github.com/en/github/visualizing-repository-data-with-graphs/viewing-a-repositorys-network

</tab>
<tab title="Directories">

The project's "space dimension" can be structured with directories (folders) to
organize experiments. Useful when you want to see all your experiments at the
same time (without switching versions) by just exploring the file system.

</tab>
<tab title="Hybrid">

Combining an intuitive directory structure with a good repo branching strategy
tends to be the best option for complex projects. Completely independent
experiments live in separate directories (and can be generated with [`foreach`
stages], for example), while their progress can be found in different branches.

</tab>
<tab title="Labels">

In general, you can record experiments in a separate system and structure them
using custom labeling. This is typical in dedicated experiment tracking tools. A
possible problem with this approach is that it's easy to lose the connection
between your project history and the experiments logged.

</tab>
</toggle>

[`foreach` stages]:
  /doc/user-guide/project-structure/pipelines-files#foreach-stages
[persistent]: /doc/user-guide/experiment-management/persisting-experiments
