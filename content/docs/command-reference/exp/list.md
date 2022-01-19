# exp list

List experiments in a <abbr>DVC repository</abbr> (remote or local).

## Synopsis

```usage
usage: dvc exp list [-h] [-q | -v] [--rev <rev>]
                    [--all] [--names-only]
                    [git_remote]

positional arguments:
  git_remote    Optional Git remote name or Git URL
```

## Description

Prints a list of experiments found in the current repository, and the branch/tag
or commit they're based on. This is similar to `dvc exp show --no-pager`, but
limited to experiment names and with very simple formatting. See also
`dvc exp run`.

If a working `git_remote` name (e.g. `origin`) or Git URL is provided, lists
experiments in that <abbr>repository</abbr> instead (if any).

> Note that this utility doesn't require an existing <abbr>DVC project</abbr> to
> run from when a `git_remote` URL is given.

Only experiments derived from the `HEAD` commit are listed by default (see the
options below).

> Note that [checkpoints](/doc/command-reference/exp/run#checkpoints) are not
> listed, only the parent experiment.

## Options

- `--rev <commit>` - list experiments derived from the specified Git commit
  (instead of `HEAD`).

- `--all` - list all experiments in the repository (overrides `--rev`).

- `--names-only` - print only the names of the experiments without their parent
  Git commit.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

> This example is based on our [Get Started](/doc/start/experiments), where you
> can find the actual source code.

Let's say we have run 3 experiments in our project. You can quickly list the
available experiments with this command:

```dvc
$ dvc exp list --all
10-bigrams-experiment:
        exp-e6c97
        exp-1dad0
        exp-1df77
```

> Contrast this with the full table
> [displayed by `dvc exp show`](/doc/command-reference/exp/show#examples).

You can also list experiments in any DVC repo with `dvc exp list`:

```dvc
$ dvc exp list --all git@github.com:iterative/example-get-started.git
10-bigrams-experiment:
        exp-e6c97
        exp-86dd6
```

We can see that two experiments are available in
([the DVC repo](https://github.com/iterative/example-get-started)).

If we're currently in a local clone of the repo, we can also use
[Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes)
name instead:

```dvc
$ git remote -v
origin  git@github.com:iterative/example-get-started.git
$ dvc exp list --all origin
10-bigrams-experiment:
        exp-e6c97
        exp-86dd6
```

And in this context, `dvc exp pull` can download the experiments if needed, as
`dvc exp push` can upload any local ones we wish to share.
