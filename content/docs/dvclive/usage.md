# Usage

We will use sample [MNIST classification](http://yann.lecun.com/exdb/mnist/)
training code in order to see how one can introduce `dvclive` into the workflow.
In order to run the example,
[keras](https://keras.io/about/#installation-amp-compatibility) is required.

The training code (`train.py` file):

```python
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

Run the code to verify the training is executing.

In this example we are training the `model` for 3 epochs. Lets use `dvclive` to
log the `accuracy`, `loss`, `validation_accuracy` and `validation_loss` after
each epoch, so that we can observe how our training progresses.

In order to do that, we will need to provide proper
[`Callback`](https://keras.io/api/callbacks/) for `fit` method:

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

We created callback, that, on the end of each epoch, will iterate over gathered
metrics (`logs`) and use `dvclive.log` function to log their respective value.
After logging the metrics, we call `dvclive.next_step` function to signal
`dvclive` that we are done with metrics logging for current epoch.

In order to make it work with the training code, we need to do one more change,
we need to replace:

```python
model.fit(x_train,
          y_train,
          validation_data=(x_test, y_test),
          batch_size=128,
          epochs=10)
```

with:

```python
dvclive.init("training_metrics")
model.fit(x_train,
          y_train,
          validation_data=(x_test, y_test),
          batch_size=128,
          epochs=3,
          callbacks=[MetricsCallback()])
```

We call `dvclive.init` to tell `dvclive` to write metrics under
`training_metrics` directory. We also provide `callbacks` argument for `fit`
method with newly created callback.

Rerun the code.

After running the code, you can see that `training_metrics` directory has been
created.

```bash
$ ls
training_metrics  training_metrics.json  train.py
```

`training_metrics` directory contains `*.tsv` files with names respective to
metrics logged during training:

```bash
$ tree training_metrics

training_metrics
├── accuracy.tsv
├── loss.tsv
├── val_accuracy.tsv
└── val_loss.tsv
```

Each of the files contains metric values logged in every training step:

```bash
$ cat training_metrics/accuracy.tsv

timestamp	step	accuracy
1614129197192	0	0.7612833380699158
1614129198031	1	0.8736833333969116
1614129198848	2	0.8907166719436646
```

### Configuring dvclive

Besides `training_metrics `directory, `training_metrics.json` has been created.
It's a file containing information about latest training step. You can prevent
its creation by providing proper `dvclive.init` config flag.

Args supported by `dvclive.init`:

- `path` - directory where `dvclive` will write its outputs
- `resume` (`False` by default) - If set to `True`, `dvclive` will try to read
  latest `step` from `{path}` dir. Following `next_step` calls will increment
  basing on found value.
- `step` (`0`) - If set, the `step` values in logs files will start incrementing
  from given value. If provided alongside `resume`, `dvclive` will not try to
  find latest `step` in `{path}` and start from `step`.
- `summary` (`True`) - upon each `next_step` call `dvclive` will dump a json
  file containing all metrics gathered in last step. The json file has the
  following name: `{path}.json`.
- `html` (`True`) - works only when `dvclive` is used alongside DVC. If true,
  upon each `next_step` call, DVC will prepare summary of currently running
  training with all metrics logged in `{path}`.
