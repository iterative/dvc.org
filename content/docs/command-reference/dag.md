# dag

Show [stages](/doc/command-reference/run) in a pipeline that lead to the
specified stage. By default it lists
[DVC-files](/doc/user-guide/dvc-files-and-directories).

## Synopsis

```usage
usage: dvc dag [-h] [-q | -v] [--dot] [--full] [target]

positional arguments:
  targets         Stage or output to show pipeline for.
                  Optional. (Finds all stages in the workspace by default.)
```

## Description

`dvc dag` displays the stages of a pipeline up to the target stage. If `target`
is omitted, it will show the full project DAG.

## Options

- `--dot` - show DAG in `DOT` format. It can be passed to third party
  visualization utilities.

- `--full` - show full DAG that the `target` belongs too, instead of showing
  the part that consists only of the target ancestors.

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

```dvc
$ DVC_PAGER=more dvc dag my-pipeline.dvc
```

For a persistent change, define `DVC_PAGER` in the shell configuration. For
example in Bash, we could add the following line to `~/.bashrc`:

```bash
export DVC_PAGER=more
```

## Examples

Visualize DVC pipeline:

```dvc
$ dvc dag eval.txt.dvc
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
