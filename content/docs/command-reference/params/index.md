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
dependencies: _parameters_. They usually have simple names like `epochs`,
`learning-rate`, `batch_size`, etc.

To start tracking parameters, list them under the `params` field of `dvc.yaml`
stages (manually or with the the `-p`/`--params` option of `dvc stage add`). For
example:

```yaml
stages:
  learn:
    cmd: ./deep.py
    params:
      - epochs
      - tuning.learning-rate
      - myparams.toml:
          - batch_size
```

In contrast to a regular <abbr>dependency</abbr>, a parameter dependency is not
a file or directory. Instead, it consists of a _parameter name_ (or key) in a
_parameters file_, where the _parameter value_ should be found. This allows you
to define [stage](/doc/command-reference/run) dependencies more granularly:
changes to other parts of the params file will not affect the stage. Parameter
dependencies also prevent situations where several stages share a regular
dependency (e.g. a config file), and any change in it invalidates all of them
(see `dvc status`), causing unnecessary re-executions upon `dvc repro`.

The default **parameters file** name is `params.yaml`, but any other YAML 1.2,
JSON, TOML, or [Python](#examples-python-parameters-file) files can be used
additionally (listed under `params:` with a sub-list of param values, as shown
in the sample above) . These files are typically written manually (or they can
be generated) and they can be versioned directly with Git.

**Parameter values** should be organized in tree-like hierarchies (dictionaries)
inside params files (see [Examples](#examples)). DVC will interpret param names
as the tree path to find those values. Supported types are: string, integer,
float, and arrays (groups of params). Note that DVC does not ascribe any
specific meaning to these values.

DVC saves parameter names and values to `dvc.lock` in order to track them over
time. They will be compared to the latest params files to determine if the stage
is outdated upon `dvc repro` (or `dvc status`).

> Note that DVC does not pass the parameter values to stage commands. The
> commands executed by DVC will have to load and parse the parameters file by
> itself.

The `dvc params diff` command is available to show parameter changes, displaying
their current and previous values.

💡 Parameters can also be used for
[templating](/doc/user-guide/project-structure/pipelines-files#templating)
`dvc.yaml` itself.

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

Using `dvc stage add`, define a [stage](/doc/command-reference/run) that depends
on params `lr`, `layers`, and `epochs` from the params file above. Full paths
should be used to specify `layers` and `epochs` from the `train` group:

```dvc
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p lr,train.epochs,train.layers \
                python train.py
```

> Note that we could use the same parameter addressing with JSON, TOML, or
> Python parameters files.

The `train.py` script will have some code to parse and load the needed
parameters. For example:

```py
import yaml

with open("params.yaml", 'r') as fd:
    params = yaml.safe_load(fd)

lr = params['lr']
epochs = params['train']['epochs']
layers = params['train']['layers']
```

You can find that each parameter was defined in `dvc.yaml`, as well as saved to
`dvc.lock` along with the values. These are compared to the params files when
`dvc repro` is used, to determine if the parameter dependency has changed.

```yaml
# dvc.yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    params:
      - lr
      - train.epochs
      - train.layers
    outs:
      - model.pkl
```

Alternatively, the entire group of parameters `train` can be referenced, instead
of specifying each of the params separately:

```dvc
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p lr,train \
                python train.py
```

```yaml
# in dvc.yaml
params:
  - lr
  - train
```

In the examples above, the default parameters file name `params.yaml` was used.
Note that this file name can be redefined using a prefix in the `-p` argument of
`dvc stage add`. In our case:

```dvc
$ dvc stage add -n train -d train.py -d logs/ -o users.csv -f \
                -p parse_params.yaml:threshold,classes_num \
                python train.py
```

## Examples: Print all parameters

Following the previous example, we can use `dvc params diff` to list all of the
param values available in the <abbr>workspace</abbr>:

```dvc
$ dvc params diff
Path         Param           HEAD  workspace
params.yaml  lr              —     0.0041
params.yaml  process.bow     —     15000
params.yaml  process.thresh  —     0.98
params.yaml  train.epochs    —     70
params.yaml  train.layers    —     9
```

This command shows the difference in parameters between the workspace and the
last committed version of the `params.yaml` file. In our example there's no
previous version, which is why all `Old` values are `—`.

## Examples: Python parameters file

> ⚠️ Note that complex expressions (unsupported by
> [ast.literal_eval](https://docs.python.org/3/library/ast.html#ast.literal_eval))
> won't be parsed as DVC parameters.

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
UNARY_OP = -1

# Complex expressions will be ignored.
DICT_EXP = dict(a=1, b=2)

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
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p params.py:BOOL,INT,TrainConfig.EPOCHS,TrainConfig.layers \
                python train.py
```

Resulting `dvc.yaml` and `dvc.lock` files (notice the `params` lists):

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - users.csv
    params:
      - params.py:
          - BOOL
          - INT
          - TrainConfig.EPOCHS
          - TrainConfig.layers
    outs:
      - model.pkl
```

```yaml
schema: '2.0'
stages:
  train:
    cmd: python train.py
    deps:
      - path: users.csv
        md5: 23be4307b23dcd740763d5fc67993f11
    params:
      params.py:
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
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p params.py:BOOL,INT,TestConfig \
                python train.py
```
