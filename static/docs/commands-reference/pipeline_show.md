# show

Show [stages](/doc/commands-reference/run) in a pipeline that lead to the
specified stage. By default it lists
[DVC-files](/doc/user-guide/dvc-file-format).

## Synopsis

```usage
usage: dvc pipeline show [-h] [-q | -v] [-c | -o] [-l] [--ascii]
                         [--dot] [--tree]
                         [targets [targets ...]]

positional arguments:
  targets         DVC-files. 'Dvcfile' by default.
```

## Description

`dvc show` displays the stages of a pipeline up to one or more target DVC-files
(stage files). If specific `targets` are omitted, `Dvcfile` will be assumed. The
`-c` and `-o` options allow to list the corresponding commands or data file flow
instead of stages.

> Note that the stages in these lists are in descending order, that is, from
> first to last.

## Options

- `-c`, `--commands` - show pipeline as a list (graph, if `--ascii` or `--dot`
  option is specified) of commands instead of paths to DVC-files.

- `-o`, `--outs` - show pipeline as a list (graph, if `--ascii` or `--dot`
  option is specified) of stage outputs instead of paths to DVC-files.

- `--ascii` - visualize pipeline. It will print a graph (ASCII) instead of a
  list of path to DVC-files.

- `--dot` - show contents of `.dot` files with a DVC pipeline graph. It can be
  passed to third party visualization utilities.

- `--tree` - list dependencies tree like recursive directory listing.

- `-l`, `--locked` - print locked stages only. See `dvc lock`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

- Default mode: show stage files that `output.dvc` recursively depends on:

  ```dvc
  $ dvc pipeline show output.dvc
  raw.dvc
  data.dvc
  output.dvc
  ```

- The same as previous, but show commands instead of DVC-files:

  ```dvc
  $ dvc pipeline show output.dvc --commands
  download.py s3://mybucket/myrawdata raw
  cleanup.py raw data
  process.py data output
  ```

- Visualize DVC pipeline:

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

- List dependencies recursively if graph have tree structure

  ```dvc
  dvc pipeline show e.file.dvc --tree
  e.file.dvc
  ├── c.file.dvc
  │   └── b.file.dvc
  │       └── a.file.dvc
  └── d.file.dvc
  ```
