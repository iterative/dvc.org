# params diff

Show changes in [parameter dependencies](/doc/command-reference/params) between
commits in the <abbr>DVC repository</abbr>, or between a commit and the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc params diff [-h] [-q | -v] [--all] [--show-json] [--show-md]
                       [a_rev] [b_rev]

positional arguments:
  a_rev          Old Git commit to compare (defaults to HEAD)
  b_rev          New Git commit to compare (defaults to the
                 current workspace)
```

## Description

This command provides a quick way to compare parameter values among experiments
in the repository history. Requires that Git is being used to version the
project params.

> Parameter dependencies are defined with the `-p` option in `dvc run`. See also
> `dvc params`.

Run without arguments, this command compares parameters currently present in the
<abbr>workspace</abbr> (uncommitted changes) with the latest committed version.

Supported parameter _value_ types are: string, integer, float, and arrays. DVC
itself does not ascribe any specific meaning for these values.

❗ By default it only shows parameters that were changed.

## Options

- `--all` - prints all parameters including not changed.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in the Markdown table format.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's create a simple YAML parameters file named `params.yaml` (default params
file name, see `dvc params` to learn more):

```yaml
lr: 0.0041

train:
  epochs: 70
  layers: 9

process:
  thresh: 0.98
  bow: 15000
```

Define a pipeline [stage](/doc/command-reference/run) with parameter
dependencies:

```dvc
$ dvc run -n train \
          -d train.py -d users.csv -o model.pkl \
          -p lr,train \
          python train.py
```

Let's now print parameter values that we are tracking in this
<abbr>project</abbr>:

```dvc
$ dvc params diff
Path         Param           Old   New
params.yaml  lr              —     0.0041
params.yaml  process.bow     —     15000
params.yaml  process.thresh  —     0.98
params.yaml  train.epochs    —     70
params.yaml  train.layers    —     9
```

The command above shows the difference in parameters between the workspace and
the last committed version of the params file `params.yaml`. Since it did not
exist before, all `Old` values are `—`.

In a project with parameters file history (params present in various Git
commits), you will see both `Old` and `New` values. However, the parameters
won't be shown if there are no changes:

```dvc
$ dvc params diff
Path         Param         Old     New
params.yaml  lr            0.0041  0.0043
params.yaml  train.layers  9       7
params.yaml  train.epochs  70      110
```

Specify `--all` option to see all the parameters including not changed ones:

```dvc
$ dvc params diff --all
Path         Param           Old     New
params.yaml  lr              0.0041  0.0043
params.yaml  process.bow     15000   15000
params.yaml  process.thresh  0.98    0.98
params.yaml  train.layers    9       7
params.yaml  train.epochs    70      110
```

To compare parameters with a specific commit, a tag or any
[revision](https://git-scm.com/docs/revisions) can be specified, as an
additional command line parameter:

```dvc
$ dvc params diff e12b167
Path         Param         Old     New
params.yaml  lr            0.0038  0.0043
params.yaml  train.epochs  70      110
```

Note that the `train.layers` parameter disappeared because its value was not
changed between the current version in the workspace and the given one
(`e12b167`).

To see the difference between two specific commits, both need to be specified:

```dvc
$ dvc params diff e12b167 HEAD^
Path         Param         Old     New
params.yaml  lr            0.0038  0.0041
params.yaml  train.layers  10      9
params.yaml  train.epochs  50      70
```
