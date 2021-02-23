# exp run

Run an experiment: reproduce a variation of a committed
[pipeline](/doc/command-reference/dag) in a hidden project branch.

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

## Description

Provides a way to execute and track experiments in your <abbr>project</abbr>
without polluting it with unnecessary commits, branches, directories, etc.

> `dvc exp run` is equivalent to `dvc repro` for <abbr>experiments</abbr>. It
> has the same behavior when it comes to stage execution (restores the
> dependency graph, etc.). It differs from in that experiment dependencies and
> outputs will always be <abbr>cached</abbr> (so they can be restored later).

Each `dvc exp run` creates a variation based on the last project version (Git
commit) and stores it internally with an automatic experiment ID (a short SHA-1
hash). The results of the last experiment can be seen in the
<abbr>workspace</abbr>. To display all your experiments, use `dvc exp show`.

<details>

### How does DVC track experiments?

`dvc exp` uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`). Each commit has the Git `HEAD` as parent. These are
not pushed to the Git remote by default (see `dvc exp push`).

> References have a unique signature similar to the
> [entries in the run-cache](/doc/user-guide/project-structure/internal-files#run-cache).

</details>

Successful experiments can be promoted as commits to the main Git repo with
`dvc exp apply`. Unnecessary ones can be removed with `dvc exp gc` (and their
data with `dvc gc`), or abandoned.

## Parallel execution (multi-threading)

⚠️ Multi-thread runs are experimental and may be unstable. ⚠️

When using `-j` to run experiments in parallel, take caution to only specify a
number of jobs which can be handled by your local machine or execution
environment. DVC makes no attempt to intelligently schedule or prioritize
execution of stages within pipelines.

## Options

- `-f`, `--force` - reproduce an experiment pipeline, regenerating its results,
  even if no changes were found. For `checkpoint` experiments, `dvc exp run -f`
  will force regeneration of an existing checkpoint experiment branch from
  scratch.

- `--params [<filename>:]<params_list>]` - reproduce an experiment using the
  specified [parameter](/doc/command-reference/params) values. Accepts a
  comma-separated list of key-value pairs in the form
  `[filename:]key1=val1,key2=val2...`. Any specified values will override those
  from the contents of the relevant params file.

- `-n <name>`, `--name <name>` - use the specified name for this experiment. If
  `--name` is not provided, a default name will automatically be generated.

- `--queue` - queue an experiment for future execution, but do not actually run
  the pipeline.

- `--run-all` - run all experiments which have been staged for execution via
  `--queue`. Can be used in conjunction with `-j` to run experiments in
  parallel.

- `-j <number>`, `--jobs <number>` - run the specified number of experiments at
  a time in parallel, only applicable when used in conjunction with `--run-all`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.
