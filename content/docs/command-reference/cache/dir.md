# cache dir

Set/unset the <abbr>cache</abbr> directory location intuitively (compared to
using `dvc config cache`), or shows the current configured value.

## Synopsis

```usage
usage: dvc cache dir [-h] [--global | --system | --project | --local]
                     [-u] [value]

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

If no path `value` is given, it prints the current path of the cache directory.
The value is read from the system, global, project, and local config files (in
that order).

## Options

- `-u`, `--unset` - remove the `cache.dir` config option from a config file.
  Don't provide a `value` argument when employing this flag.

- `--system` - use the system config file (e.g. `/etc/xdg/dvc/config`) instead
  of `.dvc/config`.

- `--global` - use the global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--project` - only use the project's config file (`.dvc/config`) when reading
  the value (this is the default when writing).

- `--local` - use the Git-ignored local config file (located in
  `.dvc/config.local`) instead of `.dvc/config`. This is useful to save a
  private `cache.dir` value that you don't want to track and share with Git.

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
