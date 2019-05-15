# config

Get or set repository or global DVC config options.

```usage
    usage: dvc config [-h] [-q | -v] [--global] [--system] [--local] [-u] name
                      [value]

    positional arguments:
        name                  Option name
        value                 Option value
```

## Description

You can query/set/replace/unset DVC configuration options with this command. It takes a
config option `name` (a section and a key, separated by a dot) and its `value`.

This command reads and overwrites the DVC config file `.dvc/config`. If
`--local` option is specified, `.dvc/config.local` is modified instead.

If the config option `value` is not provided and `--unset` option is not used,
this command returns the current value of the config option, if found in the
corresponding config file.

## Options

* `-u`, `--unset` - remove a specified config option from a config file.

* `--global` - modify a global config file(e.g. `~/.config/dvc/config`) instead
  of the project's `.dvc/config`.

* `--system` - modify a system config file(e.g. `/etc/dvc.config`) instead of
  `.dvc/config`.

* `--local` - modify a local config file instead of `.dvc/config`. It is located
  in `.dvc/config.local` and is Git-ignored. This is useful when you need to
  specify private config options in your config, that you don't want to track and
  share through Git.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Configuration sections

These are the `name` parameters that can be used with `dvc config`, or the
sections in the project config file (`.dvc/config`).

### remote

These are sections in the config file that describe particular remotes. See `dvc
remote` for more info.

### core

This is the main section with the general config options:

* `core.loglevel` - log level that the `dvc` command should use. Possible values are:
  `info`, `debug`, `warning`, `error`.

* `core.remote` - name of the remote that should be used by default.

### cache

DVC cache is a hidden storage (by default located in the `.dvc/cache` directory)
for files that are under DVC control, and their different versions. (See `dvc
cache` for more details.)

* `cache.dir` - set/unset cache directory location. A correct value must be either an
  absolute path or a path **relative to the config file location**. The default
  value is `cache`, which resolved relative to the default project config
  location results in `.dvc/cache`.
  > See also helper command `dvc cache dir` that properly transform paths
  relative to the present working directory into relative to the project config
  file.

* `cache.protected` - makes files in the workspace read-only. Possible values
  are `true` or `false` (default). Run `dvc checkout` for the change go into
  effect. It affects only files that are under DVC control, providing an
  additional layer of security to your data. Due to the way DVC handles linking
  between the data files in the cache and their counterparts in the working
  directory it's easy to accidentally corrupt the cached version of a file by
  editing or overwriting it. Turning this config option on forces you to run`dvc
  unprotect` before updating a file.

* `cache.type` - link type that dvc should use to link data files from cache to
  your workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or a
  combination of those separated with commas: `reflink,copy`. By default, DVC
  will try `reflink` and `copy` link type in order to choose the most effective
  link type of those two. By default DVC is not trying `symlink` and `hardlink`
  to protect user from accidental cache and repository corruption. Here are pros
  and cons of different link types. Ordered from the best and the most efficient
  to the most inefficient. **Note!** Unless your workspace supports `reflinks`
  (if you are on a recent Mac then chances are you are using `reflinks`) or
  you've manually specified `cache.type copy`, you are **corrupting** the cache
  if you are editing the data file in the workspace. Check the `cache.protected`
  config option above and corresponding `dvc unprotect` command to modify files
  safely.

  1. **`reflink`** - this is the best link type that could be. It is as fast as
     hard/symlinks, but doesn't carry a risk of cache corruption, since
     filesystem takes care of copying the file if you try to edit it in place,
     thus keeping a linked cache file intact. Unfortunately reflinks are
     currently supported on a limited number of filesystems (Linux: Btrfs, XFS,
     OCFS2; MacOS: APFS), but they are coming to every new filesystem and in the
     future will be supported by the majority of filesystems in use.

  2. **`hardlink`** - the most efficient way to link your data to cache if both
     your repo and your cache directory are located on the same
     filesystem/drive. Please note that data file linked with hardlink should
     never be edited in place, but instead deleted and then replaced with a new
     file, otherwise it might cause cache corruption and automatic deletion of a
     cache file by dvc.

  3. **`symlink`** - The most efficient way to link your data to cache if your
     repo and your cache directory are located on different filesystems/drives
     (i.e. repo is located on ssd for performance, but cache dir is located on
     hdd for bigger storage). Please note that data file linked with symlink
     should never be edited in place, but instead deleted and then replaced with
     a new file, otherwise it might cause cache corruption and automatic
     deletion of a cache file by dvc.

  4. **`copy`** - The most inefficient link type, yet the most widely supported
     for any repo/cache FS combination. Suitable for scenarios with relatively
     small data files, where copying them is not a performance/storage concern.

### state

State config options. Check the [DVC Files and
Directories](/doc/user-guide/dvc-files-and-directories) to learn more about the
state file that is used for optimization.

* `state.row_limit` - maximum number of entries in the state database which affects
  the physical size of the state file itself as well as the performance of
  certain DVC operations. The bigger the limit the more checksum history DVC can
  keep in order to avoid sequential checksum recalculations for the files.
  Default limit is set to 10 000 000 rows.

* `state.row_cleanup_quota` - percentage of the state database that is going to be
  deleted when it hits the `state.row_limit`. When an entry in the database is used
  (e.g. during the `dvc status`) dvc updates the timestamp on that entry so that
  when it needs to cleanup the database it could sort them by the timestamp and
  remove the oldest ones. Default quota is set to 50(percent).

## Examples: Core config options

Set the `dvc` log level to `debug`:
```dvc
    $ dvc config core.loglevel debug
```

Add an S3 remote and set it as the project default:
```dvc
    $ dvc remote add myremote s3://bucket/path
    $ dvc config core.remote myremote
```

## Examples: Default remotes

Use remote `myremote` by default:
```dvc
    $ dvc config core.remote myremote
```

Get the default remote:
```dvc
    $ dvc config core.remote
    myremote
```

Clear default remote value:
```dvc
    $ dvc config --unset core.remote
```
which is equivalent to:
```dvc
    $ dvc config core.remote -u
```

## Examples: Cache config options

Set the cache directory to an absolute path:
```dvc
    $ dvc config cache.dir /mnt/cache
    $ dvc config cache.dir
    /mnt/cache
```
or to a relative path (resolved from `./.dvc/`):
```dvc
    $ dvc config cache.dir ../../mycache
    $ dvc pull -q
    $ ls ../mycache
    2f/
```

Set cache type: if `reflink` is not available, use `copy`:
```dvc
    $ dvc config cache.type reflink,copy
```

Protect data files under DVC control by making them read-only:
```dvc
    $ dvc config cache.protected true
```
