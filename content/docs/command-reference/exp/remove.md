# exp remove

Delete specific experiments from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp remove [-h] [-q | -v] [-A] [--rev <commit>] [-n <num>]
                      [--queue | -g <git_remote>]
                      [<name> [<name> ...]]

positional arguments:
   experiment    Experiments to remove.
```

## Description

Deletes one or more experiments, indicated by name (see `dvc exp run`) or ID
(only queued experiments).

With `--queue`, the list of experiments awaiting execution is cleared instead.

> Note that all the checkpoints in an experiment are removed by this command.

## Options

- `--queue` - remove all experiments that haven't been run yet (defined via
  `dvc exp run --queue`).

- `-A`, `--all` - remove all experiments that have been run. Use `--queue` to
  remove queued ones.

- `--rev <commit>` - remove experiments derived from the specified `<commit>` as
  baseline.

- `-n <num>`, `--num <num>` - show experiments from the last `num` commits
  (first parents) starting from the `--rev` baseline. Give a negative value to
  include all first-parent commits (similar to `git log -n`).

- `-g`, `--git-remote` - Name or URL of the Git remote to remove the experiment
  from

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Let's say we have `dvc exp run` 3 experiments in our project:

```dvc
$ dvc exp list
master:
        exp-e6c97
        exp-1dad0
        exp-1df77
```

To remove any of them, give their names to `dvc exp remove`. Or use the `--all`
(`-A`) option to remove them all at once:

```dvc
$ dvc exp remove exp-1dad0 exp-1df77

$ dvc exp list
master:
        exp-e6c97

$ dvc exp remove -A

$ dvc exp list
```

Nothing is listed after the last `dvc exp list` because they're all gone.

The same applies to queued experiments but these won't have a name to give to
`dvc exp remove` yet (unless you specified one). Alternatively, you can use
their ID (shown when queued, and by `dvc exp show`). Let's queue a few
experiments and then delete some of them:

```dvc
$ dvc exp run --queue -S train.min_split=64
Queued experiment 'e41d5b4' for future execution.
$ dvc exp run --queue -S train.min_split=32 --name split32
Queued experiment '5751540' for future execution.
$ dvc exp run --queue -S train.min_split=16 --name split16
Queued experiment '8de9a6c' for future execution.

$ dvc exp remove e41d5b4 split16

$ dvc exp show --include-params=train.min_split --no-pager
```

```dvctable
 ──────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**              neutral:**Created**        neutral:**State**    metric:**avg_prec**   metric:**roc_auc**   metric:**train.min_split**
 ──────────────────────────────────────────────────────────────────────────────────────
  workspace               -              -         0.57553   0.94652   2
  master                  Aug 02, 2021   -         0.53252    0.9107   2
  └── 5751540 [split32]   04:57 PM       Queued          -         -   32
 ──────────────────────────────────────────────────────────────────────────────────────
```

We can also remove experiments from a remote Git repository:

```dvc
$ dvc exp push myremote exp-e6c97
$ dvc exp push myremote exp-9fcef
$ dvc exp push myremote exp-1dad0

$ dvc exp list myremote
master:
        exp-1dad0
        exp-9fcef
        exp-e6c97

$ dvc exp remove -g myremote exp-9fcef exp-e6c97
$ dvc exp list myremote
master:
        exp-1dad0
```
