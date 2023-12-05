# params

Contains a command to show changes in <abbr>parameters</abbr>:
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

Parameters can be any values used inside your code to influence the results
(e.g. machine learning [hyperparameters]). DVC can track these as key/value
pairs from structured YAML 1.2, JSON, TOML 1.0,
[or Python](#examples-python-parameters-file) files (`params.yaml` by default).
Params usually have simple names like `epochs`, `learning-rate`, `batch_size`,
etc. Example:

```yaml
epochs: 900
tuning:
  - learning-rate: 0.945
  - max_depth: 7
paths:
  - labels: 'materials/labels'
  - truth: 'materials/ground'
```

To start tracking parameters, list their names under the `params` field of
`dvc.yaml` (manually or with the `-p`/`--params` option of `dvc stage add`). For
example:

```yaml
stages:
  learn:
    cmd: python deep.py # reads params.yaml internally
    params:
      - epochs # specific param from params.yaml
      - tuning.learning-rate # nested param from params.yaml
      - paths # entire group from params.yaml
      - myparams.toml:
          - batch_size # param from custom file
      - config.json: # all params in this file
```

<admon type="info">

See [more details] about this syntax.

</admon>

Multiple stages of a <abbr>pipeline</abbr> can [use the same params file] as
<abbr>dependency</abbr>, but only certain values will affect each
<abbr>stage</abbr>.

Parameters can also be used for [templating] `dvc.yaml` itself (see also **Dict
Unpacking**), which means you can pass them to your [stage commands] as
command-line arguments. You can also load them in Python code with
`dvc.api.params_show()`.

The `dvc params diff` command is available to show parameter changes, displaying
their current and previous values.

DVC saves parameter names and values to `dvc.lock` in order to track them over
time. They will be compared to the latest params files to determine if the stage
is outdated upon `dvc repro` (or `dvc status`).

[hyperparameters]:
  /doc/user-guide/experiment-management/running-experiments#tuning-hyperparameters
[use the same params file]:
  /doc/user-guide/pipelines/defining-pipelines#parameter-dependencies
[more details]: /doc/user-guide/project-structure/dvcyaml-files#parameters
[templating]: /doc/user-guide/project-structure/dvcyaml-files#templating
[stage commands]: /doc/user-guide/project-structure/dvcyaml-files#stage-commands

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

Using `dvc stage add`, define a <abbr>stage</abbr> that depends on params `lr`,
`layers`, and `epochs` from the params file above. Full paths should be used to
specify `layers` and `epochs` from the `train` group:

```cli
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p lr,train.epochs,train.layers \
                python train.py
```

> Note that we could use the same parameter addressing with JSON, TOML, or
> Python parameters files.

The `train.py` script will have some code to parse and load the needed
parameters. You can use `dvc.api.params_show()` for this:

```py
import dvc.api

params = dvc.api.params_show()

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

```cli
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

```cli
$ dvc stage add -n train -d train.py -d logs/ -o users.csv -f \
                -p parse_params.yaml:threshold,classes_num \
                python train.py
```

## Examples: Print all parameters

Following the previous example, we can use `dvc params diff` to list all of the
param values available in the <abbr>workspace</abbr>:

```cli
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

<admon type="warn">

See Note that complex expressions (unsupported by
[ast.literal_eval](https://docs.python.org/3/library/ast.html#ast.literal_eval))
won't be parsed as DVC parameters.

</admon>

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

The following <abbr>stage</abbr> depends on params `BOOL`, `INT`, as well as
`TrainConfig`'s `EPOCHS` and `layers`:

```cli
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

```cli
$ dvc stage add -n train -d train.py -d users.csv -o model.pkl \
                -p params.py:BOOL,INT,TestConfig \
                python train.py
```
