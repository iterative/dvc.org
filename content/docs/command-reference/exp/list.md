# exp list

List `dvc experiments` in a <abbr>DVC repository</abbr> (remote or local).

## Synopsis

```usage
usage: dvc experiments list [-h] [-q | -v] [--rev <rev>] [--all]
                            [git_remote]

positional arguments:
  git_remote    Optional Git remote name or repo URL
```

## Description

Prints a list of experiments found in the current repository, and the branch/tag
or commit they're based on. This is similar to `dvc exp show --no-pager`, but
limited to experiment names and with very simple formatting. See also
`dvc exp run`.

If a working `git_remote` name (e.g. `origin`) or valid Git repo's URL is
provided, lists experiments in that <abbr>repository</abbr> instead (if any).

> Note that this utility doesn't require an existing <abbr>DVC project</abbr> to
> run from when a `git_remote` URL is given.

Only experiments derived from the `HEAD` commit are listed by default (see the
options below).

## Options

- `--rev <commit>` - list experiments derived from the specified Git commit
  (instead of `HEAD`).

- `--all` - list all experiments in the repository (overrides `--rev`).

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
