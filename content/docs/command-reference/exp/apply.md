# exp apply

Apply the changes from a previous [experiment](/doc/command-reference/exp) to
the <abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc exp apply [-h] [-q | -v] experiment

positional arguments:
  experiment     Experiment to be applied.
```

## Description

Rolls back the workspace to reflect the results of a given `experiment`.

> This is similar to `dvc checkout`, but for `dvc experiments`.

This is typically use before committing an experiment to Git in order to make it
[persistent](/doc/user-guide/experiment-management#persistent-experiments).
