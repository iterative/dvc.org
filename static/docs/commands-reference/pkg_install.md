# pkg install

Install DVC package(s).

## Synopsis

```usage
usage: dvc pkg install [-h] [--global] [--system] [--local] [-q | -v]
                       [targets [targets ...]]

positional arguments:
  targets        Package name.
```

## Description

Any external DVC project stored in a Git repository can be installed as a
package in the current workspace. The package name (`target`) will be created as
a sub-directory of `dvc_mod/`.

All the outputs of the package will be fetched into the local cache as well as
added to the workspace for further use. The `.gitignore` file will be updated to
include the `dvc_mod/` directory as well as all the aforementioned package
outputs.

A DVC-file specifying all the outputs of the package will also be added to the
pipeline. Adding the `.gitignore` changes as well as the DVC-file to Git is
recommended at this point.

## Options

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local config file instead of `.dvc/config`. It is located
  in `.dvc/config.local` and is Git-ignored. This is useful when you need to
  specify private config options in your config, that you don't want to track
  and share through Git.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Having: DVC package in https://github.com/dmpetrov/tag_classifier

```dvc
$ dvc pkg install https://github.com/dmpetrov/tag_classifier
```

Result: `tag_classifier` package in `dvc_mod/` directory
