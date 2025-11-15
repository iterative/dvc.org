## queue stop

Stop running queued [DVC experiments] (see `dvc queue start`) after the current
ones are finished running.

[dvc experiments]: /user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue stop [-h] [-q | -v] [--kill]
```

## Description

Signals DVC to stop all workers that are running queued experiments.

By default, DVC will wait for any experiments that are currently running to
complete before gracefully stopping workers. The `--kill` option can be used to
interrupt them instead and stop all workers immediately.

<admon type="warn">

Note that killed experiments will be considered failed runs and will not be
re-added to the queue for future execution.

</admon>

Any queued experiment tasks which have not been processed will remain in the
queue (use `dvc queue start` again to resume processing them).

## Options

- `--kill` - kill any experiment tasks that are currently running and
  immediately stop queue execution.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
