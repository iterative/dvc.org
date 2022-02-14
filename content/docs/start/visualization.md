# Visualization with DVC Plots

As we discussed in [experiments] section, DVC versions the experiments by
associating parameters and metrics to them. DVC can also generate plots and
tracks plot images you generated from the code.

DVC provides more than one option to fit visualization to your workflow:

- DVC can generate HTML files that includes interactive [Vega-Lite] plots, from
  the data series in JSON, YAML, CSV, or TSV.

- DVC can keep track of image files produced as plot outputs from the
  training/evaluation scripts.

- DVC, with its [DVCLive] integration can produce plots automatically during
  training.

[experiments]: /doc/start/experiments
[vega-lite]: https://vega.github.io/vega-lite/

In this section, we'll add visualization to [`example-dvc-experiments`][ede]
project. If you would like to try these yourself, please refer to the project
[README] about how to install.

One of the important plots that shows the classification performance is the
confusion matrix. DVC uses Vega-Lite to plot the text files. In order to produce
a confusion matrix, Vega expects a CSV file in the form:

```csv
actual,predicted
0,0
0,2
...
```

We added a [straightforward loop] to the project to generate this file from the
predictions.

[straightforward loop]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L213

After running the experiment, with `dvc exp run`, DVC will produce
`plots/confusion.csv` file that can immediately be shown in the browser:

```dvc
$ dvc plots show plots/confusion.csv --template confusion -x actual -y predicted
file:///Users/.../example-dvc-experiments/plots/confusion.json.html
```

The file contains the following plot that shows the performance of the CNN
classifier:

![confusion matrix](/img/start_visualization_confusion1.png)

Now, let's produce another plot to see misclassified examples from each class.
This procedure is a bit more complex than creating a CSV file but you can see
the code in [Github][misclassified-example-code]

[misclassified-example-code]:
  https://github.com/iterative/example-dvc-experiments/blob/main/src/train.py#L58

We can see the misclassification examples in the browser:

```dvc
$ dvc plots show plots/confusion.png
```

DVC automatically shows the image in an HTML page.

![confusion image](/img/start_visualization_confusion2.png)

A major requirement for deep learning projects is to see in which epoch training
loss and validation loss differs. DVC helps in that regard with its integrations
to major deep learning libraries via DVCLive.

The example project uses Keras to train a classifier, and fortunately we have a
DVCLive callback that visualizes the training and validation loss for each
epoch. We first import the callback from DVCLive.

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
