# exp

_New in DVC 2.0_

A set of commands to generate and manage <abbr>experiments</abbr>:
[init](/doc/command-reference/exp/init), [run](/doc/command-reference/exp/run),
[show](/doc/command-reference/exp/show),
[diff](/doc/command-reference/exp/diff),
[apply](/doc/command-reference/exp/apply),
[branch](/doc/command-reference/exp/branch),
[remove](/doc/command-reference/exp/remove),
[gc](/doc/command-reference/exp/gc), [push](/doc/command-reference/exp/list),
[pull](/doc/command-reference/exp/pull), and
[list](/doc/command-reference/exp/list).

> Aliased to `dvc exp`.

> Requires that Git is being used to version the project.

## Synopsis

```usage
usage: dvc exp [-h] [-q | -v]
          {show,apply,diff,run,gc,branch,list,push,pull,remove,init}
          ...

positional arguments:
  COMMAND
    show                Print experiments.
    apply               Apply the changes from an experiment to your
                        workspace.
    diff                Show changes between experiments in the DVC
                        repository.
    run                 Reproduce complete or partial experiment pipelines.
    gc                  Garbage collect unneeded experiments.
    branch              Promote an experiment to a Git branch.
    list                List local and remote experiments.
    push                Push a local experiment to a Git remote.
    pull                Pull an experiment from a Git remote.
    remove              Remove local experiments.
    init                Initialize experiments.
```

## Description

`dvc exp` subcommands provide specialized ways to create and manage data
science/ machine learning experiments.

📖 See [Experiment Management](/doc/user-guide/experiment-management) for more
info.

> ⚠️ Note that DVC assumes that experiments are deterministic (see **Avoiding
> unexpected behavior** in `dvc stage add`).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
