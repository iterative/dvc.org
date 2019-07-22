# get

Download or copy file or directory from another DVC repository (on a git server
such as Github) into the local file system.

> Unlike `dvc import`, this command does not track the downloaded data file(s)
> (does not create a DVC-file).

## Synopsis

```usage
usage: dvc get [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url         URL of Git repository with DVC project to download from.
  path        Path to data within DVC repository.
```

## Description

DVC provides an easy way to reuse datasets, intermediate results, ML models, or
other files and directories tracked in another DVC repository into the current
working directory, regardless of whether it's a DVC project. The `dvc get`
command downloads such a <abbr>data artifact</abbr>.

The `url` argument specifies the external DVC project's Git repository URL (both
HTTP and SSH protocols supported, e.g. `[user@]server:project.git`), while
`path` is used to specify the path to the data to be downloaded within the repo.

Note that this command doesn't require an existing DVC project to run in. It's a
single-purpose command that can be used out of the box after installing DVC.

> See `dvc get-url` to download data from other supported URLs.

After running this command successfully, the data found in the `url` `path` is
created in the current working directory, with its original file name.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Note that `dvc get` can be used form anywhere in the file system, as long as DVC
is [installed](/doc/get-started/install). For this example we assume an empty
current working directory.

We can use `dvc get` to download the resulting model file from our
[get started example](https://github.com/iterative/example-get-started), which
is a DVC project external to the directory we're in). The desired file is
located in the `model.pkl` path.

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
reproduces this stage locally by [pulling](/doc/commands-reference/pull) the
file from the default [remote](/doc/commands-reference/remote) of the external
DVC project (found in its
[config file](https://github.com/iterative/example-get-started/blob/master/.dvc/config)).
