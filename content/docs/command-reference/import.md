# import

Download a file or directory tracked by DVC or by Git into the
<abbr>workspace</abbr>. It also creates a `.dvc` file with information about the
data source, which can later be used to [update](/doc/command-reference/update)
the import.

> See also our `dvc.api.open()` Python API function.

## Synopsis

```usage
usage: dvc import [-h] [-q | -v]
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
repository (e.g. source code, small image/other files). `dvc import` downloads
the target file or directory (found at `path` in `url`) into the workspace and
tracks it in the project. This makes it possible to update the import later, if
it has changed in its data source (see `dvc update`).

> Note that `dvc get` corresponds to the first step this command performs (just
> download the data).

> See `dvc list` for a way to browse repository contents to find files or
> directories to import.

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported (e.g.
`[user@]server:project.git`). `url` can also be a local file system path.

The `path` argument is used to specify the location of the target to download
within the source repository at `url`. `path` can specify any file or directory
tracked by either Git or DVC (including paths inside tracked directories). Note
that DVC-tracked targets must be found in a `dvc.yaml` or `.dvc` file of the
repo.

⚠️ DVC repos should have a default [DVC remote](/doc/command-reference/remote)
containing the target actual for this command to work. The only exception is for
local repos, where DVC will try to copy the data from its <abbr>cache</abbr>
first.

> See `dvc import-url` to download and track data from other supported locations
> such as S3, SSH, HTTP, etc.

After running this command successfully, the imported data is placed in the
current working directory (unless `-o` is used) with its original file name e.g.
`data.txt`. An _import stage_ (`.dvc` file) is also created in the same
location, extending the name of the imported data e.g. `data.txt.dvc` – similar
to having used `dvc run` to generate the data as a stage <abbr>output</abbr>.

`.dvc` files support references to data in an external DVC repository (hosted on
a Git server). In such a `.dvc` file, the `deps` field specifies the remote
`url` and data `path`, and the `outs` field contains the corresponding local
path in the <abbr>workspace</abbr>. It records enough metadata about the
imported data to enable DVC efficiently determining whether the local copy is
out of date.

⚠️ DVC won't push or pull imported data to/from
[remote storage](/doc/command-reference/remote), it will rely on it's original
source.

To actually [version the data](/doc/tutorials/get-started/data-versioning),
`git add` (and `git commit`) the import stage.

Note that import stages are considered always
[frozen](/doc/command-reference/freeze), meaning that if you run `dvc repro`,
they won't be updated. Use `dvc update` to update the downloaded data artifact
from the source repo.

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

  > Note that this adds a `rev` field in the import stage that fixes it to the
  > revision. This can impact the behavior of `dvc update` (see the
  > [Importing and updating fixed revisions](#example-importing-and-updating-fixed-revisions)
  > example below).

- `--no-exec` - create the import `.dvc` file without actually downloading the
  file or directory. E.g. if the file or directory already exists, this can be
  used to skip the download. The data hash is not calculated when this option is
  used, only the import metadata is saved to the `.dvc` file.
  `dvc commit <out>.dvc` can be used if the data hashes are needed in the `.dvc`
  file, and to save existing data to the cache.

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
but it also creates an import stage (`.dvc` file) with a link to the data source
(as explained in the description above). (This `.dvc` file can later be used to
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
    metric: false
    persist: false
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

When using this option, the import stage (`.dvc` file) will also have a `rev`
subfield under `repo`:

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
will not have an effect on the import stage. You may force-update it to a
different commit with `dvc update --rev`:

```dvc
$ dvc update --rev cats-dogs-v2
```

> In the above example, the value for `rev` in the new import stage will be
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
recorded in an import stage (`.dvc` file) in order to
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

The file is imported, and along with it, an import stage (`.dvc` file) is
created. Check `it-standards.csv.dvc`:

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
