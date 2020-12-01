# run

Helper command to create or update _stages_ in `dvc.yaml`. Requires a name and a
command.

## Synopsis

```usage
usage: dvc run [-h] [-q | -v] -n <name> [-d <path>] [-o <path>]
               [-O <path>] [-p [<path>:]<params_list>] [-m <path>]
               [-M <path>] [--plots <path>] [--plots-no-cache <path>]
               [-w <path>] [--no-exec] [-f]
               [--no-run-cache] [--no-commit]
               [--outs-persist <path>] [--outs-persist-no-cache <path>]
               [--always-changed] [--external] [--desc <text>]
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
remaining terminal input provided to `dvc run` after `-`/`--` flags will become
the required [`command` argument](#the-command-argument).

`dvc run` executes stage commands, unless the `--no-exec` option is used.

<details>

### 💡 Avoiding unexpected behavior

We don't want to tell anyone how to write their code or what programs to use!
However, please be aware that in order to prevent unexpected results when DVC
reproduces pipeline stages, the underlying code should ideally follow these
rules:

- Read/write exclusively from/to the specified <abbr>dependencies</abbr> and
  <abbr>outputs</abbr> (including parameters files, metrics, and plots).

- Completely rewrite outputs. Do not append or edit.

- Stop reading and writing files when the `command` exits.

Also, if your pipeline reproducibility goals include consistent output data, its
code should be
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) (produce
the same output for any given input): avoid code that increases
[entropy](https://en.wikipedia.org/wiki/Software_entropy) (e.g. random numbers,
time functions, hardware dependencies, etc.).

</details>

### Dependencies and outputs

By specifying lists of <abbr>dependencies</abbr> (`-d` option) and/or
<abbr>outputs</abbr> (`-o` and `-O` options) for each stage, we can create a
_dependency graph_ ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph))
that connects them, i.e. the output of a stage becomes the input of another, and
so on (see `dvc dag`). This graph can be restored by DVC later to modify or
[reproduce](/doc/command-reference/repro) the full pipeline. For example:

```dvc
$ dvc run -n printer -d write.sh -o pages ./write.sh
$ dvc run -n scanner -d read.sh -d pages -o signed.pdf ./read.sh
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
  [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
  for more info.)

- [external dependencies](/doc/user-guide/external-dependencies) and
  [external outputs](/doc/user-guide/managing-external-data) (outside of the
  <abbr>workspace</abbr>) are also supported (except metrics and plots).

- Outputs are deleted from the workspace before executing the command (including
  at `dvc repro`) if their paths are found as existing files/directories. This
  also means that the stage command needs to recreate any directory structures
  defined as outputs every time its executed by DVC.

- In some situations, we have previously executed a stage, and later notice that
  some of the files/directories used by the stage as dependencies, or created as
  outputs are missing from `dvc.yaml`. It is possible to
  [add missing dependencies/outputs to an existing stage](/docs/user-guide/how-to/add-deps-or-outs-to-a-stage)
  without having to execute it again.

