# list

List <abbr>repository</abbr> contents, including files and directories tracked
by DVC (<abbr>data artifacts</abbr>) and by Git.

## Synopsis

```usage
usage: dvc list [-h] [-q | -v] [-R] [--outs-only] [--rev [REV]] url [path]

positional arguments:
  url              Location of DVC repository to list.
  path             Path to a file or directory within the repository.
```

## Description

List files, dirs and <abbr>data artifacts</abbr> for the pointed URL. The output
is sorted lexicographically.

With the command you may list all <abbr>data artifacts</abbr> the repo contains.
Also it works with remote repos and you can list files before trying to get it
(with `dvc get` or `dvc import`).

The `url` argument specifies the address of the DVC or Git repository containing
the data source. Both HTTP and SSH protocols are supported for online repos
(e.g. `[user@]server:project.git`). `url` can also be a local file system path.
When the url is remote Git URL the content is checkout into temporary directory.

`--outs-only` option allows to filter <abbr>data artifacts</abbr> into the repo,
so only <abbr>data artifacts</abbr> will be printed.

`path` argument is used for pointing relative path into the repo. So you may use
it when need to list files for some specific path. With recursive option `-R` it
allows to filter output by prefix.

Also with `path` argument you may check existense of some file - if the file
doesn't exist the error would be thrown.

## Options

- `--outs-only` - show only <abbr>data artifacts</abbr>.

- `-R`, `--recursive` - recursively prints the directory. When `path` is not
  specified the directory is the root of the repo.

- `--rev` - commit hash, branch or tag name, etc. (any
  [Git revision](https://git-scm.com/docs/revisions)) of the repository to list
  content for. The latest commit in `master` (tip of the default branch) is used
  by default when this option is not specified.

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

## Example: Check the path

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
