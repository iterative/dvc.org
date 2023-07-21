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
    cache: Optional[bool] = True,
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

If `Live` was initialized with `dvcyaml=True` (which is the default) and you
include any of the optional metadata fields (`type`, `name`, `desc`, `labels`,
`meta`), it will add an
[artifact](/doc/user-guide/project-structure/dvcyaml-files#artifacts) and all
the metadata passed as arguments to the corresponding `dvc.yaml`. Passing
`type="model"` will mark it as a `model` for DVC and will make it appear in
[Studio Model Registry](/doc/studio/user-guide/model-registry).

## Parameters

- `path` - an existing directory or file.

- `type` - an optional type of the artifact. Common types are `model` or
  `dataset`.

- `name` - an optional custom name of an artifact. If not provided the path stem
  (last part of the path without the file extension) will be used as the
  artifact name.

- `desc` - an optional description of an artifact.

- `labels` - optional labels describing the artifact.

- `meta` - optional metainformation in `key: value` format.

- `copy` - copy a directory or file at `path` into the `dvclive/artifacts`
  location ([default](/doc/dvclive/how-it-works#directory-structure)) before
  tracking it. The new path is used instead of the original one to track the
  artifact. Useful if you don't want to track the original path in your repo
  (for example, it is outside the repo or in a Git-ignored directory).

- `cache` - <abbr>cache</abbr> the files with DVC to
  [track](/doc/dvclive/how-it-works#track-large-artifacts-with-dvc) them outside
  of Git. Defaults to `True`, but set to `False` if you want to annotate
  metadata about the artifact without storing a copy in the DVC cache.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `path` does not
  have a supported type.
