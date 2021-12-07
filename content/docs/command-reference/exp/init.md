# exp init

Codify project using [DVC metafiles](/doc/user-guide/project-structure) to run
[experiments](/doc/user-guide/experiment-management).

## Synopsis

```usage
usage: dvc exp init [-h] [-q | -v] [--run] [--interactive] [-f]
                    [--explicit] [--name NAME] [--code CODE]
                    [--data DATA] [--models MODELS] [--params PARAMS]
                    [--metrics METRICS] [--plots PLOTS] [--live LIVE]
                    [--type {default,dl}]
                    [command]
```

## Description

`dvc exp init` helps you quickly get started with experiments. It reduces
boilerplate for initializing [pipeline](/doc/command-reference/dag) stages in a
`dvc.yaml` file by assuming defaults about the location of your data,
[parameters](/doc/command-reference/params), source code, models,
[metrics](/doc/command-reference/metrics) and
[plots](/doc/command-reference/plots), which can be customized through config.

It also offers guided `--interactive` mode for creating a stage to be
[`exp run`](/doc/command-reference/exp/run) later. `dvc exp init` supports
creating different types of stages, eg: `dl` if you are doing deep learning,
which uses [dvclive](/doc/dvclive) to monitor and checkpoint progress during
training of machine learning models.

This command is intended to be a quick way to start running experiments. To
create more complex stages and pipeliens, use `dvc stage add`.

### The `command` argument

The `command` argument is optional, if you are using `--interactive` mode. The
`command` sent to `dvc exp init` can be anything your terminal would accept and
run directly, for example a shell built-in, expression, or binary found in
`PATH`. Please remember that any flags sent after the `command` are interpreted
by the command itself, not by `dvc exp init`.

⚠️ While DVC is platform-agnostic, the commands defined in your
[pipeline](/doc/command-reference/dag) stages may only work on some operating
systems and require certain software packages to be installed.

Wrap the command with double quotes `"` if there are special characters in it
like `|` (pipe) or `<`, `>` (redirection), otherwise they would apply to
`dvc exp init` itself. Use single quotes `'` instead if there are environment
variables in it that should be evaluated dynamically. Examples:

```dvc
$ dvc exp init "./a_script.sh > /dev/null 2>&1"
$ dvc exp init './another_script.sh $MYENVVAR'
```

## Options

- `-i`, `--interactive` - prompts user for the command to execute and different
  paths for tracking outputs and dependencies, unless they are provided through
  arguments explicitly. Interactive mode allows users to set those locations
  from default values or omit them.

- `--explicit` - `dvc exp init` assumes default location of your outputs and
  dependencies (which can be overriden from the config). By using `--explicit`,
  it will not use those default values while initializing experiments. In
  `--interactive` mode, prompt won't set default value and all the values for
  the prompt needs to be explicitly provided, or omitted.

- `--code` - override the a path to your source file or directory which your
  experiment depends on. The default is `src` directory for your code.

- `--data` - override the path to your data file or directory to track, which
  your experiment depends on. The default is `data` directory.

- `--params` - override the path to
  [parameter dependencies](/doc/command-reference/params) which your experiment
  depends on. The default parameters file name is `params.yaml`. Note that
  `dvc exp init` may fail if the parameters file does not exist at the time of
  the invocation, as DVC reads the file to find parameters to track for the
  stage.

- `--model` - override the path to your models file or directory to track, which
  your experiment produces. `dvc exp init` assumes `models` directory by
  default.

- `--metrics` - override the path to metrics file to track, which your
  experiment produces. Default is `metrics.json` file.

- `--plots` - override the path to plots file or directory, which your
  experiment produces. The default is `plots`.

- `--live` - override the directory `path` for [DVCLive](/doc/dvclive), which
  your experiment will write logs to. The default is `dvclive` directory, which
  only comes to effect when used with `--type=dl`.

- `--type` - selects the type of the stage to create. Currently it provides two
  different kinds of stages: `default` and `dl`. If unspecified, `default` stage
  is created.

  `default` stage creates a stage with `metrics` and `plots` tracked by DVC
  itself, and does not track live-created artifacts (unless explicitly
  specified).

  `dl` stage is intended for use in deep-learning scenarios, where metrics and
  plots are tracked by [dvclive](/doc/dvclive) and supports tracking progress
  while training a deep-learning model with
  [checkpoints](/doc/command-reference/exp/run#checkpoints).

- `-n <stage>`, `--name <stage>` - specify a custom name for the stage generated
  by this command (e.g. `-n train`). The default is `train`.

  Note that the stage name can only contain letters, numbers, dash `-` and
  underscore `_`.

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation.

- `--run` - runs the experiment after initializing it.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
