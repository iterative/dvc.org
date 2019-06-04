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

Any DVC project can be used as a DVC package in order to reuse its code, stages,
and related data artifacts in the current project workspace.

When installing a package, the provided name(s) (`targets`) can be previously
registered with `dvc pkg add`. Each name will be created as a subdirectory of
`.dvc/pkg/`, where the corresponding package source files (code and stage files)
will be placed. (`.dvc/pkg/` will be added to the `.dvc/.gitignore` file if
needed.) All the outputs in the package pipelines will be also downloaded from
the default remotes into the locally installed package directory.

The provided `targets` may also be URLs to the HTTP location of the DVC
packages, in that case, the implicit package name will be extracted from the
given HTTP address and used for the subdirectory of `.dvc/pkg/` as explained in
the previous paragraph.

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
