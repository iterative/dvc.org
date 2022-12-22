# DVC Experiments Overview

Each DVC Experiment creates and tracks a variation of your data science project
based on the changes in your <abbr>workspace</abbr>. They can be captured
automatically when [run with DVC][run] or can be [saved directly][save] (e.g.
after executing code manually).

Experiments preserve a connection to the latest commit in the current branch
(Git `HEAD`) as their parent or _baseline_, but do not form part of the regular
Git tree (unless you make them [persistent]). This prevents bloating your repo
with temporary commits and branches.

[run]: /doc/user-guide/experiment-management/running-experiments
[save]: /doc/command-reference/exp/save

<details>

### ⚙️ How does DVC track experiments?

DVC Experiments are custom [Git references](/blog/experiment-refs) (found in
`.git/refs/exps`) with one or more hidden commits based on `HEAD`. Note that
these are not pushed to Git remotes by default (see `dvc exp push`).

All experiments require a unique name to identify them. DVC will usually
auto-generate one by default, such as `exp-bfe64` (based on the experiment's
hash). A custom name can be set instead (see the `--name`/`-n` option of
`dvc exp run` and `dvc exp save`). These names can be used to reference
experiments in other `dvc exp` subcommands.

</details>

## Basic workflow

`dvc exp` commands let you automatically track a variation of a project version
(the baseline). You can create independent groups of experiments this way, as
well as review, compare, and restore them later. The basic workflow goes like
this:

- Modify hyperparameters or other dependencies (input data, source code,
  commands to execute, etc.). Leave these changes un-committed in Git.
- [Run experiments][run] with `dvc exp run` (instead of `repro`) or [save the
  current workspace state][save] as an experiment. The results are reflected in
  your <abbr>workspace</abbr>, and tracked automatically.
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

## Work with DVC Experiments from a GUI

DVC Experiments can be used directly [from the VS Code IDE] or online with
[Iterative Studio], the web UI that integrates all of our data science tools.

[from the vs code ide]: /doc/vs-code-extension
[iterative studio]: /doc/studio

### Iterative Studio

https://www.youtube.com/watch?v=hKf4twg832g

### VS Code Extension

https://www.youtube.com/watch?v=LHi3SWGD9nc
