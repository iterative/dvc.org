# push

Upload tracked files or directories to
[remote storage](/doc/command-reference/remote) based on the current `dvc.yaml`
and `.dvc` files.

## Synopsis

```usage
usage: dvc push [-h] [-q | -v] [-j <number>] [-r <name>] [-a] [-T]
                [--all-commits] [-d] [-R] [--run-cache]
                [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

The `dvc push` and `dvc pull` commands are the means for uploading and
downloading data to and from remote storage (S3, SSH, GCS, etc.). These commands
are similar to `git push` and `git pull`, respectively.
[Data sharing](/doc/use-cases/sharing-data-and-model-files) across environments,
and preserving data versions (input datasets, intermediate results, models,
[metrics](/doc/command-reference/metrics), etc.) remotely are the most common
use cases for these commands.

`dvc push` uploads data from the <abbr>cache</abbr> to
[remote storage](/doc/command-reference/remote).

> Note that pushing data does not affect code, `dvc.yaml`, or `.dvc` files.
> Those should be uploaded with `git push`.

The default remote is used (see `dvc remote default`) unless the `--remote`
option is used. See `dvc remote` for more information on how to configure a
remote.

Without arguments, it uploads all files and directories missing from remote
storage, found as <abbr>outputs</abbr> of the
[stages](/doc/command-reference/run) or `.dvc` files present in the workspace.
The `--all-branches`, `--all-tags`, and `--all-commits` options enable pushing
multiple Git commits.

The `targets` given to this command (if any) limit what to push. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

💡 For convenience, a Git hook is available to automate running `dvc push` after
`git push`. See `dvc install` for more details.

For all <abbr>outputs</abbr> referenced in each target, DVC finds the
corresponding files and directories in the <abbr>cache</abbr> (identified by
hash values saved in `dvc.lock` and `.dvc` files). DVC then gathers a list of
files missing from the remote storage, and uploads them.

Note that the `dvc status -c` command can list files tracked by DVC that are new
in the cache (compared to the default remote.) It can be used to see what files
`dvc push` would upload.

## Options

- `-a`, `--all-branches` - determines the files to upload by examining
  `dvc.yaml` and `.dvc` files in all Git branches instead of just those present
  in the current workspace. It's useful if branches are used to track
  experiments or project checkpoints. Note that this can be combined with `-T`
  below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Useful if tags are used to track "checkpoints" of an experiment
  or project. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. This uploads tracked data for the entire commit
  history of the project.

- `-d`, `--with-deps` - determines files to upload by tracking dependencies to
  the `targets`. If none are provided, this option is ignored. By traversing all
  stage dependencies, DVC searches backward from the target stages in the
  corresponding pipelines. This means DVC will not push files referenced in
  later stages than the `targets`.

- `-R`, `--recursive` - determines the files to push by searching each target
  directory and its subdirectories for `dvc.yaml` and `.dvc` files to inspect.
  If there are no directories among the `targets`, this option is ignored.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to push from (see
  `dvc remote list`).

- `--run-cache` - uploads all available history of stage runs to the remote
  repository.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to upload data to
  remote storage. The default value is `4 * cpu_count()`. For SSH remotes, the
  default is `4`. Note that the default value can be set using the `jobs` config
  option with `dvc remote modify`. Using more jobs may improve the overall
  transfer speed.

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

Push <abbr>outputs</abbr> of a specific `.dvc` file only:

```dvc
$ dvc push data.zip.dvc
```

## Example: With dependencies

Demonstrating the `--with-deps` option requires a larger example. First, assume
a [pipeline](/doc/command-reference/dag) has been setup with these
[stages](/doc/command-reference/run): `clean-posts`, `featurize`, `test-posts`,
`matrix-train`

Imagine the <abbr>project</abbr> has been modified such that the
<abbr>outputs</abbr> of some of these stages need to be uploaded to
[remote storage](/doc/command-reference/remote).

```dvc
$ dvc status --cloud
...
	new:            data/model.p
	new:            data/matrix-test.p
	new:            data/matrix-train.p
```

One could do a simple `dvc push` to share all the data, but what if you only
want to upload part of the data?

```dvc
$ dvc push --with-deps test-posts

... Do some work based on the partial update

$ dvc push --with-deps matrix-train

... Push the rest of the data

$ dvc status --cloud
Cache and remote 'r1' are in sync.
```

We specified a stage in the middle of this pipeline (`test-posts`) with the
first push. `--with-deps` caused DVC to start with that `.dvc` file, and search
backwards through the pipeline for data files to upload.

Because the `matrix-train` stage occurs later (it's the last one), its data was
not pushed. However, we then specified it in the second push, so all remaining
data was uploaded.

Finally, we used `dvc status` to double check that all data had been uploaded.

## Example: What happens in the cache?

Let's take a detailed look at what happens to the
[cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
as you run an experiment locally and push data to remote storage. To set the
example consider having created a <abbr>workspace</abbr> that contains some code
and data, and having set up a remote.

Some work has been performed in the workspace, and new data is ready for
uploading to the [remote](/doc/command-reference/remote). `dvc status --cloud`
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
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
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
Cache and remote 'r1' are in sync.
```

And running `dvc status --cloud`, DVC verifies that indeed there are no more
files to push to remote storage.
