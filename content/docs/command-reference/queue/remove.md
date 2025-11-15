## queue remove

Removes non-active tasks from the [DVC experiment] queue.

> See `dvc queue kill` to interrupt active ones.

[dvc experiment]: /user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue remove [-h] [-q | -v]
                        [--all] [--queued] [--success] [--failed]
                        [<task> ...]

positional arguments:
  <task>         Tasks in queue to remove.
```

## Description

Removes the specified queued or completed experiment `task`(s) from the queue.
For completed tasks, this will also remove any associated output logs.

<admon type="warn">

Note that for successfully completed tasks, this command is not the same as
`dvc exp remove`, because `dvc queue remove` does not remove any data associated
with an experiment, only the queue entry and any output logs for that task.

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
