## queue status

Show status of tasks and workers for the [DVC experiment] task queue.

[dvc experiment]: /user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue status [-h] [-q | -v]
```

## Description

Shows the status of queued and running experiments in the queue, as well as the
status of running workers (see `dvc queue start`).

```cli
$ dvc queue status
Task     Name    Created    Status
753b005          04:01 PM   Running
1ae8b65          04:01 PM   Queued

Worker status: 1 active, 0 idle
```

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Before adding any experiments to the task queue and before starting the queue
worker process, we can verify the queue status:

```cli
$ dvc queue status
No experiment tasks in the queue.

Worker status: 0 active, 0 idle
```

Let's add some experiments to the queue:

```cli
$ dvc exp run --queue -S prepare.split=0.25 -S featurize.max_features=2000
Queued experiment '0bbb118' for future execution.
$ dvc exp run --queue -S prepare.split=0.30 -S featurize.max_features=2500
Queued experiment '753b005' for future execution.
$ dvc exp run --queue -S prepare.split=0.35 -S featurize.max_features=3000
Queued experiment '1ae8b65' for future execution.
```

And verify the queue status:

```cli
$ dvc queue status
Task     Name    Created    Status
753b005          04:01 PM   Queued
0bbb118          04:01 PM   Queued
1ae8b65          04:01 PM   Queued

Worker status: 0 active, 0 idle
```

Let's start 2 queue workers, so up to 2 experiments will be run at a time in
parallel:

```cli
$ dvc queue start -j 2
Started '2' new experiments task queue workers.
$ dvc queue status
Task     Name    Created    Status
753b005          04:01 PM   Running
0bbb118          04:01 PM   Running
1ae8b65          04:01 PM   Queued

Worker status: 2 active, 0 idle
```

Once the first two experiments have completed and the third is running, we can
see that the second worker process becomes idle:

```cli
$ dvc queue status
Task     Name    Created    Status
1ae8b65          04:01 PM   Running
753b005          04:01 PM   Success
0bbb118          04:01 PM   Success

Worker status: 1 active, 1 idle
```

And once all tasks in the queue have been processed, the workers shut down:

```cli
$ dvc queue status
Task     Name    Created    Status
753b005          04:01 PM   Success
0bbb118          04:01 PM   Success
1ae8b65          04:01 PM   Success

Worker status: 0 active, 0 idle
```
