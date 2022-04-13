<details>

### ⚙️ Run multiple experiments in parallel

Instead of running the experiments one-by-one, we can define them to run in a
batch. This is especially handy when you have long running experiments.

We add experiments to the queue using the `--queue` option of `dvc exp run`. We
also use `-S` (`--set-param`) to set a value for the parameter.

```dvc
$ dvc exp run --queue -S model.conv_units=32
Queued experiment '3cac8c6' for future execution.
$ dvc exp run --queue -S model.conv_units=64
Queued experiment '23660b6' for future execution.
$ dvc exp run --queue -S model.conv_units=128
Queued experiment '6591a57' for future execution.
$ dvc exp run --queue -S model.conv_units=256
Queued experiment '9109ea9' for future execution.
```

Next, run all (`--run-all`) queued experiments in parallel. You can specify the
number of parallel processes using `--jobs`:

```dvc
$ dvc exp run --run-all --jobs 2
```

</details>
