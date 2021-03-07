# exp apply

Apply the results from an [experiment](/doc/command-reference/exp) to the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc exp apply [-h] [-q | -v] experiment

positional arguments:
  experiment     Experiment to be applied
```

## Description

Rolls back/forward the workspace to reflect the results of a given `experiment`
(name or hash are accepted, see `dvc exp run` for details). This means changing
the appropriate [metafiles](/doc/user-guide/project-structure),
<abbr>parameter</abbr> files, <abbr>metrics</abbr>, <abbr>plots</abbr>, and
corresponding DVC-tracked data.

> This is similar to `dvc checkout`, but for `dvc experiments`.

This is typically used after using `dvc exp show` or `dvc exp diff` to find the
best experiment, and before committing to Git in order to make it
[persistent](/doc/user-guide/experiment-management#persistent-experiments).

Note that this command will fail if the target `experiment` was not derived from
the current Git commit.

## Options

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
