# import

Download a file or directory tracked by another DVC or Git repository into the
<abbr>workspace</abbr>, and track it (an import `.dvc` file is created).

> See also our `dvc.api.open()` Python API function.

## Synopsis

```usage
usage: dvc import [-h] [-q | -v] [-j <number>]
                  [-o <path>] [--file <filename>]
                  [--rev <commit>] [--no-exec] [--desc <text>]
                  url path

positional arguments:
  url              Location of DVC or Git repository to download from
  path             Path to a file or directory within the repository
```

## Description

Provides an easy way to reuse files or directories tracked in any <abbr>DVC
repository</abbr> (e.g. datasets, intermediate results, ML models) or Git
repository (e.g. code, small image/other files). `dvc import` downloads the
target file or directory (found at `path` in `url`), and tracks it in the local
project. This makes it possible to update the import later, if the data source
has changed (see `dvc update`).

> Note that `dvc get` corresponds to the first step this command performs (just
> download the data).

> See `dvc list` for a way to browse repository contents to find files or
> directories to import.

The imported data is <abbr>cached</abbr>, and linked (or copied) to the current
working directory with its original file name e.g. `data.txt` (or to a location
provided with `--out`). An _import `.dvc` file_ is created in the same location
e.g. `data.txt.dvc` – similar to using `dvc add` after downloading the data.

⚠️ DVC won't push or pull data imported from other DVC repos to/from
[remote storage](/doc/command-reference/remote). It will rely on it's original
source.

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported (e.g.
`[user@]server:project.git`). `url` can also be a local file system path
(including the current project e.g. `.`).

The `path` argument is used to specify the location of the target to download
within the source repository at `url`. `path` can specify any file or directory
tracked by either Git or DVC (including paths inside tracked directories). Note
that DVC-tracked targets must be found in a `dvc.yaml` or `.dvc` file of the
repo.

⚠️ Source DVC repos should have a default
[DVC remote](/doc/command-reference/remote) containing the target data for this
command to work. The only exception is for local repos, where DVC will try to
copy the data from its <abbr>cache</abbr> first.

> See `dvc import-url` to download and track data from other supported locations
> such as S3, SSH, HTTP, etc.

`.dvc` files support references to data in an external DVC repository (hosted on
a Git server). In such a `.dvc` file, the `deps` field specifies the `url` and
data `path`, and the `outs` field contains the corresponding local path in the
<abbr>workspace</abbr>. It records enough metadata about the imported data to
enable DVC efficiently determining whether the local copy is out of date.

To actually [version the data](/doc/tutorials/get-started/data-versioning),
`git add` (and `git commit`) the import `.dvc` file.

Note that `dvc repro` doesn't check or update import `.dvc` files (see
`dvc freeze`), use `dvc update` to bring the import up to date from the data
source.

Also note that chained imports (importing data that was imported into the source
repo at `url`) are not supported.

## Options

- `-o <path>`, `--out <path>` - specify a path to the desired location in the
  workspace to place the downloaded file or directory (instead of using the
  current working directory). Directories specified in the path must already
  exist, otherwise this command will fail.

- `--file <filename>` - specify a path and/or file name for the `.dvc` file
  created by this command (e.g. `--file stages/stage.dvc`). This overrides the
  default file name: `<file>.dvc`, where `<file>` is the desired file name of
  the imported data (`out`).

