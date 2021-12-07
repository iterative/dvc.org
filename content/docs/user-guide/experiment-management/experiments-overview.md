# DVC Experiments Overview

DVC Experiments are captured automatically by DVC when [run]. Each experiment
creates and tracks a variation of your data science project based on the changes
in your <abbr>workspace</abbr>.

Experiments preserve a connection to the latest commit in the current branch
(Git `HEAD`) as their parent or _baseline_, but do not form part of the regular
Git tree or workflow (unless you make them [persistent]). This prevents
polluting Git namespaces and bloating the repo unnecessarily.

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

`dvc exp init` lets you onboard any existing data science project to use DVC
Experiments without having to worry bootstrapping DVC manually. This creates a
simple `dvc.yaml` file for you, as well as other other <abbr>metafiles</abbr>
with sane default values. For more control `dvc exp init --interactive` (or
`-i`) will prompt you with a few simple questions to populate the aforementioned
DVC metafiles.

One of the important steps this takes care of is to [codify a pipeline] (even if
it has a single <abbr>stage</abbr> that represents your entire process). Other
typical preparation step are to write (or update) a structured
<abbr>parameters</abbr> file, and to track <abbr>metrics</abbr> output by your
code or ML models.

You can review these files and commit them to Git to begin using DVC Experiments
quickly. Now you can move on to [running your experiments][run].

[codify a pipeline]: /doc/user-guide/project-structure/pipelines-files
