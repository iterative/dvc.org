# push

Uploads files or directories tracked by DVC to
[remote storage](/doc/command-reference/remote).

## Synopsis

```usage
usage: dvc push [-h] [-q | -v] [-j JOBS]
                [-r REMOTE] [-a] [-T] [-d] [-R]
                [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

The `dvc push` command is the twin pair to the `dvc pull` command, and together
they are the means for uploading and downloading data to and from remote
storage, respectively.
[Data sharing](/doc/use-cases/sharing-data-and-model-files) across environments
and preserving data versions (input datasets, intermediate results, models,
[metrics](/doc/command-reference/metrics), etc) remotely (S3, SSH, GCS, etc.)
are the most common use cases for these commands.

The `dvc push` command allows one to upload data to remote storage. It doesn't
save any changes in the code or DVC-files. Those should be saved by using
`git commit` and `git push`.

💡 For convenience, a Git hook is available to automate running `dvc push` after
`git push`. See `dvc install` for more details.

Under the hood a few actions are taken:

- The push command by default uses all
  [DVC-files](/doc/user-guide/dvc-file-format) in the <abbr>workspace</abbr>.
  The command line options listed below will either limit or expand the set of
  DVC-files to consult.

- For each <abbr>output</abbr> referenced from each selected DVC-file, DVC finds
  a corresponding entry in the <abbr>cache</abbr>. DVC checks whether the entry
  exists in the remote. From this DVC gathers a list of files missing from the
  remote storage.

- Upload the cache files missing from remote storage, if any, to the remote.

The DVC `push` command always works with a remote storage, and it is an error if
none are specified on the command line nor in the configuration. If a
`--remote REMOTE` option is not specified, then the default remote, configured
with the `core.config` config option, is used. See `dvc remote`, `dvc config`
and this [example](/doc/get-started/configure) for more information on how to
configure a remote.

With no arguments, just `dvc push` or `dvc push --remote REMOTE`, it uploads
only the files (or directories) that are new in the local repository to remote
storage. It will not upload files associated with earlier commits in the
<abbr>repository</abbr> (if using Git), nor will it upload files that have not
changed.

The `dvc status -c` command can list files tracked by DVC that are new in the
cache (compared to the default remote.) It can be used to see what files
`dvc push` would upload.

If one or more `targets` are specified, DVC only considers the files associated
with those DVC-files. Using the `--with-deps` option, DVC tracks dependencies
backward from the target [stage files](/doc/command-reference/run), through the
corresponding [pipelines](/doc/command-reference/pipeline), to find data files
to push.

## Options

- `-r REMOTE`, `--remote REMOTE` specifies which remote to push from (see
  `dvc remote list`). The value for `REMOTE` is a name defined using
  `dvc remote`. If the option is not specified, then the default remote
  (configured with the `core.config` config option) is used.

- `-a`, `--all-branches` - determines the files to upload by examining DVC-files
  in all Git branches instead of just those present in the current workspace.
  It's useful if branches are used to track experiments or project checkpoints.

- `-T`, `--all-tags` - the same as `-a`, `--all-branches`, but Git tags are used
  to save different experiments or project checkpoints. Note that both options
  can be combined, for example using the `-aT` flag.

- `-d`, `--with-deps` - one or more `targets` should be specified for this
  option to have effect. Determines files to upload by tracking dependencies to
  the target DVC-files (stages). By traversing all stage dependencies, DVC
  searches backward from the target stages in the corresponding pipelines. This
  means DVC will not push files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to push by searching each target
  directory and its subdirectories for DVC-files to inspect. `targets` is
  expected to contain one or more directories for this option to have effect.

- `-j JOBS`, `--jobs JOBS` - specifies number of jobs to run simultaneously
  while uploading files to the remote. The effect is to control the number of
  files uploaded simultaneously. Default is `4 * cpu_count()`. For example with
  `-j 1` DVC uploads one file at a time, with `-j 2` it uploads two at a time,
  and so forth. For SSH remotes default is set to 4.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For using the `dvc push` command, a remote storage must be defined. (See
`dvc remote add`.) For an existing <abbr>project</abbr>, remotes are usually
already set up and you can use `dvc remote list` to check them. To remember how
it's done, and set a context for the example, let's define a default SSH remote:

```dvc
$ dvc remote add r1 ssh://_username_@_host_/path/to/dvc/cache/directory
$ dvc remote list
r1	ssh://_username_@_host_/path/to/dvc/cache/directory
```

> DVC supports several
> [remote types](/doc/command-reference/remote/add#supported-storage-types).

Push all data file caches from the current Git branch to the default remote:

```dvc
$ dvc push
```

Push <abbr>outputs</abbr> of a specific DVC-file:

```dvc
$ dvc push data.zip.dvc
```

## Example: With dependencies

Demonstrating the `--with-deps` flag requires a larger example. First, assume a
[pipeline](/doc/command-reference/pipeline) has been setup with these
[stages](/doc/command-reference/run):

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

Imagine the project has been modified such that the <abbr>outputs</abbr> of some
of these stages should be uploaded to remote storage.

```dvc
$ dvc status --cloud

  new:            data/model.p
  new:            data/matrix-test.p
  new:            data/matrix-train.p
