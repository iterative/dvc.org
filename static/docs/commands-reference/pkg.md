# pkg

A set of commands to to manage DVC packages:
[install](/doc/commands-reference/pkg-install),
[uninstall](/doc/commands-reference/pkg-uninstall),
[add](/doc/commands-reference/pkg-add),
[remove](/doc/commands-reference/pkg-remove),
[modify](/doc/commands-reference/pkg-modify),
[list](/doc/commands-reference/pkg-list),
[import](/doc/commands-reference/pkg-import)

## Synopsis

```usage
usage: dvc pkg [-h | -q | -v]
               {install,uninstall,add,remove,modify,list,import} ...

positional arguments:
  {install,uninstall,add,remove,modify,list,import}
                        Use dvc pkg CMD --help for command-specific help.
    install             Install package(s).
    uninstall           Uninstall package(s).
    add                 Add package.
    remove              Remove package.
    modify              Modify package.
    list                List packages.
    import              Import data from package.
```

## Description

Manage DVC packages. See `dvc pkg install`.

Any DVC project can be used as a DVC package in order to reuse its data
artifacts in the current project workspace.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
