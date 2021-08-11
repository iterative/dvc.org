# Cleaning Up Experiments

Although DVC uses minimal resources to keep track of the experiments, they may
clutter tables and the workspace. DVC allows to remove particular experiments
from the workspace or delete all not-yet-persisted experiments at once.

## Removing Local Experiments

When you want to discard an experiment you can use `dvc exp remove` and supply
the experiment name.

```dvc
$ dvc exp list
main:
    cnn-32
    cnn-64
    cnn-128
$ dvc exp remove cnn-32
$ dvc exp list
main:
    cnn-64
    cnn-128
```

## Removing Multiple Local Experiments

When the local project becomes cluttered with too many experiments, you can
delete all of them at once with `dvc exp gc`.

This command takes a _scope_ argument. The scope can be `workspace`,
`all-branches`, `all-tags`, `all-commits`. Scope determines the experiments to
_keep_, i.e., experiments out of the scope of the given flag are removed.

### Keeping experiments in the workspace

Supplying `--workspace` flag to `dvc exp gc` causes all experiments to be
removed **except** those in the current workspace.

```dvc
$ dvc exp list --all
main:
   exp-aaa000
   exp-aaa111
   exp-aaa222
other:
   exp-bbb333
   exp-bbb444
another:
   exp-ccc555
   exp-ccc666
   exp-ccc777
```

Issuing `dvc exp gc --workspace` removes experiments in `other` and `another`
branches in this example.

```dvc
$ dvc exp gc --workspace
$ dvc exp list --all
main:
   exp-abc000
   exp-abc111
   exp-abc222
```

### Keeping experiments in all branches

DVC can create a branch for an experiment using `dvc exp branch` command.

In cases where you want to clean up the experiments _except_ those in the
branches, you can use `--all-branches` flag.

```dvc
$ dvc exp show --all-branches
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃    acc ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │      - │ 64               │
│ cnn-48                  │ 09:11 AM     │ 0.9131 │ 48               │
│ main                    │ Jul 21, 2021 │ 0.9189 │ 16               │
│ ├── dac711b [cnn-32]    │ 09:16 AM     │ 0.9152 │ 32               │
│ ├── 7cd3ae7 [cnn-48]    │ 09:11 AM     │ 0.9131 │ 48               │
│ ├── ab585b5 [cnn-24]    │ 09:06 AM     │ 0.9135 │ 24               │
│ ├── 7d51b55 [exp-44136] │ 09:01 AM     │ 0.9151 │ 16               │
│ └── 7feaa1c [exp-78ede] │ Aug 02, 2021 │ 0.9151 │ 16               │
│ 8583124                 │ Jul 20, 2021 │ 0.9132 │ 17               │
└─────────────────────────┴──────────────┴────────┴──────────────────┘
```

Supplying `--all-branches` keeps only the experiments in branch tips. Any
experiment that's not promoted to a branch is removed this way.

```dvc
$ dvc exp gc --all-branches
WARNING: This will remove all experiments except those derived from the workspace and all git branches of the current repo.
Are you sure you want to proceed? [y/n] y
Removed 6 experiments. To remove unused cache files use 'dvc gc'.
```

