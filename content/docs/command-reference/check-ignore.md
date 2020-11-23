# check-ignore

Check whether any given files or directories are excluded from DVC due to the
patterns found in [`.dvcignore`](/doc/user-guide/dvcignore).

## Synopsis

```usage
usage: dvc check-ignore [-h] [-q | -v] [-d] [-a] [-n] [--stdin]
                        targets [targets ...]

positional arguments:
  targets        File or directory paths to check
```

## Description

This helper command checks whether the given `targets` are ignored by DVC
according to the [`.dvcignore` file](/doc/user-guide/dvcignore) (if any). The
ones that are ignored indeed are printed back.

## Options

- `-d`, `--details` - show the exclude patterns along with each target path. A
  series of lines are printed in this format:
  `<path/to/.dvcignore>:<line_num>:<pattern> <target_path>`

- `-a`, `--all` - include all the patterns that match each target path in the
  `--details` list. Has no effect without `--details`.

- `-n`, `--non-matching` - include the target paths which don’t match any
  pattern in the `--details` list. All fields in each line, except for
  `<target_path>`, will be empty. Has no effect without `--details`.

- `--stdin` - read target paths from standard input instead of using the
  `targets` arguments. Useful for interactive debugging and POSIX pipes.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

First, let's create a `.dvcignore` file with some patterns in it, and some files
to check against it:

```dvc
$ echo "file*\n\!file2" >> .dvcignore
$ cat .dvcignore
file*
!file2

$ touch file1 file2 other
$ ls
file1  file2 other
```

Then, let's use `dvc check-ignore` to see which of these files would be excluded
given our `.dvcignore` file:

```dvc
$ dvc check-ignore file1
file1

$ dvc check-ignore file1 file2
file1
file2

$ dvc check-ignore other
  # There's no command output, meaning `other` is not excluded.

$ dvc check-ignore file*
file1
file2
```

With `--details` (`-d`), we get a detailed report of all the matches:

```dvc
$ dvc check-ignore -d file1 file2
.dvcignore:1:file*	file1
.dvcignore:2:!file2	file2

$ dvc check-ignore -d file*
.dvcignore:1:file*	file1
.dvcignore:2:!file2	file2
```

By default, only the last pattern matched would be shown. To see all the
patterns matched, use `--all` (`-a`).

```dvc
$ dvc check-ignore -d -a file2
.dvcignore:1:file*	file2
.dvcignore:2:!file2	file2
```

With the `--non-matching` (`-n`) option, non-matching `targets` will also be
included in the details list:

```dvc
$ dvc check-ignore -d -n other
::	other
```

## Example: Check paths interactively or programmatically

The `--stdin` option provides an interactive way to debug `.dvcignore` patterns:

```dvc
$ dvc check-ignore --stdin
> file1
file1
> other
> file2
file2
```

It can also be used as part of a POSIX pipe:

```dvc
cat file_list | dvc check-ignore --stdin
```
