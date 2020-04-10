# params

A set of commands to manage, and display project parameters:
[diff](/doc/command-reference/params/diff).

## Synopsis

```usage
usage: dvc params [-h] [-q | -v] {diff} ...

positional arguments:
  COMMAND
    diff         Show changes in params between commits
                 in the DVC repository, or between a commit
                 and the workspace.
```

## Description

In order to track parameters and hyperparameters associated to machie learning
experiments DVC has a special type of <abbr>dependencies</abbr> - parameters.
(See the `--params` option of `dvc run`.) Parameters are project-specific string
or array values e.g. `epochs`, `learning-rate`, `batch_size`, `num_classes` etc.

In contrast to a regular file <abbr>dependencies</abbr>, parameters are pairs of
a file dependency (parameter file) and a parameter name inside the file.
Supported file formats for parameter file: YAML and JSON. The default parameters
file name is `params.yaml`. Parameters are organized in a tree hierarchy in the
file. DVC addresses the parameters by the tree path.

The parameters concept helps to define stage dependencies more granularly when
not only a file change invalidate a stage and requires the stage execution but a
particular parameter or a set of parameters change is required for the stage
invalidation. As a result, it prevents situations when many pipeline stages
depends on a single file and any change in the file invalidates all of these
stages.

Supported parameter value types are: string, number values, float values and
arrays. DVC itself does not ascribe any specific meaning for these parameter
values. Usually these values are defined by users and serve as a way to
generalize and parametrize an machine learning algorithm or data processing
code.

[run](/doc/command-reference/run) command defines parameters and
[diff](/doc/command-reference/params/diff) command is available to manage
<abbr>DVC project</abbr> parameters.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a simple parameters file:

```dvc
$ cat params.yaml
lr: 0.0041

train:
    epochs: 70
    layers: 9

processing:
    threshold: 0.98
    bow_size: 15000
```

Define a pipeline stage with dependencies to parameters `lr`, `layers` and
`epochs` in the default parameters file `params.yaml`. A whole parameter paths
can be used to specify `layers` and `epochs` parameters from `train` group:

```dvc
$ dvc run -d users.csv -o model.pkl \
        -p lr,train.epochs,train.layers \
        python train.py
```

> `-p` (`--params`) is telling DVC to mark `lr`, `train.epochs` and
> `train.layers` as parameters while `train.epochs` and `train.layers` are full
> paths to these two params in the YAML file. JSON files use the same parameters
> addressation.

The entire group of parameters `train` can be referenced instead of spefifying
each of the group parameters separately:

```dvc
$ dvc run -d users.csv -o model.pkl \
        -p lr,train \
        python train.py
```

You can find that each parameter and it's value were saved in the dvc-file.
These values will be compared to the values from the parameter files during the
next `dvc repro` to define if dependency to the parameter file is invalidated:

```dvc
$ head -n 10 model.pkl.dvc
md5: 05d178cfa0d1474b6c5800aa1e1b34ac
cmd: python train.py
deps:
- md5: 3aec0a6cf36720a1e9b0995a01016242
  path: users.csv
- path: params.yaml
  params:
    lr: 0.0041
    train.epochs: 70
    train.layers: 9
```

In the examples above the default parameters file `params.yaml` was used. The
parameter file name can be redefined by prefix:

```dvc
$ dvc run -d logs/ -o users.csv \
        -p parse_params.yaml:threshold,classes_num \
        python train.py
```

Now let's print parameter values that we are tracking in this
<abbr>project</abbr>:

```dvc
$ dvc params diff
   Path          Param       Old     New
params.yaml   lr             None   0.0041
params.yaml   train.layers   None   9
params.yaml   train.epochs   None   70
```

The command showed the difference between the workspace and the last commited
version of the `params.yaml` file which does not exist yet. This is why all
`Old` values are `None`. See `params diff` to learn more about the `diff`
command.
