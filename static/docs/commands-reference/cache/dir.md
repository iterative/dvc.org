# dir

Sets the cache directory location.

## Synopsis

```usage
usage: dvc cache dir [-h] [--global] [--system] [--local] [-u] value

positional arguments:
  value        Path to cache directory. Relative paths are resolved relative
               to the current directory and saved to config relative to the
               config file location.
```

## Description

Sets the `cache.dir` configuration option. Unlike doing so with
`dvc config cache`, this command transform paths (`value`) that are provided
relative to the present working directory into relative to the specified config
file, as they are expected in the config file.

## Options

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local config file instead of `.dvc/config`. It is located
  in `.dvc/config.local` and is Git-ignored. This is useful when you need to
  specify private config options in your config, that you don't want to track
  and share through Git.

- `-u`, `--unset` - remove a specified config option from a config file.

- `-h`, `--help` - prints the usage/help message, and exit.

## Examples: Using relative path

```dvc
$ dvc cache dir ../dir
$ cat .dvc/config
...
[cache]
    dir = ../../dir
...
```

`../dir` has been resolved relative to `.dvc/config` location, resulting in
`../../dir`.

## Examples: Using absolute path

```dvc
$ dvc cache dir /path/to/dir
$ cat .dvc/config
...
[cache]
    dir = /path/to/dir
...
```

Absolute path `/path/to/dir` saved as is.
