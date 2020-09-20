# Tips and tricks for DVC Projects

Using the methods listed here, you can manage your DVC projects more
efficiently.

## Switching between datasets

You can quickly switch between a large dataset and a small subset without
modifying source code: Change the dependencies of stage, either by manually
editing the stage in `dvc.yaml` or by using `dvc run` again with `-f`.

<!-- TODO: needs actual example -->

## Tracking small data with Git

If your `output` files are small in size and you want to track them with Git
then you can use `--outs-no-cache` option to define outputs while creating or
modifying a stage. DVC will not track will not track outputs in this case:

```dvc
$ dvc run -n train -d src/train.py -d data/features \
          ---outs-no-cache model.p \
          python src/train.py data/features model.pkl
```

## Partial reproducibility

You can run a model's evaluation process again without preprocessing a raw
dataset again, or retraining the model. Pass a target stage to `dvc repro` to
execute only the necessary parts of the pipeline:

```dvc
$ dvc repro evaluate
```

## User metadata in DVC metafiles

DVC provides an optional `meta` field for `dvc.yaml` and `.dvc` metafiles
(that's very meta!). It can be used to add any user information (as YAML content
e.g. `"a string"`).
