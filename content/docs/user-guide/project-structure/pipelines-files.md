# Pipelines Files (`dvc.yaml`)

You construct pipelines by defining individual
[stages](/doc/command-reference/run) in one or more `dvc.yaml` files (or
_pipelines files_). Stages form a pipeline when they connect with each other
(see `dvc dag`). Refer to [Data Pipelines](/doc/start/data-pipelines).

> Note that a helper command, `dvc run`, is available to create (and execute)
> stages.

To record the state of your pipeline(s) and help track its <abbr>outputs</abbr>,
DVC will also maintain a `dvc.lock` file for each `dvc.yaml`. `dvc.yaml` and
`dvc.lock` files can be versioned with Git.

## Stages

`dvc.yaml` files contain a list of `stages` that form the pipeline(s) of your
project, and determine how they connect (forming a _dependency graph_ or
[DAG](/doc/command-reference/dag)).

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema explained below. We encourage you to get familiar with it
so you may modify, write, or generate stages and pipelines on your own. Here's a
simple example:

> Note that we use [GNU/Linux](https://www.gnu.org/software/software.html) in
> most of our examples.

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
    cmd: ./clean.r raw.txt clean.txt
    deps:
      - raw.txt
    params:
      - threshold
      - passes
    outs:
      - clean.txt
```

This allows several stages to depend on values of a shared structured file
(which can be versioned directly with Git, see `dvc params diff`).

### Metrics and Plots outputs

Like [common outputs](#outputs), metrics and plots files are produced by the
stage `cmd`. However, their purpose is different and closer to a side-effect, as
metadata to evaluate our processes.

...

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
