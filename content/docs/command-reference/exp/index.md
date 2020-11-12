# exp[eriments]

A set of commands to generate and compare local _experiments_:
[show](/doc/command-reference/exp/show),
[checkout](/doc/command-reference/exp/show),
[diff](/doc/command-reference/exp/diff), [run](/doc/command-reference/exp/run),
[resume](/doc/command-reference/exp/resume), and
[gc](/doc/command-reference/exp/gc).

## Synopsis

```usage
usage: dvc exp[eriments] [-h] [-q | -v] {show,checkout,diff,run,resume,res,gc} ...

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
