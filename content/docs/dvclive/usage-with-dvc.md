# dvclive with DVC

Even though dvclive does not require DVC to function properly, it includes a lot
of integrations with DVC that user might find valuable. In this section we will
modify the [example from previous one](/doc/dvclive/usage) to see how DVC can
cooperate with dvclive.

Let's use the code prepared in previous example and try to make it work with
dvc. Training file `train.py` content:

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


from keras.callbacks import Callback
import dvclive

class MetricsCallback(Callback):
    def on_epoch_end(self, epoch: int, logs: dict = None):
        logs = logs or {}
        for metric, value in logs.items():
            dvclive.log(metric, value)
        dvclive.next_step()

(x_train, y_train), (x_test, y_test) = load_data()
model = get_model()

dvclive.init("training_metrics")
model.fit(x_train,
          y_train,
          validation_data=(x_test, y_test),
          batch_size=128,
          epochs=3,
          callbacks=[MetricsCallback()])
```

DVC provides extensive integration with dvclive. When one is using dvclive in a
project managed by DVC, there is no need for manual initialization of dvclive
inside the code.

So in case of our code we can remove the following line:

```python
dvclive.init("training_metrics")
```

Now, lets use dvc to run the project:

```dvc
$ dvc run -n train --live training_metrics -d train.py python train.py
```

DVC integration will allow to pass the information that `training_metrics` is
`path` argument for `dvclive.init`. Other supported args for DVC integration:

- `--live-no-summary` - passes `summary=False` into the `dvclive`.
- `--live-no-html` - passes `html=False` into the `dvclive`.

> Note that those `dvc run` params are only convinience methods. If you decide
> to invoke `dvclive.init` manually, the manual call config will override
> provided `run` args. In such case your `path` arg for `dvclive.init` must
> match `--live` argument.

After the training is done you should see following content:

```bash
$ ls

dvc.lock  training_metrics       training_metrics.json
dvc.yaml  training_metrics.html  train.py
```

`training_metrics.json` and `training_metrics.html` are there because we did not
provide `--live-no-sumary` nor `--live-no-html`. If you will open
`training_metrics.html` in your browser, you will get plots for metrics logged
during the training.

![](/img/dvclive_report.png)

In `dvc.yaml` there is new stage defined, containing information about the
`dvclive` outputs:

```bash
$ cat dvc.yaml

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
