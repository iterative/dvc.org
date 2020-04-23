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
(`.dvc`), hides actual locations and names. It means that you don't see actual
data when you view a <abbr>DVC repository</abbr> with Github/Gitlab UI (you see
`.dvc` files instead). It makes it hard to navigate the project, makes it hard
to use `dvc get`, `dvc import`, [`dvc.api`](/doc/api-reference) - they all deal
with actual path to a data file or directory.

This command prints a virtual view of a DVC repository, the way it would have
looked like if files and directories that are DVC-tracked were actually regular
Git-tracked files.

Another way to explain this - it prints the result similar to:

```dvc
$ git clone <url> example
$ cd example
$ dvc pull
$ ls <path>
```

The `url` argument is a Git repository address to list. Command works for any
Git repository - either it has DVC project in it, or not. Both HTTP and SSH
protocols are supported for online repositories (e.g.
`https://github.com/iterative/example-get-started` or
`git@github.com:iterative/example-get-started.git`). `url` can also be a local
file system path to a valid Git repository.

The `path` argument of this command is used to specify a path within the source
repository at `url`. It's similar to providing a path to list to the commands
like `ls` or `aws s3 ls`. And similar to the, `-R` option might be used to list
files recursively.

## Options

- `-R`, `--recursive` - recursively prints the repository contents.

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

## Example: List files and directories in a DVC repository

We can use the command for getting information about remote repository with all
files, directories and <abbr>data artifacts</abbr>, including DVC-tracked ones:

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
[example-get-started project's page](https://github.com/iterative/example-get-started),
you will see a similar list, except that `model.pkl` will be missing. That's
because its tracked by DVC and not visible to Git. You can find it specified as
an output if you open
[`train.dvc`](https://github.com/iterative/example-get-started/blob/master/train.dvc).

We can now, for example, run

```dvc
$ dvc get https://github.com/iterative/example-get-started model.pkl
```

to download the model file (see `dvc get`).

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
