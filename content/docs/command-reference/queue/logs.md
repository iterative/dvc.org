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

  <admon type="warn">

  Note that this option is used to specify the encoding of the experiment task
  output (i.e. the output of pipeline stage commands), which may not always
  match the encoding of your system terminal.

  </admon>

- `-f`, `--follow` - attach to task and follow additional live output. Only
  applicable if the task is still running.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

## Example: View logs for completed experiment tasks

Let's say we have previously run some queued experiment tasks:

```dvc
$ dvc queue status
Task     Name    Created    Status
192a13c          04:15 PM   Failed
753b005          04:01 PM   Success
0bbb118          04:01 PM   Success
1ae8b65          04:01 PM   Success

Worker status: 0 active, 0 idle
```

We can view the output for both failed and successfully completed experiment
tasks:

```dvc
$ dvc queue logs 192a13c
'data/data.xml.dvc' didn't change, skipping
Running stage 'prepare':
> python src/prepare.py data/data.xml
Traceback (most recent call last):
  File "/Users/pmrowla/git/example-get-started/.dvc/tmp/exps/tmp217n0tjv/src/prepare.py", line 10, in <module>
    raise AssertionError
AssertionError
ERROR: failed to reproduce 'prepare': failed to run: python src/prepare.py data/data.xml, exited with 1
```

```dvc
$ dvc queue logs 0bbb118
'data/data.xml.dvc' didn't change, skipping
Stage 'prepare' is cached - skipping run, checking out outputs
Updating lock file 'dvc.lock'

Stage 'featurize' is cached - skipping run, checking out outputs
Updating lock file 'dvc.lock'

Stage 'train' is cached - skipping run, checking out outputs
Updating lock file 'dvc.lock'

Stage 'evaluate' is cached - skipping run, checking out outputs
Updating lock file 'dvc.lock'

To track the changes with git, run:

    git add dvc.yaml scores.json roc.json params.yaml data/prepared data/data.xml prc.json src/featurization.py data/features src/evaluate.py model.pkl dvc.lock src/train.py src/prepare.py

To enable auto staging, run:

        dvc config core.autostage true
```

## Example: View logs for running experiment tasks

Let's queue a new experiment and view the output while it is running:

```dvc
$ dvc exp run --queue -S prepare.split=0.40 -S featurize.max_features=4000
Queued experiment '93cfa70' for future execution.
$ dvc queue start
Started '1' new experiments task queue worker.
$ dvc queue logs 93cfa70
'data/data.xml.dvc' didn't change, skipping
Running stage 'prepare':
> python src/prepare.py data/data.xml
Updating lock file 'dvc.lock'

Running stage 'featurize':
> python src/featurization.py data/prepared data/features
```

We can see that by default, `dvc queue logs` displays any available output and
then exits. In this case, our `featurize` stage is still running, so no
additional output is available at this time.

If we wanted to continuously view live output from the running task (until it
completes) we also could have used the `--follow` option.
