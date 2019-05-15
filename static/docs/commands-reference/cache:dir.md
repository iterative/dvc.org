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

Sets the `cache.dir` configuration option. Unlike doing so with `dvc config
cache`, this command transform paths (`value`) that are provided relative to the
present working directory into relative to the specified config file, as they
are meant to be stored.

## Options

- `--global` - Use global config.

- `--system`- Use system config.

- `--local` - Use local config.

- `-u`, `--unset`- Unset option.

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
