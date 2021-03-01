# exp gc

Remove unnecessary `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp gc [-h] [-q | -v] [-w]
                  [-a] [-T] [--all-commits] [--queued] [-f]
```

## Description

This command can delete (garbage collect) experiments that exist in the project
but are no longer needed.

> See **How does DVC track experiments?** in `dvc exp run` to learn more about
> DVC experiment storage.

To avoid accidentally deleting work, `dvc exp gc` doesn't do anything unless one
or a combination of scope options are provided (`--workspace`, `--all-branches`,
`--all-tags`, `--all-commits`). Use these to indicate which experiments are
still needed. See the [Options](#options) section for more details.

Note that after removing experiments, the corresponding data which may no longer
be needed still remains in the <abbr>cache</abbr>. You can use `dvc gc`
separately to delete it.

## Options

- `-w`, `--workspace` - keep _only_ experiments derived from the Git `HEAD`
  commits (default base commit for `dvc exp run`). This option is enabled
  automatically if `--all-tags`, `--all-branches`, or `--all-commits` are used.

- `-a`, `--all-branches` - keep experiments derived from the tips of all Git
  branches as well as the workspace (implies `-w`). Note that this can be
  combined with `-T` below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace (implies `-w`). Note that both options can be combined, for
  example using the `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace (implies `-w`). This is mainly only needed when
  clearing the experiments run queue.

- `--queued` - keep also experiments that haven't been run yet (defined via
  `dvc exp run --queue`). A scope option (`-w`, `-a`, etc.) is required along
  with this. The experiment run queue will typically be cleared if this option
  isn't used.

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have the following project, and have just
[applied](/docs/command-reference/exp/apply) and committed `exp-1dad0` (current
`HEAD` of `master`):

```dvc
$ dvc exp show --all-commits --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.57756 │ 2000                   │ 2                │
│ master                │ 05:39 PM     │ 0.57756 │ 2000                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-e6c97         │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── exp-1dad0         │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── exp-1df77         │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ 9-bigrams-model       │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
│ └── exp-069d9         │ Sep 24, 2020 │ 0.51076 │ 2500                   │ 2                │
│ 8-evaluation          │ Jun 20, 2020 │ 0.54175 │ 500                    │ 1                │
│ 7-ml-pipeline         │ Jun 20, 2020 │       - │ 500                    │ 1                │
  ...
│ 0-git-init            │ Jun 20, 2020 │       - │ 1500                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

If we consider all the other experiments unnecessary, we can delete them like
this:

```dvc
$ dvc exp gc -w
WARNING: This will remove all experiments except ...
Are you sure you want to proceed? [y/n] y
Removed 4 experiments. To remove unused cache files use 'dvc gc'.
```

We can confirm that all the previous experiments are gone:

```dvc
$ dvc exp show --all-commits --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.57756 │ 2000                   │ 2                │
│ master                │ 05:39 PM     │ 0.57756 │ 2000                   │ 2                │
│ 10-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ 9-bigrams-model       │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
  ...
│ 0-git-init            │ Jun 20, 2020 │       - │ 2000                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

To remove any <abbr>cached</abbr> data associated to the deleted experiments and
which are no longer needed in the project, we can use regular `dvc gc` (with the
appropriate options):

```dvc
$ dvc dvc gc --all-commits
WARNING: This will remove all cache except ...
Are you sure you want to proceed? [y/n] y
...
```

> Note the use of `--all-commits` to ensure that we do not garbage collect files
> or directories referenced in remaining commits in the repo.
