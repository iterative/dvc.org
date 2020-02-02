# import

Download a file or directory from any <abbr>DVC project</abbr> or Git repository
into the <abbr>workspace</abbr>. This also creates a
[DVC-file](/doc/user-guide/dvc-file-format) with information about the data
source, which can later be used to [update](/doc/command-reference/update) the
import.

> See also `dvc get`, that corresponds to the first step this command performs
> (just download the data).

## Synopsis

```usage
usage: dvc import [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url       Location of DVC project or Git repository to download
            from.
  path      Path to a file or directory within the project or
            repository.
```

## Description

Provides an easy way to reuse files or directories tracked in any <abbr>DVC
project</abbr> (e.g. datasets, intermediate results, ML models) or Git
repository (e.g. source code, small image/other files). `dvc import` downloads
the target file or directory (`url`/`path`) in a way so that it's tracked with
DVC, becoming a local <abbr>data artifact</abbr>. This also permits updating the
import later, if it has changed in its data source. (See `dvc update`.)

The `url` argument specifies the address of the <abbr>DVC project</abbr> or Git
repository containing the data source. Both HTTP and SSH protocols are supported
for online repositories (e.g. `[user@]server:project.git`). `url` can also be a
local file system path to an "offline" repository (in this case and if it
doesn't have a default remote set up, instead of downloading, DVC will try to
copy the target data from the external source project or its
<abbr>cache</abbr>).

The `path` argument of this command is used to specify the location of the
target(s) to be downloaded within the source project or repository at `url`. It
can point to any file or directory in the source project, including
<abbr>outputs </abbr> tracked by DVC as well as files tracked by Git. Note that
for the former, data should be specified in one of the
[DVC-files](/doc/user-guide/dvc-file-format) of the source repository. (In this
case, a default [DVC remote](/doc/command-reference/remote) needs to be
configured in the project, containing the actual data.)

> See `dvc import-url` to download and track data from other supported URLs.

After running this command successfully, the imported data is placed in the
current working directory with its original file name e.g. `data.txt`. An
_import stage_ (DVC-file) is then created, extending the full file or directory
name of the imported data e.g. `data.txt.dvc` – similar to having used `dvc run`
to generate the same output.

DVC-files support references to data in an external DVC repository (hosted on a
Git server). In such a DVC-file, the `deps` section specifies the `repo`-`url`
and data `path` fields, and the `outs` section contains the corresponding local
workspace `path` field. This is enough data about the imported data, to enable
DVC efficiently determining whether the local copy is out of date.

To actually [track the data](https://dvc.org/doc/get-started/add-files),
`git add` (and `git commit`) the import stage.

Note that import stages are considered always locked, meaning that if you run
`dvc repro`, they won't be updated. Use `dvc update` or
[re-import](#example-fixed-revisions-re-importing) them to update the downloaded
data artifact from the source project.

## Options

- `-o`, `--out` - specify a path (directory and/or file name) to the desired
  location to place the imported data in. The default value (when this option
  isn't used) is the current working directory (`.`) and original file name. If
  an existing directory is specified, then the output will be placed inside of
  it.

- `--rev` - specific
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash) of the repository to download
  the file or directory from. The tip of the default branch is used by default
  when this option is not specified.

  > Note that this adds a `rev` field in the import stage that fixes it to this
  > revision. This can impact the behavior of `dvc update`. (See
  > **re-importing** example below.)

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
dependency.

## Example: Fixed revisions & re-importing

To import a specific revision of a <abbr>data artifact</abbr>, we may use the
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

If `rev` is a Git branch or tag, it may have new commits periodically. To bring
the data up to date (and update `rev_lock` in the DVC-file), simply use
`dvc update <stage>.dvc`. If `rev` is a specific commit (does not change),
`dvc update` will never have an effect on the import stage. You may
**re-import** a different commit instead, by using `dvc import` again with a
different (or without) `--rev`. For example:

```dvc
$ dvc import --rev master \
             git@github.com:iterative/dataset-registry.git \
             use-cases/cats-dogs
```

The import stage is overwritten, and will now be able update normally with
`dvc update`.

> In the above example, the value for `rev` in the new import stage will be
> `master` (default branch), so the command is equivalent to not using `--rev`
> at all.

## Example: Data registry

If you take a look at our
[dataset-registry](https://github.com/iterative/dataset-registry)
<abbr>project</abbr>, you'll see that it's organized into different directories
such as `tutorial/ver` and `use-cases/`, and these contain
[DVC-files](/doc/user-guide/dvc-file-format) that track different datasets.
Given this simple structure, these files can be easily shared among several
other projects, using `dvc get` and `dvc import`. For example:

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
current project and the source project. This means that enough information is
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
