# diff

Show changes between files or directories that are under DVC control.

## Synopsis

```usage
  usage: dvc diff [-h] [-q | -v] [-t TARGET] a_ref [b_ref]

  positional arguments:
    a_ref                 Git reference from which diff calculates
    b_ref                 Git reference until which diff calculates,
                          if omitted diff shows the difference
                          between current HEAD and a_ref
```

## Description

Given two Git commit references (commit hash, branch or tag name, etc) `a_ref`
and `b_ref`, this command shows a a summary of basic statistics: how many files were
deleted/changed. Note, this does not work like `git diff` works.

If the `-t` option is used, the diff is limited to the `TARGET` file or
directory specified.

`dvc diff` doesn't have an effect when the repository is not tracked by the Git
SCM, for example when `dvc init` was used with the `--no-scm` option

## Options

* `-t TARGET`, `--target TARGET` - Source path to a data file or directory.
  Default None. If not specified, compares all files and directories that are
  under DVC control in the current working space.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## Examples: Previous version of the same branch

For the setup of our examples we can use the steps in our [Get
Started](/doc/get-started) guide. Lets assume you've followed them up to the
[Add Files](https://dvc.org/doc/get-started/add-files) section (or checked out
the corresponding commit in your Git repo).

> TODO: Use https://github.com/iterative/example-get-started and `git checkout`?

The minimal `dvc diff` command only includes the A reference (`a_ref`) from
which the difference is to be calculated. The B reference (`b_ref`) defaults to
Git `HEAD` (the currently checked out version). To find the general differences
with the very previous committed version of the project, we can use the `HEAD^`
Git reference.

```dvc
    $ dvc diff HEAD^
    dvc diff from 6a819f8fa053f124f6a5487efc824a8c17366c71 to 612f6caf5c5daeb172167db285efd8b169d41b60

    diff for 'data/data.xml'
    +data/data.xml with md5 a304afb96060aad90176268345e10355

    added file with size 37.9 MB
```

## Examples: Specific target accross branches

> WIP
