# TensorFlow

DVCLive allows you to add experiment tracking capabilities to your
[TensorFlow](https://www.tensorflow.org/) projects.

## Usage

To start using DVCLive you just need to add a few lines to your training code in
**any** [TensorFlow](https://www.tensorflow.org/) project.

> 💡 If you prefer the Keras API, check the
> [DVCLive - Keras](/docs/dvclive/user-guide/ml-frameworks/keras) page.

You need to add `Live.log()` calls to each place where you would like to log
metrics and one single `Live.next_step()` call to indicate that the epoch has
ended.

let's consider the following example, extracted from the
[official TensorFlow guide](https://www.tensorflow.org/guide/keras/writing_a_training_loop_from_scratch):

```git
+ from dvclive import Live

+ live = Live()

for epoch in range(epochs):
    start_time = time.time()
    for step, (x_batch_train, y_batch_train) in enumerate(train_dataset):
        with tf.GradientTape() as tape:
            logits = model(x_batch_train, training=True)
            loss_value = loss_fn(y_batch_train, logits)
        grads = tape.gradient(loss_value, model.trainable_weights)
        optimizer.apply_gradients(zip(grads, model.trainable_weights))
        train_acc_metric.update_state(y_batch_train, logits)

+    live.log("train/accuracy", float(train_acc_metric.result())
    train_acc_metric.reset_states()

    for x_batch_val, y_batch_val in val_dataset:
        val_logits = model(x_batch_val, training=False)
        val_acc_metric.update_state(y_batch_val, val_logits)
+    live.log("val/accuracy", float(val_acc_metric.result())
    val_acc_metric.reset_states()

+    live.next_step()
```

This will generate the metrics logs and summaries as described in the
[Get Started](/docs/dvclive/get-started#outputs).

> 💡Without requiring additional modifications to your training code, you can
> use DVCLive alongside DVC. See
> [DVCLive with DVC](/doc/dvclive/dvclive-with-dvc) for more info.
