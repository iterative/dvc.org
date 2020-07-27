# params

Contains a command to show changes in parameters:
[diff](/doc/command-reference/params/diff).

## Synopsis

```usage
usage: dvc params [-h] [-q | -v] {diff} ...

positional arguments:
  COMMAND
    diff         Show changes in params between commits in the
                 DVC repository, or between a commit and the workspace.
```

## Description

In order to track parameters and hyperparameters associated to machine learning
experiments in <abbr>DVC projects</abbr>, DVC provides a different type of
dependencies: _parameters_. Parameters are defined using the the `-p`
(`--params`) option of `dvc run`, using simple names like `epochs`,
`learning-rate`, `batch_size`, etc.

In contrast to a regular <abbr>dependency</abbr>, a parameter is not a file (or
directory). Instead, it consists of a _parameter name_ (or key) to find inside a
YAML, JSON, or TOML _parameters file_. Multiple parameter dependencies can be
specified from one or more parameters files.

The default parameters file name is `params.yaml`. Parameters should be
organized as a tree hierarchy inside, as DVC will locate param names by their
tree path. parameters files have to be manually written, or generated, and these
can be versioned directly with Git.

Supported parameter _value_ types are: string, integer, float, and arrays. DVC
itself does not ascribe any specific meaning for these values. They are
user-defined, and serve as a way to generalize and parametrize an machine
learning algorithms or data processing code.

DVC saves the param names and their latest values in the `dvc.yaml` file. These
values will be compared to the ones in the params files to determine if the
stage is invalidated upon pipeline [reproduction](/doc/command-reference/repro).

> Note that DVC does not pass the parameter values to stage commands. The
> associated command executed by `dvc run` or `dvc repro` will have to open and
> parse the parameters file by itself, and use the params specified with `-p`.

The parameters concept helps to define [stage](/doc/command-reference/run)
dependencies more granularly. A particular parameter or set of parameters will
be required for the stage invalidation (see `dvc status` and `dvc repro`).
Changes to other parts of the dependency file will not affect the stage. This
prevents situations where several stages share a (configuration) file as a
common dependency, and any change in this dependency invalidates all these
stages and causes their reproduction unnecessarily.

`dvc params diff` is available to show changes in parameters, displaying the
param names as well as their current and previous values.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple parameters file in YAML format, using the default
file name `params.yaml`:

```yaml
lr: 0.0041

train:
  epochs: 70
  layers: 9

process:
  thresh: 0.98
  bow: 15000
```

Define a [stage](/doc/command-reference/run) that depends on params `lr`,
`layers`, and `epochs` from the params file above. Full paths should be used to
specify `layers` and `epochs` from the `train` group:

```dvc
$ dvc run -n train -d users.csv -o model.pkl \
          -p lr,train.epochs,train.layers \
          python train.py
```

> Note that we could use the same parameter addressing with JSON or TOML
> parameters files.

The `train.py` script will have some code to parse the needed parameters. For
example:

```py
import yaml

with open("params.yaml", 'r') as fd:
    params = yaml.safe_load(fd)

lr = params['lr']
epochs = params['train']['epochs']
layers = params['train']['layers']
```

You can find that each parameter and it's value were saved to `dvc.yaml`. These
values will be compared to the ones in the parameters files whenever `dvc repro`
is used, to determine if dependency to the params file is invalidated:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    params:
      - lr
      - train
    outs:
      - model.pkl
```

Alternatively, the entire group of parameters `train` can be referenced, instead
of specifying each of the group parameters separately:

```dvc
$ dvc run -n train -d users.csv -o model.pkl \
          -p lr,train \
          python train.py
```

In the examples above, the default parameters file name `params.yaml` was used.
This file name can be redefined with a prefix in the `-p` argument:

```dvc
$ dvc run -n train -d logs/ -o users.csv \
          -p parse_params.yaml:threshold,classes_num \
          python train.py
```

## Examples: Print all parameter values in the workspace

Following the previous example, we can use `dvc params diff` to list all of the
available param values:

```dvc
$ dvc params diff
Path         Param           Old    New
params.yaml  lr              None   0.0041
params.yaml  process.bow     None   15000
params.yaml  process.thresh  None   0.98
params.yaml  train.epochs    None   70
params.yaml  train.layers    None   9
```

This command shows the difference in parameters between the workspace and the
last committed version of the `params.yaml` file. In our example, there's no
previous version, which is why all `Old` values are `None`. See `params diff` to
learn more about the `diff` command.
