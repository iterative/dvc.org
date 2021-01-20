# Pipelines Files (`dvc.yaml`)

You can construct pipelines by defining individual
[stages](/doc/command-reference/run) in one or more `dvc.yaml` files (or
_pipelines files_). Stages form a pipeline when they connect with each other
(forming a _dependency graph_, see `dvc dag`). Refer to
[Data Pipelines](/doc/start/data-pipelines).

> Note that a helper command, `dvc run`, is available to create (and execute)
> stages.

`dvc.yaml` files can be versioned with Git.

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema explained below. We encourage you to get familiar with it
so you may modify, write, or generate stages and pipelines on your own.

> Note that we use [GNU/Linux](https://www.gnu.org/software/software.html) in
> most of our examples.

## Stages

Here's a simple example:

```yaml
stages:
  print2cols:
    cmd: awk '{print $1 "\t" $2}' lines.txt > 2columns.txt
    deps:
      - lines.txt
    outs:
      - 2columns.txt
```

The most important part of a stage it's the terminal command(s) it executes
(`cmd` field). This is what DVC runs when the stage is reproduced (see
`dvc repro`).

If a program executed by the command read input files, they can be defined as
<abbr>dependencies</abbr> (`deps`). DVC will check whether they have changed to
decide whether the stage requires re-execution (see `dvc status`).

If the command writes files or directories, they can be defined as
<abbr>outputs</abbr> (`outs`). DVC will track them going forward (similar to
using `dvc add`).

### Parameter dependencies

[Parameters](/doc/command-reference/params) are a special type of stage
dependency. They consist of a name/value pair to find in a YAML, JSON, TOML, or
Python parameters file (`params.yaml` by default). Example:

```yaml
stages:
  preprocess:
    cmd: ./clean.sh raw.txt clean.txt
    deps:
      - raw.txt
    params:
      - threshold
      - passes
    outs:
      - clean.txt
```

This allows several stages to depend on values of a shared structured file
(which can be versioned directly with Git). See also `dvc params diff`.

### Metrics and Plots outputs

Like [common outputs](#outputs), <abbr>metrics</abbr> and <abbr>plots</abbr>
files are produced by the stage `cmd`. However, their purpose is different.
Typically they contain metadata to evaluate pipeline processes. Example:

```yaml
stages:
  build:
    cmd: python train.py
    deps:
      - features.csv
    outs:
      - model.pt
    metrics:
      - accuracy.txt:
          cache: false
    plots:
      - auc.json:
          cache: false
```

> `cache: false` is typical here, since they're small enough for Git to version
> directly.

The commands in `dvc metrics` and `dvc plots` help you display and compare
metrics and plots.

## Templating

`params` and `vars` ...

## Generating multiple stages

`foreach` ...

## Specification

| Field  | Description                                                                                                                                                                                                   |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cmd`  | (Required.) One or more commands executed by the stage (may contain either a single value or a list). Commands are executed sequentially until all are finished or until one of them fails (see `dvc repro`). |
| `wdir` |                                                                                                                                                                                                               |

...

> See also
> [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts#dvcyaml).

## dvc.lock file

> ⚠️ Avoid editing these files, DVC will create and update them for you.

To record the state of your pipeline(s) and help track its <abbr>outputs</abbr>,
DVC will maintain a `dvc.lock` file for each `dvc.yaml`. Their purposes include:

- Allow DVC to detect when stage definitions, or their <abbr>dependencies</abbr>
  have changed. Such conditions invalidate stages, requiring their reproduction
  (see `dvc status`).
- Tracking of intermediate and final <abbr>outputs</abbr> of a pipeline —
  similar to `.dvc` files.
- Needed for several DVC commands to operate, such as `dvc checkout` or
  `dvc get`.

Here's an example:

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

Stages are listed again in `dvc.lock`, in order to know if their definitions
change in `dvc.yaml`.

Regular <abbr>dependencies</abbr> and all kinds of <abbr>outputs</abbr>
(including [metrics](/doc/command-reference/metrics) and
[plots](/doc/command-reference/plots) files) are also listed (per stage) in
`dvc.lock`, but with an additional field storing a hash of their last known
contents. Specifically: `md5`, `etag`, or `checksum` are used (same as in `deps`
and `outs` entries of `.dvc` files).

Full <abbr>parameter dependencies</abbr> (key and value) are listed too (under
`params`), grouped by parameters file.

Note that in the case of [templated](#templating) `dvc.yaml` files, the actual
values are substituted in `dvc.lock` (no `${}` expressions remain). And for
those with [multi-stages](#generating-multiple-stages), individual stages are
expanded (`foreach` structures are not preserved).
