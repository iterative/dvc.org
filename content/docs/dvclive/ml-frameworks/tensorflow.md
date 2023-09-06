# TensorFlow

DVCLive allows you to add experiment tracking capabilities to your
[TensorFlow](https://www.tensorflow.org/) projects.

## Usage

<admon type="tip">

If you prefer the Keras API, check the
[DVCLive - Keras](/doc/dvclive/ml-frameworks/keras) page.

</admon>

You need to add `Live.log_metric()` calls to each place where you would like to
log metrics and one single `Live.next_step()` call to indicate that the epoch
has ended.

let's consider the following example, extracted from the
[official TensorFlow guide](https://www.tensorflow.org/guide/keras/writing_a_training_loop_from_scratch):

```python
from dvclive import Live

with Live() as live:

    for epoch in range(epochs):
        start_time = time.time()
        for step, (x_batch_train, y_batch_train) in enumerate(train_dataset):
            with tf.GradientTape() as tape:
                logits = model(x_batch_train, training=True)
                loss_value = loss_fn(y_batch_train, logits)
            grads = tape.gradient(loss_value, model.trainable_weights)
            optimizer.apply_gradients(zip(grads, model.trainable_weights))
            train_acc_metric.update_state(y_batch_train, logits)

        live.log_metric("train/accuracy", float(train_acc_metric.result())
        train_acc_metric.reset_states()

        for x_batch_val, y_batch_val in val_dataset:
            val_logits = model(x_batch_val, training=False)
            val_acc_metric.update_state(y_batch_val, val_logits)
        live.log_metric("val/accuracy", float(val_acc_metric.result())
        val_acc_metric.reset_states()

        live.next_step()
```
