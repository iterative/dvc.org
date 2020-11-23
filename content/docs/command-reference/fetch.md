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

Downloads DVC-tracked files from remote storage into the cache of the project
(without placing them in the <abbr>workspace</abbr>, like `dvc pull` would).
This makes them available for linking (or copying) into the workspace (refer to
[`dvc config cache.type`](/doc/command-reference/config#cache)).

Without arguments, `dvc fetch` ensures that the files specified in all
`dvc.lock` and `.dvc` files in the workspace exist in the cache. The
`--all-branches`, `--all-tags`, and `--all-commits` options enable fetching data
for multiple Git commits.

The `targets` given to this command (if any) limit what to fetch. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

Fetching is performed automatically by `dvc pull` (when the data is not already
in the <abbr>cache</abbr>), along with `dvc checkout`:

```
Tracked files                Commands
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

Here are some scenarios in which `dvc fetch` is useful, instead of pulling:

- After checking out a fresh copy of a <abbr>DVC repository</abbr>, to get
  DVC-tracked data from multiple project branches or tags into your machine.
- To use comparison commands across different Git commits, for example
  `dvc metrics show` with its `--all-branches` option.
- If you want to avoid [linking](/doc/user-guide/large-dataset-optimization)
  files from the cache, or keep the <abbr>workspace</abbr> clean for any other
  reason.

The default remote is used (see
[`dvc config core.remote`](/doc/command-reference/config#core)) unless the
`--remote` option is used.

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

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from remote storage. The default value is `4 * cpu_count()`. For SSH remotes,
  the default is `4`. Note that the default value can be set using the `jobs`
  config option with `dvc remote modify`. Using more jobs may improve the
  overall transfer speed.

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
  as well as the workspace. This downloads tracked data for the entire commit
  history of the project.

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
├── 20
│   └── b786b6e6f80e2b3fcf17827ad18597.dir
├── c8
│    ├── d307aa005d6974a8525550956d5fb3
│    └── ...
...
```

> `dvc status --cloud` compares the cache contents against the default remote.
> Refer to `dvc status`.

Note that the `.dvc/cache` directory was created and populated.

> Refer to
> [Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
> for more info.

Used without arguments (as above), `dvc fetch` downloads all files and
directories needed by all `dvc.yaml` and `.dvc` files in the current branch. For
example, the hash values `20b786b...` and `c8d307a...` correspond to the
`data/features/` directory and `model.pkl` file, respectively.

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

Cache entries for the `data/prepared` directory (<abbr>output</abbr> of the
`prepare` target), as well as the actual `test.tsv` and `train.tsv` files, were
downloaded. Their hash values are shown above.

Note that you can fetch data within directories tracked. For example, the
`featurize` stage has the entire `data/features` directory as output, but we can
just get this:

```dvc
$ dvc fetch data/features/test.pkl
```

If you check again `.dvc/cache`, you'll see a couple more files were downloaded:
the cache entries for the `data/features` directory, and
`data/features/test.pkl` itself.

## Example: With dependencies

After following the previous example (**Specific stages**), only the files
associated with the `prepare` stage have been fetched. Several
dependencies/outputs of other pipeline stages are still missing from the cache:

```dvc
$ dvc status -c
...
    deleted:            data/features/test.pkl
    deleted:            data/features/train.pkl
    deleted:            model.pkl
```

One could do a simple `dvc fetch` to get all the data, but what if you only want
to retrieve the data up to our third stage, `train`? We can use the
`--with-deps` (or `-d`) option:

```dvc
$ dvc fetch --with-deps train

$ tree .dvc/cache
.dvc/cache
├── 20
│   └── b786b6e6f80e2b3fcf17827ad18597.dir
├── c8
│   ├── 43577f9da31eab5ddd3a2cf1465f9b
│   └── d307aa005d6974a8525550956d5fb3
├── 32
│   └── b715ef0d71ff4c9e61f55b09c15e75
├── 54
│   └── c0f3ef1f379563e0b9ba4accae6807
├── 6f
│   └── 597d341ceb7d8fbbe88859a892ef81
├── a1
│   └── 414b22382ffbb76a153ab1f0d69241.dir
└── a3
    └── 04afb96060aad90176268345e10355
```

Fetching using `--with-deps` starts with the target stage (`train`) and searches
backwards through its pipeline for data to download into the project's cache.
All the data for the second and third stages (`featurize` and `train`) has now
been downloaded to the cache. We could now use `dvc checkout` to get the data
files needed to reproduce this pipeline up to the third stage into the workspace
(with `dvc repro train`).

> Note that in this example project, the last stage `evaluate` doesn't add any
> more data files than those form previous stages, so at this point all of the
> data for this pipeline is cached and `dvc status -c` would output
> `Cache and remote 'storage' are in sync.`
