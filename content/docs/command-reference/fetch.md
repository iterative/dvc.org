# fetch

Get tracked files or directories from
[remote storage](/doc/command-reference/remote) into the <abbr>cache</abbr>.

## Synopsis

```usage
usage: dvc fetch [-h] [-q | -v] [-j <number>] [-r <name>] [-a] [-T]
                  [--all-commits] [-d] [-R] [--run-cache]
                 [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

`dvc fetch` downloads DVC-tracked files from remote storage into the cache of
the project (without placing them in the <abbr>workspace</abbr>). This makes the
data files available for linking (or copying) into the workspace (refer to
[dvc config cache.type](/doc/command-reference/config#cache)).

Along with `dvc checkout`, fetching performed automatically by `dvc pull` (when
the data is not already in the cache):

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

Fetching is useful when first checking out a <abbr>DVC project</abbr> for
example, to get any files tracked by DVC that already exist in remote storage
(see `dvc push`) to the local <abbr>cache</abbr>. Refer to `dvc remote` for more
information on DVC remotes.

`dvc fetch` ensures that the files needed for all the stages (in
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories#dvcyaml-file)) and
[`.dvc` files](/doc/user-guide/dvc-files-and-directories#dvc-files) exist in the
cache. It can be limited to any given `targets` (files inside directories
[tracked as a whole](/doc/command-reference/add#example-directory) are
supported). These data files, datasets, or models are listed as
<abbr>outputs</abbr>.

If no `targets` are specified, the set of data files to fetch is determined by
scanning all `dvc.yaml` and `.dvc` files in the workspace (the `--all-branches`
and `--all-tags` options compare multiple workspace versions).

The default remote is used (see `dvc config core.remote`) unless the `--remote`
option is used.

`dvc fetch`, `dvc pull`, and `dvc push` are related in that these 3 commands
perform data synchronization among local and remote storage. The specific way in
which the set of files to push/fetch/pull is determined begins with calculating
file hashes when these are [added](/doc/command-reference/add) with DVC. File
hash values are stored in the corresponding `dvc.yaml` or `.dvc` files
(typically versioned with Git). Only the hash specified in `dvc.yaml` or `.dvc`
files currently in the workspace are considered by `dvc fetch` (unless the `-a`
or `-T` options are used).

## Options

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to fetch from (see
  `dvc remote list`).

- `--run-cache` - downloads all available history of stage runs from the remote
  repository.

- `-d`, `--with-deps` - determines files to download by tracking dependencies to
  the `targets`. If none are provided, this option is ignored. By traversing all
  stage dependencies, DVC searches backward from the target stages in the
  corresponding pipelines. This means DVC will not fetch files referenced in
  later stages than the `targets`.

- `-R`, `--recursive` - determines the files to fetch by searching each target
  directory and its subdirectories for `dvc.yaml` and `.dvc` files to inspect.
  If there are no directories among the `targets`, this option is ignored.

- `-j <number>`, `--jobs <number>` - number of threads to run simultaneously to
  handle the downloading of files from the remote. The default value is
  `4 \* cpu_count()`. For SSH remotes, the default is just `4`. Using more jobs
  may improve the total download speed if a combination of small and large files
  are being fetched.

- `-a`, `--all-branches` - fetch cache for all Git branches instead of just the
  current workspace. This means DVC may download files needed to reproduce
  different versions of a `.dvc` file
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
[Get Started](/doc/tutorials/get-started). Then we can see what `dvc fetch` does
in different scenarios.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

</details>

The workspace looks like this:

```dvc
.
├── data
│   └── data.xml.dvc
├── dvc.lock
├── dvc.yaml
├── params.yaml
├── prc.json
├── scores.json
└── src
    └── <code files here>
```

This project comes with a predefined HTTP
[remote storage](/doc/command-reference/remote). We can now just run `dvc fetch`
to download the most recent `model.pkl`, `data.xml`, and other DVC-tracked files
into our local <abbr>cache</abbr>.

```dvc
$ dvc status --cloud
...
  deleted:            data/features/train.pkl
  deleted:            model.pkl

$ dvc fetch

$ tree .dvc/cache
.dvc/cache
├── 38
│   └── 63d0e317dee0a55c4e59d2ec0eef33
├── 42
│   └── c7025fc0edeb174069280d17add2d4.dir
...
```

> `dvc status --cloud` compares the cache contents against the default remote.
> Refer to `dvc status`.

Note that the `.dvc/cache` directory was created and populated.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
> for more info.

Used without arguments (as above), `dvc fetch` downloads all files and
directories needed by all
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories#dvcyaml-file) and
[`.dvc`](/doc/user-guide/dvc-files-and-directories#dvc-files) files in the
current branch. For example, the hash values `3863d0e...` and `42c7025...`
correspond to the `model.pkl` file and `data/features/` directory, respectively.

Let's now link files from the cache to the workspace with:

```dvc
$ dvc checkout
```

## Example: Specific files or directories

> If you tried the previous example, please delete the `.dvc/cache` directory
> first (e.g. `rm -Rf .dvc/cache`) to follow this one.

`dvc fetch` only downloads the tracked data corresponding to any given
`targets`:

```dvc
$ dvc fetch prepare

$ tree .dvc/cache
.dvc/cache
├── 20
│   └── b786b6e6f80e2b3fcf17827ad18597.dir
├── 32
│   └── b715ef0d71ff4c9e61f55b09c15e75
└── 6f
    └── 597d341ceb7d8fbbe88859a892ef81
```

Cache entries for the `data/prepared` directory, as well as the actual
`test.tsv` and `train.tsv` files, were downloaded. Their hash values are shown
above.

Note that granular files inside directories tracked as a whole are supported.
For example, the `featurize` stage has the `data/features` directory as output,
and we can do:

```dvc
$ dvc fetch data/features/test.pkl
```

If you check again `.dvc/cache`, you'll see a couple more files were downloaded:
the cache entries for the `data/features` directory, and
`data/features/test.pkl` itself.

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
[`.dvc` file](/doc/user-guide/dvc-files-and-directories#dvc-files) (`train.dvc`)
and searches backwards through its pipeline for data to download into the
project's cache. All the data for the second and third stages ("featurize" and
"train") has now been downloaded to the cache. We could now use `dvc checkout`
to get the data files needed to reproduce this pipeline up to the third stage
into the workspace (with `dvc repro train.dvc`).

> Note that in this example project, the last stage file `evaluate.dvc` doesn't
> add any more data files than those form previous stages, so at this point all
> of the data for this pipeline is cached and `dvc status -c` would output
> `Data and pipelines are up to date.`
