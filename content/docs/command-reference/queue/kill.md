## queue kill

Kill actively running [DVC experiment] tasks (see `dvc queue start`).

[dvc experiment]: /user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue kill [-h] [-q | -v] [-f] [<task> ...]

positional arguments:
  <task>         Tasks in queue to kill.
```

## Description

Gracefully interrupt running experiment queue tasks (equivalent to Ctrl-C).

<admon type="warn">

Note that killed experiments will be considered failed runs and will not be
re-added to the queue for future execution.

</admon>

This command does not stop the `dvc queue start` worker(s). After the specified
task has been killed, a worker will move on to process the next experiment task
in the queue.

To kill all running experiments and also stop processing the queue, use
`dvc queue stop --kill`.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

- `-f`, `--force` - forcefully and immediately interrupt the task (not
  graceful).
