# params diff

Show changes in [parameters](/doc/command-reference/params) between commits in
the <abbr>DVC repository</abbr>, or between a commit and the
<abbr>workspace</abbr>.

> Requires that Git is being used to version the project.

## Synopsis

```usage
usage: dvc params diff [-h] [-q | -v]
                       [--targets [<paths> [<paths> ...]]] [--all]
                       [--deps] [--json] [--md] [--no-path]

positional arguments:
  a_rev          Old Git commit to compare (defaults to HEAD)
  b_rev          New Git commit to compare (defaults to the
                 current workspace)
```

## Description

Provides a quick way to compare parameter values among experiments in the
repository history. The differences shown by this command include the old and
new param values, along with the param name.

> Parameter dependencies are defined in the `params` field of `dvc.yaml` (e.g.
> with the the `-p` (`--params`) option of `dvc stage add`).

Without arguments, `dvc params diff` compares parameters currently present in
the <abbr>workspace</abbr> (uncommitted changes) with the latest committed
versions (required). This includes everything in `params.yaml` (default
parameters file) as well all the `params` used in `dvc.yaml`. Values in
`dvc.lock` are used for comparison. Only params that have changes are listed.

`a_rev` and `b_rev` are optional Git commit hashes, tags, or branch names to
compare. A single specified revision results in comparing it against the
workspace.

All params defined in `dvc.yaml` are used by default, but specific ones can be
specified with the `--targets` option.

> Note that targets don't necessarily have to be defined in `dvc.yaml`. For that
> reason, it doesn't require an existing DVC project to run in. It can work in
> any Git repo.

## Options

- `--targets <paths>` - specific params files to compare. It accepts `paths` to
  any valid parameters file, regardless of whether `dvc.yaml` is currently
  tracking any params in them.

  When specifying arguments for `--targets` before `a_rev`/`b_rev`, you should
  use `--` after this option's arguments (POSIX terminals), e.g.:

  ```dvc
  $ dvc params diff --targets m1.json m2.yaml -- HEAD v1
  ```

- `--all` - list all parameters, including those without changes.

- `--deps` - include only parameters that are stage dependencies.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable table.

- `--md` - prints the command's output in the Markdown table format.

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
$ dvc stage add -n train \
                -d train.py -d users.csv -o model.pkl \
                -p lr,train \
                python train.py
```

Let's now print parameter values that we are tracking in this
<abbr>project</abbr>:

```dvc
$ dvc params diff
Path         Param           HEAD   workspace
params.yaml  lr              —      0.0041
params.yaml  process.bow     —      15000
params.yaml  process.thresh  —      0.98
params.yaml  train.epochs    —      70
params.yaml  train.layers    —      9
```

The command above shows the difference in parameters between the workspace and
the last committed version (`HEAD`) of the params file `params.yaml`. Since it
did not exist before, all `HEAD` values are `—`.

In a project with parameters file history (params present in various Git
commits), you will see both `HEAD` and `workspace` values. However, the
parameters won't be shown if there are no changes:

```dvc
$ dvc params diff
Path         Param         HEAD    workspace
params.yaml  lr            0.0041  0.0043
params.yaml  train.layers  9       7
params.yaml  train.epochs  70      110
```

Specify `--all` option to see all the parameters including not changed ones:

```dvc
$ dvc params diff --all
Path         Param           HEAD    workspace
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
Path         Param         HEAD    e12b167
params.yaml  lr            0.0038  0.0043
params.yaml  train.epochs  70      110
```

Note that the `train.layers` parameter disappeared because its value was not
changed between the current version in the workspace and the given one
(`e12b167`).

To see the difference between two specific commits, both need to be specified:

```dvc
$ dvc params diff e12b167 HEAD^
Path         Param         e12b167  HEAD^
params.yaml  lr            0.0038   0.0041
params.yaml  train.layers  10       9
params.yaml  train.epochs  50       70
```
