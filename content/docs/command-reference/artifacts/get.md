## artifacts get

Download an artifact tracked in a DVC project into the current working
directory.

## Synopsis

```usage
usage: dvc artifacts get [-h] [-q | -v]
                         [--rev [<version>]] [--stage [<stage>]]
                         [-o [<path>]] [-j <number>] [-f]
                         [--config CONFIG]
                         [--remote REMOTE] [--remote-config [REMOTE_CONFIG ...]]
                         url name

positional arguments:
  url                   Location of DVC repository to download from
  name                  Name of artifact in the repository
```

## Description

Provides an easy way to download artifacts tracked in a DVC project.
`dvc artifacts get` supports downloading artifacts both from the
[Studio Model Registry](/doc/studio/user-guide/model-registry) and from DVC
remotes. Unlike `dvc get`, `dvc artifacts get` supports downloading an artifact
by name, rather than by path.

<admon type="tip">

Downloading an artifact from the Studio Model Registry only requires a valid
Studio
[access token](/doc/studio/user-guide/account-management#studio-access-token).
It does not require the client to have DVC remote credentials.

</admon>

The `url` argument specifies the address of the DVC or Git repository containing
the artifact. Both HTTP and SSH protocols are supported (e.g.
`[user@]server:project.git`). `url` can also be a local file system path
(including the current project e.g. `.`).

The `name` argument specifies the name of the artifact to download.

<admon type="info">

`dvc artifacts get` will first try to download artifacts from Studio. If you do
not have a valid Studio token, or the artifact is not tracked in the Studio
Model Registry, DVC will fall back to downloading the artifact from the
project's default DVC remote.

</admon>

## Options

- `--rev <version>` - Version of the artifact to download. The latest version of
  the artifact is used by default when neither `rev` nor `stage` are specified.

- `--stage <stage>` - Stage of the artifact to download. The latest version of
  the artifact is used by default when neither `rev` nor `stage` are specified.

- `-o <path>`, `--out <path>` - specify a `path` to the desired location in the
  workspace to place the downloaded file or directory (instead of using the
  current working directory). Directories specified in the path will be created
  by this command.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from the remote. The default value is `4 * cpu_count()`. Using more jobs may
  speed up the operation. Note that the default value can be set in the source
  repo using the `jobs` config option of `dvc remote modify`.

- `-f`, `--force` - when using `--out` to specify a local target file or
  directory, the operation will fail if those paths already exist. this flag
  will force the operation causing local files/dirs to be overwritten by the
  command.

- `--config <path>` - path to a [config file](/doc/command-reference/config)
  that will be merged with the config in the target repository.

- `--remote <name>` - name of the `dvc remote` to set as a default in the target
  repository. Only applicable when downloading artifacts from a DVC remote.

- `--remote-config [<name>=<value> ...]` - `dvc remote` config options to merge
  with a remote's config (default or one specified by `--remote`) in the target
  repository. Only applicable when downloading artifacts from a DVC remote.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.
