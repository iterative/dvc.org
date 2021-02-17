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

To track successive steps in a longer
[experiment](/doc/user-guide/experiment-management), you can write your code so
it registers checkpoints with DVC during runtime. This function should be called
by the code in stages executes by `dvc exp run` (see `cmd` field of `dvc.yaml`).

> Note that for non-Python code, the alternative is to write a
> `.dvc/tmp/DVC_CHECKPOINT` signal file.

## Example: Every 100th iteration

Let's consider the following `dvc.yaml` file:

```yaml
stages:
  foo:
    cmd: python iterate.py
    outs:
      - int.txt:
          checkpoint: true
```

The code in `iterate.py` will execute continuously increment an integer number
saved in `int.txt` (starting at 0). Every 100 loops, it makes a checkpoint with
`dvc exp`:

```py
import os

from dvc.api import make_checkpoint

while True:
    try:
        if os.path.exists("int.txt"):
            with open("int.txt", "r") as fd:
                try:
                    i_ = int(fd.read()) + 1
                except ValueError:
                    i_ = 0
        else:
            i_ = 0

        with open("int.txt", "w") as fd:
            fd.write(f"{i_}")

        if i_ % 100 == 0:
            make_checkpoint()

    except KeyboardInterrupt:
        exit()
```
