# DVC Experiments Overview

ML experiments can be saved with DVC automatically as they're run or manually
after they complete. Each experiment creates and tracks a variation of your data
science project based on the changes in your <abbr>workspace</abbr>.

Experiments preserve a connection to the latest commit in the current branch
(Git `HEAD`) as their parent or _baseline_, but do not form part of the regular
Git tree (unless you make them [persistent]). This prevents bloating your repo
with temporary commits and branches.

<details>

### ⚙️ How does DVC track experiments?

Experiments are custom [Git references] (found in `.git/refs/exps`) with one or
more commits based on `HEAD`. These commits are hidden and not checked out by
DVC. Note that these are not pushed to Git remotes by default either (see
`dvc exp push`).

Note that DVC Experiments require a unique name to identify them. DVC will
auto-generate one by default, such as `puffy-daks`. A custom name can be set
instead, using the `--name`/`-n` option of `dvc exp run`/`dvc exp save`. These
names can be used to reference experiments in other `dvc exp` subcommands.

</details>

[git references]: https://iterative.ai/blog/experiment-refs/

## Basic workflow

`dvc exp` commands let you automatically track a variation of a project version
(the baseline). You can create independent groups of experiments this way, as
well as review, compare, and restore them later. The basic workflow goes like
this:

- Modify hyperparameters or other dependencies (input data, source code,
  commands to execute, etc.). Leave these changes un-committed in Git.
- Run and [save experiments]. The results are reflected in your
  <abbr>workspace</abbr>, and tracked automatically.
- Review and [compare] experiments in a [GUI] or from the command line with
  `dvc exp show`, using `dvc metrics` and `dvc plots` to identify the best
  one(s). Repeat 🔄
- Make certain experiments [persistent] by committing their results to Git. This
  lets you repeat the process from that point.

[save experiments]: #saving-experiments
[compare]: /doc/user-guide/experiment-management/comparing-experiments
[gui]: #work-with-dvc-experiments-from-a-gui
[persistent]: /doc/user-guide/experiment-management/persisting-experiments

<admon type="">

See 👨‍💻 [Get Started: Experiments] for a hands-on introduction to DVC
experiments.

</admon>

[get started: experiments]: /doc/start/experiments

## Save experiments

DVC is not opinionated about your experiments workflow. To save an experiment,
you can follow one of these roads:

- If you do not have a DVC pipeline, you can log live results from Python code
  using [DVCLive] initialized with `save_dvc_exp=True`.
- If you have a DVC [pipeline], use `dvc exp run` to both [run] your code
  pipeline and save experiment results. `dvc exp run` also enables advanced
  features like queuing many experiments at once.
- If you already have results that you want to save, or you don't want to use
  either of the above methods, you can save experiment results manually with
  `dvc exp save`.

[pipeline]: /doc/user-guide/pipelines
[run]: /doc/user-guide/experiment-management/running-experiments
[dvclive]: /doc/dvclive/get-started

## Save metrics, plots, and parameters

DVC can track and compare parameters, metrics, and plots data saved in standard
structured files like YAML, JSON, and CSV, and they can be tracked as part of
your repo. `dvc.yaml` metafiles specify which files are parameters, metrics, or
plots, and how to visualize plots. One way to generate these structured
parameters, metrics, and plots files (and to automatically configure them in
`dvc.yaml`) is with DVCLive.

## Work with DVC Experiments from a GUI

DVC Experiments can be used directly [from the VS Code IDE] or online with
[Iterative Studio], the web UI that integrates all of our data science tools.

[from the vs code ide]: /doc/vs-code-extension
[iterative studio]: /doc/studio

### Iterative Studio

https://www.youtube.com/watch?v=hKf4twg832g

### VS Code Extension

https://www.youtube.com/watch?v=LHi3SWGD9nc
