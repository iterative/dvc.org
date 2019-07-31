# cache dir

Set/unset the cache directory location intuitively (compared to using
`dvc config cache`).

## Synopsis

```usage
usage: dvc cache dir [-h] [--global] [--system] [--local] [-u] value

positional arguments:
  value        Path to cache directory. Relative paths are resolved
               relative to the current directory and saved to config
               relative to the config file location.
```

## Description

Helper to set the `cache.dir` configuration option. Unlike doing so with
`dvc config cache`, this command transform paths (`value`) that are provided
relative to the current working directory into paths **relative to the config
file location**. They are required in the latter form for the config file.

## Options

- `--global` - modify a global config file (e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

- `--system` - modify a system config file (e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

- `--local` - modify a local [config file](/doc/commands-reference/config)
  instead of `.dvc/config`. It is located in `.dvc/config.local` and is
  Git-ignored. This is useful when you need to specify private config options in
  your config that you don't want to track and share through Git (credentials,
  private locations, etc).

- `-u`, `--unset` - remove the `cache.dir` config option from the config file.
  Don't provide a `value` when using this flag.

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

`../dir` has been resolved relative to the `.dvc/` dir, resulting in
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

> Avoid using the same remote that you are using for `dvc push`, `dvc pull`,
> `dvc fetch` as external cache for your external outputs, because it may cause
> possible checksum overlaps.

Absolute path `/path/to/dir` saved as is.
