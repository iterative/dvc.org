# experiments

A set of commands to generate and compare local <abbr>experiments</abbr>:
[apply](/doc/command-reference/exp/apply),
[branch](/doc/command-reference/exp/branch),
[diff](/doc/command-reference/exp/diff), [gc](/doc/command-reference/exp/gc),
[list](/doc/command-reference/exp/list),
[pull](/doc/command-reference/exp/pull),
[push](/doc/command-reference/exp/list),
[resume](/doc/command-reference/exp/resume),
[run](/doc/command-reference/exp/run), and
[show](/doc/command-reference/exp/show).

Note that `experiments` is also aliased to `exp`.

## Synopsis

```usage
usage: dvc experiments [-h] [-q | -v] {show,apply,diff,run,resume,res,gc,branch,list,push,pull} ...

positional arguments:
  COMMAND
    show                Print experiments.
    apply               Apply the changes from an experiment to your workspace.
    diff                Show changes between experiments in the DVC repository.
    run                 Reproduce complete or partial experiment pipelines.
    resume (res)        Resume checkpoint experiments.
    gc                  Garbage collect unneeded experiments.
    branch              Promote an experiment to a Git branch.
    list                List local and remote experiments.
    push                Push a local experiment to a Git remote.
    pull                Pull an experiment from a Git remote.
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
