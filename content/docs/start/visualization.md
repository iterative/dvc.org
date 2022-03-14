# Visualization with Plots

In this section, we'll add visualization to the [`example-dvc-experiments`][ede]
project. If you would like to try these yourself, please refer to the project
[README] about how to install.

[ede]: https://github.com/iterative/example-dvc-experiments
[readme]:
  https://github.com/iterative/example-dvc-experiments/blob/main/README.md

A useful plot to show the classification performance is the confusion matrix. In
order to produce it, DVC expects a CSV **plot file** in the form:

```csv
actual,predicted
0,0
0,2
...
```

> We added a [loop] comparing the results to generate this file from the
> predictions.

[loop]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L213

After running the experiment with `dvc exp run`, DVC will produce
`plots/confusion.csv` file that can immediately be shown in the browser:

```dvc
$ dvc plots show plots/confusion.csv --template confusion -x actual -y predicted
file:///Users/.../example-dvc-experiments/plots/confusion.json.html
```

The file contains the following plot that shows the performance of the CNN
classifier:

![confusion matrix](/img/start_visualization_confusion1.png)

Let's produce another plot to see misclassified examples from each class. This
procedure is a bit more complex than creating a CSV file but you can see the
code in [Github][misclassified-example-code]

[misclassified-example-code]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L58

We can see the misclassification examples in the browser:

```dvc
$ dvc plots show plots/confusion.png
```

DVC automatically shows the image in an HTML page.

![confusion image](/img/start_visualization_confusion2.png)

An important issue for deep learning projects is to observe in which epoch
training loss and validation loss differs. DVC helps in that regard with its
integrations to deep learning libraries via DVCLive.

The example project uses Keras to train a classifier, and we have a DVCLive
callback that visualizes the training and validation loss for each epoch. We
first import the callback from DVCLive.

```python

from dvclive.keras import DvcLiveCallback

```

Then we add this callback to `fit` callbacks.

```python

model.fit(
 ...
 callbacks=[DvcLiveCallback()],
 ...)

```

With these two changes, we can see the plots showing the defined metrics in our
model. You can see the HTML report with your browser in
`training_metrics/index.html` file.

![dvclive](/img/start_visualization_dvclive.png)

DVCLive has other capabilities, like saving the model every epoch or modifying
these default values. Please refer to [DVClive documentation] for details.

[dvclive documentation]: /doc/dvclive/dvclive-with-dvc

In summary, DVC provides more than one option to fit visualization to your
workflow:

- DVC can generate HTML files that includes interactive [Vega-Lite] plots, from
  the data series in JSON, YAML, CSV, or TSV.

- DVC can keep track of image files produced as plot outputs from the
  training/evaluation scripts.

- DVC, with its [DVCLive] integration can produce plots automatically during
  training.

[experiments]: /doc/start/experiments
[vega-lite]: https://vega.github.io/vega-lite/
[dvclive]: https://dvc.org/doc/dvclive
