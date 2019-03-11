# pull

Pulls data files from a remote DVC cache to the local workspace based on files
that are missing in the local cache, then checks out files to the local
workspace.

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

DVC supports sharing a data cache between workspaces.  The `dvc pull` and
`dvc push` commands are the means for uploading and downloading data with a
shared cache.  These commands are analogous to the `git pull` and `git push`
commands. The `dvc pull` command allows one to retrieve data from a remote cache.

For an overview of the process of sharing data between DVC workspaces and remote
caches, see:
[Share Data And Model Files](/doc/use-cases/share-data-and-model-files).

The command `dvc status --remote REMOTE` searches for files missing from the
local cache that are in the named remote cache.

The value for `REMOTE` is a cache name defined using the `dvc remote` command.
If no REMOTE is given, or if no remote's are defined in the workspace, an error
message is printed.  If the `--remote REMOTE` option is not specified, then the
default remote, configured with the `core.config` config option, is used.  See
`dvc remote`, `dvc config` and [remote storages](/doc/get-started/configure)
for more information on how to configure remote storage.

With no arguments, just `dvc pull` or `dvc pull --remote REMOTE`, it downloads
only the files missing from the local repository to the project directory.  It
will not download files associated with earlier versions or branches of the
project directory, nor will it download files which have not changed.

If one or more _target_'s are specified, DVC only considers the files associated
with those stages.  Using the `--with-deps` option DVC tracks dependences
backward through the pipeline to find files to pull.

After data file is in cache DVC utilizes OS specific mechanisms like reflinks or
hardlinks to put it into the working space without copying. See `dvc checkout`
for more details.

## Options

* `--show-checksums` - shows checksums instead of file names.

* `-r REMOTE`, `--remote REMOTE` specifies which remote cache 
  (see `dvc remote list`) to pull from. The argument, `REMOTE`, is a
  remote name defined using the `dvc remote add` command.

* `-a`, `--all-branches` - determines the files to download by examining files
  associated with all branches of the DVC files in the project directory.

* `-T`, `--all-tags` - determines the files to download by examining files
  associated with all tags of the DVC files in the project directory.

* `-d`, `--with-deps` - determines the files to download by searching backwards
  in the pipeline from the named stage(s).  The only files which will be
  considered are associated with the named stage, and the stages which execute
  earlier in the pipeline.

* `-f`, `--force` - does not prompt when removing working directory files. This
  option surfaces behavior from the `dvc checkout` command because `dvc pull`
  in effect performs a _checkout_ after downloading files.

* `-R dirname`, `--recursive dirname` - determines the files to download by
  searching the named directory and its subdirectories for changed files.

* `-j JOBS`, `--jobs JOBS` - specifies number of jobs to run simultaneously while
  downloading files from the remote cache.  The effect is to control the number
  of files downloaded simultaneously.  Default is `4 * cpu_count()`. For example
  with `-j 1` DVC downloads one file at a time, with `-j 2` it downloads two at
  a time, and so forth.

* `-h`, `--help` - shows the help message and exit

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Using the `dvc pull` command requires us to define a remote cache.  To start,
one uses the `dvc remote add` command with this as an example of an SSH remote.

```dvc
    $ dvc remote add r1 ssh://_username_@_host_/path/to/dvc/cache/directory
    $ dvc remote list
    r1	ssh://_username_@_host_/path/to/dvc/cache/directory
```

DVC supports several protocols for remote caches.  For details, see the
[`remote add`](/doc/commands-reference/remote-add) documentation.

The next step after defining the remote for DVC is ensuring the remote location
in fact exists.  For example with an SSH remote, you must go to the destination
server and ensure the directory path does exist.  If the location does not exist
you will receive an error message.

With a remote cache containing some images and other files, we can pull all
changed files from the current Git branch:

```dvc
    $ dvc pull --remote r1

    (1/8): [#################################] 100% images/0001.jpg
    (2/8): [#################################] 100% images/0002.jpg
    (3/8): [#################################] 100% images/0003.jpg
    (4/8): [#################################] 100% images/0004.jpg
    (5/8): [#################################] 100% images/0005.jpg
    (6/8): [#################################] 100% images/0006.jpg
    (7/8): [#################################] 100% images/0007.jpg
    (8/8): [#################################] 100% model.pkl
```

We can download specific files that are outputs of a specific dvc file:

```dvc
    $ dvc pull data.zip.dvc
    [#################################] 100% data.zip
```

In this case we left off the `--remote` option, so it will have pulled from the
default remote.  The only files considered in this case are what is listed in
the `out` section of the named target DVC file.

## Example: `--show-checksums`

Normally the file names are shown, but DVC can display the checksums instead.

```dvc
    $ dvc pull --remote r1 --show-checksums

    (1/3): [##############################] 100% 844ef0cd13ff786c686d76bb1627081c
    (2/3): [##############################] 100% c5409fafe56c3b0d4d4d8d72dcc009c0
    (3/3): [##############################] 100% a8c5ae04775fcde33bf03b7e59960e18
```

## Example: `--with-deps`

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

The remote cache has been modified such that the data files in some of these
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

    (1/2): [##############################] 100% data/matrix-test.p data/matrix-test.p
    (2/2): [##############################] 100% data/matrix-train.p data/matrix-train.p

    ... Do some work based on the partial update

    $ dvc pull --remote r1 --with-deps model.p.dvc 

    [##############################] 100% data/model.p data/model.p

    ... Pull the rest of the data

    $ dvc pull --remote r1 

    Everything is up to date.
```

With the first `dvc pull` we specified a stage in the middle of the pipeline
while using `--with-deps`.  This started with the named stage and searched
backwards through the pipeline for data files to download.  Because the stage
named `model.p.dvc` occurs later in the pipeline its data was not updated.

Later we ran `dvc pull` specifying the stage `model.p.dvc`, and its data was
downloaded.  And finally we ran `dvc pull` with no options to show that all
data was updated.
