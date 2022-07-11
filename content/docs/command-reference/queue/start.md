## queue start

Start the
[DVC experiments](/doc/user-guide/experiment-management/experiments-overview)
task queue worker process.

## Synopsis

```usage
usage: dvc queue start [-h] [-q | -v] [-j <number>]
```

## Description

Starts one or more task queue worker processes. Each worker process will consume
and execute one queued experiment task at a time in the background, until either
`dvc queue stop` is used or the queue is empty.

<admon type="info">

Due to [internal limitations], when the queue is empty a worker
may be idle for up to 10 seconds before exiting. If new
experiment tasks are added to the queue during this time, the idle worker will
resume processing them instead.

[implementation limitations]:
  /doc/user-guide/experiment-management/running-experiments#how-are-experiments-queued

</admon>

Queued experiment tasks are run sequentially by default, but can be run in parallel by using
the `--jobs` option to start  more than one worker.

> ⚠️ Parallel runs are experimental and may be unstable. Make sure you're using
> a number of jobs that your environment can handle (no more than the CPU
> cores).

> Note that since queued experiments are run isolated from each other, common
> stages may sometimes be executed several times depending on the state of the
> [run-cache] at that time.

## Options

- `-j <number>`, `--<number>` - start up to this number of workers in parallel.
  Defaults to 1 (the task queue is processed serially).

  > Note that if any queue worker processes have already been started, this
  > command will not start additional processes unless `number` is greater than
  > the number of existing workers (`number` is treated as the maximum allowed
  > concurrency value).

  > If `number` is less than the number of existing worker processes, this
  > command will not stop any existing worker processes. To reduce worker
  > concurrency, `dvc queue stop` must first be used to stop queue processing,
  > before running `dvc queue run` with the desired number of `--jobs`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.
