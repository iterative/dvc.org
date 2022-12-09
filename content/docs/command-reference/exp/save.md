# exp save

Save the current project status as a [DVC experiment].

[dvc experiment]: /doc/user-guide/experiment-management/experiments-overview

## Synopsis

```usage
usage: dvc exp save [-h] [-q | -v] [-f]
                   [--json] [-n <name>]
                   [-I path]
```

## Description

Provides a way to save the current status of your <abbr>project</abbr> as an
<abbr>experiment</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

Only files tracked by either Git or DVC are saved to the experiment. Use the
`--include-untracked` (`-I`) option to explicitly include any untracked files in
the experiment.

`dvc exp save` creates <abbr>experiments</abbr> just like
[`dvc exp run`](/doc/command-reference/exp/run), but does not require
reproduction or setup of [pipeline stages](/doc/start/data-pipelines), making it
possible to quickly start tracking, [comparing] and [persisting] experiments.

[comparing]: /doc/user-guide/experiment-management/comparing-experiments
[persisting]: /doc/user-guide/experiment-management/persisting-experiments

## Options

- `-n <name>`, `--name <name>` - specify a [unique name] for this experiment. A
  default one will be generated otherwise, such as `exp-f80g4` (based on the
  experiment's hash).

- `-I <path>`, `--include-untracked <path>` - specify untracked file(s) to be
  included in the saved experiment. Multiple files can be specified.

- `-f`, `--force` - overwrite the experiment if an experiment with the same name
  already exists.

- `-h`, `--help` - prints the usage/help message, and exits.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

[unique name]:
  https://dvc.org/doc/user-guide/experiment-management/experiments-overview#how-does-dvc-track-experiments

## Examples

<admon type="info">

This example is based on [our Get Started], where you can find the actual source
code.

[our get started](/doc/start/experiment-management/experiments)

</admon>

Let's say we have modified our repo by adding new data (`data/new.xml`), new
code (`src/extratrees.py`), as well as modifying the training script
(`src/train.py`). After running `dvc add data/new.xml`, we have the following
status in the repo:

```cli
$ git status
On branch main
Your branch is up to date with 'upstream/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   data/.gitignore
	modified:   src/train.py
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	data/new.xml.dvc
	src/extratrees.py

no changes added to commit (use "git add" and/or "git commit -a")
```

We can run `dvc repro` to reproduce the pipeline and inspect results, e.g. by
running `dvc metrics show`. We are not quite ready for a commit, but we want to
save the results of this experiment, so we can run:

```cli
dvc exp save --name extra-trees -I data/new.xml.dvc -I src/extra_trees.py
```

We use the `-I` flags to make sure to include new (untracked) files in the
experiment.

We can now get rid of all the changes in the workspace, as well as removing
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
Your branch is up to date with 'upstream/main'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   data/.gitignore
	modified:   data/data.xml.dvc
	modified:   dvc.lock
	modified:   evaluation/metrics.json
	modified:   evaluation/plots/metrics/avg_prec.tsv
	modified:   evaluation/plots/metrics/roc_auc.tsv
	modified:   evaluation/plots/prc.json
	modified:   evaluation/plots/sklearn/confusion_matrix.json
	modified:   evaluation/plots/sklearn/roc.json
	modified:   evaluation/report.html
	modified:   src/train.py

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	data/new.xml.dvc
	src/extratrees.py

no changes added to commit (use "git add" and/or "git commit -a")
```

All changes, including untracked files, have been restored to the workspace.

<admon type="info">

See [our Get Started] guide, for more examples on how to use experiments.

[our get started](/doc/start/experiment-management/experiments)

</admon>
