# exp[eriments] run

Reproduce complete or partial experiment [pipelines](/doc/command-reference/dag)
by executing commands defined in their [stages](/doc/command-reference/run) in
the correct order. Pipelines will be reproduced within local experiments

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   [<repro_options> ...]
                   [--params [<filename>:]<params_list>]
                   [--queue] [--run-all] [-j <number>]
                   [targets [targets ...]]

positional arguments:
  targets               Stages to reproduce. 'dvc.yaml' by default.
```

## Description

`dvc exp run` provides a way to easily generate experiment results without
needing to pollute your project with large numbers of experiment Git branches or
commits.

`dvc exp run` is equivalent to `dvc repro` for experiments. The state of the
current workspace (including code, params, and dependency changes) will be
reproduced as a standalone or checkpoint experiment. The `--params` option can
be used to generate experiments with parameter values specified on the
command-line, without needing to manually edit a params file in the workspace.

To get hands-on experience with data science and machine learning pipelines, see
[Get Started: Data Pipelines](/doc/start/data-pipelines).

`dvc exp run` differs from `dvc repro` in that data files and intermediate or
final results will always be saved into the <abbr>DVC cache</abbr>.

Experiment results will be
[checked out](/doc/command-reference/experiments/checkout) into the workspace
upon completion.

For checkpoint experiments, `dvc exp resume` should be used in conjunction with
`dvc exp run`.

## Options

`dvc exp run` accepts the same options as `dvc repro`, with the exception that
`--no-commit` has no effect in `dvc exp run`. See `dvc repro` for a detailed
list of available options.

- `-f`, `--force` - reproduce an experiment pipeline, regenerating its results,
  even if no changes were found. For `checkpoint` experiments, `dvc exp run -f`
  will force regeneration of an existing checkpoint experiment branch from
  scratch.

- `--params [<filename>:]<params_list>]` - reproduce an experiment using the
  specified [parameter](/doc/command-reference/params) values. Accepts a
  comma-separated list of key-value pairs in the form
  `[filename:]key1=val1,key2=val2...`. Any specified values will override those
  from the contents of the relevant params file.

- `--queue` - queue an experiment for future execution, but do not actually run
  the pipeline.

- `--run-all` - run all experiments which have been staged for execution via
  `--queue`. Can be used in conjunction with `-j` to run experiments in
  parallel.

- `-j <number>` - run the specified number of experiments at a time in parallel,
  only applicable when used in conjunction with `--run-all`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

## Parallel experiment execution

Note: parallel execution is currently considered experimental. DVC makes no
attempt to intelligently schedule or prioritize execution of stages within
pipelines. When using `-j` to run experiments in parallel, take caution to only
specify a number of jobs which can be handled given your local machine's
avaiable resources.

## Examples
