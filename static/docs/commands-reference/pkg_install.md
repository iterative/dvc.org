# pkg install

Install DVC package(s).

See also [uninstall](/doc/commands-reference/pkg-uninstall),
[add](/doc/commands-reference/pkg-add),
[remove](/doc/commands-reference/pkg-remove),
[modify](/doc/commands-reference/pkg-modify),
[list](/doc/commands-reference/pkg-list), and
[import](/doc/commands-reference/pkg-import).

## Synopsis

```usage
usage: dvc pkg install [-h] [-q | -v] [targets [targets ...]]

positional arguments:
  targets        Package name.
```

## Description

Any DVC project can be used as a DVC package in order to reuse its code, stages,
and related data artifacts in the current project workspace.

When installing a package, the provided name(s) (`targets`) can be previously
registered with `dvc pkg add`. Each name will be created as a subdirectory of
`.dvc/pkg/`, where the corresponding package source files (code and DVC-files)
will be placed. (`.dvc/pkg/` will be added to the `.dvc/.gitignore` file if
needed.)

The provided `targets` may also be URLs to the location of the DVC packages
(same as `url` in `dvc pkg add`), in that case, the implicit package name will
be extracted from the given address and used for the subdirectory of `.dvc/pkg/`
as explained in the previous paragraph.

> Note that installing packages with implicit names does NOT add them to the
> config file.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples: With an implicit package name

Having a DVC project in https://github.com/iterative/example-get-started

```dvc
$ dvc pkg install https://github.com/iterative/example-get-started
...
```

The result is the `example-get-started` package fully installed in the
`.dvc/pkg/` directory.

```dvc
$ tree .dvc/pkg
.dvc/pkg
└── example-get-started
    ├── README.md
    ├── auc.metric
    ├── data
    │   └── data.xml.dvc
    ├── evaluate.dvc
    ├── featurize.dvc
    ├── prepare.dvc
    ├── requirements.txt
    ├── src
    │   ├── evaluate.py
    │   ├── featurization.py
    │   ├── prepare.py
    │   └── train.py
    └── train.dvc
```

## Examples: Having added the package first

Having the same DVC project in https://github.com/iterative/example-get-started
as in the previous example:

```dvc
$ dvc pkg add https://github.com/iterative/example-get-started
$ dvc pkg install example-get-started
...
```

Same result as the previous example, except that additionally, the DVC config
file (typically `.dvc/config` will contain a `['pkg "example-get-started"']`
section due to the `dvc pkg add` command above.
