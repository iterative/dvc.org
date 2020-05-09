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
experiments in <abbr>DVC projects</abbr>, DVC provides a special type of
<abbr>dependencies</abbr>: _parameters_. Parameter values are specific to a
version of the project, and defined (using `dvc run`) with simple names like
`epochs`, `learning-rate`, `batch_size`, etc.

In contrast to a regular text file dependency, a parameter dependency consists
of a parameters _file_ (the file dependency itself) and a parameter _name_ (to
find inside the text file). Multiple parameter dependencies can be specified
from one or more parameters files.

The default parameters file name is `params.yaml`. Parameters should be
organized as a tree hierarchy in it, as DVC will locate param names by their  
tree path. Supported file formats for params files are: YAML and JSON.

Supported parameter _value_ types are: string, integer, float, and arrays. DVC
itself does not ascribe any specific meaning for these values. They are
user-defined, and serve as a way to generalize and parametrize an machine
learning algorithms or data processing code.

### Benefits and workflow

The parameters concept helps to define [stage](/doc/command-reference/run)
<abbr>dependencies</abbr> more granularly. A particular parameter or set of
parameters will be required for the stage invalidation (see `dvc status` and
`dvc repro`). Changes to other parts of the dependency file will not affect the
stage.

Using parameter dependencies prevents situations where several
[pipeline](/doc/command-reference/pipeline) stages share a (configuration) file
as a common dependency, and any change in this dependency invalidates all the
stages and causes the reproduction those stages unnecessarily.

The YAML or JSON parameters files needed for the project have to be manually
written, or generated, and these can be versioned directly with Git. You can
then use `dvc run` with the `-p` (`--params`) option to specify parameter
dependencies for your pipeline's stages (instead of or in addition to regular
`-d` deps.) DVC saves the param names and values in the stage file (see
[DVC-file format](/doc/user-guide/dvc-file-format)). These values will be
compared to the ones in the params files to determine if the stage is
invalidated upon pipeline [reproduction](/doc/command-reference/repro).

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
$ dvc run -d users.csv -o model.pkl \
        -p lr,train.epochs,train.layers \
        python train.py
```

> Note that we could use the same parameter addressing with JSON parameters
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
the ones in the parameters files whenever `dvc repro` is used, to determine if
dependency to the params file is invalidated:

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

In the examples above, the default parameters file name `params.yaml` was used.
This file name can be redefined with a prefix in the `-p` argument:

```dvc
$ dvc run -d logs/ -o users.csv \
        -p parse_params.yaml:threshold,classes_num \
        python train.py
```

## Examples: Print all parameter values in the workspace

Following the previous example, we can use `dvc params diff` to list all of the
available param values:

```dvc
$ dvc params diff
   Path          Param       Old     New
params.yaml   lr             None   0.0041
params.yaml   process.bow    None   15000
params.yaml   process.thresh None   0.98
params.yaml   train.layers   None   9
params.yaml   train.epochs   None   70
```

This command shows the difference in parameters between the workspace and the
last committed version of the `params.yaml` file. In our example, there's no
previous version, which is why all `Old` values are `None`. See `params diff` to
learn more about the `diff` command.
