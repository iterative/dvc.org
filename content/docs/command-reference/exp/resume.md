# exp resume

Resume (continue) existing checkpoint experiments.

## Synopsis

```usage
usage: dvc exp res[ume] [-h] [-q | -v] [-r <experiment_rev>]
                   [--params [<filename>:]<params_list>]
                   [-n <name>]
```

## Description

`dvc exp resume` can be used to resume execution of a checkpoint experiment
which was previously started via `dvc exp run`.

Note that `exp resume` is also aliased to `exp res`.

## Options

In addition to the following options, `dvc exp res` also accepts the same
options as as `dvc repro`.

- `-r <experiment_rev>` - if this option is provided, the specified checkpoint
  experiment will be resumed. Otherwise, the most recently run checkpoint
  experiment will be resumed. `experiment_rev` can be either the name of a
  checkpoint experiment or the Git SHA for an intermediate checkpoint experiment
  commit.

- `--params [<filename>:]<params_list>]` - if this option is provided, a new
  checkpoint experiment will be created (starting from the checkpoint provided
  via `-r`) using the specified parameter changes.

- `-n <name>`, `--name <name>` - if this option is provided in conjunction with
  `--params`, the resulting checkpoint experiment will be named `name`. If
  `--params` is not specified, the original experiment name will be preserved.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples
