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
dependencies: _parameters_. Params are defined in the `params` field of
`dvc.yaml` or using the the `-p` (`--params`) option of `dvc run`. They usually
have simple names like `epochs`, `learning-rate`, `batch_size`, etc.

In contrast to a regular <abbr>dependency</abbr>, a parameter is not a file (or
directory). Instead, it consists of a _parameter name_ (or key) to find inside a
YAML 1.2, JSON, TOML, or [Python](#examples-python-parameters-file) _parameters
file_, where the _parameter value_ is specified. They allow you to define
[stage](/doc/command-reference/run) dependencies more granularly, as changes to
other parts of the params file will not affect the stage.

The default parameters file name is `params.yaml` but multiple parameter
dependencies can be specified from one or more params files. Param name/value
pairs should be organized as a tree-like hierarchy inside (a dictionary), as DVC
will locate param names by their tree path (e.g. `training.threshold`). Params
files are typically written manually (or they can be generated) and they can be
versioned directly with Git.

Supported parameter value types are: string, integer, float, and arrays. DVC
itself does not ascribe any specific meaning to param values. They are
user-defined, and serve as a way to generalize and parametrize an machine
learning algorithms or data processing code.

DVC saves parameter names and values in the
[DVC files](/doc/user-guide/dvc-files) in order to track them over time. They
will be compared to the latest params files to determine if the stage is
outdated upon `dvc repro` (or `dvc status`).

> Note that DVC does not pass the parameter values to stage commands. The
> associated command executed by `dvc run` or `dvc repro` will have to open and
> parse the parameters file by itself, and use the params specified with `-p`.

Parameters prevent situations where several stages share a common dependency
file (e.g. for configuration), and any change in this dependency invalidates all
these stages, causing their reproduction unnecessarily.

`dvc params diff` is available to show changes in parameters, displaying their
current and previous values.

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

> Note that we could use the same parameter addressing with JSON, TOML, or
> Python parameters files.

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

You can find that each parameter and their values were saved to `dvc.yaml` and
`dvc.lock`. These are compared to the values in the params files when
`dvc repro` is used to determine if the param dependency has changed.

```yaml
# dvc.yaml
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

## Examples: Python parameters file

Consider this Python parameters file named `params.py`:

```python
# All standard variable types are supported.
BOOL = True
INT = 5
FLOAT = 0.001
STR = 'abc'
DICT = {'a': 1, 'b': 2}
LIST = [1, 2, 3]
SET = {4, 5, 6}
TUPLE = (10, 100)
NONE = None

# DVC can retrieve class constants and variables defined in __init__
class TrainConfig:

    EPOCHS = 70

    def __init__(self):
        self.layers = 5
        self.layers = 9  # TrainConfig.layers param will be 9
        self.sum = 1 + 2  # Will NOT be found due to the expression
        bar = 3  # Will NOT be found since it's locally scoped


class TestConfig:

    TEST_DIR = 'path'
    METRICS = ['metric']
```

The following [stage](/doc/command-reference/run) depends on params `BOOL`,
`INT`, as well as `TrainConfig`'s `EPOCHS` and `layers`:

```dvc
$ dvc run -n train -d users.csv -o model.pkl \
          -p params.py:BOOL,INT,TrainConfig.EPOCHS,TrainConfig.layers \
          python train.py
```

Resulting `dvc.yaml` and `dvc.lock` files (notice the `params` list):

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    params:
      - BOOL
      - INT
      - TrainConfig.EPOCHS
      - TrainConfig.layers
    outs:
      - model.pkl
```

```yaml
train:
  cmd: python train.py
  deps:
    - path: users.csv
      md5: 23be4307b23dcd740763d5fc67993f11
  params:
    INT: 5
    BOOL: true
    TrainConfig.EPOCHS: 70
    TrainConfig.layers: 9
  outs:
    - path: model.pkl
      md5: 1c06b4756f08203cc496e4061b1e7d67
```

Alternatively, the entire `TestConfig` params group
([class](https://docs.python.org/3/library/stdtypes.html#classes-and-class-instances))
can be referenced
([dictionaries](https://docs.python.org/3/library/stdtypes.html#dict) are also
supported), instead of the parameters in it:

```dvc
$ dvc run -n train -d users.csv -o model.pkl \
          -p params.py:BOOL,INT,TestConfig \
          python train.py
```

## Examples: Print all parameters

Following the previous example, we can use `dvc params diff` to list all of the
param values available in the <abbr>workspace</abbr>:

```dvc
$ dvc params diff
Path         Param           Old    New
params.yaml  lr              —      0.0041
params.yaml  process.bow     —      15000
params.yaml  process.thresh  —      0.98
params.yaml  train.epochs    —      70
params.yaml  train.layers    —      9
```

This command shows the difference in parameters between the workspace and the
last committed version of the `params.yaml` file. In our example there's no
previous version, which is why all `Old` values are `—`.
