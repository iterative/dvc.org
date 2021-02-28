# exp pull

Download a single [experiment](/doc/command-reference/exp) to a Git remote, and
its data to a `dvc remote`.

## Synopsis

```usage
usage: dvc experiments pull [-h] [-q | -v] [-f] [--no-cache]
                            [-r <name>] [-j <number>] [--run-cache]
                            git_remote experiment

positional arguments:
  git_remote          Git remote name or repo URL
  experiment          Experiment to pull
```

## Description

The `dvc exp push` and `dvc exp pull` commands are the means for sharing
experiments across <abbr>repository</abbr> copies via Git (and DVC) remotes.

> Plain `git push` and `git pull` don't work with `dvc experiments` because
> these are saved under custom Git references. See **How does DVC track
> experiments?** in `dvc exp run` to learn more about DVC experiment storage.

A working `git_remote` name (e.g. `origin`) or valid Git repo's URL is required,
as well as a single `experiment` name or hash (see `dvc exp run`) to pull.

By default, this command will also try to [pull](/doc/command-reference/pull)
all <abbr>cached</abbr> data associated with the experiment to DVC
[remote storage](/doc/command-reference/remote), unless `--no-cache` is used.
The default remote is used (see `dvc remote default`) unless a specific one is
given with `--remote`.

> 💡 Note that `git push <git_remote> --delete <experiment>` can be used to
> delete a pushed experiment.

## Options

- `-f`, `--force` - rewrite the `experiment` commit if it already exists in the
  local repo. Equivalent to `git push --force` (rewrites history)

- `--no-cache` - do not pull cached files files associated with this experiment
  from DVC remote storage.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to pull cached files
  to.

- `--run-cache` - downloads all available history of stage runs to the
  `dvc remote` (to the cache only, like `dvc fetch --run-cache`).

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to upload data to
  remote storage. The default value is `4 * cpu_count()`. For SSH remotes, the
  default is `4`. Note that the default value can be set using the `jobs` config
  option with `dvc remote modify`. Using more jobs may improve the overall
  transfer speed.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
