# Versioning Data and Model Files

DVC enables versioning large files and directories such as datasets, data
science features, and machine learning models using Git, but without storing the
contents in Git.

This is achieved by saving information about the data in special
[metafiles](/doc/user-guide/dvc-files-and-directories) that replace the data in
the repository. These can be versioned with regular Git workflows (branches,
pull requests, etc.)

To actually store the data, DVC uses a built-in <abbr>cache</abbr>, and supports
synchronizing it with various types of
[remote storage](/doc/command-reference/remote). This allows storing and sharing
data easily, and alongside code.

![](/img/model-versioning-diagram.png) _Code and data flows in DVC_

In this basic use case, DVC is a better alternative to
[Git-LFS / Git-annex](/doc/user-guide/related-technologies) and to ad-hoc
scripts used to manage ML <abbr>artifacts</abbr> (training data, models, etc.)
on cloud storage. DVC doesn't require special services, and works with
on-premises storage (e.g. SSH, NAS) as well as any major cloud storage provider
(Amazon S3, Microsoft Azure, Google Drive,
[among others](/doc/command-reference/remote/add#supported-storage-types)).

> For hands-on experience, we recommend following the
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files).

## DVC is not Git!

DVC metafiles such as `dvc.yaml` and `.dvc` files serve as placeholders to track
data files and directories (among other purposes). They point to specific data
contents in the <abbr>cache</abbr>, providing the ability to store multiple data
versions out-of-the-box.

Full-fledged
[version control](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control)
is left for Git and its hosting platforms (e.g. GitHub, GitLab) to handle. These
are designed for source code management (SCM) however, and thus ill-equipped to
support data science needs. That's where DVC comes in: with its built-in data
<abbr>cache</abbr>, reproducible [pipelines](/doc/start/data-pipelines), among
several other novel features (see [Get Started](/doc/start/) for a primer.)

## Track data and models for versioning

Let's say you have an empty <abbr>DVC repository</abbr> and put a dataset of
images in the `images/` directory. You can start tracking it with `dvc add`.
This generate a `.dvc` file, which can be committed to Git in order to save the
project's version:

```dvc
$ ls images/
0001.jpg 0002.jpg 0003.jpg 0004.jpg ...

$ dvc add images/

$ git add images.dvc .gitignore
$ git commit -m "Track images dataset with DVC."
```

DVC's also allows to define the processes that build artifacts based on tracked
data, such as an ML model, by writing a simple `dvc.yaml` file that connects the
pieces together:

> `dvc.yaml` files can be written manually or generated with `dvc run`.

```yaml
stages:
  train:
    cmd: python train.py images/
    deps:
      - images
    outs:
      - model.pkl
```

> See [Data Pipelines](/doc/start/data-pipelines) for a comprehensive intro to
> this feature.

`dvc repro` can now execute the `train` stage for you. DVC will track all of its
outputs (`outs`) automatically. Let's do that, and commit this project version:

```dvc
$ dvc repro
Running stage 'train' with command:
        python train.py images/
Updating lock file 'dvc.lock'
...

$ git add dvc.yaml dvc.lock .gitignore
$ git commit -m "Train model via DVC."
$ git tag -a "v1.0" -m "Fist model"   # We'll use this soon ;)
```

> See also `dvc.lock`.

## Switching versions

After iterating on this process and producing several versions, you can combine
`git checkout` and `dvc checkout` to perform full or partial
<abbr>workspace</abbr> restorations.

![](/img/versioning.png) _Code and data checkout_

> Note that `dvc install` enables auto-checkouts of data after `git checkout`.

A full checkout brings the whole <abbr>project</abbr> back to a previous version
— code, dataset and model files all match each other:

```dvc
$ git checkout v1.0
$ dvc checkout
M       images
M       model.pkl
```

However, we can checkout certain parts only, for example if we want to keep the
latest source code and model but rewind to the previous dataset only:

```dvc
$ git checkout v1.0 images.dvc
$ dvc checkout images.dvc
M       images
```

DVC [optimizes](/doc/user-guide/large-dataset-optimization) this operation by
avoiding copying files each time, so checking out data is quick even if you have
large data files.
