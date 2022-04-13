<details>

### ℹ️ More information about metrics

Metrics are what you use to evaluate your models. DVC associates metrics to
experiments for later comparison. Any scalar value can be used as a metric. You
can specify text files to contain metrics using `dvc exp init --metrics`, and
write them in the experimentation code.

An alternative to manual metrics generation is to use [DVCLive](/doc/dvclive) to
generate these files. Please refer to the documentation for details.

`dvc exp show` and `dvc metrics` are used to tabulate the experiments and Git
commits with their associated metrics. In the above tables, `loss` and `acc`
values are metrics found in [`metrics.json`] file.

Metrics files are interpreted specially also in
[Iterative Studio](https://studio.iterative.ai).

[`metrics.json`]:
  https://github.com/iterative/example-dvc-experiments/blob/main/metrics.json

</details>
