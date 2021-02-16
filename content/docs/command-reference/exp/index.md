# dvc experiments

⚠️ This feature is only available in DVC 2.0 ⚠️

> Aliased to `dvc exp`.

A set of commands to generate and manage experiments:
[run](/doc/command-reference/exp/run), [show](/doc/command-reference/exp/show),
[diff](/doc/command-reference/exp/diff),
[apply](/doc/command-reference/exp/apply),
[branch](/doc/command-reference/exp/branch),
[list](/doc/command-reference/exp/list),
[resume](/doc/command-reference/exp/resume),
[push](/doc/command-reference/exp/list),
[pull](/doc/command-reference/exp/pull), and
[gc](/doc/command-reference/exp/gc).

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
