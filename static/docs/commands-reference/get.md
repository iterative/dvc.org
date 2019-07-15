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
created in the current working directory with its original file name.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

<!--  ## Example -->