- `--rev <commit>` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to
  download the file or directory from. The latest commit in `master` (tip of the
  default branch) is used by default when this option is not specified.

  > Note that this adds a `rev` field in the import `.dvc` file that fixes it to
  > the revision. This can impact the behavior of `dvc update` (see the
  > [Importing and updating fixed revisions](#example-importing-and-updating-fixed-revisions)
  > example below).

- `--no-exec` - create the import `.dvc` file but don't download the target data
  (doesn't check whether the source is valid). You can use `dvc update` to
  finish the operation. This is useful if you need to define the project imports
  quickly, and download everything later (with `dvc update`); or if the target
  data already exist locally and you want to "DVCfy" this state of the project
  (see also `dvc commit`).

- `-j <number>`, `--jobs <number>` - number of threads to run simultaneously to
  handle the downloading of files from the remote. The default value is
  `4 * cpu_count()`. For SSH remotes, the default is just `4`. Using more jobs
  may improve the total download speed if a combination of small and large files
  are being fetched.

- `--desc <text>` - user description of the data (optional). This doesn't affect
  any DVC operations.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

A simple case for this command is to import a dataset from an external <abbr>DVC
repository</abbr>, such as our
[get started example repo](https://github.com/iterative/example-get-started).

```dvc
$ dvc import git@github.com:iterative/example-get-started \
             data/data.xml
Importing 'data/data.xml (git@github.com:iterative/example-get-started)'
-> 'data.xml'
```

In contrast with `dvc get`, this command doesn't just download the data file,
but it also creates an import `.dvc` file with a link to the data source (as
explained in the description above). (This `.dvc` file can later be used to
[update](/doc/command-reference/update) the import.) Check `data.xml.dvc`:

```yaml
md5: 7de90e7de7b432ad972095bc1f2ec0f8
wdir: .
deps:
  - path: data/data.xml
    repo:
      url: git@github.com:iterative/example-get-started
      rev_lock: 6c73875a5f5b522f90b5afa9ab12585f64327ca7
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    cache: true
```

Several of the values above are pulled from the original stage file
`model.pkl.dvc` in the external DVC repository. The `url` and `rev_lock`
subfields under `repo` are used to save the origin and version of the
dependency, respectively.

## Example: Importing and updating fixed revisions

To import a specific version of a file/directory, we may use the `--rev` option:

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
Importing
'use-cases/cats-dogs (git@github.com:iterative/dataset-registry.git)'
-> 'cats-dogs'
```

When using this option, the import `.dvc` file will also have a `rev` subfield
under `repo`:

```yaml
deps:
  - path: data/data.xml
    repo:
      url: git@github.com:iterative/dataset-registry.git
      rev: cats-dogs-v1
      rev_lock: 0547f5883fb18e523e35578e2f0d19648c8f2d5c
```

If `rev` is a Git branch or tag (where the underlying commit changes), the data
source may have updates at a later time. To bring it up to date if so (and
update `rev_lock` in the `.dvc` file), simply use `dvc update <stage>.dvc`. If
`rev` is a specific commit hash (does not change), `dvc update` without options
will not have an effect on the import `.dvc` file. You may force-update it to a
different commit with `dvc update --rev`:

```dvc
$ dvc update --rev cats-dogs-v2
```

> In the above example, the value for `rev` in the new `.dvc` file will be
> `master` (a branch) so it will be able update normally going forward.

## Example: Data registry

If you take a look at our
[dataset registry](https://github.com/iterative/dataset-registry)
<abbr>project</abbr>, you'll see that it's organized into different directories
such as `tutorial/ver` and `use-cases/`, and these contain `.dvc` files that
track different datasets. Given this simple structure, its data files can be
easily shared among several other projects using `dvc get` and `dvc import`. For
example:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/data.zip
```

> Used in our
> [versioning tutorial](/doc/use-cases/versioning-data-and-model-files/tutorial)

Or

```dvc
$ dvc import git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

`dvc import` provides a better way to incorporate data files tracked in external
<abbr>DVC repositories</abbr> because it saves the connection between the
current project and the source repo. This means that enough information is
recorded in an import `.dvc` file in order to
[reproduce](/doc/command-reference/repro) downloading of this same data version
in the future, where and when needed. This is achieved with the `repo` field,
for example (matching the import command above):

```yaml
frozen: true
deps:
  - path: use-cases/cats-dogs
    repo:
      url: git@github.com:iterative/dataset-registry.git
      rev_lock: 0547f5883fb18e523e35578e2f0d19648c8f2d5c
outs:
  - md5: b6923e1e4ad16ea1a7e2b328842d56a2.dir
    path: cats-dogs
    cache: true
```

See a full explanation in our [Data Registries](/doc/use-cases/data-registries)
use case.

## Example: Importing from any Git repository

You can even import files from plain Git repos that are not <abbr>DVC
repositories</abbr>. For example, let's import a dataset from
[GSA's data repo](https://github.com/GSA/data):

```dvc
$ dvc import git@github.com:GSA/data \
           enterprise-architecture/it-standards.csv
Importing ...
```

> Note that Git-tracked files can be imported from DVC repos as well.

The file is imported, and along with it, an import `.dvc` file is created. Check
`it-standards.csv.dvc`:

```yaml
deps:
  - path: enterprise-architecture/it-standards.csv
    repo:
      url: git@github.com:GSA/data
      rev_lock: af6a1feb542dc05b4d3e9c80deb50e6596876e5f
outs:
  - md5: 7e6de779a1ab286745c808f291d2d671
    path: it-standards.csv
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.
