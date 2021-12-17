# Visualization with DVC Plots

In parallel with versioning parameters and metrics by associating them with
experiments, DVC allows to generate plots from multivariate outputs. There are
several options to generate and keep track of the plots:

- DVC, with its DVCLive integration can produce plots automatically during
  training.

- DVC can generate HTML files that includes interactive Vega-Lite plots, from
  the data series in JSON, YAML, CSV, or TSV.

- DVC can keep track of image files produced as plot outputs from the
  training/evaluation scripts.

We'll add visualization to [`example-dvc-experiments`][ede] project. If you
would like to try these yourself, please refer to the project [README] about how
to install.

One of the important plots that shows the classification performance is the
confusion matrix. DVC uses Vega-Lite to plot the text files. In order to produce
a confusion matrix, Vega expects a CSV file in the form:

```csv
actual,predicted
0,0
0,2
...
```

We add the following loop at the end of the training function:

```python
    y_prob = m.predict(x_valid)
    y_pred = y_prob.argmax(axis=-1)
    os.makedirs("plots")
    with open("plots/confusion.csv", "w") as f:
        f.write("actual,predicted\n")
        sx = y_valid.shape[0]
        for i in range(sx):
            f.write(f"{y_valid.argmax()},{y_pred[i]}\n")
```

After running the experiment, with `dvc exp run`, DVC will produce
`plots/confusion.csv` file that can be shown in the web browser:

```dvc
$ dvc plots show plots/confusion.csv --template confusion
file:///Users/.../example-dvc-experiments/plots/confusion.json.html
```

The file contains the following plot that shows the performance of the CNN
classifier:

<<IMAGE_GOES_HERE>>

Now, let's produce another plot to see misclassified examples from each class.
This procedure is a bit more complex than creating a CSV file, and skipped here,
but you can see the code in [Github][misclassified-example-code]

We can see the misclassification examples in the browser:

```dvc
$ dvc plots show plots/misclassified.png --open
```

DVC automatically shows the image in an HTML page.

<<IMAGE_GOES_HERE>>

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

<<IMAGE_GOES_HERE>>

DVCLive has other capabilities, like saving the model every epoch or modifying
these default values. Please refer to [DVClive documentation] for details.

[dvclive documentation]: /doc/dvclive/dvclive-with-dvc
