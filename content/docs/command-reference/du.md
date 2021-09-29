# du

List disk usage of project contents, including files, models, and directories tracked by DVC
and by Git.

> Useful to check if there is enough space on your local disk before doing a `dvc pull`.

## Synopsis

```usage
usage: dvc du [-h] [-q | -v] [-R] [-s] [-H]
                [--dvc-only] [--show-json] [--rev [<commit>]]
                url [path]

positional arguments:
  url            Location of DVC or Git repository to list from
  path           Path to a file or directory in the repository
```

## Description

Produces a view of a <abbr>DVC repository</abbr> (usually online), listing the
contents of a repository alongside the disk usage of the objects.

This command's output is equivalent to [listing](/doc/command-reference/list)
the repo but includs also the size the object use on disk.

This is usefull to check if there is enough space on your locak disk before
[pulling](/doc/command-reference/pull) a repository.

Only the total disk usage is displayed when you set the `-s` option.


## Options

- `-R`, `--recursive` - recursively prints contents of all subdirectories.

- `-s`, `--summarize` - displays only a total disk usage.

- `-H`, `--human-readable` - displays disk usage in human readable form.

- `--dvc-only` - show only DVC-tracked files and directories
  (<abbr>outputs</abbr>).

- `--rev <commit>` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to list
  content for. The latest commit in `master` (tip of the default branch) is used
  by default when this option is not specified.
- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information. when this option is
  not specified.
