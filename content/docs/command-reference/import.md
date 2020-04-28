# import

Download a file or directory tracked by DVC or by Git into the
<abbr>workspace</abbr>. It also creates a
[DVC-file](/doc/user-guide/dvc-file-format) with information about the data
source, which can later be used to [update](/doc/command-reference/update) the
import.

> See also our `dvc.api.open()` Python API function.

## Synopsis

```usage
usage: dvc import [-h] [-q | -v] [-o <path>] [--rev <commit>] url path

positional arguments:
  url              Location of DVC or Git repository to download from
  path             Path to a file or directory within the repository
```

## Description

Provides an easy way to reuse files or directories tracked in any <abbr>DVC
repository</abbr> (e.g. datasets, intermediate results, ML models) or Git
repository (e.g. source code, small image/other files). `dvc import` downloads
the target file or directory (found at `path` in `url`) in a way so that it's
tracked with DVC, becoming a local <abbr>data artifact</abbr>. This also permits
updating the import later, if it has changed in its data source. (See
`dvc update`.)

> Note that `dvc get` corresponds to the first step this command performs (just
> download the data).

> See `dvc list` for a way to browse repository contents to find files or
> directories to import.

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported for online repos
(e.g. `[user@]server:project.git`). `url` can also be a local file system path
to an "offline" repo (if it's a DVC repo without a default remote, instead of
downloading, DVC will try to copy the target data from its <abbr>cache</abbr>).

The `path` argument is used to specify the location of the target to be
downloaded within the source repository at `url`. `path` can specify any file or
directory in the source repo, including those tracked by DVC, or by Git. Note
that DVC-tracked targets should be found in a
[DVC-file](/doc/user-guide/dvc-file-format) of the project.

⚠️ The project should have a default
[DVC remote](/doc/command-reference/remote), containing the actual data for this
command to work.

> See `dvc import-url` to download and track data from other supported locations
> such as S3, SSH, HTTP, etc.

After running this command successfully, the imported data is placed in the
current working directory (unless `-o` is used) with its original file name e.g.
`data.txt`. An _import stage_ (DVC-file) is also created in the same location,
extending the name of the imported data e.g. `data.txt.dvc` – similar to having
used `dvc run` to generate the data as a stage <abbr>output</abbr>.

DVC-files support references to data in an external DVC repository (hosted on a
Git server). In such a DVC-file, the `deps` field specifies the remote `url` and
data `path`, and the `outs` field contains the corresponding local path in the
<abbr>workspace</abbr>. It records enough metadata about the imported data to
enable DVC efficiently determining whether the local copy is out of date.

To actually
[track the data](https://dvc.org/doc/tutorials/get-started/add-files), `git add`
(and `git commit`) the import stage.

Note that import stages are considered always locked, meaning that if you run
`dvc repro`, they won't be updated. Use `dvc update` to update the downloaded
data artifact from the source repo.

## Options

- `-o <path>`, `--out <path>` - specify a path (directory and/or file name) to
  the desired location to place the imported file in (instead of using the
  current working directory). If an existing directory is specified, the target
  data will be placed inside.

- `--rev <commit>` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to
  download the file or directory from. The latest commit in `master` (tip of the
  default branch) is used by default when this option is not specified.

  > Note that this adds a `rev` field in the import stage that fixes it to the
  > revision. This can impact the behavior of `dvc update` (see the
  > [Importing and updating fixed revisions](#example-importing-and-updating-fixed-revisions)
  > example below).

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
but it also creates an import stage
([DVC-file](/doc/user-guide/dvc-file-format)) with a link to the data source (as
explained in the description above). (This import stage can later be used to
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

To import a specific version of a <abbr>data artifact</abbr>, we may use the
`--rev` option:

```dvc
$ dvc import --rev cats-dogs-v1 \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
Importing
'use-cases/cats-dogs (git@github.com:iterative/dataset-registry.git)'
-> 'cats-dogs'
```

When using this option, the import stage
([DVC-file](/doc/user-guide/dvc-file-format)) will also have a `rev` subfield
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
update `rev_lock` in the DVC-file), simply use `dvc update <stage>.dvc`. If
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
[dataset-registry](https://github.com/iterative/dataset-registry)
<abbr>project</abbr>, you'll see that it's organized into different directories
such as `tutorial/ver` and `use-cases/`, and these contain
[DVC-files](/doc/user-guide/dvc-file-format) that track different datasets.
Given this simple structure, its data files can be easily shared among several
other projects using `dvc get` and `dvc import`. For example:

```dvc
$ dvc get https://github.com/iterative/dataset-registry \
          tutorial/ver/data.zip
```

> Used in our [versioning tutorial](/doc/tutorials/versioning)

Or

```dvc
$ dvc import git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

`dvc import` provides a better way to incorporate data files tracked in external
<abbr>DVC repositories</abbr> because it saves the connection between the
current project and the source repo. This means that enough information is
recorded in an import stage (DVC-file) in order to
[reproduce](/doc/command-reference/repro) downloading of this same data version
in the future, where and when needed. This is achieved with the `repo` field,
for example (matching the import command above):

```yaml
md5: 96fd8e791b0ee4824fc1ceffd13b1b49
locked: true
deps:
  - path: use-cases/cats-dogs
    repo:
      url: git@github.com:iterative/dataset-registry.git
      rev_lock: 0547f5883fb18e523e35578e2f0d19648c8f2d5c
outs:
  - md5: b6923e1e4ad16ea1a7e2b328842d56a2.dir
    path: cats-dogs
    cache: true
    metric: false
    persist: false
```

See a full explanation in our [Data Registries](/doc/use-cases/data-registries)
use case.
