# exp list

List the available experiments in a local or remote Git repository.

## Synopsis

```usage
usage: dvc experiments list [-h] [-q | -v] [--rev <rev>] [--all] [[<git_remote>]]

positional arguments:
  [<git_remote>]  Optional Git remote name or Git URL. If provided, experiments from the specified Git repository will be listed instead of local experiments.

optional arguments:
  --rev <rev>     List experiments derived from the specified revision. Defaults to HEAD if neither `--rev` nor `--all` are specified.
  --all           List all experiments.
```

## Description

This command can be used to list experiments found in the current local
repository, or experiments which are available in a remote Git repository.

## Options

- `[<git_remote>]` - optional name of the remote Git repository. `git_remote`
  can either be a Git remote name (i.e. `origin`) or a full Git repository URL
  (i.e. `https://github.com/iterative/example-get-started.git`).

- `--rev <rev>` - list experiments derived from the specified Git revision,
  defaults to `HEAD`.

- `--all` - list all experiments in the repository (overrides `--rev`).

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Example: Listing experiments

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project workspace:

```dvc
$ dvc exp show --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.61314 │ 1500                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

`dvc exp list` can be used to quickly list the available experiments:

```dvc
$ dvc exp list --all
11-bigrams-experiment:
        exp-e6c97
        exp-1dad0
        exp-1df77
```

`dvc exp list` can also list experiments in a remote Git repository:

```dvc
$ dvc exp list --all origin
11-bigrams-experiment:
        exp-e6c97
        exp-86dd6
```

We can see that in our Git remote named `origin`, that two experiments are
available in the remote. `dvc exp pull` can be used to pull these experiments
from the Git remote, and `dvc exp push` can be used to push our local
experiments to the Git remote.
