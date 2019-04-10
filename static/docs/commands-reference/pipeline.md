# pipeline

Utilities to manage pipelines. [Show](#show) - visualize or [list](#list) - list
existing pipelines.

```usage
    usage: dvc pipeline [-h] [-q | -v] {show,list} ...

    Manage pipeline.

    positional arguments:
      {show,list}    Use dvc pipeline CMD --help for command-specific help.
        show         Show pipeline.
        list         List pipelines.
```

## Options

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

# show

Show stages in a pipeline that lead to the specified stage. By default it lists
stage files (usually `.dvc` files). There are `-c` or `-o` options to list or
visualize a pipeline commands or data files flow instead.

```usage
    usage: dvc pipeline show [-h] [-q] [-v] [-c] [--dot DOT] targets [targets ...]

    positional arguments:
      targets         DVC files.

    optional arguments:
      -c, --commands  Print commands instead of paths to DVC files.
      -o, --outs      Print output files instead of paths to DVC files.
      --ascii         Output DAG as ASCII.
      --dot DOT       Write DAG in .dot format.
      --tree          Output DAG as Dependencies Tree.
```

## Options

* `-c`, `--commands` - show pipeline as a list (graph, if `--ascii` or `--dot`
option is specified) of commands instead of paths to DVC files.

* `-o`, `--outs` - show pipeline as a list (graph, if `--ascii` or `--dot`
option is specified) of stage output files instead of paths to DVC files.

* `--ascii` - visualize pipeline. It will print a graph (ASCII) instead of a
list of path to DVC files.

* `--dot` - produce a `.dot` files with a DVC pipeline graph. It can be passed
to third party visualization utilities.

* `--tree` - list dependencies tree like recursive directory listing.

## Examples

* Default mode, show stages `output.dvc` recursively depends on:

```dvc
    $ dvc pipeline show output.dvc

    raw.dvc
    data.dvc
    output.dvc
```

* The same as previous, but show commands instead of DVC files:

```dvc
    $ dvc pipeline show output.dvc --commands

    download.py s3://mybucket/myrawdata raw
    cleanup.py raw data
    process.py data output
```

* Visualize DVC pipeline:

```dvc
    $ dvc pipeline show eval.txt.dvc --ascii
              .------------------------.
              | data/Posts.xml.zip.dvc |
              `------------------------'
                           *
                           *
                           *
                   .---------------.
                   | Posts.xml.dvc |
                   `---------------'
                           *
                           *
                           *
                   .---------------.
                   | Posts.tsv.dvc |
                   `---------------'
                           *
                           *
                           *
                .---------------------.
                | Posts-train.tsv.dvc |
                `---------------------'
                           *
                           *
                           *
                .--------------------.
                | matrix-train.p.dvc |
                `--------------------'
                  ***             ***
                **                   ***
              **                        **
    .-------------.                       **
    | model.p.dvc |                     **
    `-------------'                  ***
                  ***             ***
                     **         **
                       **     **
                   .--------------.
                   | eval.txt.dvc |
                   `--------------'
```

* List dependencies recursively if graph have tree structure

```dvc
    dvc pipeline show e.file.dvc --tree
    e.file.dvc
    ├── c.file.dvc
    │   └── b.file.dvc
    │       └── a.file.dvc
    └── d.file.dvc
```

# list

Show connected groups (pipelines) of DVC stages (files) that are independent of
each other.

```usage
    usage: dvc pipeline list [-h] [-q | -v]

    List pipelines.
```

## Examples

* List available pipelines:

```dvc
    $ dvc pipeline list

    Dvcfile
    ===============
    raw.dvc
    data.dvc
    output.dvc

    2 pipeline(s) total
```
