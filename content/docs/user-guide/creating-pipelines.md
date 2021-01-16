# Creating Pipelines

You construct pipelines by defining individual
[stages](/doc/command-reference/run) in one or more `dvc.yaml` files. Stages
form a pipeline when they connect with each other (see `dvc dag`). Refer to
[Data Pipelines](/doc/start/data-pipelines).

> Note that a helper command, `dvc run`, is available to create (and execute)
> stages.

💡 Keep in mind that one `dvc.yaml` file does not necessarily equal one pipeline
(although that is typical). DVC evaluates all the `dvc.yaml` files in the
<abbr>workspace</abbr> to rebuild an validate the pipeline(s) (see `dvc status`
and `dvc repro`).

To record the state of your pipeline(s) and track its <abbr>outputs</abbr>, DVC
will also maintain `dvc.lock` file(s) matching `dvc.yaml`.

> Note `dvc.yaml` and `dvc.lock` files are meant to be versioned with Git (if
> enabled in the <abbr>repository</abbr>).

## DVC YAML files

`dvc.yaml` files (or _pipelines files_) specify stages that form the pipeline(s)
of a project, and how they connect (_dependency graph_ or
[DAG](/doc/command-reference/dag)).

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema described below. We encourage you to get familiar with it
so you may modify, write, or generate stages and pipelines on your own. Here's
an example:

...

> See [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts) for tips
> on managing DVC files.

## dvc.yaml specification

...

## dvc.lock file

... normally have a matching `dvc.lock` file to record the pipeline state and
track its <abbr>outputs</abbr>.

> ⚠️ Avoid editing these, DVC will create and update them for you.
