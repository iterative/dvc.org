# get

Download or copy file or directory from any <abbr>DVC project</abbr> in a Git
repository (e.g. hosted on Github) into the current working directory.

> Unlike `dvc import`, this command does not track the downloaded data files
> (does not create a DVC-file).

## Synopsis

```usage
usage: dvc get [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url         URL of Git repository with DVC project to download from.
  path        Path to data within DVC repository.
```

## Description

Provides an easy way to reuse datasets, intermediate results, ML models, or
other files and directories (any <abbr>data artifact</abbr>) tracked in another
DVC repository, by downloading them into the current working directory.

Note that this command doesn't require an existing DVC project to run in. It's a
single-purpose command that can be used out of the box after installing DVC.

The `url` argument specifies the address of the Git repository containing the
source <abbr>DVC project</abbr>. Both HTTP and SSH protocols are supported for
online repositories (e.g. `[user@]server:project.git`). `url` can also be a
local file system path to an "offline" repository.

The `path` argument of this command is used to specify the location of the data
to be downloaded within the repo. It should point to a data file or directory
tracked by the source DVC project – specified in one of the
[DVC-files](/doc/user-guide/dvc-file-format) of the repository at `url`. You
will not find these files directly in the source Git repository. The source
project should have a default [DVC remote](/doc/commands-reference/remote)
configured, containing them.)

> See `dvc get-url` to download data from other supported URLs.

After running this command successfully, the data found in the `url` `path` is
created in the current working directory, with its original file name.

## Options

- `-o`, `--out` - specify a path (directory and file name) to the desired
  location to place the imported data in. The default value (when this option
  isn't used) is the current working directory (`.`) and original file name.

- `--rev` - specific Git revision of the DVC repository to import the data from.
  The tip of the default branch is used by default when this option is not
  specified.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

> Note that `dvc get` can be used form anywhere in the file system, as long as
> DVC is [installed](/doc/get-started/install).

We can use `dvc get` to download the resulting model file from our
[get started example repo](https://github.com/iterative/example-get-started),
which is a DVC project external to the current working directory. The desired
<abbr>output</abbr> file would be located in the root of the external
<abbr>project</abbr> (if the
[`train.dvc` stage](https://github.com/iterative/example-get-started/blob/master/train.dvc)
was reproduced) and named `model.pkl`.

```dvc
$ dvc get https://github.com/iterative/example-get-started model.pkl
Preparing to download data from 'https://remote.dvc.org/get-started'
...
$ ls
model.pkl
```

Note that the `model.pkl` file doesn't actually exist in the
[data directory](https://github.com/iterative/example-get-started/tree/master/)
of the external Git repo. Instead, the corresponding DVC-file
[train.dvc](https://github.com/iterative/example-get-started/blob/master/train.dvc)
is found, which specifies `model.pkl` in its outputs (`outs`). DVC then
[pulls](/doc/commands-reference/pull) the file from the default
[remote](/doc/commands-reference/remote) of the external DVC project (found in
its
[config file](https://github.com/iterative/example-get-started/blob/master/.dvc/config)).

A recommended use for downloading binary files from DVC repositories, as done in
this example, is to place a ML model inside a wrapper application that serves as
an [ETL](https://en.wikipedia.org/wiki/Extract,_transform,_load) pipeline or as
an HTTP/RESTful API (web service) that provides predictions upon request. This
can be automated leveraging DVC with
[CI/CD](https://en.wikipedia.org/wiki/CI/CD) tools.

The same example applies to raw or intermediate data files as well, of course,
for cases where we want to download those files and perform some analysis on
them.
