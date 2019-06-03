# pkg install

Install a DVC package. The command can be run only from a DVC project root.

## Synopsis

```usage
usage: dvc pkg install [-h] [--global] [--system] [--local] [-q | -v]
                       [-s OUT] [-f FILE]
                       [address] [target]

positional arguments:
  address       Package address: git://<url> or https://github.com/...
  target        Target directory to deploy package outputs. Default
                value is the current dir.
```

## Description

Any external DVC project stored in a Git repository at `address` can be
installed as a package in the current workspace. If no `target` directory is
specified, the repo name will be extracted from the `address` path and created
as a sub-directory of `dvc_mod/`.

All the outputs of the package will be fetched into the local cache as well as
added to the workspace for further use. The `.gitignore` file will be updated to
include the `dvc_mod/` directory as well as all the aforementioned package
outputs.

A DVC-file specifying all the outputs of the package will also be added to the
pipeline. Adding the `.gitignore` changes as well as the DVC-file to Git is
recommended at this point.

## Options

- `-s OUT`, `--select OUT` - Select and persist only specified outputs from a
  package. The parameter can be used multiple times. All outputs will be
  selected by default.

- `-f FILE`, `--file FILE` - Specify name of the stage file. It should be either
  'Dvcfile' or have a '.dvc' suffix (e.g. 'prepare.dvc', 'clean.dvc', etc). By
  default the file has 'mod\_' prefix and imported package name followed by .dvc

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples: ...

Having: DVC package in https://github.com/dmpetrov/tag_classifier

```dvc
$ dvc pkg install https://github.com/dmpetrov/tag_classifier
```

Result: `tag_classifier` package in `dvc_mod/` directory
