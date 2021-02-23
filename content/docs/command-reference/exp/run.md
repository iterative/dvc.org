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

Provides a way to execute and track `dvc experiments` in your
<abbr>project</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

> `dvc exp run` is equivalent to `dvc repro` for <abbr>experiments</abbr>. It
> has the same behavior when it comes to stage execution (restores the
> dependency graph, etc.). See the command [options](#options) for more details
> on the differences.

Each `dvc exp run` creates a variation based on the latest project version
committed to Git and stores it internally with an automatic experiment name like
`exp-bfe64` (which can be customized with the `--name` option). The results of
the last experiment can be seen in the <abbr>workspace</abbr>. To display and
compare your experiments, use `dvc exp show` or `dvc exp diff`.

<details>

### How does DVC track experiments?

`dvc exp` uses actual commits under custom
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(found in `.git/refs/exps`). Each commit has the Git `HEAD` as parent and has
it's own SHA-256 hash. These are not pushed to the Git remote by default (see
`dvc exp push`).

> References have a unique signature similar to the
> [entries in the run-cache](/doc/user-guide/project-structure/internal-files#run-cache).

</details>

Successful experiments can be made
[persistent](/doc/user-guide/experiment-management#persistent-experiments) by
committing them to the Git repo. You can use `dvc exp apply` to roll back the
workspace to a previous experiment first. Unnecessary ones can be removed with
`dvc exp gc`, or abandoned (and their data with `dvc gc`).

## Checkpoints

To track successive steps in a longer <abbr>experiment</abbr>, you can register
checkpoints with DVC during your code or script runtime (similar to a logger).

To do so, mark stage `outs` with `checkpoint: true` in `dvc.yaml`, and in your
code either call the `dvc.api.make_checkpoint()` function (Python), or write a
`.dvc/tmp/DVC_CHECKPOINT` signal file (any programming language).

<details>

### How are checkpoints captured by DVC?

When DVC runs a checkpoint-enabled experiment, a custom Git branch (in
`.git/refs/exps`) is started off the repo `HEAD`. A new commit is appended each
time a checkpoint is registered by the code. These are not pushed to the Git
remote by default (see `dvc exp push`).

</details>

## Parallel execution

⚠️ Multi-threading is experimental and may be unstable. ⚠️

When using `-j` (`--jobs`) to run experiments in parallel, make sure you're
using a number of jobs that your machine or environment can handle.

Note that DVC makes no attempt to intelligently schedule or prioritize stages
within pipelines.

## Options

> In addition to the following options, `dvc exp run` also accepts the same
> options as `dvc repro`, with the exception that `--no-commit` has no effect
> here.

- `--params [<filename>:]<params_list>]` - reproduce an experiment using the
  specified [parameter](/doc/command-reference/params) values. Accepts a
  comma-separated list of key-value pairs in the form
  `[filename:]key1=val1,key2=val2...`. Any specified values will override those
  from the contents of the relevant params file.

- `-n <name>`, `--name <name>` - specify a name for this experiment. If this not
  provided, a default name will generated like `exp-f80g4` (based on the
  experiment's hash).

- `-f`, `--force` - reproduce an experiment pipeline, regenerating its results,
  even if no changes were found. For `checkpoint` experiments, `dvc exp run -f`
  will force regeneration of an existing checkpoint experiment branch from
  scratch.

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

## Example: Modify parameters on-the-fly

dvc.yaml with 1 param, 1 stage, and 1 metric

Try a quick variation with `--set-param`...

Check the results...

Try again and check results (`-S`)...

> Notice that experiments run as a series don't build up on each other, as they
> are all based of `HEAD`.

## Example:
