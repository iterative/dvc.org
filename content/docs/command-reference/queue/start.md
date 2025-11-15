## queue start

Start running all [queued experiments], possibly in parallel.

[queued experiments]:
  /user-guide/experiment-management/running-experiments#the-experiments-queue

## Synopsis

```usage
usage: dvc queue start [-h] [-q | -v] [-j <number>]
```

## Description

Starts one or more workers (`--jobs`) to process experiments. Each worker will
consume and execute one queued experiment tasks at a time in the background,
until either `dvc queue stop` is used or the queue is empty.

<admon type="info">

Due to [internal limitations], when the queue is empty a worker may be idle for
up to 10 seconds before exiting. If new experiment tasks are added to the queue
during this time, workers will resume processing them instead.

[internal limitations]:
  /user-guide/experiment-management/running-experiments#how-are-experiments-queued

</admon>

<admon type="tip">

Use `dvc queue kill` to stop specific experiments that are currently running.

`dvc queue logs` lets you to see the console output from any experiments run in
the background with this command (for example for debugging).

</admon>

## Options

- `-j <number>`, `--jobs <number>` - run this `number` of queued experiments in
  parallel. Defaults to 1 (the task queue is processed serially).

  <admon type="info">

  Note that if any queue worker processes have already been started, this
  command will not start additional processes unless `number` is greater than
  the number of existing workers (`number` is treated as the maximum allowed
  concurrency value).

  If `number` is less than the number of existing worker processes, this command
  will not stop any existing worker processes. To reduce worker concurrency,
  `dvc queue stop` must first be used to stop queue processing, before running
  `dvc queue start` with the desired number of `--jobs`.

  </admon>

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
