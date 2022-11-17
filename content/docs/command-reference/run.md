# run

Helper command to create or update _stages_ in `dvc.yaml`. Requires a name and a
command.

## Synopsis

```usage
usage: dvc run [-h] [-q | -v] [-n <name>] [-f]
               [-d <path>] [-p [<filename>:]<params_list>]
               [-o <filename>] [-O <filename>] [-c <filename>]
               [--external] [--outs-persist <filename>]
               [--outs-persist-no-cache <filename>]
               [-m <path>] [-M <path>]
               [--plots <path>] [--plots-no-cache <path>]
               [-w <path>] [--always-changed] [--desc <text>]
               [--no-exec] [--no-commit] [--no-run-cache]
               command

positional arguments:
  command               Command for the stage.
```

## Description

`dvc run` is a helper for creating or updating
[pipeline](/doc/command-reference/dag) stages in a `dvc.yaml` file (located in
the current working directory).

_Stages_ represent individual data processes, including their input and
resulting outputs. They can be combined to capture simple data workflows,
organize data science projects, or build detailed machine learning pipelines.

A stage name is required and can be provided using the `-n` (`--name`) option.
The other available [options](#options) are mostly meant to describe different
kinds of stage [dependencies and outputs](#dependencies-and-outputs). The
remaining terminal input provided to `dvc run` after any options/flags will
become the required [`command` argument].

<admon type="info">

`-`/`--` flags sent after the `command` become part of the command itself and
are ignored by `dvc stage add`.

</admon>

`dvc run` executes stage commands, unless the `--no-exec` option is used.

[`command` argument]:
  /doc/user-guide/project-structure/dvcyaml-files#stage-commands

### Dependencies and outputs

By specifying lists of <abbr>dependencies</abbr> (`-d` option) and/or
<abbr>outputs</abbr> (`-o` and `-O` options) for each stage, we can create a
[dependency graph] that connects them, i.e. the output of a stage becomes the
input of another, and so on (see `dvc dag`). This graph can be restored by DVC
later to modify or [reproduce](/doc/command-reference/repro) the full pipeline.
For example:

```dvc
$ dvc run -n printer -d write.sh -o pages ./write.sh
$ dvc run -n scanner -d read.sh -d pages -o signed.pdf ./read.sh pages
```

Stage dependencies can be any file or directory, either untracked, or more
commonly tracked by DVC or Git. Outputs will be tracked and <abbr>cached</abbr>
by DVC when the stage is run. Every output version will be cached when the stage
is reproduced (see also `dvc gc`).

Relevant notes:

- Typically, scripts being run (or possibly a directory containing the source
  code) are included among the specified `-d` dependencies. This ensures that
  when the source code changes, DVC knows that the stage needs to be reproduced.
  (You can chose whether to do this.)

- `dvc run` checks the dependency graph integrity before creating a new stage.
  For example: two stage cannot specify the same output or overlapping output
  paths, there should be no cycles, etc.

- DVC does not feed dependency files to the command being run. The program will
  have to read by itself the files specified with `-d`.

- Entire directories produced by the stage can be tracked as outputs by DVC,
  which generates a single `.dir` entry in the cache (refer to
  [Structure of cache directory](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
  for more info.)

- [external dependencies](/doc/user-guide/data-management/importing-external-data)
  and [external outputs](/doc/user-guide/data-management/managing-external-data)
  (outside of the <abbr>workspace</abbr>) are also supported (except metrics and
  plots).

- Outputs are deleted from the workspace before executing the command (including
  at `dvc repro`) if their paths are found as existing files/directories (unless
  `--outs-persist` is used). This also means that the stage command needs to
  recreate any directory structures defined as outputs every time its executed
  by DVC.

- In some situations, we have previously executed a stage, and later notice that
  some of the files/directories used by the stage as dependencies, or created as
  outputs are missing from `dvc.yaml`. It is possible to
  [add missing dependencies/outputs to an existing stage](/doc/user-guide/how-to/add-deps-or-outs-to-a-stage)
  without having to execute it again.

- Renaming dependencies or outputs requires a
  [manual process](/doc/command-reference/move#renaming-stage-outputs) to update
  `dvc.yaml` and the project's cache accordingly.

[dependency graph]: /doc/user-guide/pipelines/defining-pipelines

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
  [external dependencies](/doc/user-guide/data-management/importing-external-data).

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
  reason.

- `--outs-persist <path>` - declare output file or directory that will not be
  removed when `dvc repro` starts (but it can still be modified, overwritten, or
  even deleted by the stage command(s)).

- `--outs-persist-no-cache <path>` - the same as `-outs-persist` except that
  outputs are not tracked by DVC (same as with `-O` above).

- `-c <path>`, `--checkpoints <path>` - the same as `-o` but also marks the
  output as a [checkpoint](/doc/command-reference/exp/run#checkpoints). This
  makes the stage incompatible with `dvc repro`. Implies `--no-exec`.

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
  track the plots output (same as with `-O` and `-M` above). This may be
  desirable with _plots_, if they are small enough to be tracked with Git
  directly.

- `-w <path>`, `--wdir <path>` - specifies a working directory for the `command`
  to run in (uses the `wdir` field in `dvc.yaml`). Dependency and output files
  (including metrics and plots) should be specified relative to this directory.
  It's used by `dvc repro` to change the working directory before executing the
  `command`.

- `--no-exec` - write the stage to `dvc.yaml`, but do not execute the `command`.
  DVC will still add the outputs to `.gitignore`, but they won't be cached or
  recorded in `dvc.lock` (like with `--no-commit` below). This is useful if you
  need to define a pipeline quickly, and `dvc repro` it later; or if the stage
  outputs already exist and you want to "DVCfy" this state of the project (see
  also `dvc commit`).

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation.

- `--no-run-cache` - execute the stage command(s) even if they have already been
  run with the same dependencies and outputs (see the [details]). Useful for
  example if the stage command/s is/are non-deterministic ([not recommended]).

- `--no-commit` - do not store the outputs of this execution in the cache
  (`dvc.yaml` and `dvc.lock` are still created or updated); useful to avoid
  caching unnecessary data when exploring different data or stages. You can use
  `dvc commit` to finish the operation.

- `--always-changed` - always consider this stage as changed (sets the
  `always_changed` field in `dvc.yaml`). As a result DVC will always execute it
  when reproducing the pipeline.

- `--external` - allow writing outputs outside of the DVC repository. See
  [Managing External Data].

- `--desc <text>` - user description of the stage (optional). This doesn't  
  affect any DVC operations.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

[visualizing plots]: /doc/user-guide/experiment-management/visualizing-plots
[details]: /doc/user-guide/project-structure/internal-files#run-cache
[not recommended]:
  /doc/user-guide/project-structure/dvcyaml-files#avoiding-unexpected-behavior
[managing external data]: /doc/user-guide/data-management/managing-external-data

## Examples

Let's create a stage (that counts the number of lines in a `test.txt` file):

```dvc
$ dvc run -n count \
          -d test.txt \
          -o lines \
          "cat test.txt | wc -l > lines"
Running stage 'test' with command:
        cat test.txt | wc -l > lines
Creating 'dvc.yaml'
Adding stage 'count' in 'dvc.yaml'
Generating lock file 'dvc.lock'

$ tree
.
├── dvc.lock
├── dvc.yaml
├── lines
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

## Example: Overwrite an existing stage

The following stage runs a Python script that trains an ML model on the training
dataset (`20180226` is a seed value):

```dvc
$ dvc run -n train \
          -d train_model.py -d matrix-train.p -o model.p \
          python train_model.py 20180226 model.p
```

To update a stage that is already defined, the `-f` (`--force`) option is
needed. Let's update the seed for the `train` stage:

```dvc
$ dvc run -n train --force \
          -d train_model.p -d matrix-train.p -o model.p \
          python train_model.py 18494003 model.p
```

## Example: Separate stages in a subdirectory

Let's move to a subdirectory and create a stage there. This generates a separate
`dvc.yaml` file in that location. The stage command itself counts the lines in
`test.txt` and writes the number to `lines`.

```dvc
$ cd more_stages/
$ dvc run -n process_data \
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
    ├── dvc.lock
    ├── dvc.yaml
    └── result.out
```

## Example: Chaining stages

DVC [pipelines](/doc/command-reference/dag) are constructed by connecting the
outputs of a stage to the dependencies of the following one(s).

Extract an XML file from an archive to the `data/` folder:

```dvc
$ dvc run -n extract \
          -d Posts.xml.zip \
          -o data/Posts.xml \
          unzip Posts.xml.zip -d data/
```

> Note that the last `-d` applies to the stage's command (`unzip`), not to
> `dvc run`.

Execute an R script that parses the XML file:

```dvc
$ dvc run -n parse \
          -d parsingxml.R -d data/Posts.xml \
          -o data/Posts.csv \
          Rscript parsingxml.R data/Posts.xml data/Posts.csv
```

To visualize how these stages are connected into a pipeline (given their outputs
and dependencies), we can use `dvc dag`:

```dvc
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

```dvc
$ dvc run -n train \
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

DVC will keep an eye on these param values (same as with the regular dependency
files) and know that the stage should be reproduced if/when they change. See
`dvc params` for more details.
