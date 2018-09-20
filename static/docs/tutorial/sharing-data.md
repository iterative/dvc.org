# Sharing Data

## Pushing data to the cloud

It is pretty clear how code and DVC-files can be shared through Git
repositories. These repositories will contain all the information needed for
reproducibility and it might be a good idea to share these DVC-repositories by
GitHub or other Git services.

DVC is able to push the cache to a cloud.

> Using your shared cache a colleague can reuse ML model that were trained in
your machine.

First, you need to modify the cloud settings in the DVC config file. This can be done
programmatically:

```dvc
    $ dvc config core.cloud AWS
    $ dvc config AWS.StoragePath dvc-share/classify
    $ git status -s
     M .dvc/config
```

Then, a simple command pushes files from your local cache to the cloud:

```dvc
    $ dvc push
    (1/9): [#########################] 100% 23/404ed8212fc1ee6f5a81ff6f6df2ef
    (2/9): [##########               ] 34% 5f/42ecd9a121b4382cd6510534533ec3
```

The command does not push all the caches but only caches for data files that
belong to the current repository workspace.

For example, in this tutorial 16 data files were created and only 9 will be
pushed because the rest of the data files belong to different branches like
`bigram`.

## Pulling data from cloud

In order to reuse your data files, a colleague of yours can pull data the
same way from the master branch:

```dvc
    $ git clone https://github.com/dmpetrov/classify.git
    $ dvc config AWS.StoragePath dvc-share/classify
    $ dvc pull
```

After this command all the data files will be in the right place. You can check
that by trying to reproduce the default goal:

```dvc
    # Nothing to reproduce:
    $ dvc repro
```
