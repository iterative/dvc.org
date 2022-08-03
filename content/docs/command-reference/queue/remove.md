## queue remove

Remove queued and completed tasks from the
[DVC Experiment](/doc/user-guide/experiment-management/experiments-overview)
task queue.

## Synopsis

```usage
usage: dvc queue remove [-h] [-q | -v]
                        [--all] [--queued] [--success] [--failed]
                        [<task> ...]

positional arguments:
  <task>         Tasks in queue to remove.
```

## Description

Removes the specified queued or completed experiment tasks from the queue. For
completed tasks, this will also remove any associated output logs.

<admon type="warn">

Note that for successfully completed tasks, this command is not the same as
`dvc exp remove`. `dvc queue remove` does not remove any Git or DVC data
associated with a successful DVC experiment. It only removes the task queue
entry and any associated output logs for that task.

</admon>

## Options

- `--all` - remove all (queued and completed) experiment tasks from the queue.

- `--queued` - remove all queued experiment tasks from the queue.

- `--success` - remove all successfully completed tasks (and associated output
  logs) from the queue.

- `--failed` - remove all failed tasks (and associated output logs) from the
  queue.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
