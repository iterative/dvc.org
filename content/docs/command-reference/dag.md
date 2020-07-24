# dag

Visualize the pipeline(s) in `dvc.yaml` as one or more graph(s) of connected
[stages](/doc/command-reference/run).

## Synopsis

```usage
usage: dvc dag [-h] [-q | -v] [--dot] [--full] [target]

positional arguments:
  target          Stage or output to show pipeline for (optional)
                  Uses all stages in the workspace by default.
```

## Description

A Data pipeline refers to a series of [stages](/doc/command-reference/run)
through which our data moves. Each stage of a pipeline takes some input and
produces some output. This output is then passed onto the next stage of a
pipeline. This process continues until we reach the final stage which produces
the final results. A pipeline works the same way as a compiler works, it takes
some data as an input and produces an output.

You can create multiple pipelines and each pipeline would be considered as an
experiment. After completing one experiment, you can commit the changes and add
a tag to your experiment. A tag is a name that you give to your experiment.

Using DVC, you can create a metafile `data.dvc` which allows us to reproduce
each stage of a pipeline using `dvc repro`. At the end of every pipeline, you
can save your output in a metrics file using `dvc metrics` command. This file
will help you in comparing the results of every experiment.

DVC provides a `dvc dag` command which creates a direct acyclic graph
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) that gives a
pictorial view of a pipeline. It also tells you in which stage of a pipeline you
are currently in.

## Options

- `--full` - show full DAG that the `target` stage belongs too, instead of
  showing only its ancestors.

- `--dot` - show DAG in
  [DOT](<https://en.wikipedia.org/wiki/DOT_(graph_description_language)>)
  format. It can be passed to third party visualization utilities.

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
$ DVC_PAGER=more dvc dag
```

For a persistent change, define `DVC_PAGER` in the shell configuration. For
example in Bash, we could add the following line to `~/.bashrc`:

```bash
export DVC_PAGER=more
```

## Examples

Visualize DVC pipeline:

```dvc
$ dvc dag
         +---------+
         | prepare |
         +---------+
              *
              *
              *
        +-----------+
        | featurize |
        +-----------+
         **        **
       **            *
      *               **
+-------+               *
| train |             **
+-------+            *
         **        **
           **    **
             *  *
        +----------+
        | evaluate |
        +----------+
```
