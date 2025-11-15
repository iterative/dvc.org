## queue logs

Show console output logs for [DVC experiment] tasks (see `dvc queue start`).

[dvc experiment]: /user-guide/experiment-management

## Synopsis

```usage
usage: dvc queue logs [-h] [-q | -v] [-e <encoding>] [-f] <task>

positional arguments:
  <task>                Task to show.
```

## Description

Shows the console output logs for the specified running or completed experiment
`task`.

By default, this command will show any existing logs and then exit. For running
tasks, the `--follow` option can be used to attach to the task and show live
logs (until the task has completed).

<admon type="tip">

It is safe to interrupt the `--follow` process, with `Ctrl+C` (or `SIGINT`) for
example. This will only cause the `dvc queue logs` command to exit, but the
experiment continue to run in the background.

</admon>

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

## Example: View logs for completed experiment tasks

Let's say we have previously run some queued experiment tasks:

```cli
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

```cli
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

```cli
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

```cli
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
