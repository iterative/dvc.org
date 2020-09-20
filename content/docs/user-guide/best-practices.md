# Best Practices for DVC Projects

DVC provides a systematic approach towards managing and collaborating on data
science projects. Here are a few recommended practices to organize your workflow
and project structure effectively:

> See also these quick [tips & tricks](/doc/user-guide/tips-and-tricks).

## Matching source code to data

One of DVC's basic uses is to avoid a disconnection between
[revisions](https://git-scm.com/docs/revisions) of source code and
[versions](/doc/use-cases/versioning-data-and-model-files) of data. DVC replaces
large data files and directories, models, etc. with small
[metafiles](/doc/user-guide/dvc-files-and-directories), which you can track with
Git, along with the corresponding code.

These metafiles point to the original data, which is <abbr>cached</abbr>
automatically. You can access it later by restoring that Git working tree (e.g.
with `git checkout`) and using `dvc checkout` to update DVC tracked data
files/dir:

```dvc
$ git checkout 95485f  # Git commit of a desired project version
$ dvc checkout
```

> See
> [Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files)
> for more details.

## Using directories as single data units

If your dataset consist of multiple files like images, etc. then the best way to
track it is
[as a directory](/doc/command-reference/add#adding-entire-directories), with a
single `.dvc` file:

```dvc
$ dvc add data/images/
```

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

## Managing and sharing large data

Traditional or cloud storage can be used to store the project's data. You can
share the entire 147 GB of your ML project, with all of its data sources,
intermediate data files, and models with others by setting up DVC
[remote storage](doc/command-reference/remote) (optional).

This way you can share models trained in a GPU environment with colleagues who
don't have access to GPUs.

## Never store secrets in the shared config file

Do not put user credentials in the default config file (`.dvc/config`), which is
tracked by Git. Use the `--local`, `--global`, or `--system` options of
`dvc config` to provide sensitive or user-specific settings:

```dvc
$ dvc config --local remote.password mypassword  # just here
$ dvc config --global core.checksum_jobs 16      # all my projest
$ dvc config --system core.check_update false    # all users
```

## Tracking experiments with Git

If you are training different models on your data files in the same project,
using Git commits, tags, or branches makes it easy to manage the project.

<!-- TODO: needs much elaboration! -->

## Basic experimentation flow

Use DVC for [reproducing](/doc/command-reference/repro) experiments after tuning
their [parameters](/doc/command-reference/params), tracking resulting
[metrics](/doc/command-reference/metrics), and visualizing their evolution with
[plots](/doc/command-reference/plots).

For example, let's first setup some parameters in `params.yaml` and reproduce
the pipeline:

<!-- TODO: sample params file -->

```dvc
$ dvc repro
```

<!-- TODO: what about the command output above? -->

Commit the changes using Git. Having some commits allows us to compare the
experiments using `dvc metrics diff`:

```dvc
$ dvc metrics diff rev1 rev2
```

<!-- TODO: command output above? -->

Finally, you can see how certain metrics evolved using `dvc plots diff`:

```dvc
$ dvc plots diff -x recall -y precision rev1 rev2
```

<!-- TODO: insert plot img -->

If you want to recover a model from last week without wasting time required to
retrain the model, you can use Git and DVC to navigate through your experiments:

```dvc
$ git checkout baseline-experiment   # Git commit, tag or branch
$ dvc checkout
```
