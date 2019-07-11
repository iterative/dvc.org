# import

Download or copy file or directory from another DVC repository (on a git server
such as Github) into the <abbr>workspace</abbr>, and track changes in the remote
source with DVC. Creates a DVC-file.

> See also `dvc get` which corresponds to the first step this command performs
> (just download the data).

## Synopsis

```usage
usage: dvc import [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url                   DVC repository URL (Git server link).
  path                  Path to data within DVC repository.
```

## Description

In some cases it's convenient to add a <abbr>data artifact</abbr> from another
DVC repository into the workspace, such that it will be automatically updated
when the data source is updated.

DVC supports [DVC-files](/doc/user-guide/dvc-file-format) which refer to data in
an external DVC repository (hosted on a Git server). In such a DVC-file, the
`deps` section specifies the DVC repo and data path, and the `outs` section
contains the corresponding local path in the workspace. It records enough data
from the external file or directory to enable DVC to efficiently check it to
determine whether the local copy is out of date. DVC uses the DVC repo and data
path to download the data to the workspace initially, and to re-download it when
changed.

> See `dvc import-url` to download and tack data from other supported URLs.

The `dvc import` command helps the user create such an external data dependency.
The `url` argument should provide the external DVC project's Git repository URL
(both HTTP and SSH protocols supported, e.g. `[user@]server:project.git`), while
`path` is used to specify the path to the data to be imported within the repo.
An import stage (DVC-file) is then created with the name of the data artifact,
similar to having used `dvc run` to generate the same output as done in the
external DVC project.

## Options

- `-o`, `--out` - specify a location in the workspace to place the imported data
  in, as a path to the desired directory. The default value (when this option
  isn't used) is the current working directory (`.`).

- `--rev` - specific Git revision of the DVC repository to import the data from.
  `HEAD` by default.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

<!--  ## Example -->
