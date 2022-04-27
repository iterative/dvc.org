---
title: 'Get Started: Visualization with Plots'
---

# Get Started: Visualization with Plots

In this section, we'll add visualization to the [`example-dvc-experiments`][ede]
project (explored [previously](/doc/start/experiments)). If you would like to
try these yourself, please refer to the project. [README] about how to install.

[ede]: https://github.com/iterative/example-dvc-experiments
[readme]:
  https://github.com/iterative/example-dvc-experiments/blob/main/README.md

## Creating plots from tabular data

A useful plot to show the classification performance is the [confusion matrix].
In order to produce it, DVC expects a CSV **plots file** in the form:

```csv
actual,predicted
0,0
0,2
...
```

> We added a [loop] comparing the results to generate this file from the
> predictions.

[loop]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L123
[confusion matrix]: https://en.wikipedia.org/wiki/Confusion_matrix

Running the experiment with `dvc exp run` will produce `plots/confusion.csv`.
Use `dvc plots show` to present it as an HTML file, and open it in the browser:

```dvc
$ dvc plots show plots/confusion.csv --template confusion \
                                     -x actual -y predicted
file:///.../example-dvc-experiments/plots/confusion.json.html
```

![confusion matrix](/img/start_visualization_confusion1.png)

## Displaying user-generated plot images

Let's produce another plot to see misclassified examples from each class. This
procedure generates the misclassification examples from the validation data and
arranges them into a _confusion table_ that shows the correct label, and
misclassification sample. The code to generate an image from a set of training
images is omitted here but you can find the code in [the example
project.][misclassified-example-code]

[misclassified-example-code]:
  https://github.com/iterative/example-dvc-experiments/blob/48b1e5078c957f71674c00f416290eaa3b20b559/src/util.py#L49

```dvc
$ dvc plots show plots/misclassified.png
```

![Misclassification table](/img/start_visualization_misclassification.png)

## Autogenerating plots from deep learning code

An important issue for deep learning projects is to observe in which epoch do
training and validation loss differ. DVC helps in that regard with its Python
integrations to deep learning libraries via [DVCLive].

The example project uses Keras to train a classifier, and we have a DVCLive
callback that visualizes the training and validation loss for each epoch. We
first import the callback from DVCLive.

```python
from dvclive.keras import DvcLiveCallback
```

Then we add this callback to the
[`fit` method](https://keras.io/api/models/model_training_apis/#fit-method)
call.

```python
model.fit(
 ...
 callbacks=[DvcLiveCallback()],
 ...)
```

With these two changes, the model metrics are automatically logged to
`dvclive.json` and plotted in `training_metrics/index.html`:

![dvclive](/img/start_visualization_dvclive.png)

DVCLive has other capabilities, like saving the model every epoch or modifying
these default values.

In summary, DVC provides more than one option to use visualization in your
workflow:

- DVC can generate HTML files that includes interactive plots from data series
  in JSON, YAML, CSV, or TSV format.

- DVC can keep track of image files produced as [plot outputs] from the
  training/evaluation scripts.

- [DVCLive] integrations can produce plots automatically during training.

[plot outputs]:
  /doc/user-guide/project-structure/pipelines-files#metrics-and-plots-outputs
[dvclive]: /doc/dvclive/dvclive-with-dvc
