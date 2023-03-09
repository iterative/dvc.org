# Live.log_artifact()

Tracks an existing directory or file with DVC.

```py
def log_artifact(path: Union[str, Path]):
```

## Usage

```py
from pathlib import Path
from dvclive import Live

# Create example file
Path("model.txt").write_text("weights")

with Live() as live:
    live.log_artifact("model.txt")
```

## Description

Uses `dvc add` to track `path` with DVC, generating a `{path}.dvc` file.

When combined with `save_dvc_exp=True`, it will ensure that `{path}.dvc` is
included in the experiment.

## Parameters

- `path` - existing directory or file

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `path` does not
  have a supported type.
