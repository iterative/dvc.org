# pipeline show

Show [stages](/doc/command-reference/run) in a pipeline that lead to the
specified stage. By default it lists
[DVC-files](/doc/user-guide/dvc-metafile-formats).

## Synopsis

```usage
usage: dvc pipeline show [-h] [-q | -v] [-c | -o] [-l] [--ascii]
                         [--dot] [--tree]
                         [targets [targets ...]]

positional arguments:
  targets         DVC-files to show pipeline for. Optional.
                  (Finds all DVC-files in the workspace by default.)
```

## Description

`dvc show` displays the stages of a pipeline up to one or more target DVC-files
(stage files). If specific `targets` are omitted, `Dvcfile` will be assumed. The
`-c` and `-o` options allow to list the corresponding commands or data file flow
instead of stages.

> Note that the stages in these lists are in descending order, that is, from
> first to last.

## Options

- `-c`, `--commands` - show pipeline as a list (diagram if `--ascii` or `--dot`
  is used) of commands instead of paths to DVC-files.

- `-o`, `--outs` - show pipeline as a list (diagram if `--ascii` or `--dot` is
  used) of stage outputs instead of paths to DVC-files.

- `--ascii` - visualize pipeline. It will print a graph (ASCII) instead of a
  list of path to DVC-files. (`less` pager may be used, see
  [Paging the output](#paging-the-output) below for details).

- `--dot` - show contents of `.dot` files with a DVC pipeline graph. It can be
  passed to third party visualization utilities.

- `--tree` - list dependencies tree like recursive directory listing.

- `-l`, `--locked` - print locked stages only. See `dvc lock`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Paging the output

This command's output is automatically piped to
[Less](<https://en.wikipedia.org/wiki/Less_(Unix)>), if available in the
terminal. (The exact command used is `less --chop-long-lines --clear-screen`.)
If `less` is not available (e.g. on Windows), the output is simply printed out.

> It's also possible to
> [enable Less paging on Windows](/doc/user-guide/running-dvc-on-windows#enabling-paging-with-less).

### Providing a custom pager

It's possible to override the default pager via the `DVC_PAGER` environment
variable. For example, the following command will replace the default pager with
[`more`](<https://en.wikipedia.org/wiki/More_(command)>), for a single run:

```bash
$ DVC_PAGER=more dvc pipeline show --ascii my-pipeline.dvc
```

For a persistent change, define `DVC_PAGER` in the shell configuration. For
example in Bash, we could add the following line to `~/.bashrc`:

```bash
export DVC_PAGER=more
```

## Examples

Default mode: show stage files that `output.dvc` recursively depends on:

```dvc
$ dvc pipeline show output.dvc
raw.dvc
data.dvc
output.dvc
```

The same as previous, but show commands instead of DVC-files:

```dvc
$ dvc pipeline show output.dvc --commands
download.py s3://mybucket/myrawdata raw
cleanup.py raw data
process.py data output
```

Visualize DVC pipeline:

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

List dependencies recursively if the graph has a tree structure:

```dvc
$ dvc pipeline show e.file.dvc --tree
e.file.dvc
├── c.file.dvc
│   └── b.file.dvc
│       └── a.file.dvc
└── d.file.dvc
```
