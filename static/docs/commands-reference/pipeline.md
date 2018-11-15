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

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

## show

Show stages in a pipeline that lead to the specified stage. By default it lists
stage files (usually `.dvc` files). There are `-c` or `-o` options to list or
visualize a pipeline commands or data files flow instead.

```usage
    usage: dvc pipeline show [-h] [-q] [-v] [-c] [--dot DOT] targets [targets ...]

    positional arguments:
      targets         DVC files.

    optional arguments:
      -h, --help      show this help message and exit
      -q, --quiet     Be quiet.
      -v, --verbose   Be verbose.
      -c, --commands  Print commands instead of paths to DVC files.
      -o, --outs      Print output files instead of paths to DVC files.
      --ascii         Output DAG as ASCII.
      --dot DOT       Write DAG in .dot format.
```

**Options**

* `-c`, `--commands` - show pipeline as a list (graph, if `--ascii` or `--dot`
option is specified) of commands instead of paths to DVC files.

* `-o`, `--outs` - show pipeline as a list (graph, if `--ascii` or `--dot`
option is specified) of stage output files instead of paths to DVC files.

* `--ascii` - visualize pipeline. It will print a graph (ASCII) instead of a
list of path to DVC files.

* `--dot` - produce a `.dot` files with a DVC pipeline graph. It can be passed
to third party visualization utilities.


**Examples**

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
              | data/Posts.xml.tgz.dvc |
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

## list

Show connected groups (pipelines) of DVC stages (files) that are independent of
each other.

```usage
    usage: dvc pipeline list [-h] [-q | -v]

    List pipelines.

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

**Examples**

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
