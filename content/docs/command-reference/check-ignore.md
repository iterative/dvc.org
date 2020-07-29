# check-ignore

Check whether any given files or directories are excluded from DVC
due to the patterns found in [`.dvcignore`](/doc/user-guide/dvcignore).

## Synopsis

```usage
usage: usage: dvc check-ignore [-h] [-q | -v] [-d] [-n]
                               targets [targets ...]

positional arguments:
  targets        Input files/directories to check ignore patterns.
```

## Description

For each pathname given via the command-line , check whether the file is excluded 
by `.dvcignore` output the path if it is excluded.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

- `-d`, `--details` - show the exclude pattern together with each target path.

- `-n`, `--non-matching` - show the target paths which don’t match any pattern.
  Only usable when `--details` is also employed

## Examples

First, let's create a `.dvcignore` file with some patterns in it, and some files
to check against it.

```dvc
$ echo "file*\n\!file2" >> .dvcignore
$ cat .dvcignore
file*
!file2
$ touch file1 file2 other
$ ls
file1  file2 other
```

Then, let's check if these files would be excluded given our `.dvcignore` file:

```dvc
$ dvc check-ignore file1
file1
$ dvc check-ignore file2
file2
$ dvc check-ignore other
$ dvc check-ignore file*
file1
file2 
```

If `--details` is specified, the output is a series of lines of the form:
`<source> <COLON> <linenum> <COLON> <pattern> <HT> <pathname>`

```dvc
$ dvc check-ignore -d file1
.dvcignore:1:file*	file1
$ dvc check-ignore -d file2
.dvcignore:2:!file2	file2
$ dvc check-ignore -d other
$ dvc check-ignore -d file*
.dvcignore:1:file*	file1
.dvcignore:2:!file2	file2
```

If `--non-matching` is specified, non-matching pathnames will also be 
output, in which case all fields in each output record except for 
<pathname> will be empty

```dvc
$ dvc check-ignore -d -n other
::	other
```
