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
your code so it registers checkpoints with DVC during runtime. This function
should be called by the code in stages executes by `dvc exp run` (see `cmd`
field of `dvc.yaml`).

> Note that for non-Python code, the alternative is to write a
> `.dvc/tmp/DVC_CHECKPOINT` signal file.

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
`int.txt`. And DVC applies the last checkpoint to the <abbr>workspace</abbr>
even when more cycles happened before the interrupt:

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

Now if we use `dvc exp run` again, the process will start from 200. To restart
from a previous point or even from scratch, you can use use `dvc exp apply`.

See `dvc experiments` for more info on managing <abbr>experiments</abbr>.
