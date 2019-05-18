# destroy

Remove DVC files from your repository.

It removes `.dvc` and `Dvcfile` files, `.dvc/` directory. It means cache will be
removed as well by default, if it's not set to an external location (by default
local cache is located in the `.dvc/cache` directory).

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
