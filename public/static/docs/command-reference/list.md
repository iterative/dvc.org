# list

List repository contents, including files and directories tracked by DVC
(<abbr>data artifacts</abbr>) and by Git.

## Synopsis

```usage
usage: dvc list [-h] [-q | -v] [-R] [--outs-only] [--rev [REV]]
                url [target]

positional arguments:
  url            Location of DVC or Git repository to list from
  target         Path to a file or directory within the repository
```

## Description

Lists files and directories in the root of a <abbr>repository</abbr>, including
<abbr>data artifacts</abbr> tracked by DVC (e.g. data, models), and Git-tracked
files (e.g. source code). To list recursively, use the `-R` option.

This command especially useful to browse a public repo in order to find the
exact file or directory names to `dvc import` or `dvc get`. The list is sorted
alphabetically.

Note that this command doesn't require an existing DVC project to run in. Also,
it does not support listing <abbr>DVC projects</abbr> that aren't tracked by Git
(see the `--no-scm` option of `dvc init`).

The `url` argument specifies the address of the DVC or Git repository to list.
Both HTTP and SSH protocols are supported for online repos (e.g.
`[user@]server:project.git`). `url` can also be a local file system path to an
"offline" repo.

The `target` argument of this command is used to specify a path within the
source repository at `url`. If the target is a file found in the repo, it's file
name will be printed as a way to confirm its existence. If it's a Git-tracked
directory, files and directories directly under it will be listed (use option
`-R` to list recursively).

Listing the contents of DVC-tracked directories is not supported at the time.

`--outs-only` option allows to filter <abbr>data artifacts</abbr> into the repo,
so only <abbr>data artifacts</abbr> will be printed.

## Options

- `-R`, `--recursive` - recursively prints the repository contents. (It can be
  limited to a specific Git-tracked directory by supplying a `target` argument.)

- `--outs-only` - show only DVC-tracked data (<abbr>outputs</abbr>).

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
files, directories and <abbr>data artifacts</abbr>.

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
