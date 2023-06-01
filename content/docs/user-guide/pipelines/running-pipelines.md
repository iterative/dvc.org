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

## Pulling Data

You can combine the `--pull` and `--allow-missing` flags to run a pipeline while
only pulling the data that is actually needed to run the changed stages.

Given the pipeline used in
[example-get-started-experiments](https://github.com/iterative/example-get-started-experiments):

```cli
$ dvc dag
    +--------------------+
    | data/pool_data.dvc |
    +--------------------+
               *
               *
               *
        +------------+
        | data_split |
        +------------+
         **        **
       **            **
      *                **
+-------+                *
| train |              **
+-------+            **
         **        **
           **    **
             *  *
         +----------+
         | evaluate |
         +----------+
```

If we are in a machine where all the data is missing:

```cli
$ dvc status
Not in cache:
  (use "dvc fetch <file>..." to download files)
        models/model.pkl
        data/pool_data/
        data/test_data/
        data/train_data/
```

We can modify the `evaluate` stage and DVC will only pull the necessary data to
run that stage (`models/model.pkl` `data/test_data/`) while skipping the rest of
the stages:

```cli
$ dvc exp run
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' didn't change, skipping
Running stage 'evaluate':
...
```

## Verify Pipeline Status

In scenarios like CI jobs, you may want to check that the pipeline is up to date
without pulling or running anything. You can check that nothing has changed:

<details>

### Clean example

In the example below, data is missing because nothing has been pulled, but
otherwise the pipeline is up to date.

```cli
$ dvc status
data_split:
        changed deps:
                deleted:            data/pool_data
        changed outs:
                not in cache:       data/test_data
                not in cache:       data/train_data
train:
        changed deps:
                deleted:            data/train_data
        changed outs:
                not in cache:       models/model.pkl
evaluate:
        changed deps:
                deleted:            data/test_data
                deleted:            models/model.pkl
data/pool_data.dvc:
        changed outs:
                not in cache:       data/pool_data
```

</details>

```cli
$ dvc exp run --allow-missing --dry
Reproducing experiment 'agley-nuke'
'data/pool_data.dvc' didn't change, skipping
Stage 'data_split' didn't change, skipping
Stage 'train' didn't change, skipping
Stage 'evaluate' didn't change, skipping
```

If anything is not up to date, the pipeline will fail:

<details>

### Dirty example

In the example below, the `data_split` parameter in `params.yaml` was modified,
so the pipeline is not up to date.

```cli
$ dvc status
data_split:
        changed deps:
                deleted:            data/pool_data
                params.yaml:
                        modified:           data_split
        changed outs:
                not in cache:       data/test_data
                not in cache:       data/train_data
train:
        changed deps:
                deleted:            data/train_data
        changed outs:
                not in cache:       models/model.pkl
evaluate:
        changed deps:
                deleted:            data/test_data
                deleted:            models/model.pkl
data/pool_data.dvc:
        changed outs:
                not in cache:       data/pool_data
```

</details>

```cli
$ dvc exp run --allow-missing --dry
Reproducing experiment 'dozen-jogs'
'data/pool_data.dvc' didn't change, skipping
ERROR: failed to reproduce 'data_split': [Errno 2] No such file or directory: '/private/tmp/example-get-started-experiments/data/pool_data'
```

You can also check that all data exists on the remote. The command below will
succeed (return `true` and set the exit code to `0`) if all data is found in the
remote. Otherwise, it will fail (return `false` and set the exit code to `1`).

```cli
$ dvc status -c --json | jq -e '. == {}'
true
```

## Debugging Stages

If you are using advanced features to interpolate values for your pipeline, like
[templating] or [Hydra composition], you can get the interpolated values by
running `dvc exp run -vv`, which will include information like:

```cli
2023-05-18 07:38:43,955 TRACE: Hydra composition enabled.
Contents dumped to params.yaml: {'model': {'batch_size':
512, 'latent_dim': 8, 'lr': 0.01, 'duration': '00:00:30:00',
'max_epochs': 2}, 'data_path': 'fra.txt', 'num_samples':
100000, 'seed': 423}
2023-05-18 07:38:44,027 TRACE: Context during resolution of
stage download: {'model': {'batch_size': 512, 'latent_dim':
8, 'lr': 0.01, 'duration': '00:00:30:00', 'max_epochs': 2},
'data_path': 'fra.txt', 'num_samples': 100000, 'seed': 423}
2023-05-18 07:38:44,073 TRACE: Context during resolution of
stage train: {'model': {'batch_size': 512, 'latent_dim': 8,
'lr': 0.01, 'duration': '00:00:30:00', 'max_epochs': 2},
'data_path': 'fra.txt', 'num_samples': 100000, 'seed': 423}
```

[templating]: /doc/user-guide/project-structure/pipelines-files#templating
[hydra composition]: /docs/user-guide/experiment-management/hydra-composition
