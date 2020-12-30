# cache dir

Set/unset the <abbr>cache</abbr> directory location intuitively (compared to
using `dvc config cache`), or shows the current configured value.

## Synopsis

```usage
usage: dvc cache dir [-h] [--global | --system | --project | --local] [-u] [value]

positional arguments:
  value        Path to cache directory. Relative paths are resolved
               relative to the current directory and saved to config
               relative to the config file location. If no path is
               provided, it returns the current cache directory.
```

## Description

Helper to set the `cache.dir` configuration option. (See
[cache directory](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory).)
Unlike doing so with `dvc config cache`, `dvc cache dir` transform paths
(`value`) that are provided relative to the current working directory into paths
**relative to the config file location**. However, if the `value` provided is an
absolute path, then it's preserved as it is.

When reading (`value` is not provided) the value is read from the system,
global, repo and local configuration files by default, and options `--system`,
`--global`, `--project`, and `--local` can be used to tell the command to read
from only that location.

When writing (`value` is provided or `--unset` is used), the new value is
written to the projects configuration file by default (`.dvc/config`), and
options `--system`, `--global` and `--local` can be used to tell the command to
write to that location (you can say `--project` but that is the default).

## Options

- `--global` - use a global config file (e.g. `~/.config/dvc/config`) instead of
  the project's `.dvc/config`.

- `--system` - use a system config file (e.g. `/etc/dvc/config`) instead of
  `.dvc/config`.

- `--project` - use a project's config file (`.dvc/config`).

- `--local` - use a local [config file](/doc/command-reference/config) instead
  of `.dvc/config`. It is located in `.dvc/config.local` and is Git-ignored.
  This is useful when you need to specify private config options in your config
  that you don't want to track and share through Git (credentials, private
  locations, etc).

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

## Example: Getting current cache directory

```dvc
$ dvc cache dir
/home/user/dvc/.dvc/cache
```
