# queue

A set of commands to manage the
[DVC experiments](/doc/user-guide/experiment-management/experiments-overview)
task queue: [start](/doc/command-reference/queue/start),
[stop](/doc/command-reference/queue/stop),
[status](/doc/command-reference/queue/status),
[logs](/doc/command-reference/queue/logs),
[remove](/doc/command-reference/queue/remove),
[kill](/doc/command-reference/queue/kill)

## Synopsis

```usage
usage: dvc queue [-h] [-q | -v] {start,stop,status,logs,remove,kill} ...

positional arguments:
  COMMAND
    start       Start experiments queue workers.
    stop        Stop experiments queue workers.
    status      List the status of the queue tasks and workers.
    logs        Show output logs for a task in the experiments queue.
    remove      Remove tasks in experiments queue.
    kill        Kill tasks in experiments queue.
```

## Description

`dvc queue` subcommands provide specialized ways to manage queued experiment
tasks.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
