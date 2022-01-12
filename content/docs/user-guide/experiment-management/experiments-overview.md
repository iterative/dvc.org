# DVC Experiments Overview

DVC Experiments are captured automatically by DVC when [run]. Each experiment
creates and tracks a variation of your data science project based on the changes
in your <abbr>workspace</abbr>.

Experiments preserve a connection to the latest commit in the current branch
(Git `HEAD`) as their parent or _baseline_, but do not form part of the regular
Git tree (unless you make them [persistent]). This prevents bloating your repo
with temporary commits and branches.

[run]: /doc/user-guide/experiment-management/running-experiments

<details>

### ⚙️ How does DVC track experiments?

Experiments are custom [Git references](/blog/experiment-refs) (found in
`.git/refs/exps`) with one or more commits based on `HEAD`. These commits are
hidden and not checked out by DVC. Note that these are not pushed to Git remotes
by default either (see `dvc exp push`).

Note that DVC Experiments require a unique name to identify them. DVC will
usually auto-generate one by default, such as `exp-bfe64` (based on the
experiment's hash). A custom name can be set instead, using the `--name`/`-n`
option of `dvc exp run`. These names can be used to reference experiments in
other `dvc exp` subcommands.

</details>

## Basic workflow

`dvc exp` commands let you automatically track a variation of a project version
(the baseline). You can create independent groups of experiments this way, as
well as review, compare, and restore them later. The basic workflow goes like
this:

- Modify hyperparameters or other dependencies (input data, source code,
  commands to execute, etc.). Leave these changes un-committed in Git.
- [Run experiments][run] with `dvc exp run` (instead of `repro`). The results
  are reflected in your <abbr>workspace</abbr>, and tracked automatically.
- Review and [compare] experiments with `dvc exp show` or `dvc exp diff`, using
  [metrics](/doc/command-reference/metrics) to identify the best one(s). Repeat
  🔄
- Make certain experiments [persistent] by committing their results to Git. This
  lets you repeat the process from that point.

[compare]: /doc/user-guide/experiment-management/comparing-experiments
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

## Initialize DVC Experiments on any project

To use DVC Experiments you need a <abbr>DVC project</abbr> with a minimal
structure and configuration. To avoid having to bootstrap DVC manually, the
`dvc exp init` command lets you quickly onboard an existing project to the DVC
Experiments workflow.

It will create a simple `dvc.yaml` metafile, which codifies your planned
experiments. This includes the locations for expected <abbr>dependencies</abbr>
(data, parameters, source code) and <abbr>outputs</abbr> (ML models,
<abbr>metrics</abbr>, etc.). These assume [sane defaults] but can be customized
with the options of `dvc exp init`.

💡 We recommend adding the `-i` flag to use its [interactive mode]. This will
ask you how to run the experiments, and guide you through customizing the
aforementioned locations (optional).

You can review the resulting changes to your repo (and commit them to Git) to
begin using DVC Experiments. Now you can move on to [running experiments][run]
(next).

[sane defaults]: /doc/command-reference/exp/init#description
[interactive mode]: /doc/command-reference/exp/init#example-interactive-mode
