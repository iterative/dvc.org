# Best Practices for DVC Projects

DVC provides a systematic approach towards managing and collaborating on data
science projects. You can manage your projects with DVC more efficiently using
the practices listed here:

## Source code and data versioning

You can use DVC to avoid discrepancies between
[revisions](https://git-scm.com/docs/revisions) of source code and
[versions](/doc/use-cases/versioning-data-and-model-files) of data files. DVC
replaces all large data files, models, etc. with small
[metafiles](doc/user-guide/dvc-files-and-directories) (tracked by Git). These
files point to the original data, which you can access by first checking out the
required `revision` using Git followed by `dvc checkout` to update DVC tracked
data files/dir:

```dvc
$ git checkout 95485f   # Git commit of required data version
$ dvc checkout
```

If your dataset consist of multiple files like images, etc. then the best way to
track whole directory is with single `.dvc` file. You can use `dvc add` with
relative path to directory:

```dvc
$ dvc add data/images
```

## Experiments and tracking parameters

You can use DVC for tuning [parameters](doc/command-reference/params), improving
target [metrics](doc/command-reference/metrics) and visualizing the changes with
[plots](doc/command-reference/plots). In the first step tune parameters in
default `params.yaml` file and reproduce the pipeline:

```dvc
$ dvc repro        # Reproducing pipeline
$ git add -am "Epoch Experiment"
```

Commit the new changes in files using Git. Next step is to compare the
experiments. Use `dvc metrics` to find difference in target metric between two
commits:

```dvc
$ dvc metrics diff rev1 rev2
```

And finally you can plot target metrics using `dvc plots`:

```dvc
$ dvc plots diff -x recall -y precision rev1 rev2
```

If you want to recover a model from last week without wasting time required for
the model to retrain you can use DVC to navigate through your experiments. First
you can checkout the required `revision` using Git:

```dvc
$ git checkout baseline-experiment   # Git commit, tag or branch
$ dvc checkout
```

Followed by `dvc checkout` to update DVC-tracked files and directories in your
workspace.

If you are training different models on your data files in the same project,
using Git commits, tags, or branches makes it easy to manage the project. Have a
look at this [example]() to see how this works.

## Reproducibility

You can run a model's evaluation process again without actually retraining the
model and preprocessing a raw dataset. DVC provides a way to reproduce pipelines
partially. You can use `dvc repro` to execute evaluation stage without
reproducing complete pipeline:

```dvc
$ dvc repro evaluate
```

## Managing and sharing large data files

Cloud or local storage can be used to store the project's data. You can share
the entire 147 GB of your ML project, with all of its data sources, intermediate
data files, and models with others if they are stored on
[remote storage](doc/command-reference/remote/add#supported-storage-types).
Using this you can share models trained in a GPU environment with colleagues who
don't have access to a GPU. Have a look at this
[example](doc/command-reference/pull#example-download-from-specific-remote-storage)
to see how this works.

## Manually editing dvc.yaml or .dvc files

It's safe to edit `dvc.yaml` and `.dvc` files. Here's a `dvc.yaml` example:

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
      - data/data.xml
    params:
      - prepare.split
    outs:
      - data/prepared
```

You can manually edit all the fields present in `dvc.yaml`. However, in `.dvc`
files please remember not to change the `md5` or `checksum` fields as they
contain hash values which DVC uses to track the file or directory.

## Never store credentials in project config

Do not store any user credentials in project config file. This file can be found
by default in `.dvc/config`. Use `--local`, `--global`, or `--system` command
options with `dvc config` for storing sensitive, or user-specific settings:

```dvc
$ dvc config --system remote.username [password]
```

## Tracking <abbr>outputs</abbr> by Git

If your `output` files are small in size and you want to track them with Git
then you can use `--outs-no-cache` option to define outputs while creating or
modifying a stage. DVC will not track will not track outputs in this case:

```dvc
$ dvc run -n train -d src/train.py -d data/features \
          ---outs-no-cache model.p \
          python src/train.py data/features model.pkl
```
