# TensorFlow/Keras

The DVCLive - TensorFlow / Keras integration allows you to easily add experiment
tracking capabilities to your Pytorch projects.

The integration is
[maintained in the DVCLive repository](https://github.com/iterative/dvclive/blob/master/dvclive/keras.py)

## About TensorFlow/Keras

[TensorFlow](https://www.tensorflow.org/) is an end-to-end open source platform
for machine learning. It has a comprehensive, flexible ecosystem of tools,
libraries, and community resources that lets researchers push the
state-of-the-art in ML and developers easily build and deploy ML-powered
applications.

[Keras](https://keras.io/) is a central part of the tightly-connected TensorFlow
2.0 ecosystem, covering every step of the machine learning workflow, from data
management to hyperparameter training to deployment solutions.

## Usage

To start using the integration you just need to add a few lines to your training
loop in **any** TensorFlow/Keras project.

You just need to add the `DvcLiveCallback` to the callbacks list passed to your
`model`:

```git
+from dvclive.keras import DvcLiveCallback

model.fit(
    train_dataset,
    epochs=num_epochs,
-    validation_data=validation_dataset)
+    validation_data=validation_dataset,
+    callbacks=[DvcLiveCallback()])
```

This will generate the metrics logs and summaries as described in the
[Quickstart](/docs/dvclive/user-guide/quickstart#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use the DVCLive - TensorFlow/Keras integration alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/user-guide/dvclive-with-dvc) for more info.

## Parameters

- `model_file` - The name of the file where the model will be saved at the end
  of each `step`.

- `save_weights_only` (`False` by default) - if True, then only the model's
  weights will be saved (`model.save_weights(model_file)`), else the full model
  is saved (`model.save(model_file)`)

Example:

```python
from dvclive.keras import DvcLiveCallback

model.fit(
    train_dataset,
    epochs=num_epochs,
    validation_data=validation_dataset,
    callbacks=[DvcLiveCallback(
        model_file="my_model_weights.h5",
        save_weights_only=True)])
```

## Example repository

You can find a fully working example using the DVCLive - TensorFlow/Keras
integration in the following link:

https://github.com/iterative/example-ml-frameworks/tree/keras
