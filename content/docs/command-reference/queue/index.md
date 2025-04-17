# queue

A set of commands to manage the [DVC experiments] task queue:
[start](/doc/command-reference/queue/start),
[stop](/doc/command-reference/queue/stop),
[status](/doc/command-reference/queue/status),
[logs](/doc/command-reference/queue/logs),
[remove](/doc/command-reference/queue/remove),
[kill](/doc/command-reference/queue/kill)

[dvc experiments]: /doc/user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue [-h] [-q | -v]
                 {start,stop,status,logs,remove,kill} ...

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

You can use `dvc exp run --queue` to queue ML experiments. `dvc queue` provides
an interface to process and manage these queued tasks.

<admon icon="book">

See [this guide] for more information on experiment queues.

[this guide]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

</admon>

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
