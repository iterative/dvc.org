# pkg uninstall

Uninstall DVC package(s).

## Synopsis

```usage
usage: dvc pkg uninstall [-h] [-q | -v] [targets [targets ...]]

positional arguments:
  targets        Package name.
```

## Description

Provided package directory name(s) (`targets`) will be searched for in the
`.dvc/pkg/` directory and completely removed if found.

> Note that this command does NOT remove the package records from the DVC config
> file. See `dvc pkg remove` for that purpose.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Having installed the `example-get-started` package from the example in
`dvc pkg install`:

```dvc
$ ls -l .dvc/pkg/
example-get-started
$ dvc pkg uninstall example-get-started
```

Results in the `.dvc/pkg/example-get-started/` directory being completely
removed.
