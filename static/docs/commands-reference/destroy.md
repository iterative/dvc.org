# destroy

Remove [DVC-files](/doc/user-guide/dvc-file-format) from your repository.

It removes DVC-files, and the entire `.dvc/` meta directory from the workspace.
Note that the DVC cache will normally be removed as well, unless it's set to an
external location with `dvc cache dir`. (By default a local cache is located in
the `.dvc/cache` directory.)

```usage
usage: dvc destroy [-h] [-q] [-v] [-f]

optional arguments:
  -f, --force    Force destruction
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

```dvc
$ dvc init
$ echo foo > foo
$ dvc add foo
$ ls -a

.dvc .git code.py foo foo.dvc

$ dvc destroy

This will destroy all information about your pipelines as well as cache in .dvc/cache.
Are you sure you want to continue?
yes

$ ls -a

.git code.py
```
