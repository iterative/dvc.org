## queue stop

Stop the
[DVC experiments](/doc/user-guide/experiment-management/experiments-overview)
task queue worker process.

## Synopsis

```usage
usage: dvc queue stop [-h] [-q | -v] [--kill]
```

## Description

Stops all running task queue worker processes. Any queued experiment tasks which
have not been run will remain in the queue (to be executed the next time that
`dvc queue start` is run).

By default, DVC will wait for any experiment tasks which are currently running
to complete before gracefully stopping any queue workers. The `--kill` option
can be used to kill any currently running experiment tasks and stop the queue
workers immediately.

<admon type="warn">

Note that killed experiment tasks will be considered failed runs and will
not be re-added to the queue for future execution.

</admon>

## Options

- `--kill` - kill any experiment tasks that are currently running and
  immediately stop queue execution.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
