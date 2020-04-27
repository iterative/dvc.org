# fetch

Get tracked files or directories from
[remote storage](/doc/command-reference/remote) into the <abbr>cache</abbr>.

## Synopsis

```usage
usage: dvc fetch [-h] [-q | -v] [-j <number>]
                 [-r <name>] [-a] [-T] [-d] [-R] [--all-commits]
                 [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

The `dvc fetch` downloads DVC-tracked files from remote storage into the cache
of the project, but without placing them in the <abbr>workspace</abbr>. This
makes the data files available for linking (or copying) into the workspace.
(Refer to [dvc config cache.type](/doc/command-reference/config#cache).) Along
with `dvc checkout`, it's performed automatically by `dvc pull` when the target
[DVC-files](/doc/user-guide/dvc-file-format) are not already in the cache:

```
Controlled files             Commands
---------------- ---------------------------------

remote storage
     +
     |         +------------+
     | - - - - | dvc fetch  | ++
     v         +------------+   +   +----------+
project's cache                  ++ | dvc pull |
     +         +------------+   +   +----------+
     | - - - - |dvc checkout| ++
     |         +------------+
     v
 workspace
```

Fetching could be useful when first checking out a <abbr>DVC project</abbr>,
since files tracked by DVC should already exist in remote storage, but won't be
in the project's <abbr>cache</abbr>. (Refer to `dvc remote` for more information
on DVC remotes.) These necessary data or model files are listed as
<abbr>dependencies</abbr> or <abbr>outputs</abbr> in a DVC-file (target
[stage](/doc/command-reference/run)) so they are required to
[reproduce](/doc/tutorials/get-started/reproduce) the corresponding
[pipeline](/doc/command-reference/pipeline). (See
[DVC-File Format](/doc/user-guide/dvc-file-format) for more information on
dependencies and outputs.)

`dvc fetch` ensures that the files needed for a DVC-file to be
[reproduced](/doc/tutorials/get-started/reproduce) exist in cache. If no
`targets` are specified, the set of data files to fetch is determined by
analyzing all DVC-files in the current branch, unless `--all-branches` or
`--all-tags` is specified.

The default remote is used (see `dvc config core.remote`) unless the `--remote`
option is used.

`dvc fetch`, `dvc pull`, and `dvc push` are related in that these 3 commands
perform data synchronization among local and remote storage. The specific way in
which the set of files to push/fetch/pull is determined begins with calculating
file hashes when these are [added](/doc/tutorials/get-started/add-files) with
DVC. File hashes are stored in the corresponding DVC-files (typically versioned
with Git). Only the hashes specified in DVC-files currently in the workspace are
considered by `dvc fetch` (unless the `-a` or `-T` options are used).

## Options

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to fetch from (see
  `dvc remote list`).

- `-d`, `--with-deps` - determines files to download by tracking dependencies to
  the target DVC-files (stages). If no `targets` are provided, this option is
  ignored. By traversing all stage dependencies, DVC searches backward from the
  target stages in the corresponding pipelines. This means DVC will not fetch
  files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to fetch by searching each target
  directory and its subdirectories for DVC-files to inspect. If there are no
  directories among the `targets`, this option is ignored.

- `-j <number>`, `--jobs <number>` - number of threads to run simultaneously to
  handle the downloading of files from the remote. The default value is
  `4 * cpu_count()`. For SSH remotes, the default is just `4`. Using more jobs
  may improve the total download speed if a combination of small and large files
  are being fetched.

- `-a`, `--all-branches` - fetch cache for all Git branches instead of just the
  current workspace. This means DVC may download files needed to reproduce
  different versions of a DVC-file
  ([experiments](/doc/tutorials/get-started/experiments)), not just the ones
  currently in the workspace. Note that this can be combined with `-T` below,
  for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. Useful for downloading all the data used in the
  entire existing commit history of the project.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created for the
[Get Started](/doc/tutorials/get-started). Then we can see what happens with
`dvc fetch` as we switch from tag to tag.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

</details>

The workspace looks almost like in this
[pipeline setup](/doc/tutorials/pipelines):

```dvc
.
├── data
│   └── data.xml.dvc
├── evaluate.dvc
├── featurize.dvc
├── prepare.dvc
├── train.dvc
└── src
    └── <code files here>
