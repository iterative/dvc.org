# list

List Git repository contents including files and directories under DVC control
(<abbr>data artifacts</abbr>).

## Synopsis

```usage
usage: dvc list [-h] [-q | -v] [-R] [--outs-only] [--rev [REV]] url [target]

positional arguments:
  url              Url to the repo. Can be either local fs path or Git repository URL.
  target           Path to directory within the repository to list contents for.
```

## Description

List files, dirs and <abbr>data artifacts</abbr> for the pointed url. The output
is sorted lexicographically.

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported for online repos
(e.g. `[user@]server:project.git`). `url` can also be a local file system path.
When the url is remote git url the content is checkout into temporary directory.

`--outs-only` option allows to check all <abbr>data artifacts</abbr> into the
repo, which can be useful before `dvc get` or `dvc import` invocation.

The `target` argument allows to check existense of the target into the repo.
With recursive option `-R` it allows to filter output by prefix. The `target`
should be relative file system path.

## Options

- `--outs-only` - show only <abbr>data artifacts</abbr>.

- `-R`, `--recursive` - recursively prints the repo.

- `--rev` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to
  download the file or directory from. The latest commit in `master` (tip of the
  default branch) is used by default when this option is not specified.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information. when this option is
  not specified.

## Example: List remote git repo

We can use the command for getting information about remote repository with all
files, dirs and <abbr>data artifacts</abbr>.

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
images/owl_sticker.png.dvc
images/owl_sticker.svg
...
```

Or

```dvc
$ dvc list https://github.com/iterative/dataset-registry

.gitignore
README.md
get-started
images
tutorial
use-cases
```

for getting flat information about the repo

## Example: List the repo with the rev

Another useful case is checking the files for the **specific revision**

```dvc
$ dvc list -R --rev 7476a858f6200864b5755863c729bff41d0fb045 \
        https://github.com/iterative/dataset-registry

.gitignore
README.md
get-started/.gitignore
get-started/data.xml
get-started/data.xml.dvc
tutorial/nlp/.gitignore
tutorial/nlp/Posts.xml.zip
tutorial/nlp/Posts.xml.zip.dvc
tutorial/nlp/pipeline.zip
tutorial/nlp/pipeline.zip.dvc
tutorial/ver/.gitignore
tutorial/ver/data.zip
tutorial/ver/data.zip.dvc
tutorial/ver/new-labels.zip
```

## Example: Check the target

Before trying to get or import some <abbr>data artifacts</abbr> with `dvc get`
or `dvc import` we can check their existence with

```dvc
$ dvc list --outs-only \
         https://github.com/iterative/dataset-registry \
         tutorial/nlp/pipeline.zip
```

Or everything under the prefix

```dvc
$ dvc list -R --outs-only \
         https://github.com/iterative/dataset-registry \
         tutorial
```
