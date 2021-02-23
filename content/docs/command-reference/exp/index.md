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

`dvc exp` subcommands provide specialized ways to create and manage data science
experiments. The basic workflow goes like this:

- Modify <abbr>dependencies</abbr> (e.g. input data or source code),
  <abbr>parameters</abbr>, or commands (`cmd` field of `dvc.yaml`) of committed
  stages.
- Use `dvc exp run` (instead of `repro`) to execute the pipeline. This puts the
  experiment's results in your <abbr>workspace</abbr>, and tracks it under the
  hood.
- Visualize experiment configurations and results with `dvc exp show`. Repeat.
- Use [metrics](/doc/command-reference/metrics) in your pipeline to identify the
  best experiment(s), and promote them to persistent experiments (regular
  commits) with `dvc exp apply`.

📖 See [Experiment Management](/doc/user-guide/experiment-management) for more
info.

> Note that DVC assumes that <abbr>experiments</abbr> are deterministic (see
> **Avoiding unexpected behavior** in `dvc run`).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
