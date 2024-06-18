# remote remove

Remove a `dvc remote`.

<admon type="info">

This command affects [DVC configuration] files only. It does not physically remove
data files stored remotely. See `dvc gc --cloud` for that.

</admon>

## Synopsis

```usage
usage: dvc remote remove [-h]
                         [--global | --system | --project | --local]
                         [-q | -v]
                         name

positional arguments:
  name           Name of the remote to remove
```

## Description

This command removes a section in the [DVC configuration] file. Alternatively, it
is possible to edit config files manually.

The `name` argument is required.

[dvc configuration]: /doc/user-guide/project-structure/configuration

## Options

- `--system` - modify the system config file (e.g. `/etc/xdg/dvc/config`)
  instead of `.dvc/config`.

- `--global` - modify the global config file (e.g. `~/.config/dvc/config`)
  instead of `.dvc/config`.

- `--project` - modify the project's config file (`.dvc/config`). This is the
  default behavior.

- `--local` - modify the Git-ignored local config file (located in
  `.dvc/config.local`) instead of `.dvc/config`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Add Amazon S3 remote:

```cli
$ dvc remote add myremote s3://mybucket/path
```

Remove it:

```cli
$ dvc remote remove myremote
```
