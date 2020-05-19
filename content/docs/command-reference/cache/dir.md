# cache dir

Set/unset the <abbr>cache</abbr> directory location intuitively (compared to
using `dvc config cache`).

## Synopsis

```usage
usage: dvc cache dir [-h] [--global] [--system] [--local] [-u] value

positional arguments:
  value        Path to cache directory. Relative paths are resolved
               relative to the current directory and saved to config
               relative to the config file location.
```

## Description

Helper to set the `cache.dir` configuration option. (See
[cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).)
Unlike doing so with `dvc config cache`, this command transform paths (`value`)
that are provided relative to the current working directory into paths
**relative to the config file location** of your own project. They are required in the latter form
for the config file.

## Options

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local [config file](/doc/command-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-u`, `--unset` - remove the `cache.dir` config option from the config file.
  Don't provide a `value` argument when employing this flag.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Using relative path

```dvc
$ dvc cache dir ../dir
$ cat .dvc/config
...
[cache]
    dir = ../../dir
...
```

`../dir` has been resolved relative to the `.dvc/` dir, resulting in
`../../dir`.

Thecommand `dvc cache dir` resolves your relative paths so that they work with the location of the config file in your project.

## Example: Using absolute path

```dvc
$ dvc cache dir /path/to/dir
$ cat .dvc/config
...
[cache]
    dir = /path/to/dir
...
```

Absolute path `/path/to/dir` saved as is.

As compared to the `dvc config cache.dir` command, this is a higher level command which is specific to a set of use cases. To know more about usage of `dvc config cache` refer to the [cache](/doc/command-reference/config#cache) section in the `config` docs.