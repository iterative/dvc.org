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
    params:
      - start
    outs:
      - int.txt:
          checkpoint: true
```

> See `dvc params` for information on stage parameters.

Here's the example code that the stage above will execute. It continuously
increments an integer value in `int.txt`, starting at the `start` param. It
makes a checkpoint with `dvc exp` every time the value adds 100:

```py
import os
from dvc.api import make_checkpoint

output_file = "int.txt"
start = _load_param('start') # Load start from params.yaml

while True:
    try:
        if os.path.exists(output_file):
            with open(output_file, "r") as fd:
                try:
                    iter_ = int(fd.read()) + 1
                except ValueError:
                    iter_ = start
        else:
            iter_ = start

        with open(output_file, "w") as fd:
            fd.write(f"{iter_}")

        if iter_ % 100 == 0:
            make_checkpoint()
    # ...
```
