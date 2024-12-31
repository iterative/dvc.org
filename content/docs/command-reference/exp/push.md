# exp push

Upload [experiments](/doc/command-reference/exp) to a Git remote, and their data
to [remote storage].

[remote storage]: /doc/user-guide/data-management/remote-storage

## Synopsis

```usage
usage: dvc exp push [-h] [-q | -v] [-A] [--rev <commit>] [-n <num>] [-f]
                    [--no-cache] [-r <name>] [-j <number>]
                    [--run-cache | --no-run-cache]
                    git_remote [experiment ...]

positional arguments:
  git_remote          Git remote name or Git URL
  experiment          Experiment to push
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
derived from the `HEAD` commit are pushed by default (see the options below).

The first action of `dvc exp push` is to upload the `experiments` to the Git
remote so they can be pulled later from other repo clones (equivalent to
`git push <git_remote> refs/exps/<experiment>`). Use `dvc exp list <git_remote>`
to see experiments in the remote.

This command will also try to `dvc push` all <abbr>cached</abbr> data associated
with the experiments to [remote storage], unless `--no-cache` is used.

If the [DVC Studio](https://studio.datachain.ai)
[access token](/doc/studio/user-guide/experiments/live-metrics-and-plots#set-up-an-access-token)
is set, DVC will notify DVC Studio about new experiments, and display a DVC
Studio project URL to view experiments.

## Options

- `-A`, `--all-commits` - push all experiments in the repository (overrides
  `--rev` and `--num`).

- `--rev <commit>` - push experiments derived from the specified `<commit>` as
  baseline (HEAD by default).

- `-n <num>`, `--num <num>` - push experiments from the last `num` commits
  (first parents) starting from the `--rev` baseline. Give a negative value to
  include all first-parent commits (similar to `git log -n`).

- `-f`, `--force` - rewrite the experiment if it already exists in the Git
  remote.

- `--no-cache` - do not push cached files associated with this experiment to a
  DVC remote.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to push cached files
  to.

- `--run-cache`, `--no-run-cache` - whether to upload all available history of
  [stage runs] to the `dvc remote`. Default is `--no-run-cache`.

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

Let's say we have run 3 experiments in our project:

```cli
$ dvc exp list --all-commits
11-bigrams-experiment:
    1d4c01d [conic-ease]
    a80bca5 [lucid-lair]
    9380a12 [major-mela]
```

We would now like to share them with others via the Git remote:

```cli
$ dvc exp push origin
Pushed experiment conic-ease, lucid-lair, and major-mela to Git remote 'origin'.
```

We can now see that the experiment exists in the remote repo:

```cli
$ dvc exp list --all origin
master:
    conic-ease
    lucid-lair
    major-mela
```
