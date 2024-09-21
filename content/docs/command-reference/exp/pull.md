# exp pull

Download [experiments](/doc/command-reference/exp) from a Git remote, and their
data from [remote storage].

[remote storage]: /doc/user-guide/data-management/remote-storage

## Synopsis

```usage
usage: dvc exp pull [-h] [-q | -v] [-A] [--rev <commit>] [-n <num>] [-f]
                    [--no-cache] [-r <name>] [-j <number>]
                    [--run-cache | --no-run-cache]
                    git_remote [experiment ...]

positional arguments:
  git_remote          Git remote name or Git URL
  experiment          Experiment to pull
```

## Description

The `dvc exp push` and `dvc exp pull` commands are the means for [sharing
experiments] across <abbr>repository</abbr> copies via Git and [remote storage].

[sharing experiments]: /doc/user-guide/experiment-management/sharing-experiments

> Plain `git push` and `git fetch` don't work with experiments because these are
> saved under custom Git references. See
> [**How does DVC track experiments?**](/doc/user-guide/experiment-management#how-does-dvc-track-experiments)
> in **DVC Experiments Overview** to learn more about DVC experiment storage.

A working `git_remote` name (e.g. `origin`) or Git URL is required. Experiments
derived from the `HEAD` commit are pulled by default (see the options below).

The first action of `dvc exp pull` is to download the `experiments` from the Git
remote so they are available in the local repository (equivalent to
`git fetch <git_remote> refs/exps/<experiment>`). Use `dvc exp show` to explore
your local experiments.

By default, this command will also try to `dvc pull` all <abbr>cached</abbr>
data associated with the experiments to [remote storage], unless `--no-cache` is
used.

## Options

- `-A`, `--all-commits` - pull all experiments in the repository (overrides
  `--rev` and `--num`).

- `--rev <commit>` - pull experiments derived from the specified `<commit>` as
  baseline (HEAD by default).

- `-n <num>`, `--num <num>` - pull experiments from the last `num` commits
  (first parents) starting from the `--rev` baseline. Give a negative value to
  include all first-parent commits (similar to `git log -n`).

- `-f`, `--force` - rewrite the experiment if it already exists in the local
  repo.

- `--no-cache` - do not pull cached files files associated with this experiment
  from DVC remote storage.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to pull cached files
  from.

- `--run-cache`, `--no-run-cache` - whether to download all available history of
  [stage runs] from the `dvc remote` (to the cache only, like `dvc fetch --run-cache`).
  Note that `dvc exp run <stage_name>` is necessary to checkout these files. Default
  is `--no-run-cache`.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to upload data to
  remote storage. The default value is `4 * cpu_count()`. Note that the default
  value can be set using the `jobs` config option with `dvc remote modify`.
  Using more jobs may improve the overall transfer speed.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

[stage runs]: /doc/user-guide/project-structure/internal-files#run-cache

## Examples

<admon type="info">

This example is based on [our Get Started], where you can find the actual source
code.

[our get started]: /doc/start/experiments

</admon>

Let's say we have cloned a DVC repository, and would like to fetch an experiment
that someone else shared (see also `dvc exp list`).

```cli
$ dvc exp list --all-commits origin
main:
    lurid-air
$ dvc exp pull origin
Pulled experiment 'lurid-lair' from Git remote 'origin'.
```

We can now see that the experiment exists in the local repo:

```cli
$ dvc exp list --all-commits
main:
    5cdc6a9 [lurid-air]
```
