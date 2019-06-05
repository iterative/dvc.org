# pkg import

Import a data artifact from a DVC package.

See also [uninstall](/doc/commands-reference/pkg-uninstall),
[add](/doc/commands-reference/pkg-add),
[remove](/doc/commands-reference/pkg-remove),
[modify](/doc/commands-reference/pkg-modify),
[list](/doc/commands-reference/pkg-list), and
[import](/doc/commands-reference/pkg-import).

## Synopsis

```usage
usage: dvc pkg import [-h] [-q | -v] pkg_name pkg_path [out]

positional arguments:
  pkg_name       Package name.
  pkg_path       Path to data in the package.
  out            Destination path to put data to.
```

## Description

Any DVC project can be used as a DVC package in order to reuse its code, stages,
and related data artifacts in the current project workspace.

When importing data from a package, the provided name (`pkg_name`) can be
previously registered with `dvc pkg add`. The first thing that this command does
is to install the package in `.dvc/pkg/{pkg_name}`. (See `dvc pkg install` for
more details.)

The provided name (`pkg_name`) may also be the URL to the location of the DVC
package (same as `url` in `dvc pkg add`), in that case, the implicit package
name will be extracted from the given address and used for the package
installation.

> Note that like with installing, importing data from a package with implicit
> names does NOT add the package to the config file.

`pkg_path` is the path to the data artifact in the package after its `url` root
`/`, such as `scripts/innosetup/dvc.ico` (see [example](#example) below). A data
artifact is any one output defined in a DVC-file in the package. Note that since
these data artifacts are controlled by DVC and not by the SCM system (e.g. Git),
they can't be found by browsing the code repository. This command has to read
the package configuration to connect to a remote of that project in order to
fetch the data file to the local cache, and "check it out" (see `dvc checkout`)
it to the current project's workspace.

Data artifacts are placed in the current working directory with the same file
name as the original output from the package. To use custom path and file name
instead, and optional `out` argument can be used with this command.

Finally, the data import process creates a DVC-file in the same location as the
imported data, specifying the package dependency for the imported data similar
as to having added the imported data with `dvc add`. This way `dvc repro` will
be able to reproduce the import operation as a regular stage in this project's
pipeline.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

# Example

```dvc
$ mkdir import && cd import
$ dvc pkg import https://github.com/iterative/dvc scripts/innosetup/dvc.ico
Preparing to collect status from https://dvc.org/s3/dvc
...
```

Will find the `dvc.ico` file in the output of a stage file in the
https://github.com/iterative/dvc package and import it into the current working
dir (`import/`).

```dvc
$ ls
dvc.ico     dvc.ico.dvc
```

The `dvc.ico.dvc` file contents should look something like:

```ini
md5: 7aac042f559753a470723d44b2384a61
wdir: .
deps:
- md5: 90104d9e83cfb825cf45507e90aadd27
  path: scripts/innosetup/dvc.ico
  pkg:
    name: dvc
    url: https://github.com/iterative/dvc
outs:
- md5: 90104d9e83cfb825cf45507e90aadd27
  path: dvc.ico
  cache: true
  metric: false
  persist: false
```
