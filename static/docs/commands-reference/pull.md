# pull

Downloads missing files and directories from
[remote storage](/doc/commands-reference/remote) to the local cache based on DVC
files in the workspace, then links the downloaded files into the workspace.

## Synopsis

```usage
usage: dvc pull [-h] [-q | -v] [-j JOBS]
                [--show-checksums] [-r REMOTE]
                [-a] [-T] [-d] [-f] [-R]
                [targets [targets ...]]

Pull data files from the cloud.

positional arguments:
  targets               DVC files.
```

## Description

The `dvc pull` and `dvc push` commands are the means for uploading and
downloading data to and from remote storage. These commands are analogous to the
`git pull` and `git push` commands.
[Data sharing](/doc/use-cases/share-data-and-model-files) across environments
and preserving data versions (input datasets, intermediate results, models,
metrics, etc) remotely (S3, SSH, GCS, etc) are the most common use cases for
these commands.

The `dvc pull` command allows one to retrieve data from remote storage.
`dvc pull` has the same effect as running `dvc fetch` and `dvc checkout`
immediately after that.

If the `--remote REMOTE` option is not specified, then the default remote,
configured with the `core.config` config option, is used. See `dvc remote`,
`dvc config` and this [example](/doc/get-started/configure) for more information
on how to configure a remote.

With no arguments, just `dvc pull` or `dvc pull --remote REMOTE`, it downloads
only the files (or directories) missing from the local repository to the project
directory. It will not download files associated with earlier versions or
branches of the project directory, nor will it download files which have not
changed.

The command `dvc status -c` can list files that are missing in the local cache
and are referenced in the current workspace. It can be used to see what files
`dvc pull` would download.

If one or more `targets` are specified, DVC only considers the files associated
with those stages. Using the `--with-deps` option DVC tracks dependencies
backward through the pipeline to find data files to pull.

After data file is in cache DVC, `dvc pull` uses OS-specific mechanisms like
reflinks or hardlinks to put it in the workspace without copying. See
`dvc checkout` for more details.

## Options

- `--show-checksums` - shows checksums instead of file names.

- `-r REMOTE`, `--remote REMOTE` specifies which remote cache (see
  `dvc remote list`) to pull from. The value for `REMOTE` is a cache name
  defined using the `dvc remote` command. If no `REMOTE` is given, or if no
  remote's are defined in the workspace, an error message is printed. If the
  option is not specified, then the default remote, configured with the
  `core.config` config option, is used.

- `-a`, `--all-branches` - determines the files to download by examining files
  associated with all branches of the DVC files in the project directory. It's
  useful if branches are used to track "checkpoints" of an experiment or
  project.

- `-T`, `--all-tags` - the same as `-a`, `--all-branches` but tags are used to
  save different experiments or project checkpoints.

- `-d`, `--with-deps` - determines the files to download by searching backwards
  in the pipeline from the named stage(s). The only files which will be
  considered are associated with the named stage, and the stages which execute
  earlier in the pipeline.

- `-f`, `--force` - does not prompt when removing working directory files, which
  occurs during the process of updating the workspace. This option surfaces
  behavior from the `dvc checkout` command because `dvc pull` in effect performs
  a _checkout_ after downloading files.

- `-R`, `--recursive` - `targets` values is expected to be a directory path.
  Determines the files to download by searching the named directory and its
  subdirectories for DVC files to download data for. Along with providing a
  `target`, or `target` along with `--with-deps` it is yet another way to cut
  the scope of DVC files to download.

- `-j JOBS`, `--jobs JOBS` - specifies number of jobs to run simultaneously
  while downloading files from the remote cache. The effect is to control the
  number of files downloaded simultaneously. Default is `4 * cpu_count()`. For
  example with `-j 1` DVC downloads one file at a time, with `-j 2` it downloads
  two at a time, and so forth. For SSH remotes default is set to 4.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For using the `dvc pull` command, remote storage must be defined. For an
existing project a remote is usually defined and you can use `dvc remote list`
to check existing remotes. Just to remind how it is done and set a context for
the example, let's define an SSH remote with the `dvc remote add` command:

```dvc
$ dvc remote add r1 ssh://_username_@_host_/path/to/dvc/cache/directory
$ dvc remote list
r1	ssh://_username_@_host_/path/to/dvc/cache/directory
```

> DVC supports several protocols for remote storage. For details, see the
> [`remote add`](/doc/commands-reference/remote-add) documentation.

With a remote cache containing some images and other files, we can pull all
changed files from the current Git branch:

```dvc
$ dvc pull --remote r1

(1/8): [####################] 100% images/0001.jpg
(2/8): [####################] 100% images/0002.jpg
...
(7/8): [####################] 100% images/0007.jpg
(8/8): [####################] 100% model.pkl
```

We can download specific files that are outputs of a specific dvc file:

```dvc
$ dvc pull data.zip.dvc
[####################] 100% data.zip
```

In this case we left off the `--remote` option, so it will have pulled from the
default remote. The only files considered in this case are what is listed in the
`out` section of the named target DVC file.

## Examples: With dependencies

Demonstrating the `--with-deps` flag requires a larger example. First, assume a
pipeline has been setup with these stages:

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

The remote storage has been modified such that the data files in some of these
stages should be updated into the local cache.

```dvc
$ dvc status --cloud

  deleted:            data/model.p
  deleted:            data/matrix-test.p
  deleted:            data/matrix-train.p
```

One could do a simple `dvc pull` to get all the data, but what if you only want
to retrieve part of the data?

```dvc
$ dvc pull --remote r1 --with-deps matrix-train.p.dvc

(1/2): [####################] 100% data/matrix-test.p data/matrix-test.p
(2/2): [####################] 100% data/matrix-train.p data/matrix-train.p

... Do some work based on the partial update

$ dvc pull --remote r1 --with-deps model.p.dvc

(1/1): [####################] 100% data/model.p data/model.p

... Pull the rest of the data

$ dvc pull --remote r1

Everything is up to date.
```

With the first `dvc pull` we specified a stage in the middle of the pipeline
while using `--with-deps`. This started with the named stage and searched
backwards through the pipeline for data files to download. Because the stage
named `model.p.dvc` occurs later in the pipeline its data was not updated.

Later we ran `dvc pull` specifying the stage `model.p.dvc`, and its data was
downloaded. And finally we ran `dvc pull` with no options to show that all data
was updated.

## Examples: Show checksums

Normally the file names are shown, but DVC can display the checksums instead.

```dvc
$ dvc pull --remote r1 --show-checksums

(1/3): [####################] 100% 844ef0cd13ff786c686d76bb1627081c
(2/3): [####################] 100% c5409fafe56c3b0d4d4d8d72dcc009c0
(3/3): [####################] 100% a8c5ae04775fcde33bf03b7e59960e18
```
