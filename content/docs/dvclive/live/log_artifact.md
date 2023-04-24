# Live.log_artifact()

Tracks an existing directory or file with DVC.

```py
def log_artifact(
    path: Union[str, Path],
    type: Optional[str] = None,
    name: Optional[str] = None,
    desc: Optional[str] = None,
    labels: Optional[List[str]] = None,
    meta: Optional[Dict[str, Any]] = None,
):
```

## Usage

```py
from pathlib import Path
from dvclive import Live

# Create example file
Path("model.pt").write_text("weights")

with Live() as live:
    live.log_artifact(
      "model.pt",
      type="model",
      name="mymodel",
      desc="Fine-tuned Resnet50",
      labels=["resnet", "imagenet"],
    )
```

## Description

Uses `dvc add` to track `path` with DVC, generating a `{path}.dvc` file.

When combined with `save_dvc_exp=True`, it will ensure that `{path}.dvc` is
included in the experiment.

If `Live` was initialized with `dvcyaml=True` (which is the default), will add an [artifact](/doc/user-guide/project-structure/dvcyaml-files#artifacts) to
corresponding `dvc.yaml`, marking it as a `model` for DVC and making artifact
appear in [Studio Model Registry](/doc/studio).

## Parameters

- `path` - existing directory or file

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `path` does not
  have a supported type.
