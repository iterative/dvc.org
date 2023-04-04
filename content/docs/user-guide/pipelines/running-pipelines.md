# Running pipelines

To run a pipeline, you can use `dvc exp run`. This will run the pipeline and
save the results as an [experiment](/doc/user-guide/experiment-management):

```cli
$ dvc exp run
'data/data.xml.dvc' didn't change, skipping
Running stage 'prepare':
> python src/prepare.py data/data.xml
Updating lock file 'dvc.lock'

Running stage 'featurize':
> python src/featurization.py data/prepared data/features
Updating lock file 'dvc.lock'

Running stage 'train':
> python src/train.py data/features model.pkl
Updating lock file 'dvc.lock'

Running stage 'evaluate':
> python src/evaluate.py model.pkl data/features
Updating lock file 'dvc.lock'

Ran experiment(s): barer-acts
Experiment results have been applied to your workspace.
```

If you do not want to save the results as an experiment, you can use
`dvc repro`, which is similar but does not save an experiment or have the other
experiment-related features of `dvc exp run`.

<admon type="info">

Stage outputs are deleted from the <abbr>workspace</abbr> before executing the
stage commands that produce them (unless `persist: true` is used in `dvc.yaml`).

</admon>

## DAG

DVC runs the [DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph) stages
sequentially, in the order defined by the
[dependencies](/doc/user-guide/pipelines/defining-pipelines#simple-dependencies)
and [outputs](/doc/user-guide/pipelines/defining-pipelines#outputs). Consider
this example `dvc.yaml`:

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - data/data.xml
      - src/prepare.py
    params:
      - prepare.seed
      - prepare.split
    outs:
      - data/prepared
  featurize:
    cmd: python src/featurization.py data/prepared data/features
    deps:
      - data/prepared
      - src/featurization.py
    params:
      - featurize.max_features
      - featurize.ngrams
    outs:
      - data/features
```

The `prepare` stage will always precede the `featurize` stage because
`data/prepared` is an **output** of `prepare` and a **dependency** of
`featurize`.

## Caching Stages

DVC will try to avoid recomputing stages that have been run before. If you run a
stage without changing its commands,
[dependencies](/doc/user-guide/pipelines/defining-pipelines#simple-dependencies),
or
[parameters](/doc/user-guide/pipelines/defining-pipelines#parameter-dependencies),
DVC will skip that stage:

```cli
Stage 'prepare' didn't change, skipping
```

DVC will also recover the outputs from previous runs using the
[run cache](/doc/user-guide/pipelines/run-cache):

```
Stage 'prepare' is cached - skipping run, checking out outputs
```

If you want a stage to run every time, you can use
[always changed](/doc/user-guide/project-structure/dvcyaml-files#stage-entries)
in `dvc.yaml`:

```yaml
stages:
  pull_latest:
    cmd: python pull_latest.py
    deps:
      - pull_latest.py
    outs:
      - latest_results.csv
    always_changed: true
```