The resulting `dvc exp show` table is as the following:

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃ Created      ┃    acc ┃ model.conv_units ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━┩
│ workspace               │ -            │      - │ 64               │
│ cnn-48                  │ 09:11 AM     │ 0.9131 │ 48               │
│ main                    │ Jul 21, 2021 │ 0.9189 │ 16               │
│ 8583124                 │ Jul 20, 2021 │ 0.9132 │ 17               │
└─────────────────────────┴──────────────┴────────┴──────────────────┘
```

### Keeping experiments in all tags

When you tag the experiment commits by `git tag`, `dvc exp show --all-tags`
presents them along with the tags. If you want the delete _all experiments
without tags_, you can issue a `dvc exp gc --all-tags` command.

```dvc
$ dvc exp show --all-tags
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃    acc ┃ model.conv_units  ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.9067 │ 16                │
│ ├── 2fc4f81 [exp-a1b3c4]│ 0.9037 │ 48                │
│ └── 21beb69 [exp-d4e3ff]│ 0.9367 │ 128               │
│ my-experiments          │ 0.9067 │ 16                │
│ ├── 2fc4f81 [cnn-32]    │ 0.9067 │ 32                │
│ ├── 5bc84a3 [cnn-64]    │ 0.9158 │ 64                │
│ ├── 206cba6 [cnn-96]    │ 0.9260 │ 96                │
│ └── 21beb69 [cnn-128]   │ 0.9379 │ 128               │
└─────────────────────────┴────────┴───────────────────┘
```

```dvc
$ dvc exp gc --all-tags
$ dvc exp show --all-tags
```

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
┃ Experiment              ┃    acc ┃ model.conv_units  ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━╇━━━━━━━━━━━━━━━━━━━┩
│ workspace               │ 0.9067 │ 16                │
│ my-experiments          │ 0.9067 │ 16                │
│ ├── 2fc4f81 [cnn-32]    │ 0.9067 │ 32                │
│ ├── 5bc84a3 [cnn-64]    │ 0.9158 │ 64                │
│ ├── 206cba6 [cnn-96]    │ 0.9260 │ 96                │
│ └── 21beb69 [cnn-128]   │ 0.9379 │ 128               │
└─────────────────────────┴────────┴───────────────────┘
```

### Keeping experiments in all commits

When you want to delete _all the experiments not associated with a Git commit_,
you can do so by `--all-commits` flag. It deletes the experiments in the
workspace that are not committed to the history.

## Removing Experiments in Remotes

As you push the experiments with `dvc exp push`, remotes may be become cluttered
with experiment references.

DVC doesn't provide a shortcut for cleaning up the experiments in remotes but
you can use Git plumbing commands to remove experiment references from remotes.

First get the list of experiments with their hash values.

```dvc
$ git ls-remote origin 'refs/exps/*'
```

Then we can use `git push -d` as any other Git reference:

```dvc
$ git push -d origin refs/exps/path/to/ref
```

If you want to delete **all** experiments in a remote, you can use a loop:

```dvc
$ git ls-remote origin 'refs/exps/*' | cut -f 2 | while read exppath ; do
   git push -d origin "${exppath}"
done
```

## Deleting Experiment-Related Objects in DVC Cache

Note that `dvc exp gc` and `dvc exp remove` doesn't delete any objects in the
DVC <abbr>cache</abbr>. In order to remove the cache objects, e.g. model files,
intermediate artifacts, etc. related with the experiments, you can use `dvc gc`
command.

## Deleting All Queued Experiments

When you created experiments to be run in the queue with `--queue` option of
`dvc exp run`, and later decide not to run them, you can remove by either
`dvc exp gc --queued` or `dvc exp remove --queue`. Both of these commands remove
_all_ queued experiments.

```dvc
$ dvc exp run --queue -S param=10
Queued experiment '7b83744' for future execution.
$ dvc exp run --queue -S param=20
Queued experiment '68808d5' for future execution.
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━┓
┃ Experiment   ┃ Created      ┃ param ┃
┡━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━┩
│ workspace    │ -            │ -     │
│ 04abbb7      │ Jul 21, 2021 │ -     │
│ ├── *68808d5 │ 12:05 PM     │ 20    │
│ └── *7b83744 │ 12:05 PM     │ 10    │
└──────────────┴──────────────┴───────┘
```

You can delete these queued experiments with `dvc exp remove --queue`.

```dvc
$ dvc exp remove --queue
$ dvc exp show
```

```dvctable
┏━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┳━━━━━━━┓
┃ Experiment   ┃ Created      ┃ param ┃
┡━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━╇━━━━━━━┩
│ workspace    │ -            │ -     │
│ 04abbb7      │ Jul 21, 2021 │ -     │
└──────────────┴──────────────┴───────┘
```
