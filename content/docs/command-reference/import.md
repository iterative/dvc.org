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

> See `dvc list` for a way to browse repository contents to find files or
> directories to import.

> Note that `dvc get` corresponds to the first step this command performs (just
> download the data).

The imported data is <abbr>cached</abbr>, and linked (or copied) to the current
working directory with its original file name e.g. `data.txt` (or to a location
provided with `--out`). An _import `.dvc` file_ is created in the same location
e.g. `data.txt.dvc` – similar to using `dvc add` after downloading the data.

(ℹ️) DVC won't push data imported from other DVC repos to
[remote storage](/doc/command-reference/remote). `dvc pull` will download from
the original source.

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported (e.g.
`[user@]server:project.git`). `url` can also be a local file system path
(including the current project e.g. `.`).

The `path` argument specifies a file or directory to download (paths inside
tracked directories are supported). It should be relative to the root of the
repo (absolute paths are supported when `url` is local). Note that DVC-tracked
targets must be found in a `dvc.yaml` or `.dvc` file of the repo.

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

To actually [version the data](/doc/start/data-and-model-versioning), `git add`
(and `git commit`) the import `.dvc` file.

Note that `dvc repro` doesn't check or update import `.dvc` files (see
`dvc freeze`), use `dvc update` to bring the import up to date from the data
source.

DVC includes limited support for chained imports (importing data that was
imported into the source repo at `url`).

> See [Chained imports](#example-chained-imports) below for more details.

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

- `--no-exec` - create the import `.dvc` file but don't download `url` (assumes
  that the data source is valid). This is useful if you need to define the
  project imports quickly, and download everything later (use `dvc update` to
  finish the operation(s)); or if the target data already exist locally and you
  want to "DVCfy" this state of the project (see also `dvc commit`).

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from the remote. The default value is `4 * cpu_count()`. For SSH remotes, the
  default is `4`. Using more jobs may speed up the operation. Note that the
  default value can be set in the source repo using the `jobs` config option of
  `dvc remote modify`.

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
frozen: true
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

Several of the values above are pulled from the original `.dvc` file
[in the external DVC repository](https://github.com/iterative/example-get-started/blob/master/data/data.xml.dvc).
The `url` and `rev_lock` subfields under `repo` are used to save the origin and
version of the dependency, respectively.

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
such as `tutorials/versioning` and `use-cases/`, and these contain `.dvc` files
that track different datasets. Given this simple structure, its data files can
be easily shared among several other projects using `dvc get` and `dvc import`.
For example:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorials/versioning/data.zip
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

## Example: Chained imports

DVC supports importing data importing data that was imported into the source
repo, as long as all repos in the import chain are accessible from the final
destination repo. Each source repo's default DVC remote must also be accessible
from the final destination repo.

Consider an example where we start with two DVC repos, A and B, with the
following contents:

```
/repo/a
├── foo
└── foo.dvc

/repo/b
├── bar
└── bar.dvc
```

Now, we create a third DVC repo, C, with the following contents:

```
/repo/c
└── dir
    ├── bar
    ├── bar.dvc
    ├── foo
    ├── foo.dvc
    ├── subdir
    │   └── baz
    └── subdir.dvc
```

Repo C, contains a data directory tracked with `dvc add` (`dir/subdir`), as well
as two separate imports (`dir/foo` and `dir/bar`). The imports were created via:

```dvc
# In repo C
$ dvc import /repo/a foo -o dir/foo
$ dvc import /repo/b bar -o dir/bar
```

If we examine the contents of `dir/foo.dvc`, we can see that it is imported from
repo A:

```yaml
# dir/foo.dvc
md5: d652071a8f0fd9f5c74d9348a468dec5
frozen: true
deps:
- path: foo
  repo:
    url: /repo/a
    rev_lock: 32ab3ddc8a0b5cbf7ed8cb252f93915a34b130eb
outs:
- md5: acbd18db4cc2f85cedef654fccc4a4d8
  size: 3
  path: foo
outs:
- md5: 630bd47b538d2a513c7d267d07e0bc44.dir
  size: 3
  nfiles: 1
  path: subdir
```

Now, lets say that we want to create a fourth DVC repo, D, and run the following
command:

```dvc
# In repo D
$ dvc import /repo/c dir
```

This will result in the following directory structure, which contains two
chained imports:

- `foo` is imported from A into C into D
- `bar` is imported from B into C into D

```
/repo/d
├── dir
│   ├── bar
│   ├── foo
│   └── subdir
│       └── baz
└── dir.dvc
```

If we examine `dir.dvc`, we can see that it only references repo C.

```yaml
# dir.dvc
md5: bfdac3f7c77bdd89dcd1f6d22f5e39c5
frozen: true
deps:
  - path: dir
    repo:
      url: /repo/c
      rev_lock: 15136ed84b59468b68fd66b8141b41c5be682ced
outs:
  - md5: e784c380dd9aa9cb13fbe22e62d7b2de.dir
    size: 27
    nfiles: 4
    path: dir
```

Each time that we run `dvc import dir` (from C), `dvc update dir` or
`dvc pull dir`, DVC will first look up the contents of `dir` in repo C. At that
point in time, DVC will see that `foo` and `bar` are chained imports from repos
A and B, and then continue resolving the chain as needed (by looking up `foo`
from A, and `bar` from B).

This means that all three repos A, B and C must be reachable when DVC commands
are run from repo D, otherwise the import chain resolution would fail, and the
`dvc import` command will error out.

⚠️ When fetching files imported from the chain, DVC will fetch them from their
original source locations. This means that the default DVC remotes for all repos
in the import chain must be accessible from the final destination repo. So in
this example, a user running `dvc pull` from repo D must have the appropriate
credentials to access the default remotes for all three source repos (A, B and
C).

> Note that when running `dvc update dir` from repo D, DVC will only check
> whether or not `dir/` has changed in repo C. This means that even if `foo` has
> changed in repo A, that change will not be propagated to repo D until
> `dvc update dir/foo` has been run in repo C.
