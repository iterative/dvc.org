# diff

Show diff of a data file or a directory that is under DVC control. Some basic
statistics summary, how many files were deleted/changed.

## Synopsis

```usage
  usage: dvc diff [-h] [-q | -v] [-t TARGET] a_ref [b_ref]

  positional arguments:
    a_ref                 Git reference from which diff calculates
    b_ref                 Git reference till which diff calculates, if omitted
                          diff shows the difference between current HEAD and
                          a_ref
```

## Description

...

## Options

* `-t TARGET`, `--target TARGET` - Source path to a data file or directory.
  Default None,If not specified, compares all files and directories that are
  under DVC control in the current working space.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## Examples: A

...

## Examples: B

...
