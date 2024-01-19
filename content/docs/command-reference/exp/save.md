# exp save

Capture the current state of the <abbr>workspace</abbr> as a [DVC experiment].

[dvc experiment]: /doc/user-guide/experiment-management

<admon type="info">

See also `dvc exp run`, which includes this operation.

</admon>

## Synopsis

```usage
usage: dvc exp save [-h] [-q | -v] [-R] [-f]
                   [--json] [-n <name>]
                   [-I path] [-m <message>]
                   [targets [targets ...]]

positional arguments:
  targets        Limit DVC caching to these stages or .dvc files.
                 Using -R, directories to search for stages or .dvc
                 files can also be given.
```

## Description

Saves a snapshot of your <abbr>project</abbr> as an <abbr>experiment</abbr>,
without polluting your Git repository with unnecessary commits, branches,
directories, etc.

This lets you start tracking, [comparing], [plotting], and [sharing] experiments
quickly after making any project changes (e.g. retrain an ML model).

[comparing]: /doc/user-guide/experiment-management/comparing-experiments
[plotting]: /doc/user-guide/experiment-management/visualizing-plots
[sharing]: /doc/user-guide/experiment-management/sharing-experiments

<admon type="tip">

Only files tracked by either Git or DVC are saved to the experiment unless you
use `--include-untracked` (`-I`) on untracked files explicitly (see an
[example](#examples) below).

</admon>

[Review] your experiments with `dvc exp show`. Successful ones can be [made
persistent] by restoring them via `dvc exp branch` or `dvc exp apply` and
committing them to the Git repo. Unnecessary ones can be [cleared] with
`dvc exp remove`.

[review]: /doc/user-guide/experiment-management/comparing-experiments
[made persistent]:
  /doc/user-guide/experiment-management/sharing-experiments#persist-experiment
[cleared]:
  /doc/user-guide/experiment-management/comparing-experiments#clean-up-experiments

## Options

- `-n <name>`, `--name <name>` - specify a [unique name] for this experiment. A
  default one will be generated otherwise, such as `urban-sign`.

  <admon type="tip">

  The name of the experiment is exposed in env var `DVC_EXP_NAME`.

  </admon>

- `-I <path>`, `--include-untracked <path>` - specify an untracked file or
  directory to be included in the experiment. This option can be used multiple
  times.

- `-m <message>`, `--message <message>` - custom message to use when saving the
  experiment. If not provided, `dvc: commit experiment {hash}` will be used.

- `-R`, `--recursive` - determines the files to cache by searching each target
  directory and its subdirectories for stages (in `dvc.yaml`) or `.dvc` files to
  inspect. If there are no directories among the `targets`, this option has no
  effect.

- `-f`, `--force` - rewrite the experiment if it already exists.

- `-h`, `--help` - prints the usage/help message, and exits.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

[unique name]:
  /doc/user-guide/experiment-management#how-does-dvc-track-experiments

## Examples

<admon type="info">

This example is based on [our Get Started], where you can find the actual source
code.

[our get started]: /doc/start/experiments

</admon>

Let's say we have modified our repo by adding new data (`data/new.xml`), new
code (`src/extratrees.py`), as well as modifying the training script
(`src/train.py`). After running `dvc add data/new.xml`, we have the following
status in the repo:

```cli
$ git status
On branch main

Changes not staged for commit:
	modified:   data/.gitignore
	modified:   src/train.py
Untracked files:
	data/new.xml.dvc
	src/extratrees.py
```

We can inspect results with `dvc metrics show` (or other means) after running
the experiment (in this case we can do so with `dvc repro` since the example
project uses a [DVC pipeline]). We are not quite ready for a Git commit, but we
want to save the results in the repo nonetheless:

```cli
dvc exp save --name extra-trees \
             -I data/new.xml.dvc -I src/extra_trees.py
```

[dvc pipeline]: /doc/user-guide/pipelines

<admon type="info">

We use [`-I`](#-I) to include new (untracked) files in the experiment.

</admon>

We can now get rid of all the changes in the <abbr>workspace</abbr> and remove
untracked files:

```cli
$ git reset --hard
$ rm data/new.xml data/new.xml.dvc src/extratrees.py
```

We see the experiment we just saved by using `dvc exp show`

```dvctable
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Experiment                  Created        avg_prec   roc_auc   prepare.split   prepare.seed   featurize.max_features   featurize.ngrams   train.seed   train.n_est   train.min_split   data/data.xml   data/features   data/prepared   model.pkl   src/evaluate.py   src/featurization.py   src/prepare.py   src/train.py
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 workspace                   -                 0.925   0.94602   0.2             20170428       200                      2                  20170428     50            0.01              22a1a29         f35d4cc         153aad0         fb021d7     759095a           e0265fc                f09ea0c          c3961d7
 main                        Nov 02, 2022      0.925   0.94602   0.2             20170428       200                      2                  20170428     50            0.01              22a1a29         f35d4cc         153aad0         fb021d7     759095a           e0265fc                f09ea0c          c3961d7
 └── d0f234c [extra-trees]   12:11 PM        0.92707   0.94612   0.2             20170428       200                      2                  20170428     50            0.01              ced660e         f35d4cc         153aad0         27473f2     759095a           e0265fc                f09ea0c          6537232
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

The experiment has higher `avg_prec`/`roc_auc`, so we want to restore it, we can
use `dvc exp apply`:

```cli
$ dvc exp apply extra-trees
Changes for experiment 'extra-trees' have been applied to your current workspace.
$ git status
On branch main

Changes not staged for commit:
	modified:   data/...
	modified:   dvc.lock
	modified:   evaluation/...
	modified:   src/train.py

Untracked files:
	data/new.xml.dvc
	src/extratrees.py
```

All changes, including untracked files, have been restored to the workspace.

<admon type="info">

See [our Get Started] guide, for more examples on how to use experiments.

</admon>

## Example: Specify targets to save

Let's say a repository looks like this:

```cli
$ tree
.
├── dir_a
│   └── dvc.yaml
└── dir_b
    └── dvc.yaml
```

`dvc repro dir_a/dvc.yaml` will reproduce stages in `dir_a/dvc.yaml`. If stages
in `dir_b/dvc.yaml` have not been run, `dvc exp save` will fail because the
outputs for those stages do not exist. Running `dvc exp save dir_a/dvc.yaml`
will ignore stages in `dir_b/dvc.yaml` and only cache changes to stages in
`dir_a/dvc.yaml`.

<admon type="info">

Changes to Git-tracked files in `dir_b` (including `dir_b/dvc.yaml` itself) will
be saved as part of the experiment since the entire repository is committed to
Git.

</admon>
