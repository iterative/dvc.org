## queue logs

Show output logs for running and completed tasks in the
[DVC Experiment](/doc/user-guide/experiment-management/experiments-overview)
task queue.

## Synopsis

```usage
usage: dvc queue logs [-h] [-q | -v] [-e <encoding>] [-f] <task>

positional arguments:
  <task>                Task to show.
```

## Description

Shows output logs for the specified running or completed experiment task.

By default, this command will show any available log data and then exit. For
tasks which are still running, the `--follow` option can be used to attach to
the task and continuously show live log output, until the task has completed.

When using the `--follow` option, it is safe to stop following output using
`Ctrl+C` (or `SIGINT`). This will only cause the logs command to exit, and the
experiment task will continue to be run in the background.

## Options

- `-e <encoding>`, `--encoding <encoding>` - text encoding for log output.
  Defaults to the system locale encoding.

  > ⚠️ Note that this option is used to specify the encoding of the experiment
  > task output (i.e. the output of pipeline stage commands), which may not
  > always match the encoding of your system terminal.

- `-f`, `--follow` - attach to task and follow additional live output. Only
  applicable of the task is still running.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
