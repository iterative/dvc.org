# params diff

Show changes in [project parameters](/doc/command-reference/params), between
commits in the <abbr>DVC repository</abbr>, or between a commit and the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc params diff [-h] [-q | -v] [--show-json] [a_rev] [b_rev]

positional arguments:
  a_rev          Old Git commit to compare (defaults to HEAD)
  b_rev          New Git commit to compare (defaults to the
                 current workspace)
```

## Description

This command means to provide a quick way to compare parameters from your
previous experiments with the current ones of your pipeline, as long as you're
using params that DVC is aware of (see `--params` in `dvc run`). Run without
arguments, this command compares all existing parameters currently present in
the <abbr>workspace</abbr> (uncommitted changes) with the latest committed
version. The command shows only parameters that were used in any of stages and
ignores parameters that were not used.

## Options

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's create a simple parameters file and a stage with params dependency (See
`dvc params` and `dvc run` to learn more):

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

Define a pipeline stage with dependencies to parameters:

```dvc
$ dvc run -d users.csv -o model.pkl \
        -p lr,train \
        python train.py
```

Let's print parameter values that we are tracking in this <abbr>project</abbr>:

```dvc
$ dvc params diff
   Path          Param       Old     New
params.yaml   lr             None   0.0041
params.yaml   train.layers   None   9
params.yaml   train.epochs   None   70
```

The command showed the difference between the workspace and the last commited
version of the `params.yaml` file which does not exist yet. This is why all
`Old` values are `None`.

Note, not all the parameter were printed. `dvc params diff` prints only changed
parameters that were used in one of the stages and ignors parameters from the
group `processing` that were not used.

In a project with parameter file history you will see both `Old` and `New`
values:

```dvc
$ dvc params diff
   Path          Param       Old     New
params.yaml   lr             0.0041 0.0043
params.yaml   train.layers   9      7
params.yaml   train.epochs   70     110
```

To compare parameters with a specific commit, tag or revision it should be
specified as an additional command line parameter:

```dvc
$ dvc params diff e12b167
   Path          Param       Old     New
params.yaml   lr             0.0038 0.0043
params.yaml   train.epochs   70     110
```

Note, the `train.layers` parameter dissapeared because its value was not changed
between the current version in the workspace and the defined one.

To see the difference between two specific commits, both need to be specified:

```dvc
$ dvc params diff e12b167 HEAD^
   Path          Param       Old     New
params.yaml   lr             0.0038 0.0041
params.yaml   train.layers   10     9
params.yaml   train.epochs   50     70
```
