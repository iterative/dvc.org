# Live.log_image()

Saves the given image `val` to the output file `name`.

```py
def log_image(name: str, val):
```

#### Usage:

```py
from dvclive import Live

live = Live()

import numpy as np
img_numpy = np.ones((500, 500), np.uint8) * 255
live.log_image("numpy.png", img_numpy)

from PIL import Image
img_pil = Image.new("RGB", (500, 500), (250, 250, 250))
live.log_image("pil.png", img_pil)
```

## Description

Supported values for `val` are:

- A valid numpy array (convertible to image via
  [PIL.Image.fromarray](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.fromarray))
- A `PIL.Image` instance.

The images will be saved in `{path}/images/{name}`:

```dvc
$ tree
└── dvclive
    └── images
        ├── numpy.png
        └── pil.png
```

<admon type="tip">

The logged images can be visualized with `dvc plots`.

</admon>

### Step updates

The first `step` update (with `Live.next_step()` or `Live.set_step()`) will move
the saved file from `{path}/images/{name}` to `{path}/images/{step}/{name}`.

Each subsequent call to `live.log_image(name, val)` will save the image under
the folder `{path}/images/{step}/{name}` corresponding to the current `step`.

```dvc
$ tree
└── dvclive
    └── images
        ├── 0
        │   ├── numpy.png
        │   └── pil.png
        └── 1
            ├── numpy.png
            └── pil.png
```

## Parameters

- `name` - name of the image file that this command will output

- `val` - image to be saved

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged whithin the same `step`.
