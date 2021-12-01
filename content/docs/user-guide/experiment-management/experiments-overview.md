# DVC Experiments Overview

DVC Experiments are captures automatically by DVC when you [run them]. Each
experiment creates and tracks a project variation based on the changes in your
<abbr>workspace</abbr>.

Experiments preserve a connection to the latest commit in the current branch
(Git `HEAD`) as their parent or _baseline_, but do not form part of the regular
Git tree or workflow (unless you make them [persistent]). This prevents
polluting Git namespaces and bloating the repo unnecessarily.

<details>

### ⚙️ How does DVC track experiments?

Experiments are custom [Git references] (found in `.git/refs/exps`) with one or
more commits based on `HEAD`. These commits are hidden and not checked out by
DVC. Note that these are not pushed to Git remotes by default either (see
`dvc exp push`).

</details>

[run them]: /doc/user-guide/experiment-management/running-experiments
[git references]: https://git-scm.com/book/en/v2/Git-Internals-Git-References

## Properties

DVC Experiments will have an auto-generated name like `exp-bfe64` by default. A
custom name can be given instead (using the `--name`/`-n` option of
`dvc exp run`). These names can be used to reference experiments in other
`dvc exp` subcommands.

All experiments created by DVC will be associated to the latest commit (Git
`HEAD`) at the time that they were run. This is called the experiment's
_baseline_.

## Basic workflow

`dvc exp` commands let you automatically track a variation to a committed
project version (baseline). You can create independent groups of experiments
this way, as well as review, compare, and restore them later. The basic workflow
goes like this:

- Modify hyperparameters or other dependencies (input data, source code,
  commands to execute, etc.). Leave these changes un-committed in Git.
- [Run experiments] with `dvc exp run` (instead of `repro`). The results are
  reflected in your <abbr>workspace</abbr>, and tracked automatically.
- Review and [compare] experiments with `dvc exp show` or `dvc exp diff`, using
  [metrics](/doc/command-reference/metrics) to identify the best one(s). Repeat
  🔄
- Make certain experiments [persistent] by committing their results to Git. This
  lets you repeat the process from that point.

[run experiments]: /doc/user-guide/experiment-management/running-experiments
[pipeline]: /doc/user-guide/project-structure/pipelines-files
[compare]: /doc/user-guide/experiment-management/comparing-experiments
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

## Initialize DVC Experiments on any project

DVC Experiments features build on basic semantics of <abbr>DVC projects</abbr>.
This means that minimal formalities are required, such as codifying a pipeline
with `dvc.yaml` (even if it has a single <abbr>stage</abbr> that represents your
entire process). Another typical preparation step is to create or modify a
structured <abbr>parameters</abbr> file.

`dvc exp init` lets you onboard any existing data science project to use DVC
Experiments without having to worry bootstrapping DVC manually. It will prompt
you a few simple questions and create a simple `dvc.yaml` file as well as other
<abbr>metafiles</abbr> with sane default values. You can review these and commit
them to Git to begin using DVC Experiments.
