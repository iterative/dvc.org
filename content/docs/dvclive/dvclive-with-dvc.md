# Dvclive with DVC

Even though Dvclive does not require DVC, they can integrate in several useful
ways.

> In this section we reuse the finished
> [basic usage example](/doc/dvclive/usage) to see how DVC can cooperate with
> Dvclive.

```python
# train.py

import dvclive
from keras.callbacks import Callback
from keras.datasets import mnist
from keras.models import Sequential
from keras.layers.core import Dense, Activation
from keras.utils import np_utils


class MetricsCallback(Callback):
    def on_epoch_end(self, epoch: int, logs: dict = None):
        logs = logs or {}
        for metric, value in logs.items():
            dvclive.log(metric, value)
        dvclive.next_step()


def load_data():
    (x_train, y_train), (x_test, y_test) = mnist.load_data()

    x_train = x_train.reshape(60000, 784)
    x_test = x_test.reshape(10000, 784)
    x_train = x_train.astype('float32')
    x_test = x_test.astype('float32')
    x_train /= 255
    x_test /= 255

    classes = 10
    y_train = np_utils.to_categorical(y_train, classes)
    y_test = np_utils.to_categorical(y_test, classes)
    return (x_train, y_train), (x_test, y_test)


def get_model():
    model = Sequential()

    model.add(Dense(512, input_dim=784))
    model.add(Activation('relu'))
    model.add(Dense(10, input_dim=512))
    model.add(Activation('softmax'))

    model.compile(loss='categorical_crossentropy',
    metrics=['accuracy'], optimizer='sgd')
    return model


(x_train, y_train), (x_test, y_test) = load_data()
model = get_model()

# dvclive.init("training_metrics")  # Implicit with DVC
model.fit(x_train,
          y_train,
          validation_data=(x_test, y_test),
          batch_size=128,
          epochs=3,
          callbacks=[MetricsCallback()])
```

Note that when using Dvclive in a DVC project, there is no need for manual
initialization of Dvclive (no `dvclive.init()` call).

Let's use `dvc stage add` to create a stage to wrap this code (don't forget to
`dvc init` first):

```dvc
$ dvc stage add -n train --live training_metrics
                -d train.py python train.py
```

`dvc.yaml` will contain a new `train` stage with the Dvclive
[configuration](/doc/dvclive/usage#initial-configuration) (in the `live` field):

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - train.py
    live:
      training_metrics:
        summary: true
        html: true
```

The value passed to `--live` (`training_metrics`) became the directory `path`
for Dvclive to write logs in, and DVC will now
[track](/doc/use-cases/versioning-data-and-model-files) it. Other supported
command options for the DVC integration:

- `--live-no-cache <path>` - specify a Dvclive log directory `path` but don't
  tracked it with DVC. Useful if you prefer to track it with Git.
- `--live-no-summary` - passes `summary=False` to Dvclive.
- `--live-no-html` - passes `html=False` to Dvclive.

> Note that these are convenience CLI options. You can still use
> `dvclive.init()` manually, which will override any options sent to
> `dvc stage add`. Just be careful to match the `--live` value (CLI) and `path`
> argument (code). Also, note that summary files are never tracked by DVC
> automatically.

Run the training with `dvc repro`:

```bash
$ dvc repro train
```

After that's finished, you should see the following content in the project:

```bash
$ ls
dvc.lock  training_metrics       training_metrics.json
dvc.yaml  training_metrics.html  train.py
```

If you open `training_metrics.html` in a browser, you'll see a plot for metrics
logged during the model training!

![](/img/dvclive_report.png)

💡 Dvclive is also capable of creating _checkpoint_ signal files used by
[experiments](/doc/user-guide/experiment-management). See this example
[repository](https://github.com/iterative/dvc-checkpoints-mnist) to see how.
