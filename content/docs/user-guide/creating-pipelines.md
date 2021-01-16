# Creating Pipelines

You construct pipelines by defining individual
[stages](/doc/command-reference/run) in one or more `dvc.yaml` files. Stages
that connect to each other (the <abbr>outputs</abbr> of one stage become the
<abbr>dependencies</abbr> of another one, and so on) become a pipeline. See
[Data Pipelines](/doc/start/data-pipelines) for an intro.

💡 Keep in mind that one `dvc.yaml` file does not necessarily equal one pipeline
(although that is typical). DVC evaluates all the `dvc.yaml` files in the
<abbr>workspace</abbr> to rebuild an validate all of your pipelines (see
`dvc repro` and `dvc status`).

To record the state of your pipeline(s) and track its outputs, DVC will also
maintain `dvc.lock` file(s) matching `dvc.yaml`.

> Note `dvc.yaml` and `dvc.lock` files are meant to be versioned with Git (if
> enabled in the <abbr>repository</abbr>).

## DVC YAML files

`dvc.yaml` files (or _pipelines files_) specify stages that form the pipeline(s)
of a project, and how they connect (_dependency graph_ or
[DAG](/doc/command-reference/dag)).

They use the [YAML 1.2](https://yaml.org/) file format, and a human-friendly
schema described below. We encourage you to get familiar with it so you may
modify, write, or generate stages and pipelines on your own. Here's an example:

...

> See [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts) for tips
> on managing DVC files.

## dvc.yaml specification

...

## dvc.lock file

... normally have a matching `dvc.lock` file to record the pipeline state and
track its <abbr>outputs</abbr>.

> ⚠️ Avoid editing these, DVC will create and update them for you.
