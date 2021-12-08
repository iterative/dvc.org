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

[pipeline]: /doc/user-guide/project-structure/pipelines-files
[compare]: /doc/user-guide/experiment-management/comparing-experiments
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

## Initialize DVC Experiments on any project

DVC Experiments build on basic semantics of <abbr>DVC projects</abbr>. This
means that minimal formalities are required.

`dvc exp init` lets you quickly onboard an existing data science project to use
DVC Experiments, without having to worry about bootstrapping DVC manually. You
can either supply a `command` to execute your experiments or use the
`--interactive` flag (`-i`) to be prompted for that and other optional
customizations.

This creates a simple `dvc.yaml` file for you. It uses sane default locations
for your project's <abbr>dependencies</abbr> (data, parameters, source code) and
<abbr>outputs</abbr> (ML models or other artifacts, <abbr>metrics</abbr>, etc.)
-- which you can customize via `-i` or other options of `dvc exp init`.

You can review the results (and commit them to Git) to begin using DVC
Experiments. Now you can move on to [running your experiments][run] (next).

[codify a pipeline]: /doc/user-guide/project-structure/pipelines-files
