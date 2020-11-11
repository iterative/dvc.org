# exp res[ume]

Resume (continue) existing checkpoint experiments.

## Synopsis

```usage
usage: dvc exp res[ume] [-h] [-q | -v] [-r <experiment_rev>]
                   [--params [<filename>:]<params_list>]
```

## Description

`dvc exp resume` can be used to resume execution of a checkpoint experiment
which was previously started via `dvc exp run`.

## Options

- `-r <experiment_rev>` - if this option is provided, the specified checkpoint
  experiment will be resumed. Otherwise, the most recently run checkpoint
  experiment will be resumed.

- `--params [<filename>:]<params_list>]` - if this option is provided, a new
  checkpoint branch will be created (starting from the checkpoint provided via
  `-r`) using the specified parameter changes.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples
