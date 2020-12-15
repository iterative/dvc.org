# exp push

Push a local experiment to a Git remote.

## Synopsis

```usage
usage: dvc experiments push [-h] [-q | -v]
                            [-f] [--no-cache] [-r <name>]
                            [-j <number>] [--run-cache]
                            <git_remote> <experiment>

positional arguments:
  <git_remote>          Git remote name or Git URL.
  <experiment>          Experiment to push.

optional arguments:
  -f, --force           Replace experiment in the Git remote if it already exists.
  --no-cache            Do not push cached outputs for this experiment to DVC remote storage.
  -r <name>, --remote <name>
                        Name of the DVC remote to use when pushing cached outputs.
  -j <number>, --jobs <number>
                        Number of jobs to run simultaneously when pushing to DVC remote storage.
  --run-cache           Push run history for all stages.
```

## Description

This command can be used to push a local experiment to a remote Git repository.
`dvc exp push` is analogous to `git push` for experiments.

By default, any DVC cache files associated with the experiment will also be
pushed to a DVC remote. `--no-cache` can be used to disable this behavior. The
`-r`, `-j`, and `--run-cache` options can be used to control this behavior, just
like in `dvc push`.

## Options

- `<git_remote>` - remote Git repository to push to. `git_remote` can either be
  a Git remote name (i.e. `origin`) or a full Git repository URL (i.e.
  `https://github.com/iterative/example-get-started.git`).

- `<experiment>` - name of the experiment to push.

- `-f`, `--force` - replace experiment in the Git remote if it already exists.
  This option is equivalent to `git push --force`. By default, if the experiment
  already exists in the Git remote, the push operation will only complete if the
  remote experiment can be fast-forwarded.

- `--no-cache` - do not push DVC cache files associated with this experiment to
  a DVC remote.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to push DVC cache files to
  (see `dvc remote list`). If this option is not provided, the default DVC
  remote will be used.

- `--run-cache` - uploads all available history of stage runs to the remote
  repository.

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

## Example: Pushing an experiment

> This example is based on our
> [Get Started](/doc/tutorials/get-started/experiments), where you can find the
> actual source code.

Let's say we have run 3 experiments in our project workspace:

```dvc
$ dvc exp list --all
11-bigrams-experiment:
        exp-e6c97
        exp-1dad0
        exp-1df77
```

We would now like to push one of these experiments into a remote Git repository:

```dvc
$ dvc exp push origin exp-e6c97
Pushed experiment 'exp-e6c97' to Git remote 'origin'.
```

Finally, we can now see that the pushed experiment exists in the remote Git
repository:

```dvc
$ dvc exp list --all origin
master:
        exp-e6c97
```
