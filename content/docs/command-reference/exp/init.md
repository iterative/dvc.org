# exp init

Quickly create or prepare any project to use [DVC Experiments].

> Requires a <abbr>DVC repository</abbr>, created with `git init` and
> `dvc init`.

## Synopsis

```usage
usage: dvc exp init [-h] [-q | -v] [--run] [--interactive] [-f]
                    [--explicit] [--name NAME] [--code CODE]
                    [--data DATA] [--models MODELS] [--params PARAMS]
                    [--metrics METRICS] [--plots PLOTS] [--live LIVE]
                    [--type {default,checkpoint}]
                    [command]
```

## Description

This command helps you get started with DVC Experiments quickly. It reduces
repetitive DVC procedures by creating a necessary `dvc.yaml` file, which assumes
standard locations of your inputs (data, <abbr>parameters</abbr>, and source
code) and outputs (models, <abbr>metrics</abbr>, and
[plots](/doc/command-reference/plots)).

These locations can be customized through the [command options](#options) or via
[configuration](/doc/command-reference/config#exp). Default project structure:

```
├── data/
├── metrics.json
├── models/
├── params.yaml
├── plots/
└── src/
```

The only required argument is the terminal command that runs your experiment(s).
It can be provided directly [as an argument](#the-command-argument) or by using
the `--interactive` (`-i`) mode (which will prompt for it). The command will be
wrapped as a <abbr>stage</abbr> that `dvc exp run` can execute.

<admon type="tip">

A special `--type` of stage is supported (`checkpoint`), which monitors
[checkpoints] during training of ML models.

</admon>

`dvc exp init` also generates the boilerplate project structure, including input
files/directories and directories needed for future outputs, or any locations
determined in interactive mode.

<admon type="info">

`dvc exp init` is intended as a quick way to start running [DVC Experiments].
See the `dvc.yaml` specification for more complex data pipelines.

</admon>

[stage definition]:
  /doc/user-guide/project-structure/pipelines-files#stage-entries
[checkpoints]: /doc/user-guide/experiment-management/checkpoints
[dvc experiments]: /doc/user-guide/experiment-management/experiments-overview

### The `command` argument

The command given to `dvc exp init` can be anything your system terminal would
accept and run directly, for example a shell built-in, an expression, or a
binary found in `PATH`. Please note that any flags sent after the `command`
argument will normally become part of that command itself and ignored by
`dvc exp init` (so provide it last).

⚠️ While DVC is platform-agnostic, commands defined in `dvc.yaml` (`cmd` field)
may only work on some operating systems and require certain software packages or
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

- `-i`, `--interactive` - prompts user for a command that runs your
  experiment(s) (see [details](#the-command-argument)) and to confirm or define
  the paths that conform your repo's structure.

- `-n <stage>`, `--name <stage>` - specify a custom name for the stage generated
  by this command. The default is `train`. It can only contain letters, numbers,
  dash `-` and underscore `_` (same as `dvc stage add --name`).

- `--run` - automatically run the experiment after creating the stage (same as
  `dvc exp run`).

- `--type` - selects the type of the stage to create. Currently it provides two
  alternatives: `checkpoint` (supports logging
  [checkpoints](/doc/command-reference/exp/run#checkpoints) during model
  training) and `default` (no need to specify this).

- `--code` - set the path to the file or directory where the source code that
  your experiment depends on can be found (if any). Overrides other
  configuration and default value (`src/`).

- `--params` - set the path to the file or directory where the
  </abbr>parameters</abbr> that your experiment depends on can be found.
  Overrides other configuration and default value (`params.yaml`).

- `--data` - set the path to the data file or directory that your experiment
  depends on can be found (if any). Overrides other configuration and default
  value (`data/`).

- `--models` - set the path to the file or directory where the model(s) produced
  by your experiment can be found (if any). Overrides other configuration and
  default value (`models/`).

  > 💡 This could be used for any artifacts produced by your experiment.

- `--metrics` - set the path to the file or directory where the metrics produced
  by your experiment can be found (if any). Overrides other configuration and
  default value (`metrics.json`).

- `--plots` - set the path to the file or directory where the plots produced by
  your experiment can be found (if any). Overrides other configuration and
  default value (`plots/`).

- `--live` - set the path to the directory where the metrics and plots
  [produced by DVCLive](https://dvc.org/doc/dvclive/dvclive-with-dvc#outputs)
  will be found. Overrides the default values for `--metrics` and `--plots`.

- `--explicit` - do not assume default locations of project dependencies and
  outputs. You'll have to provide specific locations via other options or
  `dvc config exp`. In `--interactive` this removes default values from prompts.

- `-f`, `--force` - overwrite an existing stage in `dvc.yaml` file without
  asking for confirmation (same as `dvc stage add --force`).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: interactive mode

Let's prepare an ML model training script to start running experiments on it.
The easiest route is using interactive mode and answering a few questions:

```dvc
$ dvc exp init --interactive
Command to execute: python src/train.py

Enter experiment dependencies.
Path to a code file/directory [src, n to omit]: src/train.py
Path to a data file/directory [data, n to omit]: data/features
Path to a parameters file [params.yaml, n to omit]:

Enter experiment outputs.
Path to a model file/directory [models, n to omit]: models/predict.h5
Path to a metrics file [metrics.json, n to omit]:
Path to a plots file/directory [plots, n to omit]: n

Creating dependencies: src/train.py and params.yaml
Creating output directories: models
Creating train stage in dvc.yaml

Ensure your experiment command creates metrics.json and models/predict.h5.
You can now run your experiment using "dvc exp run".
```

In this example the code, data, and model locations were specified above to
avoid using the defaults (which are too broad). `params.yaml` and `metrics.json`
are accepted (pressed Enter) for <abbr>parameters</abbr> and
<abbr>metrics</abbr>. Plots are omitted (entered `n`) as none will be written.

The resulting `dvc.yaml` file codifies the meta-information you provided in
DVC's format:

```yaml
train:
  cmd: python src/train.py
  deps:
    - data/features
    - src/train.py
  params:
    - params.yaml:
  outs:
    - models/predict.h5
  metrics:
    - metrics.json:
        cache: false
```

> Notes:
>
> - `train` is the default stage name unless you provide one with the `--name`
>   option.
> - The `epochs` param was obtained from the `params.yaml` file. Any other param
>   keys found there would all be listed under `params:` automatically.

The next step would be to tune `params.yaml` or improve `src/train.py` directly,
and start [running experiments](/doc/command-reference/exp/run).
