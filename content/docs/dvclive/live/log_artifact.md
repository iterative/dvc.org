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
    copy: Optional[bool] = False,
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

Uses `dvc add` to track `path` with DVC, generating a `{path}.dvc` file. When
combined with [`save_dvc_exp=True`](/doc/dvclive#initialize-dvclive), it will
ensure that `{path}.dvc` is included in the experiment.

If `Live` was initialized with `dvcyaml=True` (which is the default), it will
add an [artifact](/doc/user-guide/project-structure/dvcyaml-files#artifacts) and
all the metadata passed as arguments to the corresponding `dvc.yaml`. Passing
`type="model"` will mark it as a `model` for DVC and will make it appear in
[Studio Model Registry](/doc/studio) (coming soon).

## Parameters

- `path` - an existing directory or file.

- `name` - an optional custom name of an artifact. If not provided the path stem
  (last part of the path without the file extension) will be used as the
  artifact name.

- `copy` - copy a directory or file at `path` into the `dvclive/artifacts`
  location ([default](/doc/dvclive/how-it-works#directory-structure)) before
  tracking it. The new path is used instead of the original one to track the
  artifact. Useful if you don't want to track the original path in your repo
  (for example, it is outside the repo or in a Git-ignored directory).

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `path` does not
  have a supported type.
