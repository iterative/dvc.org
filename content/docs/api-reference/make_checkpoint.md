# dvc.api.make_checkpoint()

Make an
[in-code checkpoint](/doc/user-guide/experiment-management#checkpoints-in-source-code).

```py
def make_checkpoint()
```

#### Usage:

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
2. Creates an empty `$DVC_ROOT/tmp/DVC_CHECKPOINT` signal file so DVC knows that
   a checkpoint should be captures now.
3. Blocks the execution of any further code (that changes the state of the
   <abbr>workspace</abbr>) until the signal file is deleted, which means that
   DVC has finished caching all the data, calculating hashes, etc. (see
   `dvc commit`).

💡 Note that for non-Python code, the way to register checkpoints with DVC is to
implement the steps above yourself.

The stage definition in `dvc.yaml` should contain at least one
<abbr>output</abbr> with the `checkpoint: true` value set, so that DVC registers
its checkpoints. This is needed so that the experiment can later restart based
on that output's last <abbr>cached</abbr> state.

⚠️ Using the `checkpoint` field in `dvc.yaml` is only compatibly with
`dvc exp run`, `dvc repro` will abort if any stage contains it.

## Example: Every 100th iteration

Let's consider the following `dvc.yaml` file:

```yaml
stages:
  every100:
    cmd: python iterate.py
    outs:
      - int.txt:
          checkpoint: true
```

The code in `iterate.py` will execute continuously increment an integer number
saved in `int.txt` (starting at 0). At 0 and every 100 loops, it makes a
checkpoint for `dvc experiments`:

```py
import os

from dvc.api import make_checkpoint

while True:
    if os.path.exists("int.txt"):
        with open("int.txt", "r") as fd:
            i_ = int(fd.read()) + 1
    else:
        i_ = 0

    with open("int.txt", "w") as fd:
        fd.write(f"{i_}")

    if i_ % 100 == 0:
        make_checkpoint()
```

Using `dvc repro` with a continuous process such as this may not be helpful, as
you know the output file will keep changing every time. Instead you can execute
the stage with `dvc exp run` and end the process when you decide:

```dvc
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

Reproduced experiment(s): exp-8a3bd
Experiment results have been applied to your workspace.
```

In this example we kill the process (with Ctrl + C) after 3 checkpoints (at 0,
100, and 200). The <abbr>cache</abbr> will contain those 3 versions of
`int.txt`. DVC applies the last checkpoint to the <abbr>workspace</abbr> even if
more cycles happened after that:

```dvc
$ cat int.txt
200
$ ls .dvc/cache
36  cf  f8
```

`dvc exp show` will display these checkpoints as an experiment branch:

```dvc
$ dvc exp show
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━┓
┃ Experiment    ┃ Created      ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━┩
│ workspace     │ -            │
│ master        │ Feb 10, 2021 │
│ │ ╓ exp-8a3bd │ 02:07 PM     │
│ │ ╟ 75ff5e0   │ 01:54 PM     │
│ │ ╟ 6f5009b   │ 01:54 PM     │
│ ├─╨ d832784   │ 01:54 PM     │
└───────────────┴──────────────┘
# Press q to exit this screen.
```

If we use `dvc exp run` again, the process will start from 200 (since that's
what the workspace reflects). The `--reset` option of that command drops the
existing checkpoints and restarts the experiment from scratch. Or, to restart
from a previous checkpoint, you can use use `dvc exp apply` instead.

See `dvc experiments` for more info on managing <abbr>experiments</abbr>.
