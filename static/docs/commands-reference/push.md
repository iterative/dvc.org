# push

Uploads files and directories from the current branch in the local workspace to
the [remote storage]('doc/commands-reference/remote').

## Synopsis

```usage
    usage: dvc push [-h] [-q | -v] [-j JOBS] [--show-checksums] 
                [-r REMOTE] [-a]
                [-T] [-d] [-R]
                [targets [targets ...]]

    positional arguments:
      targets               DVC files.

```

## Description

The `dvc push` command is the twin pair to the `dvc pull` command, and together
they are the means for uploading and downloading data to and from remote storage.
[Data sharing](/doc/use-cases/share-data-and-model-files) across environments
and preserving data versions (input datasets, intermediate results, models,
metrics, etc) remotely (S3, SSH, GCS, etc) are the most common use cases for
these commands.

The `dvc push` command allows one to upload data to remote storage.

If the `--remote REMOTE` option is not specified, then the default remote,
configured with the `core.config` config option, is used. See `dvc remote`,
`dvc config` and this [example](/doc/get-started/configure) for more information
on how to configure a remote.

With no arguments, just `dvc push` or `dvc push --remote REMOTE`, it uploads
only the files (or directories) that are new in the local repository to the
remote cache. It will not upload files associated with earlier versions or
branches of the project directory, nor will it upload files which have not
changed.

See `dvc remote`, `dvc config` and
[remote storages](https://dvc.org/doc/get-started/configure)
for more information on how to configure the remote storage.

The command `dvc status -c` can list files that are new in the local cache and
are referenced in the current workspace. It can be used to see what files
`dvc push` would upload.

If one or more `targets` are specified, DVC only considers the files associated
with those stages. Using the `--with-deps` option DVC tracks dependencies
backward through the pipeline to find data files to push.

## Options

* `--show-checksums` - shows checksums instead of file names.

* `-r REMOTE`, `--remote REMOTE` specifies which remote cache
  (see `dvc remote list`) to push to. The value for `REMOTE` is a cache name
  defined using the `dvc remote` command. If no `REMOTE` is given, or if no
  remote's are defined in the workspace, an error message is printed. If the
  option is not specified, then the default remote, configured with the
  `core.config` config option, is used.

* `-a`, `--all-branches` - determines the files to upload by examining files
  associated with all branches of the DVC files in the project directory. It's
  useful if branches are used to track "checkpoints" of an experiment or
  project.

* `-T`, `--all-tags` - the same as `-a`, `--all-branches` but tags are used to
  save different experiments or project checkpoints.

* `-d`, `--with-deps` - determines the files to upload by searching backwards
  in the pipeline from the named stage(s). The only files which will be
  considered are associated with the named stage, and the stages which execute
  earlier in the pipeline.

* `-R`, `--recursive` -  the `targets` value is expected to be a directory path.
  With this option, `dvc pull` determines the files to upload by searching the
  named directory, and its subdirectories, for DVC files for which to upload
  data. Along with providing a `target`, or `target` along with `--with-deps`,
  it is yet another way to limit the scope of DVC files to upload.

* `-j JOBS`, `--jobs JOBS` - specifies number of jobs to run simultaneously
  while uploading files to the remote cache. The effect is to control the
  number of files uploaded simultaneously. Default is `4 * cpu_count()`. For
  example with `-j 1` DVC uploads one file at a time, with `-j 2` it uploads
  two at a time, and so forth. For SSH remotes default is set to 4.

* `-h`, `--help` - shows the help message and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc push` command.

## Examples

Using the `dvc push` command remote storage must be defined. For an existing
project a remote is usually defined and you can use `dvc remote list` to check
existing remotes. Just to remind how it is done and set a context for the
example, let's define an SSH remote with the `dvc remote add` command:

```dvc
    $ dvc remote add r1 ssh://_username_@_host_/path/to/dvc/cache/directory
    $ dvc remote list
    r1	ssh://_username_@_host_/path/to/dvc/cache/directory
```

> DVC supports several protocols for remote storage. For details, see the
[`remote add`](/doc/commands-reference/remote-add) documentation.

Push all data file caches from the current Git branch to the default remote:

```dvc
    $ dvc push

    (1/8): [##################################] 100% images/0001.jpg
    (2/8): [##################################] 100% images/0002.jpg
    (3/8): [##################################] 100% images/0003.jpg
    (4/8): [##################################] 100% images/0004.jpg
    (5/8): [##################################] 100% images/0005.jpg
    (6/8): [##################################] 100% images/0006.jpg
    (7/8): [##################################] 100% images/0007.jpg
    (8/8): [#######################           ] 57% model.pkl
```

Push outputs of a specific dvc file:

```dvc
    $ dvc push data.zip.dvc

    [#################################] 100% data.zip
```

## Examples: With dependencies

Demonstrating the `--with-deps` flag requires a larger example.  First, assume
a pipeline has been setup with these stages:

```dvc
    $ dvc pipeline show

    data/Posts.xml.zip.dvc
    Posts.xml.dvc
    Posts.tsv.dvc
    Posts-test.tsv.dvc
    matrix-train.p.dvc
    model.p.dvc
    Dvcfile
```

The local cache has been modified such that the data files in some of these
stages should be uploaded to the remote cache.

```dvc
   $ dvc status --cloud

    	new:            data/model.p
	    new:            data/matrix-test.p
	    new:            data/matrix-train.p
```

One could do a simple `dvc push` to share all the data, but what if you only want
to upload part of the data?

```dvc
    $ dvc push --remote r1 --with-deps matrix-train.p.dvc

    (1/2): [####################] 100% data/matrix-test.p data/matrix-test.p
    (2/2): [####################] 100% data/matrix-train.p data/matrix-train.p

    ... Do some work based on the partial update

    $ dvc push --remote r1 --with-deps model.p.dvc

    (1/1): [####################] 100% data/model.p data/model.p

    ... Pull the rest of the data

    $ dvc push --remote r1

    Everything is up to date.

    $ dvc status --cloud

    Pipeline is up to date. Nothing to reproduce.
```

With the first `dvc push` we specified a stage in the middle of the pipeline
while using `--with-deps`.  This started with the named stage and searched
backwards through the pipeline for data files to upload.  Because the stage
named `model.p.dvc` occurs later in the pipeline its data was not uploaded.

Later we ran `dvc push` specifying the stage `model.p.dvc`, and its data was
uploaded.  And finally we ran `dvc push` with no options to show that all
data had been uploaded.

## Examples: Show checksums

Normally the file names are shown, but DVC can display the checksums instead.

```dvc
    $ dvc push --remote r1 --show-checksums

    (1/3): [####################] 100% 844ef0cd13ff786c686d76bb1627081c
    (2/3): [####################] 100% c5409fafe56c3b0d4d4d8d72dcc009c0
    (3/3): [####################] 100% a8c5ae04775fcde33bf03b7e59960e18
```
