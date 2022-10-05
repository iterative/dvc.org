# Integrate with DVC Checkpoints

When using [DVC Checkpoints](/doc/user-guide/experiment-management/checkpoints)
and/or enabling DVCLive's [`resume`](/doc/dvclive/api-reference/live#parameters)
you need to add the flag
[`persist: true`](/doc/user-guide/project-structure/pipelines-files#output-subfields)
to all DVCLive outputs in `dvc.yaml`.

Adding `--type checkpoint` to `dvc exp init` will take care of doing this when
generating the `dvc.yaml`:

```dvc
$ dvc exp init \
--live "training_metrics" \
--code "train.py" \
--type checkpoint \
python train.py
```

The resulting `dvc.yaml` would look as follows:

```yaml
stages:
  train:
    cmd: python train.py
    deps:
      - data
      - train.py
    params:
      - params.yaml:
    outs:
      - models:
          checkpoint: true
    metrics:
      - training_metrics.json:
          cache: false
          persist: true
    plots:
      - training_metrics/scalars:
          cache: false
          persist: true
```
