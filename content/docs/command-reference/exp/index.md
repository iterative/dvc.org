# exp

> Alias of `dvc experiments`.

A set of commands to generate and manage <abbr>experiments</abbr>:
[run](/doc/command-reference/exp/run), [show](/doc/command-reference/exp/show),
[diff](/doc/command-reference/exp/diff),
[apply](/doc/command-reference/exp/apply),
[branch](/doc/command-reference/exp/branch),
[remove](/doc/command-reference/exp/remove),
[gc](/doc/command-reference/exp/gc), [push](/doc/command-reference/exp/push),
[pull](/doc/command-reference/exp/pull),
[list](/doc/command-reference/exp/list), and
[clean](/doc/command-reference/exp/clean).

> Requires that Git is being used to version the project.

## Synopsis

```usage
usage: dvc exp [-h] [-q | -v]
          {show,apply,diff,run,gc,branch,list,push,pull,remove,init,clean}
          ...

positional arguments:
  COMMAND
    show                Print experiments.
    run                 Run or resume an experiment.
    apply               Apply the changes from an experiment to your workspace.
    branch              Promote an experiment to a Git branch.
    clean               Cleanup experiments temporary internal files.
    diff                Show changes between experiments.
    gc                  Garbage collect unneeded experiments.
    list                List local and remote experiments.
    pull                Pull an experiment from a Git remote.
    push                Push a local experiment to a Git remote.
    remove              Remove experiments.
    save                Save current workspace as an experiment.
```

## Description

`dvc exp` subcommands provide specialized ways to create and manage data
science/ machine learning experiments.

<admon icon="book">

See [Experiment Management](/doc/user-guide/experiment-management) for more
info.

</admon>

<admon type="warn">

Note that DVC assumes that experiments are deterministic (see [Avoiding
unexpected behavior]).

[avoiding unexpected behavior]:
  /doc/user-guide/project-structure/dvcyaml-files#avoiding-unexpected-behavior

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
