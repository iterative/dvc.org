# list

List repository contents, including files, models, and directories tracked by
DVC (<abbr>data artifacts</abbr>) and by Git.

## Synopsis

```usage
usage: dvc list [-h] [-q | -v] [-R] [--outs-only] [--rev <commit>]
                url [path]

positional arguments:
  url            Location of DVC or Git repository to list from
  path           Path to a file or directory within the repository
```

## Description

DVC, by effectively replacing data files, models, directories with DVC-files
(`.dvc`), hides actual locations and names. This means that you don't see data
files when you browse a <abbr>DVC repository</abbr> on Git hosting (e.g.
Github), you just see the DVC-files. This makes it hard to navigate the project
to find <abbr>data artifacts</abbr> for use with `dvc get`, `dvc import`, or
[`dvc.api`](/doc/api-reference).

`dvc list` prints a virtual view of a DVC repository, as if files and
directories [tracked by DVC](/doc/use-cases/versioning-data-and-model-files)
were found directly in the remote Git repo. Only the root directory is listed by
default. The output of this command is equivalent to actually cloning the repo
and [pulling](/doc/command-reference/pull) its data like this:

```dvc
$ git clone <url> example
$ cd example
$ dvc pull
$ ls <path>
```

The `url` argument specifies the address of the Git repository containing the
data source. Both HTTP and SSH protocols are supported for online repos (e.g.
`[user@]server:project.git`). `url` can also be a local file system path to an
"offline" Git repo.

The optional `path` argument is used to specify directory to list within the
source repository at `url`. It's similar to providing a path to list to commands
such as `ls` or `aws s3 ls`. And similar to the, `-R` option might be used to
list files recursively.

Please note that `dvc list` doesn't check whether the listed data (tracked by
DVC) actually exists in remote storage, so it's not guaranteed whether it can be
accessed with `dvc get`, `dvc import`, or [`dvc.api`](/doc/api-reference)

## Options

- `-R`, `--recursive` - recursively prints contents of all subdirectories.

- `--outs-only` - show only DVC-tracked files and directories
  (<abbr>outputs</abbr>).

- `--rev <commit>` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to list
  content for. The latest commit in `master` (tip of the default branch) is used
  by default when this option is not specified.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information. when this option is
  not specified.

## Example: Find files to download from a repository

We can use this command for getting information about a repository before using
other commands like `dvc get` or `dvc import` to reuse any file or directory
found in it. This includes files tracked by Git as well as <abbr>data
artifacts</abbr> tracked by DVC-tracked:

```dvc
$ dvc list https://github.com/iterative/example-get-started
.gitignore
README.md
auc.metric
data
evaluate.dvc
featurize.dvc
model.pkl
prepare.dvc
src
train.dvc
```

If you open the
[example-get-started](https://github.com/iterative/example-get-started)
project's page, you will see a similar list, except that `model.pkl` will be
missing. That's because its tracked by DVC and not visible to Git. You can find
it in the
[`train.dvc`](https://github.com/iterative/example-get-started/blob/master/train.dvc)
DVC-file (`outs` field).

We can now, for example, download the model file with:

```dvc
$ dvc get https://github.com/iterative/example-get-started model.pkl
```

## Example: List all files and directories in a data registry

Let's imagine a DVC repo used as a
[data registry](/doc/use-cases/data-registries#using-registries), structured
with different datasets in separate directories. We can do this recursively,
using `-R` option:

```dvc
$ dvc list -R https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started/.gitignore
get-started/data.xml
get-started/data.xml.dvc
images/.gitignore
images/dvc-logo-outlines.png
images/dvc-logo-outlines.png.dvc
images/owl_sticker.png
...
```
