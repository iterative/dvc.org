# exp init

Quickly setup any project to use [DVC Experiments].

> Requires a <abbr>DVC repository</abbr>, created with `git init` and
> `dvc init`.

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
boilerplate DVC procedures by creating a `dvc.yaml` file that assumes default
location of your input data, <abbr>parameters</abbr>, source code, models,
<abbr>metrics</abbr> and [plots](/doc/command-reference/plots). These locations
can be customized through the [options](#options) below or via config files.

Standard repository structure:

```
├── data/
├── metrics.json
├── models/
├── params.yaml  # required by default
├── plots/
└── src/
```

> Note that by default `dvc exp init` expects at least a `params.yaml` file
> present. It can be avoided via the `--params` or `-i` options.

You must provide a command that runs your experiments(s). This can be done
either directly with the `command` argument, or by using the `--interactive`
(`-i`) mode which will prompt you for it. This command will be wrapped as a
<abbr>stage</abbr> that `dvc exp run` can execute.

Different types of stages are supported, such as `dl` (deep learning) which uses
[DVCLive](/doc/dvclive) to monitor [checkpoints] during training of ML models.

> `dvc exp init` is intended as a quick way to start running [DVC Experiments].
> See the `dvc.yaml` specification for complex data pipelines.

[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[dvc experiments]: /doc/user-guide/experiment-management/experiments-overview

### The `command` argument

The `command` given to `dvc exp init` can be anything your system terminal would
accept and run directly, for example a shell built-in, an expression, or a
binary found in `PATH`. Please note that any flags sent after the `command` will
typically become part of the command itself and ignored by `dvc exp init` (so
put the command last).

⚠️ While DVC is platform-agnostic, the commands defined in `dvc.yaml` may only
work on some operating systems and require certain software packages or
libraries in the environment.

Surround the command with double quotes `"` if it includes special characters
like `|` or `<`, `>` -- otherwise they would apply to `dvc exp init` itself. Use
single quotes `'` instead if there are environment variables in it that should
be evaluated dynamically.

```dvc
$ dvc exp init "./a_script.sh > /dev/null 2>&1"
$ dvc exp init './another_script.sh $MYENVVAR'
```

## Options

- `-i`, `--interactive` - prompts user for the `command` to execute and for the
  different paths where dependencies and outputs can be found, unless they are
  provided through arguments explicitly. Interactive mode allows users to set
  those locations from default values or omit them.

- `--run` - automatically run the experiment after codifying it (same as
  `dvc exp run`).

- `--type` - selects the type of the stage to create. Currently it provides two
  alternatives: `dl` and `default` (no need to specify this one).

  `dl` stages are intended for use in deep-learning scenarios, where metrics and
  plots are tracked with [DVCLive](/doc/dvclive). This also supports logging
  [checkpoints](/doc/command-reference/exp/run#checkpoints) during the training
  of DL models.

- `--code` - set the path to the file or directory where the source code that
  your experiment depends on can be found (if any). Overrides other
  configuration and default value (`src/`).

- `--params` - set the path to the file or directory where the
  </abbr>parameters</abbr> that your experiment depends on can be found.
  Overrides other configuration and default value (`params.yaml`).

  > Note that `dvc exp init` fails if the parameters file does not exist at the
  > time of the invocation. This is because DVC reads that file to find params
  > to include in the stage.

- `--data` - set the path to the data file or directory that your experiment
  depends on can be found (if any). Overrides other configuration and default
  value (`data/`).

- `--model` - set the path to the file or directory where the model(s) produced
  by your experiment can be found (if any). Overrides other configuration and
  default value (`models/`).

  > 💡 This could be used for any artifacts produced by your experiment.

- `--metrics` - set the path to the file or directory where the metrics produced
  by your experiment can be found (if any). Overrides other configuration and
  default value (`metrics.json`).

- `--plots` - set the path to the file or directory where the plots produced by
  your experiment can be found (if any). Overrides other configuration and
  default value (`plots/`).

- `--live` - configure the `path` directory for [DVCLive](/doc/dvclive). This is
  where experiment logs will be written. Overrides other configuration and
  default value (`dvclive/`).

  > This only has an effect when used with `--type=dl`.

- `--explicit` - do not assume default locations of project dependencies and
  outputs. You'll have to provide specific locations via other options or config
  files. If combined with `--interactive`, prompts won't have default values.

- `-n <stage>`, `--name <stage>` - specify a custom name for the stage generated
  by this command. The default is `train`. It can only contain letters, numbers,
  dash `-` and underscore `_` (same as `dvc stage add --name`).

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation (same as `dvc stage add --force`).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
