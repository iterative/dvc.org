# Live.log_image()

Saves the given image `val` to the output file `name`.

```py
def log_image(name: str, val):
```

## Usage

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

- A valid NumPy array (convertible to image via
  [PIL.Image.fromarray](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.fromarray))
- A `PIL.Image` instance.

The images will be saved in `{Live.plots_dir}/images/{name}`:

```
dvclive
└── plots
    └── images
        ├── numpy.png
        └── pil.png
```

<admon type="tip">

The logged images can be visualized with `dvc plots`:

```cli
$ dvc plots diff dvclive/plots
```

</admon>

## Parameters

- `name` - name of the image file that this command will output

- `val` - image to be saved

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged within the same `step`.
