# Resume training

When using [DVC Checkpoints](/doc/user-guide/experiment-management/checkpoints)
and/or enabling DVCLive's [`resume`](/doc/dvclive/api-reference/live#parameters)
you need to add the flag
[`persist: true`](/doc/user-guide/project-structure/pipelines-files#output-subfields)
to all DVCLive outputs in `dvc.yaml`:

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

You can pass `--type checkpoint` to `dvc exp init` in order to generate a
`dvc.yaml` like the above:

```dvc
$ dvc exp init \
--live "training_metrics" \
--code "train.py" \
--type checkpoint \
python train.py
```
