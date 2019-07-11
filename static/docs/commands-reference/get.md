# get

Download or copy file or directory from another DVC repository (on a git server
such as Github) into the local file system.

> Unlike `dvc import`, this command does not track the downloaded data file(s)
> (does not create a DVC-file).

## Synopsis

```usage
usage: dvc get [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url                   DVC repository URL (Git server link).
  path                  Path to data within DVC repository.
```

## Description

In some cases it's convenient to get a <abbr>data artifact</abbr> from another
DVC repository. The `dvc get` command helps the user do so. The `url` argument
should provide the external DVC project's Git repository URL (both HTTP and SSH
protocols supported, e.g. `[user@]server:project.git`), while `path` is used to
specify the path to the data to be downloaded within the repo.

<!-- A file of the same name is then created in the working directory? -->

> This command doesn't require an existing DVC project to run in. It's a
> single-purpose command that can be used out of the box after installing DVC.

> See `dvc get-url` to download data from other supported URLs.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

<!--  ## Example -->
