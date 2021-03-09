# Usage Guide

We will use sample [MNIST classification](http://yann.lecun.com/exdb/mnist/)
training code in order to see how one can introduce Dvclive into the workflow.

> Note that [keras](https://keras.io/about/#installation-amp-compatibility) is
> required throughout these examples.

```python
# train.py

from keras.datasets import mnist
from keras.models import Sequential
from keras.layers.core import Dense, Activation
from keras.utils import np_utils

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

model.fit(x_train,
          y_train,
          validation_data=(x_test, y_test),
          batch_size=128,
          epochs=3)
```

> You may want to run the code manually to verify that the model gets trained.

In this example we are training the `model` for 3 epochs. Lets use `dvclive` to
log the `accuracy`, `loss`, `validation_accuracy` and `validation_loss` after
each epoch, so that we can observe how the training progresses.

In order to do that, we will provide a
[`Callback`](https://keras.io/api/callbacks/) for the `fit` method call:

```python
from keras.callbacks import Callback
import dvclive
class MetricsCallback(Callback):
    def on_epoch_end(self, epoch: int, logs: dict = None):
        logs = logs or {}
        for metric, value in logs.items():
            dvclive.log(metric, value)
        dvclive.next_step()
```

On the end of each epoch, this callback will iterate over the gathered metrics
(`logs`) and use the `dvclive.log()` function to record their respective value.
After that we call `dvclive.next_step()` to signal Dvclive that we are done
logging for the current iteration.

And in order to make that work, we need to plug it in with this change:

```diff
+ dvclive.init("training_metrics")
  model.fit(x_train,
            y_train,
            validation_data=(x_test, y_test),
            batch_size=128,
-           epochs=3)
+           epochs=3,
+           callbacks=[MetricsCallback()])
```

We call `dvclive.init()` first, which tells Dvclive to write metrics under the
diven directory path (in this case `./training_metrics`).

After running the code, the `training_metrics` should be created:

```bash
$ ls
training_metrics  training_metrics.json  train.py
```

The `*.tsv` files inside have names corresponding to the metrics logged during
training. Note that a `training_metrics.json` file has been created as well.
It's contains information about latest training step. You can prevent its
creation by sending `summary = False` to `dvclive.init()` (see all the
[options](#initial-configuration)).

```bash
$ ls training_metrics
accuracy.tsv  loss.tsv  val_accuracy.tsv  val_loss.tsv
```

Each file contains metrics values logged in each epoch. For example:

```bash
$ cat training_metrics/accuracy.tsv
timestamp	step	accuracy
1614129197192	0	0.7612833380699158
1614129198031	1	0.8736833333969116
1614129198848	2	0.8907166719436646
```

## Initial configuration

These are the arguments accepted by `dvclive.init()`:

- `path` (**required**) - directory where `dvclive` will write TSV log files

- `step` (`0` by default) - the `step` values in log files will start
  incrementing from this value.

- `resume` (`False`) - if set to `True`, Dvclive will try to read the previous
  `step` from the `path` dir and start from that point (unless a `step` is
  passed explicitly). Subsequent `next_step()` calls will increment the step.

- `summary` (`True`) - upon each `next_step()` call, Dvclive will dump a JSON
  file containing all metrics gathered in the last step. This file uses the
  following naming: `<path>.json` (`path` being the logging directory passed to
  `init()`).

- `html` (`True`) - works only when Dvclive is used alongside DVC. If true, upon
  each `next_step()` call, DVC will prepare summary of the training currently
  running, with all metrics logged in `path`.
