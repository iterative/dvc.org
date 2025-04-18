# stage add

Helper command to create or update <abbr>stages</abbr> in `dvc.yaml`.

## Synopsis

```usage
usage: dvc stage add [-h] [-q | -v] -n <name> [-f]
                 [-d <path>] [-p [<filename>:]<params_list>]
                 [-o <filename>] [-O <filename>] [-c <filename>]
                 [--outs-persist <filename>]
                 [--outs-persist-no-cache <filename>]
                 [-m <path>] [-M <path>]
                 [--plots <path>] [--plots-no-cache <path>]
                 [-w <path>] [--always-changed] [--desc <text>]
                 [--run]
                 command

positional arguments:
  command               Command to execute
```

## Description

Writes stage definitions to `dvc.yaml` (in the current working directory). To
update an existing stage, overwrite it with the `-f` (`--force`) option.

A stage name is required and can be provided using the `-n` (`--name`) option.
Most of the other [options](#options) help with defining different kinds of
[dependencies and outputs](#dependencies-and-outputs) for the stage. The
remaining terminal input provided to `dvc stage add` after any options/flags
will become the required [`command` argument].

<admon type="info">

`-`/`--` flags sent after the `command` become part of the command itself and
are ignored by `dvc stage add`.

</admon>

Stages whose <abbr>outputs</abbr> become <abbr>dependencies</abbr> for other
stages form <abbr>pipelines</abbr>. For example:

```dvc
$ dvc stage add -n printer -d write.sh -o pages ./write.sh
$ dvc stage add -n scanner -d read.sh -d pages -o signed.pdf ./read.sh pages
```

<admon icon="book">

See the guide on [defining pipeline stages] for more details.

</admon>

`dvc repro` can be used to rebuild this [dependency graph] and run stages.

[`command` argument]:
  /doc/user-guide/project-structure/dvcyaml-files#stage-commands
[defining pipeline stages]:
  /doc/user-guide/pipelines/defining-pipelines#dvcyaml-metafiles
[dependency graph]:
  /doc/user-guide/pipelines/defining-pipelines#directed-acyclic-graph-dag

### Dependencies and outputs

Stage dependencies can be any file or directory, either untracked, or more
commonly tracked by DVC or Git. Outputs will be tracked and <abbr>cached</abbr>
by DVC when the stage is run. Every output version will be cached when the stage
is reproduced (see also `dvc gc`). Relevant notes:

- Typically, scripts to run (or possibly a directory containing the source code)
  are included among the specified `-d` dependencies. This ensures that when the
  source code changes, DVC knows that the stage needs to be reproduced. (You can
  chose whether to do this.)

- `dvc stage add` checks the [dependency graph] integrity before creating a new
  stage. For example: two stage cannot specify the same output or overlapping
  output paths, there should be no cycles, etc.

- DVC does not feed dependency files to the command being run. The program will
  have to read the files itself.

- Entire directories produced by the stage can be tracked as outputs by DVC,
  which generates a single `.dir` entry in the cache (refer to [Structure of
  cache directory] for more info.)

- [external dependencies and outputs] (outside of the <abbr>workspace</abbr>)
  are also supported (except metrics and plots).

- Since <abbr>outputs</abbr> are deleted from the workspace before executing
  stage commands, the underlying code should create any directory structures
  needed every time its executed by DVC.

- In some situations, we have previously executed a stage, and later notice that
  some of the dependencies or outputs are missing from `dvc.yaml`. It is
  possible to [add them to an existing stage].

- Renaming dependencies or outputs requires a [manual process] to update
  `dvc.yaml` and the project's cache accordingly.

[add them to an existing stage]:
  /docs/user-guide/how-to/add-deps-or-outs-to-a-stage
[structure of cache directory]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory
[external dependencies and outputs]:
  /doc/user-guide/pipelines/external-dependencies-and-outputs
[manual process]: /doc/command-reference/move#renaming-stage-outputs

### For displaying and comparing data science experiments

[parameters][param-deps] (`-p`/`--params` option) are a special type of
key/value dependencies. Multiple params can be specified from within one or more
structured files (`params.yaml` by default). This allows tracking experimental
hyperparameters easily in ML.

Special types of output files, [metrics](/doc/command-reference/metrics) (`-m`
and `-M` options) and [plots](/doc/command-reference/plots) (`--plots` and
`--plots-no-cache` options), are also supported. Metrics and plots files have
specific formats (JSON, YAML, CSV, or TSV) and allow displaying and comparing
data science experiments.

[param-deps]:
  /doc/user-guide/pipelines/defining-pipelines#parameter-dependencies

## Options

- `-n <stage>`, `--name <stage>` (**required**) - specify a name for the stage
  generated by this command (e.g. `-n train`). Stage names can only contain
  letters, numbers, dash `-` and underscore `_`.

- `-d <path>`, `--deps <path>` - specify a file or a directory the stage depends
  on. Multiple dependencies can be specified like this:
  `-d data.csv -d process.py`. Usually, each dependency is a file or a directory
  with data, or a code file, or a configuration file. DVC also supports certain
  [external dependencies].

  When you use `dvc repro`, the list of dependencies helps DVC analyze whether
  any dependencies have changed and thus executing stages required to regenerate
  their outputs.

- `-o <path>`, `--outs <path>` - specify a file or directory that is the result
  of running the `command`. Multiple outputs can be specified:
  `-o model.pkl -o output.log`. DVC builds a dependency graph (pipeline) to
  connect different stages with each other based on this list of outputs and
  dependencies (see `-d`). DVC tracks all output files and directories and puts
  them into the cache (this is similar to what's happening when you use
  `dvc add`).

- `-O <path>`, `--outs-no-cache <path>` - the same as `-o` except that outputs
  are not tracked by DVC. This means that they are never cached, so it's up to
  the user to manage them separately. This is useful if the outputs are small
  enough to be tracked by Git directly; or large, yet you prefer to regenerate
  them every time (see `dvc repro`); or unwanted in storage for any other
  reason. Using this option will deactivate the <abbr>run cache</abbr> for the
  stage.

- `--outs-persist <path>` - declare output file or directory that will not be
  removed when `dvc repro` starts (but it can still be modified, overwritten, or
  even deleted by the stage command(s)).

- `--outs-persist-no-cache <path>` - the same as `-outs-persist` except that
  outputs are not tracked by DVC (same as with `-O` above).

- `-p [<path>:]<params_list>`, `--params [<path>:]<params_list>` - specify one
  or more [parameter dependencies][param-deps] from a structured file `path`
  (`./params.yaml` by default). This is done by sending a comma separated list
  (`params_list`) as argument, e.g. `-p learning_rate,epochs`. A custom params
  file can be defined with a prefix, e.g. `-p params.json:threshold`. Or use the
  prefix alone with `:` to use all the parameters found in that file, e.g.
  `-p myparams.toml:`.

- `-m <path>`, `--metrics <path>` - specify a metrics file produced by this
  stage. This option behaves like `-o` but registers the file in a `metrics`
  field inside the `dvc.yaml` stage. Metrics are usually small, human readable
  files (JSON, TOML, or YAML) with scalar numbers or other simple information
  that describes a model (or any other data artifact). See `dvc metrics` to
  learn more about _metrics_.

- `-M <path>`, `--metrics-no-cache <path>` - the same as `-m` except that DVC
  does not track the metrics file (same as with `-O` above). This means that
  they are never cached, so it's up to the user to manage them separately. This
  is typically desirable with _metrics_ because they are small enough to be
  tracked with Git directly.

- `--plots <path>` - specify a plots file or directory produced by this stage.
  This option behaves like `-o` but registers the file or directory in a `plots`
  field inside the `dvc.yaml` stage. Plots outputs are either data series stored
  in tabular (CSV or TSV) or hierarchical (JSON or YAML) files, or image (JPEG,
  GIF, PNG, or SVG) files. See [Visualizing Plots] to learn more about plots.

- `--plots-no-cache <path>` - the same as `--plots` except that DVC does not
  track the plots file (same as with `-O` and `-M` above). This may be desirable
  with _plots_, if they are small enough to be tracked with Git directly.

- `-w <path>`, `--wdir <path>` - specifies a working directory for the `command`
  to run in (uses the `wdir` field in `dvc.yaml`). Dependency and output files
  (including metrics and plots) should be specified relative to this directory.
  It's used by `dvc repro` to change the working directory before executing the
  `command`.

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation.

- `--always-changed` - always consider this stage as changed (sets the
  `always_changed` field in `dvc.yaml`). As a result DVC will always execute it
  when reproducing the pipeline.

- `--desc <text>` - user description of the stage (optional). This doesn't  
  affect any DVC operations.

- `--run` - executes the stage after generating it

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

[visualizing plots]: /doc/user-guide/experiment-management/visualizing-plots
[external dependencies]:
  /doc/user-guide/pipelines/external-dependencies-and-outputs

## Examples

Let's create a stage (that counts the number of lines in a `test.txt` file):

```cli
$ dvc stage add -n count \
                -d test.txt \
                -o lines \
                "cat test.txt | wc -l > lines"
Creating 'dvc.yaml'
Adding stage 'count' in 'dvc.yaml'

To track the changes with git, run:

	git add .gitignore dvc.yaml

$ tree
.
├── dvc.yaml
└── test.txt
```

This results in the following stage entry in `dvc.yaml`:

```yaml
stages:
  count:
    cmd: 'cat test.txt | wc -l > lines'
    deps:
      - test.txt
    outs:
      - lines
```

There's no `lines` file in the workspace as the stage is not run yet. It'll be
created and tracked whenever `dvc repro` is run.

## Example: Overwrite an existing stage

The following stage runs a Python script that trains an ML model on the training
dataset (`20180226` is a seed value):

```cli
$ dvc stage add -n train \
                -d train_model.py -d matrix-train.p -o model.p \
                python train_model.py 20180226 model.p
```

To update a stage that is already defined, the `-f` (`--force`) option is
needed. Let's update the seed for the `train` stage:

```cli
$ dvc stage add -n train --force \
                -d train_model.p -d matrix-train.p -o model.p \
                python train_model.py 18494003 model.p
```

## Example: Separate stages in a subdirectory

Let's move to a subdirectory and create a stage there. This generates a separate
`dvc.yaml` file in that location. The stage command itself counts the lines in
`test.txt` and writes the number to `lines`.

```cli
$ cd more_stages/
$ dvc stage add -n process_data \
                -d data.in \
                -o result.out \
                ./my_script.sh data.in result.out
$ tree ..
.
├── dvc.yaml
├── dvc.lock
├── file1
├── ...
└── more_stages/
    ├── data.in
    └── dvc.yaml
```

## Example: Chaining stages

DVC [pipelines](/doc/command-reference/dag) are constructed by connecting the
outputs of a stage to the dependencies of the following one(s).

Let's create a stage that extracts an XML file from an archive to the `data/`
folder:

```cli
$ dvc stage add -n extract \
                -d Posts.xml.zip \
                -o data/Posts.xml \
                unzip Posts.xml.zip -d data/
```

> Note that the last `-d` applies to the stage's command (`unzip`), not to
> `dvc stage add`.

Also, let's add another stage that executes an R script that parses the XML
file:

```cli
$ dvc stage add -n parse \
                -d parsingxml.R -d data/Posts.xml \
                -o data/Posts.csv \
                Rscript parsingxml.R data/Posts.xml data/Posts.csv
```

These stages are not run yet, so there are no outputs. But we can still see how
they are connected into a pipeline (given their outputs and dependencies) with
`dvc dag`:

```cli
$ dvc dag
+---------+
| extract |
+---------+
      *
      *
      *
+---------+
|  parse  |
+---------+
```

We can use `dvc repro` to execute this pipeline to get the outputs.

## Example: Using parameter dependencies

To use specific values inside a parameters file as dependencies, create a simple
YAML file named `params.yaml` (default params file name, see `dvc params` to
learn more):

```yaml
seed: 20180226

train:
  lr: 0.0041
  epochs: 75
  layers: 9

processing:
  threshold: 0.98
  bow_size: 15000
```

Define a stage with both regular dependencies as well as parameter dependencies:

```cli
$ dvc stage add -n train \
                -d train_model.py -d matrix-train.p  -o model.p \
                -p seed,train.lr,train.epochs
                python train_model.py 20200105 model.p
```

`train_model.py` can use the `dvc.api.params_show()` to parse the parameters:

```py
import dvc.api

params = dvc.api.params_show()

seed = params['seed']
lr = params['train']['lr']
epochs = params['train']['epochs']
```

<admon type="info">

We use [ruamel.yaml](https://pypi.org/project/ruamel.yaml/) which supports YAML
1.2 (unlike the more popular PyYAML).

</admon>

<admon type="tip">

You can also [use templating] to parse parameters directly from `params.yaml`
into the stage.

[use templating]: /doc/user-guide/project-structure/dvcyaml-files#templating

</admon>

DVC will keep an eye on these param values (same as with the regular dependency
files) and know that the stage should be reproduced if/when they change. See
`dvc params` for more details.
