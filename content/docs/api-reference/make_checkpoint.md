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

## Exceptions

None

## Example: Mark a checkpoint every 100 iterations

Let's consider the following `dvc.yaml` file:

```yaml
stages:
  foo:
    cmd: python src/mystage.py
    params:
      - start
    outs:
      - int.txt:
          checkpoint: true
```

> See `dvc params` for information on stage parameters.

Here's the example code that the stage above will execute. It continuously
increments an integer value in the `int.txt` file, starting at the `start`
param. It makes a checkpoint with `dvc exp` every time the value adds 100:

```py
import os
from ruamel.yaml import YAML
from dvc.api import make_checkpoint

output_file = "int.txt"

with open("params.yaml") as fobj:
    params = yaml.load(fobj)
start = params.get("start", 0)

while True:
    try:
        if os.path.exists(output_file):
            with open(output_file, "r") as fobj:
                try:
                    data = fobj.read()
                    iter_ = int(data) + 1
                except ValueError:
                    iter_ = start
        else:
            iter_ = start

        with open(output_file, "w") as fobj:
            fobj.write(f"{iter_}")

        if iter_ % 100 == 0:
            make_checkpoint()
```
