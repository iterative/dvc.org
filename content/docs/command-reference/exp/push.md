# exp push

Upload an [experiment](/doc/command-reference/exp) to a Git remote, and its data
to a `dvc remote`.

## Synopsis

```usage
usage: dvc exp push [-h] [-q | -v] [-A] [--rev <commit>] [-n <num>] [-f]
                    [--no-cache] [-r <name>] [-j <number>] [--run-cache]
                    git_remote experiment

positional arguments:
  git_remote          Git remote name or Git URL
  experiment          Experiment to push
```

## Description

The `dvc exp push` and `dvc exp pull` commands are the means for [sharing
experiments] across <abbr>repository</abbr> copies via Git and DVC remotes.

[sharing experiments]: /doc/user-guide/experiment-management/sharing-experiments

> Plain `git push` and `git fetch` don't work with experiments because these are
> saved under custom Git references. See **How does DVC track experiments?** in
> `dvc exp run` to learn more about DVC experiment storage.

A working `git_remote` name (e.g. `origin`) or Git URL is required, as well as
an `experiment` name or hash (see `dvc exp run`) to push.

The first action of `dvc exp push` is to upload the `experiment` to the Git
remote so it can be pulled later from other repo clones (equivalent to
`git push <git_remote> refs/exps/<experiment>`). Use `dvc exp list <git_remote>`
to see experiments in the remote.

This command will also try to [push](/doc/command-reference/push) all
<abbr>cached</abbr> data associated with the experiment to DVC
[remote storage](/doc/command-reference/remote), unless `--no-cache` is used.

## Options

- `-A`, `--all-commits` - push all experiments in the repository (overrides
  `--rev` and `--num`).

- `--rev <commit>` - push experiments derived from the specified `<commit>` as
  baseline.

- `-n <num>`, `--num <num>` - show experiments from the last `num` commits
  (first parents) starting from the `--rev` baseline. Give a negative value to
  include all first-parent commits (similar to `git log -n`).

- `-f`, `--force` - rewrite the `experiment` commit if it already exists in the
  Git remote. Equivalent to `git push --force` (rewrites history)

- `--no-cache` - do not push cached files associated with this experiment to a
  DVC remote.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to push cached files
  to.

- `--run-cache` - uploads all available history of
  [stage runs](/doc/user-guide/project-structure/internal-files#run-cache) to
  the `dvc remote`.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to upload data to
  remote storage. The default value is `4 * cpu_count()`. Note that the default
  value can be set using the `jobs` config option with `dvc remote modify`.
  Using more jobs may improve the overall transfer speed.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project:

```dvc
$ dvc exp list --all
11-bigrams-experiment:
        exp-e6c97
        exp-1dad0
        exp-1df77
```

We would now like to share one of them with others via the Git remote:

```dvc
$ dvc exp push origin exp-e6c97
Pushed experiment 'exp-e6c97' to Git remote 'origin'.
```

We can now see that the experiment exists in the remote repo:

```dvc
$ dvc exp list --all origin
master:
        exp-e6c97
```
