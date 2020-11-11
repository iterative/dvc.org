# exp[eriments]

A set of commands to generate and compare local _experiments_:
[show](/doc/command-reference/experiments/show),
[checkout](/doc/command-reference/experiments/show),
[diff](/doc/command-reference/experiments/diff),
[run](/doc/command-reference/experiments/run),
[resume](/doc/command-reference/experiments/resume), and
[gc](/doc/command-reference/experiments/gc).

## Synopsis

```usage
usage: dvc exp[eriments] [-h] [-q | -v] {show,checkout,diff,run,resume,res,gc} ...

Commands to display and compare experiments.
Documentation: <https://man.dvc.org/experiments>

positional arguments:
  {show,checkout,diff,run,resume,res,gc}
                        Use `dvc experiments CMD --help` to display command-specific help.
    show                Print experiments.
    checkout            Checkout experiments.
    diff                Show changes between experiments in the DVC repository.
    run                 Reproduce complete or partial experiment pipelines.
    resume (res)        Resume checkpoint experiments.
    gc                  Garbage collect unneeded experiments.
```

## Types of experiments

DVC supports two types of experiments:

1. Standalone experiments
2. Checkpoints

## Description

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Standalone experiment

## Example: Checkpoint experiment
