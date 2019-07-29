# import

> **Note!** This command has been repurposed after its original release. The
> previous version is still available as the `dvc import-url` command.

Download or copy file or directory from another DVC repository (on a git server
such as Github) into the <abbr>workspace</abbr>, and track changes in the remote
data source with DVC. Creates a DVC-file.

> See also `dvc get` which corresponds to the first step this command performs
> (just download the data).

## Synopsis

```usage
usage: dvc import [-h] [-q | -v] [-o [OUT]] [--rev [REV]] url path

positional arguments:
  url         URL of Git repository with DVC project to download from.
  path        Path to data within DVC repository.
```

## Description

DVC provides an easy way to reuse datasets, intermediate results, ML models, or
other files and directories tracked in another DVC repository into the present
<abbr>workspace</abbr>. The `dvc import` command downloads such a <abbr>data
artifact</abbr> in a way that it is tracked with DVC, so it can be updated when
the external data source changes.

The `url` argument specifies the external DVC project's Git repository URL (both
HTTP and SSH protocols supported, e.g. `[user@]server:project.git`), while
`path` is used to specify the path to the data to be downloaded within the repo.

> See `dvc import-url` to download and tack data from other supported URLs.

After running this command successfully, the data found in the `url` `path` is
created in the current working directory with its original file name e.g.
`data.txt`. An import stage (DVC-file) is then created (similar to having used
`dvc run` to generate the same output) extending the full file or directory name
of the imported data e.g. `data.txt.dvc`.

DVC supports [DVC-files](/doc/user-guide/dvc-file-format) which refer to data in
an external DVC repository (hosted on a Git server). In such a DVC-file, the
`deps` section specifies the `repo` URL and data `path`, and the `outs` section
contains the corresponding local path in the workspace. It records enough data
from the external file or directory to enable DVC to efficiently check it to
determine whether the local copy is out of date.

To actually [track the data](https://dvc.org/doc/get-started/add-files),
`git add` (and `git commit`) the import stage (DVC-file).

Note that by default, these import stages are locked in their DVC-files (with
fields `locked: true` and `rev_lock`). Use `dvc update` manually on them to
force updating the downloaded data artifact from the external DVC repo.

> If `dvc unlock` is used on locked stages, they will start to be checked by
> `dvc status`, and updated by `dvc repro`.

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
