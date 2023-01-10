# dvc.api.make_checkpoint()

Make an in-code [checkpoint].

```py
def make_checkpoint()
```

[checkpoint]:
  /doc/user-guide/experiment-management/running-experiments#checkpoint-experiments

## Usage

```py
from dvc.api import make_checkpoint

while True:
    # ... write a stage output
    make_checkpoint()
```

## Description

To track successive steps in a longer <abbr>experiment</abbr>, you can write
your code so it registers checkpoints with DVC during runtime (similar to a
logger). This function can be called by the code in stages executed by
`dvc exp run`.

`make_checkpoint()` does the following:

1. Check that the `DVC_ROOT` env var is set. It means this code is being
   executed via `dvc exp run`, and it contains the location to the correct
   `.dvc/` directory for this experiment (which can vary when `-j` is used)
2. Creates an empty `$DVC_ROOT/.dvc/tmp/DVC_CHECKPOINT` signal file so DVC knows
   that a checkpoint should be captured now.
3. Blocks the execution of any further code (that changes the state of the
   <abbr>workspace</abbr>) until the signal file is deleted, which means that
   DVC has finished caching all the data, calculating hashes, etc. (see
   `dvc commit`).

💡 Note that for non-Python code, the way to register checkpoints with DVC is to
implement the steps above yourself.

Note that the stage definition in `dvc.yaml` should contain at least one
<abbr>output</abbr> with the `checkpoint: true` value set for DVC to register
its checkpoints. See [Checkpoints](/doc/command-reference/exp/run#checkpoints)
for details.

## Example: Every 100th iteration

Let's consider the following `dvc.yaml` file:

```yaml
stages:
  train:
    cmd: python train.py
    outs:
      - model:
          checkpoint: true
```

The code in `train.py` will train a model up to a number of epochs. Every 100
iterations, it saves the `model`, evaluates it, and makes a checkpoint for [DVC
experiments]:

[dvc experiments]: /doc/user-guide/experiment-management#experiments

```py
from dvc.api import make_checkpoint

for epoch in range(epochs):
    train(model, x_train, y_train)

    if epoch % 100 == 0:
        save_model(model, "model")
        evaluate(model, x_test, y_test)
        make_checkpoint()
```

Since `checkpoint` outputs in effect implement a circular dependency,
`dvc repro` does not support running this stage. Let's execute the stage with
`dvc exp run` instead, and interrupt the process manually moments later:

```cli
$ dvc exp run
Running stage 'every100':
> python iterate.py
Generating lock file 'dvc.lock'
Updating lock file 'dvc.lock'
Checkpoint experiment iteration 'd832784'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '6f5009b'.
Updating lock file 'dvc.lock'
Checkpoint experiment iteration '75ff5e0'.
^C

Reproduced experiment(s): gluey-leak
Experiment results have been applied to your workspace.
```

> ⚠️ it's important to handle interruptions or any other errors in your code for
> DVC checkpoints to behave as expected.

In this example we killed the process (with `[Ctrl] C`) after 3 checkpoints (at
0, 100, and 200 epochs). The <abbr>cache</abbr> will contain those 3 versions of
`model`.

`dvc exp show` will display these checkpoints as an experiment branch:

```cli
$ dvc exp show
```

```dvctable
 ──────────────────────────────
  neutral:**Experiment**       neutral:**Created**
 ──────────────────────────────
  workspace        -
  master           Feb 10, 2021
  │ ╓ gluey-leak   02:07 PM
  │ ╟ 75ff5e0      01:54 PM
  │ ╟ 6f5009b      01:54 PM
  ├─╨ d832784      01:54 PM
 ──────────────────────────────
# Press q to exit this screen.
```

If we use `dvc exp run` again, the process will start from 200 (since that's
what the <abbr>workspace</abbr> reflects).

See [Experiment Management](/doc/user-guide/experiment-management) for more
details on managing <abbr>experiments</abbr>.
