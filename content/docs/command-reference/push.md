# push

Upload tracked files or directories to [remote storage] based on the current
`dvc.yaml` and `.dvc` files.

[remote storage]: /doc/user-guide/data-management/remote-storage

## Synopsis

```usage
usage: dvc push [-h] [-q | -v] [-j <number>] [-r <name>] [-a] [-T]
                [--all-commits] [--glob] [-d] [-R] [--run-cache]
                [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

The `dvc push` and `dvc pull` commands are the means for uploading and
downloading data to and from [remote storage] (S3, SSH, GCS, etc.). These
commands are similar to `git push` and `git pull`, respectively. [Data sharing]
across environments, and preserving data versions (input datasets, intermediate
results, models, `dvc metrics`, etc.) remotely are the most common use cases for
these commands.

`dvc push` uploads data from the <abbr>cache</abbr> to a `dvc remote`.

> Note that pushing data does not affect code, `dvc.yaml`, or `.dvc` files.
> Those should be uploaded with `git push`. `dvc import` data is also ignored by
> this command.

[data sharing]: /doc/start/data-management/data-versioning#storing-and-sharing

The `dvc remote` used is determined in order, based on

1. the `remote` fields in the `dvc.yaml` or `.dvc` files.
2. the value passed to the `--remote` (`-r`) option via CLI.
3. the value of the `core.remote` config option (see `dvc remote default`).

Without arguments, it uploads the files and directories referenced in the
current workspace (found in all `dvc.yaml` and `.dvc` files) that are missing
from the remote. Any `targets` given to this command limit what to push. It
accepts paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

The `--all-branches`, `--all-tags`, and `--all-commits` options enable pushing
files/dirs referenced in multiple Git commits.

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
  `dvc.yaml` and `.dvc` metafiles in all Git branches, as well as in the
  workspace. It's useful if branches are used to track experiments. Note that
  this can be combined with `-T` below, for example using the `-aT` flags.

- `-T`, `--all-tags` - examines metafiles in all Git tags, as well as in the
  workspace. Useful if tags are used to mark certain versions of an experiment
  or project. Note that this can be combined with `-a` above, for example using
  the `-aT` flags.

- `-A`, `--all-commits` - examines metafiles in all Git commits, as well as in
  the workspace. This uploads tracked data for the entire commit history of the
  project.

- `-d`, `--with-deps` - only meaningful when specifying `targets`. This
  determines files to push by resolving all dependencies of the targets: DVC
  searches backward from the targets in the corresponding pipelines. This will
  not push files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to push by searching each target
  directory and its subdirectories for `dvc.yaml` and `.dvc` files to inspect.
  If there are no directories among the `targets`, this option has no effect.

- `-r <name>`, `--remote <name>` - name of the `dvc remote` to push to (see
  `dvc remote list`).

- `--run-cache` - uploads all available history of
  [stage runs](/doc/user-guide/project-structure/internal-files#run-cache) to
  the `dvc remote`.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to upload data to
  remote storage. The default value is `4 * cpu_count()`. Note that the default
  value can be set using the `jobs` config option with `dvc remote modify`.
  Using more jobs may speed up the operation.

- `--glob` - allows pushing files and directories that match the
  [pattern](https://docs.python.org/3/library/glob.html) specified in `targets`.
  Shell style wildcards supported: `*`, `?`, `[seq]`, `[!seq]`, and `**`

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To use `dvc push` (without options), a `dvc remote default` must be defined (see
also `dvc remote add --default`). Let's see an SSH remote example:

```cli
$ dvc remote add --default r1 \
                 ssh://user@example.com/path/to/dvc/cache/directory
```

<admon type="info">

For existing <abbr>projects</abbr>, remotes are usually already set up. You can
use `dvc remote list` to check them:

```cli
$ dvc remote list
r1	ssh://user@example.com/path/to/dvc/cache/directory
```

</admon>

Push entire data <abbr>cache</abbr> from the current <abbr>workspace</abbr> to
the default remote:

```cli
$ dvc push
```

Push files related to a specific `.dvc` file only:

```cli
$ dvc push data.zip.dvc
```

## Example: With dependencies

Demonstrating the `--with-deps` option requires a larger example. First, assume
a [pipeline](/doc/command-reference/dag) has been set up with these
[stages](/doc/command-reference/run): `clean-posts`, `featurize`, `test-posts`,
`matrix-train`

Imagine the <abbr>project</abbr> has been modified such that the
<abbr>outputs</abbr> of some of these stages need to be uploaded to [remote
storage].

```cli
$ dvc status --cloud
...
	new:            data/model.p
	new:            data/matrix-test.p
	new:            data/matrix-train.p
```

One could do a simple `dvc push` to share all the data, but what if you only
want to upload part of the data?

```cli
$ dvc push --with-deps test-posts

# Do some work based on the partial update...
# Then push the rest of the data:

$ dvc push --with-deps matrix-train

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

https://www.youtube.com/watch?v=FYmmiAz81G4

Let's take a detailed look at what happens to the [cache directory] as you run
an experiment locally and push data to remote storage. To set the example
consider having created a <abbr>project</abbr> with some code, data, and a
`dvc remote` setup.

Some work has been performed in the workspace, and new data is ready for
uploading to the remote. `dvc status --cloud` will list several files in `new`
state. We can see exactly what that means by looking in the project's
<abbr>cache</abbr>:

[cache directory]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

```cli
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
> [Structure of cache directory](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)
> for more info.

Next we can copy the remaining data from the cache to the remote using
`dvc push`:

```cli
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

## Example: Version-aware remote for readable storage

Let's set up a [version-aware] remote, which uses cloud versioning to organize
the remote storage.

[version-aware]:
  /doc/user-guide/data-management/cloud-versioning#version-aware-remotes

```cli
$ dvc remote add -d versioned_store s3://mybucket
$ dvc remote modify versioned_store version_aware true

$ dvc push
```

> See also `dvc remote add` and `dvc remote modify`.

Now let's look at what was pushed to the remote. Unlike the [example above], the
version-aware remote looks similar to the data in your workspace and is easy to
read.

[example above]: #example-what-happens-in-the-cache

```cli
# Show the current versions.
$ aws s3 ls --recursive s3://mybucket/

2023-02-01 15:24:09    1708591 data/prepared/test.tsv
2023-02-01 15:24:10    6728772 data/prepared/train.tsv

# Show all object versions.
$ aws s3api list-object-versions --bucket mybucket
{
    "Versions": [
        {
            "ETag": "\"b656f1a8273d0c541340cb129fd5d5a9\"",
            "Size": 1708591,
            "StorageClass": "STANDARD",
            "Key": "data/prepared/test.tsv",
            "VersionId": "T6rFr7NSHkL3v9tGStO7GTwsVaIFl42T",
            "IsLatest": true,
            "LastModified": "2023-02-01T20:24:09.000Z",
            ...
        },
        {
            "ETag": "\"9ca281786366acca17632c27c5c5cc75\"",
            "Size": 6728772,
            "StorageClass": "STANDARD",
            "Key": "data/prepared/train.tsv",
            "VersionId": "XaYsHQHWK219n5MoCRe.Rr7LeNbbder_",
            "IsLatest": true,
            "LastModified": "2023-02-01T20:24:10.000Z",
            ...
        }
    ]
```
