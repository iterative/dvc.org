# exp pull

Pull an experiment from a Git remote into the local repository.

## Synopsis

```usage
usage: dvc experiments pull [-h] [-q | -v]
                            [-f] [--no-cache] [-r <name>]
                            [-j <number>] [--run-cache]
                            <git_remote> <experiment>

positional arguments:
  <git_remote>          Git remote name or Git URL.
  <experiment>          Experiment to pull.

optional arguments:
  -f, --force           Replace local experiment if it already exists.
  --no-cache            Do not pull cached outputs for this experiment to DVC
                        remote storage.
  -r <name>, --remote <name>
                        Name of the DVC remote to use when pulling cached
                        outputs.
  -j <number>, --jobs <number>
                        Number of jobs to run simultaneously when pulling from
                        DVC remote storage.
  --run-cache           Pull run history for all stages.
```

## Description

This command can be used to pull an experiment from a remote Git repository into
the local repository. `dvc exp pull` is analogous to `git fetch` or `git pull`
for experiments.

By default, any DVC cache files associated with the experiment will also be
pulled from DVC remote storage. `--no-cache` can be used to disable this
behavior. The `-r`, `-j`, and `--run-cache` options can be used to control this
behavior, just like in `dvc pull`.

## Options

- `<git_remote>` - remote Git repository to pull from. `git_remote` can either
  be a Git remote name (i.e. `origin`) or a full Git repository URL (i.e.
  `https://github.com/iterative/example-get-started.git`).

- `<experiment>` - name of the experiment to pull.

- `-f`, `--force` - replace local experiment if it already exists. This option
  is equivalent to `git fetch --force`. By default, if the experiment already
  exists in the local repository, the pull operation will only complete if the
  local experiment can be fast-forwarded.

- `--no-cache` - do not pull DVC cache files associated with this experiment
  from DVC remote storage.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to pull DVC cache files from
  (see `dvc remote list`). If this option is not provided, the default DVC
  remote will be used.

- `--run-cache` - downloads all available history of stage runs from the remote
  repository (to the cache only, like `dvc fetch --run-cache`).

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

## Example: Pulling an experiment

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have cloned a remote Git repository, and would now like to fetch an
experiment that someone else has already pushed to that remote Git repository.

```dvc
$ dvc exp list --all origin
master:
        exp-e6c97
```

To pull the specified experiment:

```dvc
$ dvc exp pull origin exp-e6c97
Pulled experiment 'exp-e6c97' from Git remote 'origin'.
```

Finally, we can now see that the pulled experiment exists in the local
repository:

```dvc
$ dvc exp list --all
master:
        exp-e6c97
```
