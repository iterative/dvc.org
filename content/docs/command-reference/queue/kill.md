## queue kill

Kill actively running
[DVC Experiment](/doc/user-guide/experiment-management/experiments-overview)
tasks.

## Synopsis

```usage
usage: dvc queue kill [-h] [-q | -v] [<task> ...]

positional arguments:
  <task>         Tasks in queue to kill.
```

## Description

Forcefully stops execution of the specified (running) experiment tasks. Killed
tasks will be considered as failed runs.

This command does not stop the queue worker process. After the specified task
has been killed, the worker process will consume and execute the next experiment
task in the queue.

To kill all running experiment tasks and also stop queue processing, you can use
`dvc queue stop --kill`.

<admon type="warn">

Note that killed experiment tasks will be considered failed runs and will
not be re-added to the queue for future execution.

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
