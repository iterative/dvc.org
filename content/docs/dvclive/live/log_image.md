# Live.log_image()

Saves the given image `val` to the output file `name`.

```py
def log_image(name: str, val):
```

## Usage

```py
from dvclive import Live

with Live(cache_images=True) as live:
    # 1. Log an image from a numpy array:
    import numpy as np
    img_numpy = np.ones((500, 500), np.uint8) * 255
    live.log_image("numpy.png", img_numpy)

    # 2. Or log a matplotlib figure:
    from matplotlib import pyplot as plt
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3, 4])
    live.log_image("matplotlib.png", fig)

    # 3. Or log a `PIL.image`:
    from PIL import Image
    img_pil = Image.new("RGB", (500, 500), (250, 250, 250))
    live.log_image("pil.png", img_pil)

    # 4. Or log an existing image:
    live.log_image("sample.png", "run/batch_0_sample.png")
```

## Description

Supported values for `val` are:

- A valid NumPy array (convertible to an image via
  [PIL.Image.fromarray](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.fromarray))
- A `matplotlib.figure.Figure` instance
- A `PIL.Image` instance
- A path to an image file (`str` or
  [`Path`](https://docs.python.org/3/library/pathlib.html#pathlib.Path)). It
  should be in a format that is readable by
  [`PIL.Image.open()`](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.open)

The images will be saved in `{Live.plots_dir}/images/{name}`. When using
[`Live(cache_images=True)`](/doc/dvclive/live#parameters), the images directory
will also be <abbr>cached</abbr> as part of `Live.end()`. In that case, a `.dvc`
file will be saved to
[track](/doc/dvclive/how-it-works#track-large-artifacts-with-dvc) it, and the
directory will be added to a `.gitignore` file to prevent Git tracking:

```
dvclive
└── plots
    ├── .gitignore
    ├── images
    │   ├── numpy.png
    │   ├── matplotlib.png
    │   ├── pil.png
    │   └── sample.png
    └── images.dvc
```

<admon type="tip">

The logged images can be visualized with `dvc plots`:

```cli
$ dvc plots diff dvclive/plots
```

</admon>

### Images per step

By default the images will be overwritten on each step. However, you can log
images using the following pattern
`live.log_image(f"folder/{live.step}.png", img)`:

```py
import numpy as np
from dvclive import Live

with Live() as live:
    base_img = np.ones((500, 500), np.uint8)
    for i in range(10):
      live.log_image(
        f"numpy/{live.step}.png", base_img * i * 10)
      live.next_step()
```

In [DVC Studio] and the [DVC Extension for VSCode], folders following this
pattern will be rendered using an image slider:

<toggle>
<tab title="DVC Studio">

![DVCLive Studio Image Slider](/img/dvclive-studio-image-slider.gif)

</tab>
<tab title="VSCode Extension">

![DVCLive VSCode Image Slider](/img/dvclive-vscode-image-slider.gif)

</tab>

</toggle>

### Annotations on images

You can also log bounding boxes with your image. To do so, you can use the
`annotations` parameter:

```py
import numpy as np
from dvclive import Live

with Live() as live:
    base_img = np.ones((500, 500), np.uint8)
    live.log_image(
      name="numpy.png",
      val=base_img,
      annotations={
        "boxes": [[10, 20, 100, 200], [100, 120, 310, 400], [50, 40, 230, 400]],
        "labels": ["cat", "dog", "cat"],
        "scores": [0.9, 0.8, 0.7],
        "box_format": "tlbr"
        }
      )
```

<details id="what-is-log-image-doing-under-the-hood">

#### What is `log_image` doing under the hood?

`log_image()` will store the annotations in a JSON file with the same path and
name as the image `{Live.plots_dir}/images/{name}.json`. For the given example
the JSON file will contain the following structure:

```json
{
  "annotations": {
    "cat": [
      {
        "box": { "top": 10, "left": 20, "bottom": 100, "right": 200 },
        "score": 0.9
      },
      {
        "box": { "top": 50, "left": 40, "bottom": 230, "right": 400 },
        "score": 0.7
      }
    ],
    "dog": [
      {
        "box": { "top": 100, "left": 120, "bottom": 310, "right": 400 },
        "score": 0.8
      }
    ]
  }
}
```

If you don't want to use `log_image` to store the annotations, but you want to
see the annotations on [DVC Studio] or on the [DVC Extension for VSCode], you
can save the JSON yourself, but it needs to respect this structure.

</details>

<toggle>
<tab title="VSCode Extension">

![DVCLive VSCode Image Annotations](/img/dvclive-vscode-annotations.gif)

</tab>

</toggle>

## Parameters

- `name` - name of the image file that this command will output.

- `val` - image to be saved. See the list of supported values in the
  [Description](#description).

- `annotations` - a dictionnary with the keys "boxes", "labels", "scores", and
  "box_format".
  - `"boxes"` - contains a list of bounding boxes, each represented as a list of
    four `int`. Example : `[[10, 20, 100, 200], [50, 40, 230, 400]]`.
  - `"labels"` - contains a list of `str` representing the class of each
    bounding box. Example : `["cat", "dog"]`.
  - `"scores"` - contains a list of `float` representing the confidence score of
    each bounding box. Example : `[0.9, 0.8]`.
  - `"box_format"` - a `str` representing the format of the bounding boxes. It
    supports `"tlbr"` for `[top, left, bottom tight]`, `"ltrb"` for
    `[left, top, right, bottom]`, `"tlhw"` for `[top, left, height, width]`, and
    `"xywh"` for `[center_x, center_y, width, height]`. Example : `"tlbr"` for
    `[10, 20, 100, 200]` means that the box start at the 10th pixel from the top
    and the 20th pixel from the left. The width of the bounding box is 90 pixels
    and the height is 180 pixels.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

[DVC Studio]: https://studio.iterative.ai/
[DVC Extension for VSCode]:
  https://marketplace.visualstudio.com/items?itemName=Iterative.dvc
