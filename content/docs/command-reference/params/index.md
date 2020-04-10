# params

Contains a command to show changes in parameters defined with the `-p` option of
`dvc run`: [diff](/doc/command-reference/params/diff).

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
experiments, DVC provides a special type of <abbr>dependencies</abbr>:
_parameters_ (see the `--params` option of `dvc run`). Parameters are
<abbr>project</abbr> version-specific string or array values e.g. `epochs`,
`learning-rate`, `batch_size`, `num_classes` etc.

In contrast to a regular file dependency, a parameter consists of a parameter
_file_ (the file dependency itself) and a parameter _name_ to look for inside
the file. User can specify dependencies to many parameters from a single
parameters file as well as many dependencies from different parameters files.

Users manualy write parameters file, store them in Git and specify parameter
dependencies for DVC stages. DVC saves the dependent parameters and their values
in the [DVC-file](/doc/user-guide/dvc-file-format) corresponded to the stage.
These values will be compared to the ones in the parameter files whenever
`dvc repro` is used, to determine if dependency to the parameter is invalidated.

The default parameters file name is `params.yaml`. Parameters should be
organized as a tree hierarchy in the params file. DVC addresses the parameters
by the tree path. Supported file formats for parameter file are: YAML and JSON.

The parameters concept helps to define stage dependencies more granularly when
not only a file change invalidate a stage and requires the stage execution but a
particular parameter or a set of parameters change is required for the stage
invalidation. As a result, it prevents situations when many pipeline stages
depends on a single file and any change in the file invalidates all of these
stages.

Supported parameter value types are: string, integer, float values and arrays.
DVC itself does not ascribe any specific meaning for these parameter values.
Usually these values are defined by users and serve as a way to generalize and
parametrize an machine learning algorithm or data processing code.

`dvc run` is used to define parameters, and `dvc params diff` is available to
manage them.

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

processing:
  threshold: 0.98
  bow_size: 15000
```

Define a [stage](/doc/command-reference/run) that depends on params `lr`,
`layers`, and `epochs` from the parameters file above. Full paths should be used
to specify `layers` and `epochs` from the `train` group:

```dvc
$ dvc run -d users.csv -o model.pkl \
        -p lr,train.epochs,train.layers \
        python train.py
```

> Note that we could use the same parameters addressation with JSON parameters
> files.

Alternatively, the entire group of parameters `train` can be referenced, instead
of specifying each of the group parameters separately:

```dvc
$ dvc run -d users.csv -o model.pkl \
        -p lr,train \
        python train.py
```

You can find that each parameter and it's value were saved in the
[DVC-file](/doc/user-guide/dvc-file-format). These values will be compared to
the ones in the parameter files whenever `dvc repro` is used, to determine if
dependency to the parameter file is invalidated:

```yaml
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

In the examples above, the default parameters file `params.yaml` was used. The
parameter file name can be redefined with a prefix in the `-p` argument:

```dvc
$ dvc run -d logs/ -o users.csv \
        -p parse_params.yaml:threshold,classes_num \
        python train.py
```

Now let's print parameter values that we are tracking in this
<abbr>project</abbr>:

## Examples: Print all parameter values in the workspace

Following the previous example, we can use `dvc params diff` to list all of the
available param values associated to DVC-files in the <abbr>workspace</abbr>:

```dvc
$ dvc params diff
   Path          Param       Old     New
params.yaml   lr             None   0.0041
params.yaml   train.layers   None   9
params.yaml   train.epochs   None   70
```

This command shows the difference in parameters between the workspace and the
last committed version of the `params.yaml` file. In our example, there's no
previous version, which is why all `Old` values are `None`. See `params diff` to
learn more about the `diff` command.
