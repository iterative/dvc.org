# dag

Visualize the <abbr>pipeline</abbr>(s) in `dvc.yaml` as one or more graph(s) of
connected [stages](/doc/command-reference/run).

## Synopsis

```usage
usage: dvc dag [-h] [-q | -v] [-o] [--full]
               [--md] [--mermaid] [--dot]
               [target]

positional arguments:
  target          Stage or output to show pipeline for (optional)
                  Uses all stages in the workspace by default.
```

## Description

Displays the stages of a pipeline up to the `target` stage. If the `target` is
omitted, it will show the full project DAG.

### Directed acyclic graph

A data pipeline, in general, is a series of data processing
[stages](/doc/command-reference/run) (for example, console commands that take an
input and produce an outcome). The connections between stages are formed by the
<abbr>output</abbr> of one turning into the <abbr>dependency</abbr> of another.
A pipeline may produce intermediate data, and has a final result.

Data science and machine learning pipelines typically start with large raw
datasets, include intermediate featurization and training stages, and produce a
final model, as well as accuracy [metrics](/doc/command-reference/metrics).

In DVC, pipeline stages and commands, their data I/O, interdependencies, and
results (intermediate or final) are specified in `dvc.yaml`, which can be
written manually or built using the helper command `dvc stage add`. This allows
DVC to restore one or more pipelines later (see `dvc repro`).

> DVC builds a dependency graph
> ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)) to do this.

### Paginating the output

This command's output is automatically piped to
[less](<https://en.wikipedia.org/wiki/Less_(Unix)>) if available in the terminal
(the exact command used is `less --chop-long-lines --clear-screen`). If `less`
is not available (e.g. on Windows), the output is simply printed out.

> It's also possible to
> [enable `less` on Windows](/doc/user-guide/running-dvc-on-windows#enabling-paging-with-less).

> Note that this also applies to `dvc exp show`.

### Providing a custom pager

It's possible to override the default pager via the `DVC_PAGER` environment
variable. Set it to a program found in `PATH` or give a full path to it. For
example on Linux shell:

```dvc
$ DVC_PAGER=more dvc exp show  # Use more as pager once.
...

$ export DVC_PAGER=more  # Set more as pager for all commands.
$ dvc exp show ...
```

> For a persistent change, set `DVC_PAGER` in the shell configuration, for
> example in `~/.bashrc` for Bash.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

- `-o`, `--outs` - show a DAG of chained dependencies and outputs instead of the
  stages themselves. The graph may be significantly different.

- `--full` - show full DAG that the `target` stage belongs to, instead of
  showing only its ancestors.

- `--md` - show DAG in `--mermaid` format, wrapped inside a Markdown
  [fenced code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks).

  This can be used to combine `dvc dag` with
  [`cml send-comment`](https://cml.dev/doc/ref/send-comment)

- `--mermaid` - show DAG in [Mermaid](https://mermaid-js.github.io) format. It
  can be passed to third party visualization utilities.

- `--dot` - show DAG in
  [DOT](<https://en.wikipedia.org/wiki/DOT_(graph_description_language)>)
  format. It can be passed to third party visualization utilities.

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

The pipeline can also be seen from the point of view of how stage
outputs/dependencies are connected (using the `--outs` option). Notice that the
resulting graph may be different:

```dvc
$ dvc dag --outs
                  +---------------+
                  | data/prepared |
                  +---------------+
                          *
                          *
                          *
                  +---------------+
                  | data/features |
                **+---------------+**
            ****          *          *****
       *****              *               ****
   ****                   *                   ****
***                 +-----------+                 ***
  **                | model.pkl |                **
    **              +-----------+              **
      **           **           **           **
        **       **               **       **
          **   **                   **   **
      +-------------+            +----------+
      | scores.json |            | prc.json |
      +-------------+            +----------+
```

## Example: Mermaid flowchart

The `--mermaid` flag will generate a
[flowchart in Mermaid format](https://mermaid-js.github.io/mermaid/#/flowchart):

```dvc
$ dvc dag --mermaid
flowchart TD
        node1[data/data.xml.dvc]
        node2[evaluate]
        node3[featurize]
        node4[prepare]
        node5[train]
        node1-->node4
        node3-->node2
        node3-->node5
        node4-->node3
        node5-->node2
```

When the `--md` flag is passed, the mermaid output will be wrapped inside a
Markdown
[fenced code block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks).
Note that this output is automatically rendered as a diagram
[in GitHub](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/)
and [in GitLab](https://docs.gitlab.com/ee/user/markdown.html#mermaid).

<admon type="tip">

You can combine `dvc dag --md` with the
[`cml send-comment`](https://cml.dev/doc/ref/send-comment) of CML:

```dvc
dvc dag --md >> dag.md
cml send-comment dag.md
```

</admon>
