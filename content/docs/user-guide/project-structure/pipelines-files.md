# Pipelines (`dvc.yaml` files)

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

To record the state of your pipeline(s) and help track its <abbr>outputs</abbr>,
DVC will also maintain `dvc.lock` file(s) matching `dvc.yaml`.

> Note `dvc.yaml` and `dvc.lock` files are meant to be versioned with Git (if
> enabled in the <abbr>repository</abbr>).

## DVC YAML files

`dvc.yaml` files (or _pipelines files_) specify a list of `stages` that form the
pipeline(s) of your project, and determine how they connect (representing a
_dependency graph_ or [DAG](/doc/command-reference/dag)).

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema explained below. We encourage you to get familiar with it
so you may modify, write, or generate stages and pipelines on your own.

Let's go over all the things you can do with stages!

> Note that we use GNU/Linux in most of our examples.

### Commands

The most basic part of a stage it's the terminal command it executes (`cmd`
field):

```yaml
stages:
  hello:
    cmd: echo Howdy!
```

> Try `dvc repro` after saving the `dvc.yaml` file above in a fresh <abbr>DVC
> project</abbr>.

### Dependencies

Just printing a preset text is not very useful. What if you read/process a file
along the way?

```yaml
stages:
  print2cols:
    cmd: awk '{print $1 "\t" $2}' input.txt
    deps:
      - input.txt
```

The command above prints 2 columns with the first words from each line in an
input text file. Since it requires `input.txt`, we mark that file as a
<abbr>dependency</abbr> (`deps` list). DVC will check whether this file has
changed before deciding to re-execute the stage.

### Basic outputs

To make DVC stages really useful, you'll usually want to write the command
results to disk:

```yaml
stages:
  duplicate:
    cmd: sed 'p' lines.txt > doubled.txt
    deps:
      - lines.txt
    outs:
      - doubled.txt
```

In this stage, we are editing the contents of `lines.txt` (a dependency), and
writing the results to `doubled.txt`. By listing the <abbr>output</abbr> file in
`outs`, we are telling DVC to track it going forward (similar to using `dvc add`
on it).

### Parameter dependencies

params ...

### Metrics (outputs)

metrics and plots ...

### Templating (with `params` and `vars`)

...

### Generating multiple stages (`foreach`)

...

## dvc.yaml specification

| Field  | Description                                                                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cmd`  | (Required.) One or more commands executed by the stage (may contain either a single value or a list). Commands are executed sequentially until all are finished or until one of them fails (see `dvc repro`). |
| `wdir` |                                                                                                                                                                                                               |

...

> See [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts) for tips
> on managing DVC files.

## dvc.lock file

For every `dvc.yaml` file, a matching `dvc.lock` (YAML) file usually exists.
It's created or updated by DVC commands such as `dvc run` and `dvc repro`. In
general, it describes the latest pipeline state, having these specific purposes:

> ⚠️ Avoid editing these files, DVC will create and update them for you.

- Tracking of intermediate and final <abbr>outputs</abbr> of a pipeline —
  similar to [`.dvc` files](#dvc-files).
- Allow DVC to detect when stage definitions, or their <abbr>dependencies</abbr>
  have changed. Such conditions invalidate stages, requiring their reproduction
  (see `dvc status`).
- `dvc.lock` is needed for several DVC commands to operate, such as
  `dvc checkout`, `dvc get`, and `dvc import`.

Here's a comprehensive example:

```yaml
stages:
  features:
    cmd: jupyter nbconvert --execute featurize.ipynb
    deps:
      - path: data/clean
        md5: d8b874c5fa18c32b2d67f73606a1be60
    params:
      params.yaml:
        levels.no: 5
    outs:
      - path: features
        md5: 2119f7661d49546288b73b5730d76485
      - path: performance.json
        md5: ea46c1139d771bfeba7942d1fbb5981e
      - path: logs.csv
        md5: f99aac37e383b422adc76f5f1fb45004
```

Stage commands are listed again in `dvc.lock`, in order to know when their
definitions change in `dvc.yaml`.

Regular <abbr>dependencies</abbr> and all kinds of <abbr>outputs</abbr>
(including [metrics](/doc/command-reference/metrics) and
[plots](/doc/command-reference/plots) files) are also listed (per stage) in
`dvc.lock`, but with an additional field with a hash of their last known
contents. Specifically: `md5`, `etag`, or `checksum` are used (same as in `deps`
and `outs` entries of `.dvc` files).

Full <abbr>parameter dependencies</abbr> (key and value) are listed too (under
`params`), grouped by parameters file. And in the case of
[templated `dvc.yaml`](/doc/user-guide/dvc-files/advanced-dvc.yaml) files, their
actual values are substituted into the `dvc.lock` YAML structure.
