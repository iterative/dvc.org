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
and `b_ref`, this command shows a standard textual comparisson (or "diff") of
all the files under DVC control among both refs. This is similar to how `git
diff` works.

If the `-t` option is used, the diff is limited to the `TARGET` file or
directory specified.

The output also includes a summary of basic statistics: how many files were
deleted/changed.

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
