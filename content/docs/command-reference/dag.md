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

A data pipeline, in general, is a series of data processing
[stages](/doc/command-reference/run) (for example, console commands that take an
input and produce an <abbr>output</abbr>). A pipeline may produce intermediate
data, and has a final result.

Data science and machine learning pipelines typically start with large raw
datasets, include intermediate featurization and training stages, and produce a
final model, as well as accuracy [metrics](/doc/command-reference/metrics).

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified in `dvc.yaml`, which can be
written manually or built using the helper command `dvc run`. This allows DVC to
restore one or more pipelines later (see `dvc repro`).

> DVC builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) to do this.

`dvc dag` command displays the stages of a pipeline up to the target stage. If
`target` is omitted, it will show the full project DAG.

## Options

- `--full` - show full DAG that the `target` stage belongs to, instead of
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

## Example: Visualize a DVC Pipeline

Visualize the prepare, featurize, train, and evaluate stages of a pipeline as
defined in `dvc.yaml`:

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