- Renaming dependencies or outputs requires a
  [manual process](/doc/command-reference/move#renaming-stage-outputs) to update
  `dvc.yaml` and the project's cache accordingly.

### For displaying and comparing data science experiments

[parameters](/doc/command-reference/params) (`-p`/`--params` option) are a
special type of key/value dependencies. Multiple parameter dependencies can be
specified from within one or more YAML, JSON, TOML, or Python parameters files
(e.g. `params.yaml`). This allows tracking experimental hyperparameters easily.

Special types of output files, [metrics](/doc/command-reference/metrics) (`-m`
and `-M` options) and [plots](/doc/command-reference/plots) (`--plots` and
`--plots-no-cache` options), are also supported. Metrics and plots files have
specific formats (JSON, YAML, CSV, or TSV) and allow displaying and comparing
data science experiments.

### The `command` argument

The `command` sent to `dvc run` can be anything your terminal would accept and
run directly, for example a shell built-in, expression, or binary found in
`PATH`. Please remember that any flags sent after the `command` are interpreted
by the command itself, not by `dvc run`.

⚠️ Note that while DVC is platform-agnostic, the commands defined in your
[pipeline](/doc/command-reference/dag) stages may only work on some operating
systems and require certain software packages to be installed.

Wrap the command with double quotes `"` if there are special characters in it
like `|` (pipe) or `<`, `>` (redirection), otherwise they would apply to
`dvc run` itself. Use single quotes `'` instead if there are environment
variables in it that should be evaluated dynamically. Examples:

```dvc
$ dvc run -n my_stage "./my_script.sh > /dev/null 2>&1"
$ dvc run -n my_stage './my_script.sh $MYENVVAR'
```

## Options

- `-n <stage>`, `--name <stage>` (**required**) - specify a name for the stage
  generated by this command (e.g. `-n train`). Stage names can only contain
  letters, numbers, dash `-` and underscore `_`.

- `-d <path>`, `--deps <path>` - specify a file or a directory the stage depends
  on. Multiple dependencies can be specified like this:
  `-d data.csv -d process.py`. Usually, each dependency is a file or a directory
  with data, or a code file, or a configuration file. DVC also supports certain
  [external dependencies](/doc/user-guide/external-dependencies).

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
  are not tracked by DVC. It means that they are not cached, and it's up to a
  user to manage them separately. This is useful if the outputs are small enough
  to be tracked by Git directly, or if these files are not of future interest.

- `--outs-persist <path>` - declare output file or directory that will not be
  removed upon `dvc repro`.

- `--outs-persist-no-cache <path>` - the same as `-outs-persist` except that
  outputs are not tracked by DVC.

- `-p [<path>:]<params_list>`, `--params [<path>:]<params_list>` - specify a set
  of [parameter dependencies](/doc/command-reference/params) the stage depends
  on, from a parameters file. This is done by sending a comma separated list as
  argument, e.g. `-p learning_rate,epochs`. The default parameters file name is
  `params.yaml`, but this can be redefined with a prefix in the argument sent to
  this option, e.g. `-p parse_params.yaml:threshold`. See `dvc params` to learn
  more about parameters.

- `-m <path>`, `--metrics <path>` - specify a metrics file produced by this
  stage. This option behaves like `-o` but registers the file in a `metrics`
  field inside the `dvc.yaml` stage. Metrics are usually small, human readable
  files (JSON or YAML) with scalar numbers or other simple information that
  describes a model (or any other data artifact). See `dvc metrics` to learn
  more about _metrics_.

- `-M <path>`, `--metrics-no-cache <path>` - the same as `-m` except that DVC
  does not track the metrics file. This means that the file is not cached, so
  it's up to the user to manage them separately. This is typically desirable
  with _metrics_ because they are small enough to be tracked with Git directly.
  See also the difference between `-o` and `-O`.

- `--plots <path>` - specify a plot metrics file produces by this stage. This
  option behaves like `-o` but registers the file in a `plots` field inside the
  `dvc.yaml` stage. Plot metrics are data series stored in tabular (CSV or TSV)
  or hierarchical (JSON or YAML) files, with complex information that describes
  a model (or any other data artifact). See `dvc plots` to learn more about
  plots.

- `--plots-no-cache <path>` - the same as `--plots` except that DVC does not
  track the plots metrics file. This means that the file is not cached, so it's
  up to the user to manage them separately. See also the difference between `-o`
  and `-O`.

- `-w <path>`, `--wdir <path>` - specifies a working directory for the `command`
  to run in (uses the `wdir` field in `dvc.yaml`). Dependency and output files
  (including metrics and plots) should be specified relative to this directory.
  It's used by `dvc repro` to change the working directory before executing the
  `command`.

- `--no-exec` - create a stage file, but do not execute the `command` defined in
  it, nor cache dependencies or outputs (like with `--no-commit`, explained
  below). DVC will also add your outputs to `.gitignore`, same as it would do
  without `--no-exec`. Use `dvc commit` to force committing existing output file
  versions to cache.

  This is useful if, for example, you need to build a pipeline quickly first,
  and run it all at once later.

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation.

- `--no-run-cache` - execute the stage `command` even if it has already been run
  with the same dependencies/outputs/etc. before. Useful for example if the
  command's code is non-deterministic
  ([not recommended](#avoiding-unexpected-behavior)).

- `--no-commit` - do not save outputs to cache. A stage created, while nothing
  is added to the cache. In the stage file, the file hash values will be empty;
  They will be populated the next time this stage is actually executed, or
  `dvc commit` can be used to force committing existing output file versions to
  cache.

  This is useful to avoid caching unnecessary data repeatedly when running
  multiple experiments.

- `--always-changed` - always consider this stage as changed (uses the
  `always_changed` field in `dvc.yaml`). As a result `dvc status` will report it
  as `always changed` and `dvc repro` will always execute it.

  > Note that DVC-files without dependencies are automatically considered
  > "always changed", so this option has no effect in those cases.

- `--external` - allow writing outputs outside of the DVC repository. See
  [Managing External Data](/doc/user-guide/managing-external-data).

- `--desc <text>` - user description of the stage (optional). This doesn't  
  affect any DVC operations.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's create a <abbr>DVC project</abbr> and a stage (that counts the number of
lines in a `test.txt` file):

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ mkdir data
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
          -d matrix-train.p -d train_model.py \
          -o model.p \
          python train_model.py matrix-train.p 20180226 model.p
```

To update a stage that is already defined, the `-f` (`--force`) option is
needed. Let's update the seed for the `train` stage:

```dvc
$ dvc run -n train -f -d matrix-train.p -d train_model.py -o model.p \
          python train_model.py matrix-train.p 18494003 model.p
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
$ mkdir data
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
          -d matrix-train.p -d train_model.py -o model.p \
          -p seed,train.lr,train.epochs
          python train_model.py matrix-train.p model.p
```

`train_model.py` will include some code to open and parse the parameters:

```py
import yaml

with open("params.yaml", 'r') as fd:
    params = yaml.safe_load(fd)

seed = params['seed']
lr = params['train']['lr']
epochs = params['train']['epochs']
```

DVC will keep an eye on these param values (same as with the regular dependency
files) and know that the stage should be reproduced if/when they change. See
`dvc params` for more details.
