# exp pull

Download an [experiment](/doc/command-reference/exp) from a Git remote, and its
data from a `dvc remote`.

## Synopsis

```usage
usage: dvc exp pull [-h] [-q | -v] [-f] [--no-cache]
                    [-r <name>] [-j <number>] [--run-cache]
                    git_remote experiment

positional arguments:
  git_remote          Git remote name or Git URL
  experiment          Experiment to pull
```

## Description

The `dvc exp push` and `dvc exp pull` commands are the means for [sharing
experiments] across <abbr>repository</abbr> copies via Git and DVC remotes.

[sharing experiments]: /doc/user-guide/experiment-management/sharing-experiments

> Plain `git push` and `git fetch` don't work with experiments because these are
> saved under custom Git references. See **How does DVC track experiments?** in
> `dvc exp run` to learn more about DVC experiment storage.

A working `git_remote` name (e.g. `origin`) or Git URL is required, as well as
an `experiment` name or hash (see `dvc exp run`) to pull.

The first action of `dvc exp pull` is to download the `experiment` so it's
available in the local repository (equivalent to
`git fetch <git_remote> refs/exps/<experiment>`). Use `dvc exp show` to explore
your local experiments.

By default, this command will also try to [pull](/doc/command-reference/pull)
all <abbr>cached</abbr> data associated with the experiment to DVC
[remote storage](/doc/command-reference/remote), unless `--no-cache` is used.

> 💡 Note that `git push <git_remote> --delete <experiment>` can be used to
> delete a pushed experiment.

## Options

- `-f`, `--force` - rewrite the `experiment` commit if it already exists in the
  local repo. Equivalent to `git push --force` (rewrites history)

- `--no-cache` - do not pull cached files files associated with this experiment
  from DVC remote storage.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to pull cached files
  to.

- `--run-cache` - downloads all available history of
  [stage runs](/doc/user-guide/project-structure/internal-files#run-cache) from
  the `dvc remote` (to the cache only, like `dvc fetch --run-cache`). Note that
  `dvc exp run <stage_name>` is necessary to checkout these files.

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

Let's say we have cloned a DVC repository, and would like to fetch an experiment
that someone else shared (see also `dvc exp list`).

```dvc
$ dvc exp list --all origin
master:
        exp-e6c97
$ dvc exp pull origin exp-e6c97
Pulled experiment 'exp-e6c97' from Git remote 'origin'.
```

We can now see that the experiment exists in the local repo:

```dvc
$ dvc exp list --all
master:
        exp-e6c97
```
