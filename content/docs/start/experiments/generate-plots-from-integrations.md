### Autogenerating plots with integrations

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
