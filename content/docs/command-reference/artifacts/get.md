## artifacts get

Download an <abbr>artifact</abbr> tracked in a DVC project into the current
working directory.

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

Provides a way to download artifacts tracked in a DVC project. Unlike `dvc get`,
`dvc artifacts get` supports downloading an artifact by name, rather than by
path. Likewise, `dvc artifacts get` supports downloading a registered artifact
version or stage, instead of requiring a specified Git revision.

`dvc artifacts get` also supports downloading artifacts both from the
<abbr>model registry</abbr> and from DVC remotes.

<admon type="tip">

Downloading an artifact from the <abbr>model registry</abbr> only requires a
valid Studio
[access token](/doc/studio/user-guide/account-management#studio-access-token).
It does not require the client to have DVC remote credentials.

</admon>

The `url` argument specifies the address of the DVC or Git repository containing
the artifact. Both HTTP and SSH protocols are supported (e.g.
`[user@]server:project.git`). `url` can also be a local file system path
(including the current project e.g. `.`).

The `name` argument specifies the name of the artifact to download. By default
DVC will search for artifacts declared in a `dvc.yaml` file located at the root
of the DVC repository. Artifacts declared in other `dvc.yaml` files should be
addressed in the form `path/to/dvc.yaml:artifact_name`.

<admon icon="tip">

DVC also accepts <abbr>model registry</abbr>/[GTO](/doc/gto) style names in the
form `path/to:artifact_name` (where `dvc.yaml` is omitted).

</admon>

<admon type="info">

`dvc artifacts get` will first try to download artifacts via the <abbr>model
registry</abbr>. If you do not have a valid Studio token, or the artifact is not
tracked in the model registry, DVC will fall back to downloading the artifact
from the project's default DVC remote.

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

## Example: Download an artifact from a DVC remote

```cli
$ dvc artifacts get https://github.com/iterative/example-get-started.git text-classification --rev=v1.0.0
Downloaded 1 file(s) to 'model.pkl'
```

In this example, we download version `v1.0.0` of the artifact. Since we have no
Studio credentials set in our environment, `dvc artifacts get` will download the
artifact from the default DVC remote defined in the repository.

## Example: Download an artifact using a Studio token

```cli
$ DVC_STUDIO_TOKEN=mytoken dvc artifacts get https://github.com/iterative/example-get-started.git text-classification --stage=prod
Downloaded 1 file(s) to 'model.pkl'
```

In this example, we download stage `prod` of the artifact. Since we have set our
Studio access token in the `DVC_STUDIO_TOKEN` environment variable,
`dvc artifacts get` will download the artifact via the <abbr>model
registry</abbr> rather than from a DVC remote.

## Example: Download an artifact defined in a specific `dvc.yaml` file

```cli
$ dvc artifacts get https://github.com/iterative/lstm_seq2seq.git results/dvc.yaml:best
Downloaded 1 file(s) to 'epoch=0-step=16.ckpt'
```

In this example, we download the latest version of the `best` artifact. In this
case, the artifact is defined in `results/dvc.yaml` so we must include the path
to the `dvc.yaml` file when addressing the artifact. Since we do not specify
`--rev` or `--stage`, `dvc artifacts get` will download the latest version of
the artifact by default.