```

We have these tags in the repository that represent different iterations of
solving the problem:

```dvc
$ git tag

baseline-experiment     <- first simple version of the model
bigrams-experiment      <- use bigrams to improve the model
```

## Example: Default behavior

This project comes with a predefined HTTP
[remote storage](/doc/command-reference/remote). We can now just run `dvc fetch`
to download the most recent `model.pkl`, `data.xml`, and other DVC-tracked files
into our local <abbr>cache</abbr>.

```dvc
$ dvc status --cloud
...
    deleted:            model.pkl
    deleted:            data/features/...

$ dvc fetch
...
$ tree .dvc
.dvc
├── cache
│   ├── 38
│   │   └── 63d0e317dee0a55c4e59d2ec0eef33
│   ├── 42
│   │   └── c7025fc0edeb174069280d17add2d4.dir
│   ├── ...
├── config
├── ...
```

> `dvc status --cloud` compares the cache contents vs. the default remote.

Note that the `.dvc/cache` directory was created and populated.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more info.

As seen above, used without arguments, `dvc fetch` downloads all assets needed
by all DVC-files in the current branch, including for directories. The hash
values `3863d0e317dee0a55c4e59d2ec0eef33` and `42c7025fc0edeb174069280d17add2d4`
correspond to the `model.pkl` file and `data/features/` directory, respectively.

Let's now link files from the cache to the workspace with:

```dvc
$ dvc checkout
```

## Example: Specific stages

> Please delete the `.dvc/cache` directory first (with `rm -Rf .dvc/cache`) to
> follow this example if you tried the previous one (**Default behavior**).

`dvc fetch` only downloads the data files of a specific stage when the
corresponding DVC-file (command target) is specified:

```dvc
$ dvc fetch prepare.dvc

$ tree .dvc/cache
.dvc/cache
├── 42
│   └── c7025fc0edeb174069280d17add2d4.dir
├── 58
│   └── 245acfdc65b519c44e37f7cce12931
├── 68
│   └── 36f797f3924fb46fcfd6b9f6aa6416.dir
└── 9d
    └── 603888ec04a6e75a560df8678317fb
```

> Note that `prepare.dvc` is the first stage in our example's pipeline.

Cache entries for the necessary directories, as well as the actual
`data/prepared/test.tsv` and `data/prepared/train.tsv` files were downloaded.
Their hash values are shown above.

## Example: With dependencies

After following the previous example (**Specific stages**), only the files
associated with the `prepare.dvc` stage file have been fetched. Several
dependencies/outputs of other pipeline stages are still missing from the cache:

```dvc
$ dvc status -c
...
    deleted:            model.pkl
    deleted:            data/features/test.pkl
    deleted:            data/features/train.pkl
    deleted:            data/data.xml
```

One could do a simple `dvc fetch` to get all the data, but what if you only want
to retrieve the data up to our third stage, `train.dvc`? We can use the
`--with-deps` (or `-d`) option:

```dvc
$ dvc fetch --with-deps train.dvc

$ tree .dvc/cache
.dvc/cache
├── 38
│   └── 63d0e317dee0a55c4e59d2ec0eef33
├── 42
│   └── c7025fc0edeb174069280d17add2d4.dir
├── 58
│   └── 245acfdc65b519c44e37f7cce12931
├── 68
│   └── 36f797f3924fb46fcfd6b9f6aa6416.dir
├── 9d
│   └── 603888ec04a6e75a560df8678317fb
├── a3
│   └── 04afb96060aad90176268345e10355
├── aa
│   └── 35101ce881d04b41d5b4ff3593b423
└── dc
    └── a9c512fda11293cfee7617b66648dc
```

Fetching using `--with-deps` starts with the target
[DVC-file](/doc/user-guide/dvc-file-format) (`train.dvc` stage) and searches
backwards through its pipeline for data to download into the project's cache.
All the data for the second and third stages ("featurize" and "train") has now
been downloaded to the cache. We could now use `dvc checkout` to get the data
files needed to reproduce this pipeline up to the third stage into the workspace
(with `dvc repro train.dvc`).

> Note that in this example project, the last stage file `evaluate.dvc` doesn't
> add any more data files than those form previous stages, so at this point all
> of the data for this pipeline is cached and `dvc status -c` would output
> `Data and pipelines are up to date.`
