# exp

> Alias of `dvc experiments`.

A set of commands to generate and manage <abbr>experiments</abbr>:
[run](/command-reference/exp/run), [show](/command-reference/exp/show),
[diff](/command-reference/exp/diff), [apply](/command-reference/exp/apply),
[branch](/command-reference/exp/branch),
[remove](/command-reference/exp/remove), [push](/command-reference/exp/push),
[pull](/command-reference/exp/pull), [list](/command-reference/exp/list), and
[clean](/command-reference/exp/clean).

> Requires that Git is being used to version the project.

## Synopsis

```usage
usage: dvc exp [-h] [-q | -v]
          {show,apply,diff,run,branch,list,push,pull,remove,clean}
          ...

positional arguments:
  COMMAND
    show                Print experiments.
    run                 Run or resume an experiment.
    apply               Apply the changes from an experiment to your workspace.
    branch              Promote an experiment to a Git branch.
    clean               Cleanup experiments temporary internal files.
    diff                Show changes between experiments.
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

See [Experiment Management](/user-guide/experiment-management) for more info.

</admon>

<admon type="warn">

Note that DVC assumes that experiments are deterministic (see [Avoiding
unexpected behavior]).

[avoiding unexpected behavior]:
  /user-guide/project-structure/dvcyaml-files#avoiding-unexpected-behavior

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
