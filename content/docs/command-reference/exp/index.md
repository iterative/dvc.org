# experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

A set of commands to generate and manage <abbr>experiment</abbr>:
[run](/doc/command-reference/exp/run), [show](/doc/command-reference/exp/show),
[diff](/doc/command-reference/exp/diff),
[apply](/doc/command-reference/exp/apply),
[branch](/doc/command-reference/exp/branch),
[resume](/doc/command-reference/exp/resume),
[gc](/doc/command-reference/exp/gc), [list](/doc/command-reference/exp/list),
[push](/doc/command-reference/exp/list), and
[pull](/doc/command-reference/exp/pull).

> Aliased to `dvc exp`.

## Synopsis

```usage
usage: dvc experiments [-h] [-q | -v]
       {show,apply,diff,run,resume,res,gc,branch,list,push,pull} ...

positional arguments:
  COMMAND
    show          Print experiments.
    apply         Apply the changes from an experiment to your workspace.
    diff          Show changes between experiments in the DVC repository.
    run           Reproduce complete or partial experiment pipelines.
    resume (res)  Resume checkpoint experiments.
    gc            Garbage collect unneeded experiments.
    branch        Promote an experiment to a Git branch.
    list          List local and remote experiments.
    push          Push a local experiment to a Git remote.
    pull          Pull an experiment from a Git remote.
```

## Description

> Note that DVC assumes that experiments are deterministic (see **Avoiding
> unexpected behavior** in `dvc run`).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
