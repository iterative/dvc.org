# Live.make_stage_template()

Writes template for a DVC pipeline [stage], capturing the outputs tracked by
DVCLive, which you can use to [run] experiments with DVC.

```py
def make_stage_template()
```

## Usage

```py
from PIL import Image
from pathlib import Path
from dvclive import Live

live = Live(cache_images=True)

# Log an artifact
Path("model.pt").write_text("big_artifact")
live.log_artifact("model.pt")

# Log an artifact but don't cache it
Path("weights.json").write_text("small_artifact")
live.log_artifact("weights.json", cache=False)

# Log an artifact and copy it to `dvclive/artifacts`
Path("/tmp/model.pt").write_text("external_artifact")
live.log_artifact("/tmp/model.pt", copy=True)

# Log an image
img_pil = Image.new("RGB", (500, 500), (250, 250, 250))
live.log_image("matplotlib.png", img_pil)

live.make_stage_template()
```

## Description

Creates `{Live.dir}/stage_template.yaml`, which provides a template for a DVC
pipeline stage. You can then copy the contents into a `dvc.yaml` file _outside
the DVCLive directory_ (since that directory will get deleted on each run) to
automatically capture the outputs tracked by DVCLive when running a DVC
pipeline.

<admon type="info">

`Live.end()` will call `Live.make_stage_template()` internally, so you don't
need to call both.

</admon>

For example, the code above will generate in `dvclive/stage_template.yaml`:

```yaml
stages:
  dvclive:
    cmd: <python my_code_file.py my_args>
    deps:
      - <my_code_file.py>
    outs:
      - dvclive/plots/images
      - model.pt
      - weights.json:
          cache: false
      - dvclive/artifacts/model.pt
```

[stage]: /doc/user-guide/pipelines/defining-pipelines#stages
[run]: /doc/dvclive/how-it-works#run-with-dvc
