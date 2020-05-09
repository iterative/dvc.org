# push

Upload tracked files or directories to
[remote storage](/doc/command-reference/remote).

## Synopsis

```usage
usage: dvc push [-h] [-q | -v] [-j <number>]
                [-r <name>] [-a] [-T] [-d] [-R] [--all-commits]
                [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

The `dvc pull` and `dvc push` commands are the means for uploading and
downloading data to and from remote storage. These commands are similar to
`git pull` and `git push`, respectively (with some key differences given the
nature of DVC, see details below).

[Data sharing](/doc/use-cases/sharing-data-and-model-files) across environments,
and preserving data versions (input datasets, intermediate results, models,
[metrics](/doc/command-reference/metrics), etc.)
[remotely](/doc/command-reference/remote) are the two most common use cases for
these commands.

The `dvc push` command allows us to upload data to remote storage. It doesn't
save any changes in the code or DVC-files (those should be saved by using
`git commit` and `git push`).

💡 For convenience, a Git hook is available to automate running `dvc push` after
`git push`. See `dvc install` for more details.

Under the hood a few actions are taken:

- The push command by default uses all
  [DVC-files](/doc/user-guide/dvc-file-format) in the <abbr>workspace</abbr>.
  The command options listed below will either limit or expand the set of
  DVC-files to consult.

- For each <abbr>output</abbr> referenced from each selected DVC-file, DVC finds
  a corresponding file or directory in the <abbr>cache</abbr>. DVC then checks
  whether it exists in the remote. From this, DVC gathers a list of files
  missing from the remote storage.

- Upload the cache files missing from remote storage, if any, to the remote.

The DVC `push` command always works with a remote storage, and it is an error if
none are specified on the command line nor in the configuration. The default
remote is used (see `dvc config core.remote`) unless the `--remote` option is
used. See `dvc remote` for more information on how to configure a remote.

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

- `-a`, `--all-branches` - determines the files to upload by examining DVC-files
  in all Git branches instead of just those present in the current workspace.
  It's useful if branches are used to track experiments or project checkpoints.
  Note that this can be combined with `-T` below, for example using the `-aT`
  flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Useful if tags are used to track "checkpoints" of an experiment
  or project. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git  
  commits as well as the workspace. Useful for uploading all the data used in
  the entire existing commit history of the project.

- `-d`, `--with-deps` - determines files to upload by tracking dependencies to
  the target DVC-files (stages). If no `targets` are provided, this option is
  ignored. By traversing all stage dependencies, DVC searches backward from the
  target stages in the corresponding pipelines. This means DVC will not push
  files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to push by searching each target
  directory and its subdirectories for DVC-files to inspect. If there are no
  directories among the `targets`, this option is ignored.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to push from (see
  `dvc remote list`).

- `-j <number>`, `--jobs <number>` - number of threads to run simultaneously to
  handle the uploading of files from the remote. The default value is
  `4 * cpu_count()`. For SSH remotes, the default is just `4`. Using more jobs
  may improve the total download speed if a combination of small and large files
  are being fetched.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To use `dvc push` (without options), a default
[remote storage](/doc/command-reference/remote) must be defined (see option
`--default` of `dvc remote add`). Let's see an SSH remote example:

```dvc
$ dvc remote add --default r1 \
                 ssh://_username_@_host_/path/to/dvc/cache/directory
```

> For existing <abbr>projects</abbr>, remotes are usually already set up. You
> can use `dvc remote list` to check them:
>
> ```dvc
> $ dvc remote list
> r1	ssh://_username_@_host_/path/to/dvc/cache/directory
> ```

Push entire data <abbr>cache</abbr> from the current <abbr>workspace</abbr> to
the default remote:

```dvc
$ dvc push
```

Push <abbr>outputs</abbr> of a specific DVC-file only:

```dvc
$ dvc push data.zip.dvc
```

## Example: With dependencies

Demonstrating the `--with-deps` option requires a larger example. First, assume
a [pipeline](/doc/command-reference/pipeline) has been setup with these
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

Imagine the <abbr>projects</abbr> has been modified such that the
<abbr>outputs</abbr> of some of these stages need to be uploaded to
[remote storage](/doc/command-reference/remote).

```dvc
$ dvc status --cloud

  new:            data/model.p
  new:            data/matrix-test.p
  new:            data/matrix-train.p
```

One could do a simple `dvc push` to share all the data, but what if you only
want to upload part of the data?

```dvc
$ dvc push --with-deps matrix-train.p.dvc

... Do some work based on the partial update

$ dvc push --with-deps model.p.dvc

... Push the rest of the data

$ dvc status --cloud

Data and pipelines are up to date.
```

We specified a stage in the middle of this pipeline (`matrix-train.p.dvc`) with
the first push. `--with-deps` caused DVC to start with that DVC-file, and search
backwards through the pipeline for data files to upload.

Because the `model.p.dvc` stage occurs later (it's the last one), its data was
not pushed. However, we then specified it in the second push, so all remaining
data was uploaded.

Finally, we used `dvc status` to double check that all data had been uploaded.

## Example: What happens in the cache?

Let's take a detailed look at what happens to the
[cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
as you run an experiment locally and push data to remote storage. To set the
example consider having created a <abbr>workspace</abbr> that contains some code
and data, and having set up a remote.

Some work has been performed in the workspace, and it contains new data to
upload onto the [remote](/doc/command-reference/remote). `dvc status --cloud`
will list several files in `new` state. We can see exactly what that means by
looking in the project's <abbr>cache</abbr>:

```dvc
$ tree .dvc/cache
.dvc/cache
├── 02
│   └── 423d88d184649a7157a64f28af5a73
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 38
│   └── 64e70211d3bdb367ad1432bfc14c1f.dir
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 77
│   └── bea77463abe2b7c6b4d13f00d2c7b4
└── 88
    └── c3db1c257136090dbb4a7ddf31e678.dir

10 directories, 9 files

$ tree ~/vault/recursive
~/vault/recursive
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
└── 88
    └── c3db1c257136090dbb4a7ddf31e678.dir

5 directories, 5 files
```

The directory `.dvc/cache` is the local cache, while `~/vault/recursive` is a
"local remote" (another directory in the local file system). This listing shows
the cache having more files in it than the remote – which is what the `new`
state means.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more info.

Next we can copy the remaining data from the cache to the remote using
`dvc push`:

```dvc
$ tree ~/vault/recursive
~/vault/recursive
├── 02
│   └── 423d88d184649a7157a64f28af5a73
├── 0b
│   └── d48000c6a4e359f4b81285abf059b5
├── 38
│   └── 64e70211d3bdb367ad1432bfc14c1f.dir
├── 4a
│   └── 8c47036c79c01522e79ac0f518d0f7
├── 6c
│   └── 3074754e3a9b563b62c8f1a38670dc
├── 77
│   └── bea77463abe2b7c6b4d13f00d2c7b4
└── 88
    └── c3db1c257136090dbb4a7ddf31e678.dir

10 directories, 10 files

$ dvc status --cloud

Data and pipelines are up to date.
```

And running `dvc status --cloud`, DVC verifies that indeed there are no more
files to push to remote storage.
