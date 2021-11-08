# Listing Local and Remote Experiments

Experiments run with `dvc exp run` are stored locally, and they can be pushed to
Git remotes by `dvc exp push`. You can list both the local and remote
experiments with `dvc exp list`.

## List experiments in the project

You can get a list of existing experiments in the <abbr>repository</abbr> with
`dvc exp list`. Without any options, this command lists the experiments based on
the latest commit of the current branch (Git `HEAD`).

```dvc
$ dvc exp list
refs/tags/baseline-experiment:
        cnn-64
        cnn-128
```

If you want to list all the experiments in the repo regardless of their parent
commit, use the `--all` flag.

```dvc
$ dvc exp list --all
refs/tags/baseline-experiment:
        cnn-64
        cnn-128
main:
        exp-93150
```

## List experiments saved remotely

Experiments can be [shared] (with `dvc exp push`) from another location. To
review experiments uploaded to a remote <abbr>repository</abbr> (which you may
not have locally), provide a Git remote name to `dvc exp list`.

```dvc
$ dvc exp list origin
refs/tags/baseline-experiment:
        cnn-32
        cnn-64
```

This command lists remote experiments originated from `HEAD`. You can add any
other options to the remote command, including `--all` (see previous section).

[shared]: /doc/user-guide/experiment-management/sharing-experiments

## List experiment names to use in scripts

`dvc exp list` may be printing too much information when it comes to feed its
output to other commands. You can get only the names of the experiments via the
`--names-only` flag. For example, to get all the experiment names from a remote
(`origin`):

```dvc
$ for experiment in $(dvc exp list origin --names-only --all) ; do
  dvc exp pull "${experiment}"
done
```

## List experiments from a specific project version

The `--rev` option allows to specify a Git commit, tag or branch name to list
the experiments that are based on it. For example:

```dvc
# from a commit:
$ dvc exp list origin --rev 23ceb4a
23ceb4a:
        cnn-32
        cnn-96

# from a tag:
$ dvc exp list origin --rev baseline-experiment
refs/tags/baseline-experiment:
        cnn-64
        cnn-128

# from a fully specified Git reference:
$ dvc exp list origin --rev refs/tags/baseline-experiment
refs/tags/baseline-experiment:
        cnn-64
        cnn-128
```
