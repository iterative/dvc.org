# exp gc

Remove unneeded experiments from the project.

## Synopsis

```usage
usage: dvc exp gc [-h] [-q | -v] [-w] [-a] [-T] [--all-commits] [--queued] [-f]

optional arguments:
  -h, --help          show this help message and exit
  -q, --quiet         Be quiet.
  -v, --verbose       Be verbose.
  -w, --workspace     Keep experiments derived from the current workspace.
  -a, --all-branches  Keep experiments derived from the tips of all Git branches.
  -T, --all-tags      Keep experiments derived from all Git tags.
  --all-commits       Keep experiments derived from all Git commits.
  --queued            Keep queued experiments (experiments run queue will be cleared by default).
  -f, --force         Force garbage collection - automatically agree to all prompts.
```

## Description

This command deletes (garbage collects) experiments that exist in the project
but are no longer needed.

After experiments are removed with `dvc exp gc`, files and directories that are
no longer needed may remain in the DVC cache. `dvc gc` should be used as needed
to remove unneeded DVC cache data.

One of the scope options (`--workspace`, `--all-branches`, `--all-tags`,
`--all-commits`) or a combination of them must be provided. Each of them
corresponds to keeping the experiments derived from the current workspace, and
for a certain set of commits. See the [Options](#options) section for more
details.

## Options

- `-w`, `--workspace` - keep experiments _only_ derived from the current
  workspace This option is enabled automatically if `--all-tags`,
  `--all-branches`, or `--all-commits` are used.

- `-a`, `--all-branches` - keep experiments derived from the tips of all Git
  branches as well as the workspace (implies `-w`). Note that this can be
  combined with `-T` below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace (implies `-w`). Note that both options can be combined, for
  example using the `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace (implies `-w`). This is mainly only needed when
  clearing the experiments run queue.

- `--queued` - keep experiments staged for execution via `dvc exp run --queue`.
  The experiments run queue will be cleared by default if this option is
  omitted.

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's say we have the following project, have
[checked out](/docs/command-reference/exp/checkout) and promoted an experiment
to a full commit:

```dvc
$ dvc exp show --all-commits --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.57756 │ 2000                   │ 2                │
│ master                │ 05:39 PM     │ 0.57756 │ 2000                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── e6c974b           │ Oct 21, 2020 │ 0.61314 │ 1500                   │ 2                │
│ ├── 1dad0d2           │ Oct 09, 2020 │ 0.57756 │ 2000                   │ 2                │
│ └── 1df77f7           │ Oct 09, 2020 │ 0.51676 │ 500                    │ 2                │
│ 10-bigrams-model      │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
│ └── 069d9cc           │ Sep 24, 2020 │ 0.51076 │ 2500                   │ 2                │
│ 9-evaluation          │ Jun 20, 2020 │ 0.54175 │ 500                    │ 1                │
│ 8-ml-pipeline         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 6-prep-stage          │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 5-source-code         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 4-import-data         │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 2-track-data          │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 3-config-remote       │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 1-dvc-init            │ Jun 20, 2020 │       - │ 1500                   │ 2                │
│ 0-git-init            │ Jun 20, 2020 │       - │ 1500                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

Now wish to remove all old (and now unnecessary) experiments:

```dvc
$ dvc exp gc -w
WARNING: This will remove all experiments except those derived from the workspace of the current repo.
Are you sure you want to proceed? [y/n] y
Removed 4 experiments. To remove unused cache files use 'dvc gc'.
```

We can confirm that the old experiments are now removed:

```dvc
$ dvc exp show --all-commits --include-params=featurize
┏━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment            ┃ Created      ┃     auc ┃ featurize.max_features ┃ featurize.ngrams ┃
┡━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace             │ -            │ 0.57756 │ 2000                   │ 2                │
│ master                │ 05:39 PM     │ 0.57756 │ 2000                   │ 2                │
│ 11-bigrams-experiment │ Jun 20, 2020 │ 0.61314 │ 1500                   │ 2                │
│ 10-bigrams-model      │ Jun 20, 2020 │ 0.54175 │ 1500                   │ 2                │
│ 9-evaluation          │ Jun 20, 2020 │ 0.54175 │ 500                    │ 1                │
│ 8-ml-pipeline         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 6-prep-stage          │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 5-source-code         │ Jun 20, 2020 │       - │ 500                    │ 1                │
│ 4-import-data         │ Jun 20, 2020 │       - │ 2000                   │ 2                │
│ 2-track-data          │ Jun 20, 2020 │       - │ 2000                   │ 2                │
│ 3-config-remote       │ Jun 20, 2020 │       - │ 2000                   │ 2                │
│ 1-dvc-init            │ Jun 20, 2020 │       - │ 2000                   │ 2                │
│ 0-git-init            │ Jun 20, 2020 │       - │ 2000                   │ 2                │
└───────────────────────┴──────────────┴─────────┴────────────────────────┴──────────────────┘
```

To remove any DVC cache files which are no longer needed, we can use `dvc gc`
with the appropriate options:

```dvc
$ dvc dvc gc --all-commits
WARNING: This will remove all cache except items used in the workspace and all git commits of the current repo.
Are you sure you want to proceed? [y/n] y
WARNING: Some of the cache files do not exist neither locally nor on remote. Missing cache files:
name: data/features, md5: a50924d27b5ff0f023344d9b33d1d7bf.dir
Missing cache for directory 'data/features'. Cache for files inside will be lost. Would you like to continue? Use '-f' to force. [y/n] y
```

Note the use of `--all-commits` to ensure that we do not garbage collect cache
files which are still referenced by top level commits in our project.
