# Sharing Data

## Pushing data to the cloud

We've gone over how source code and [DVC-files](/doc/user-guide/dvc-file-format)
can be shared using a Git repository. These <abbr>DVC repositories</abbr> will
contain all the information needed for reproducibility, so it might be a good
idea to share them with your team using Git hosting services (such as
[GitHub](https://github.com/)).

DVC is able to push the <abbr>cache</abbr> to cloud storage.

> Using shared cloud storage, a colleague can reuse ML models that were trained
> on your machine.

First, you need to setup remote storage for the <abbr>project</abbr>, that will
be stored in the project's
[config file](https://dvc.org/doc/user-guide/dvc-files-and-directories). This
can be done using the CLI as shown below.

> Note that we are using the `dvc-public` S3 bucket as an example and you don't
> have write access to it, so in order to follow the tutorial you will need to
> either create your own S3 bucket or use other types of
> [remote storage](/doc/command-reference/remote). E.g. you can set up a local
> remote as we did in the [Configure](/doc/tutorials/get-started/configure)
> chapter of _Get Started_.

```dvc
$ dvc remote add -d upstream s3://dvc-public/remote/tutorial/nlp
$ git status -s
 M .dvc/config
```

Then, a simple command pushes files from your cache to the cloud:

```dvc
$ dvc push
```

The command does not push all cached files, but only the ones currently
references in the <abbr>workspace</abbr>.

For example, in this tutorial 16 data files were created and only 9 will be
pushed because the rest of the data files belong to different branches like
`bigrams`.

## Pulling data from the cloud

In order to reuse your data files, a colleague can pull data the same way from
the master branch:

```dvc
$ git clone https://github.com/iterative/example-get-started.git
$ cd example-get-started
$ dvc pull data/data.xml.dvc prepare.dvc
```

After running `dvc pull` above, all the data files related to the
['prepare' stage](https://github.com/iterative/example-get-started/blob/master/prepare.dvc)
in that repo should be in the right place. You can confirm this by trying to
reproduce the default goal:

```dvc
$ dvc repro prepare.dvc
Data and pipelines are up to date.
```