```

One could do a simple `dvc push` to share all the data, but what if you only
want to upload part of the data?

```dvc
$ dvc push --remote r1 --with-deps matrix-train.p.dvc

... Do some work based on the partial update

$ dvc push --remote r1 --with-deps model.p.dvc

... Push the rest of the data

$ dvc push --remote r1

Everything is up to date.

$ dvc status --cloud

Data and pipelines are up to date.
```

With the first `dvc push` we specified a stage in the middle of this pipeline
(`matrix-train.p.dvc`) while using `--with-deps`. DVC started with that DVC-file
and searched backwards through the pipeline for data files to upload. Because
the `model.p.dvc` stage occurs later, its data was not pushed.

Then we ran `dvc push` specifying the last stage, `model.p.dvc`, and its data
was uploaded. Finally, we ran `dvc push` and `dvc status` with no options to
double check that all data had been uploaded.

## Example: What happens in the cache

Let's take a detailed look at what happens to the
[cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
as you run an experiment locally and push data to remote storage. To set the
example consider having created a <abbr>workspace</abbr> that contains some code
and data, and having set up a remote.

Some work has been performed in the workspace, and it contains new data to
upload to the shared remote. When running `dvc status --cloud` the report will
list several files in `new` state. We can see exactly what that means by looking
in the project's <abbr>cache</abbr>:

```dvc
$ tree .dvc/cache
.dvc/cache
├── 02
│   └── 423d88d184649a7157a64f28af5a73
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 38
│   └── 64e70211d3bdb367ad1432bfc14c1f.dir
├── 3f
│   └── 957fa0f1bb46534d07f4fc2116d73d
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 5e
│   └── 4a7d0cbe26eda55624439661db925d
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 77
│   └── bea77463abe2b7c6b4d13f00d2c7b4
├── 88
│   └── c3db1c257136090dbb4a7ddf31e678.dir
└── f4

10 directories, 9 files
$ tree ../vault/recursive
../vault/recursive
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 88
│   └── c3db1c257136090dbb4a7ddf31e678.dir
└── f4
    └── 7482b18ecca728ba4ae931e5d568fb

5 directories, 5 files
```

The directory `.dvc/cache` is the local cache, while `../vault/recursive` is the
[remote storage](/doc/command-reference/remote) – a "local remote" in this case.
This listing shows the cache having more files in it than the remote – which is
what the `new` state means.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more info.

Next we can upload part of the data from the cache to the remote using the
command `dvc push --with-deps <stage>.dvc`. Remember that `--with-deps` searches
backwards from the DVC-file `targets` to locate files to upload, and does not
upload files in subsequent stages.

After doing that we can inspect the remote storage again:

```dvc
$ tree ../vault/recursive
../vault/recursive
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 38
│   └── 64e70211d3bdb367ad1432bfc14c1f.dir
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 5e
│   └── 4a7d0cbe26eda55624439661db925d
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 77
│   └── bea77463abe2b7c6b4d13f00d2c7b4
├── 88
│   └── c3db1c257136090dbb4a7ddf31e678.dir
└── f4
    └── 7482b18ecca728ba4ae931e5d568fb

8 directories, 8 files
```

The remote storage now has some of the files which had been missing, but not all
of them. Indeed `dvc status --cloud` still lists a couple files as `new`. We can
clearly see this above, since a couple files are in the cache, but not in the
remote.

After running `dvc push` to cause all files to be uploaded, the remote storage
now contains all of them:

```dvc
$ tree ../vault/recursive
../vault/recursive
├── 02
│   └── 423d88d184649a7157a64f28af5a73
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 38
│   └── 64e70211d3bdb367ad1432bfc14c1f.dir
├── 3f
│   └── 957fa0f1bb46534d07f4fc2116d73d
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 5e
│   └── 4a7d0cbe26eda55624439661db925d
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 77
│   └── bea77463abe2b7c6b4d13f00d2c7b4
├── 88
│   └── c3db1c257136090dbb4a7ddf31e678.dir
└── f4
    └── 7482b18ecca728ba4ae931e5d568fb

10 directories, 10 files

$ dvc status --cloud

Data and pipelines are up to date.
```

And running `dvc status --cloud`, DVC verifies that indeed there are no more
files to push to remote storage.
