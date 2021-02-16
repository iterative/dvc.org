# exp run

Run an experiment: reproduce a variation of a committed
[pipeline](/doc/command-reference/dag) under a custom Git branch.

> Similar to `dvc repro` but for
> [experimentation](/doc/user-guide/experiment-management).

## Synopsis

```usage
usage: dvc exp run [-h] [-q | -v] [-f]
                   [<repro_options> ...]
                   [--params [<filename>:]<params_list>]
                   [-n <name>] [--queue] [--run-all] [-j <number>]
                   [targets [targets ...]]

positional arguments:
  targets               Stages to reproduce. 'dvc.yaml' by default.
```
