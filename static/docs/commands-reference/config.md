# config

Get or set per repository or global options.

You can query/set/replace/unset options with this command. It takes a name - is
a section and a key separated by a dot. This command reads and overwrites the
DVC config file `.dvc/config` (if `--local` option is specified
`.dvc/config.local` is modified instead).

If option value is not provided and `--unset` is not specified this command
returns current value of the option.

```usage
    usage: dvc config [-h] [-q | -v] [--global] [--system] [--local] [-u] name
                      [value]

    positional arguments:
        name                  Option name
        value                 Option value
```

## Options

* `-u`, `--unset` - remove a specified option from a config file.

* `--global` - modify a global config file(e.g. `~/.config/dvc/config`) instead
of a `.dvc/config`.

* `--system` - modify a system config file(e.g. `/etc/dvc.config`) instead of a
`.dvc/config`.

* `--local` - modify a local config file instead of a `.dvc/config`. It is
located in `.dvc/config.local` and is Git-ignored. This is useful when you need
to specify private options in your config, that you don't want to track and
share through Git.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## core

This is the main section with the global options.

* `loglevel` - log level that dvc should use. Possible values are: `info`,
  `debug`, `warning`, `error`.

```dvc
    $ dvc config core.loglevel debug
```

* `remote` - name of the remote that should be used by default.

```dvc
    $ dvc remote add myremote s3://bucket/path
    $ dvc config core.remote myremote
```

## remote

Sections that describe particular remotes. See `dvc remote` for more info.

## cache

DVC cache is a hidden (by default it's located in the `.dvc/cache` directory)
storage. For files that are under DVC control it keeps them and their
different versions.

* `dir` - directory to use for the cache. The value can be an absolute path or a
  path relative to the config file location that it is specified in (see helper
  command `dvc cache dir` that helps to properly transform paths specified
  relative to the current directory into paths relative to the specified config
  file). The default value is `cache`, which, when resolved relative to the
  project config location `.dvc/config` results in `.dvc/cache`.

```dvc
    $ dvc config cache.dir /mnt/cache
```
Or
```dvc
    $ dvc config cache.dir ../../mycache
    $ dvc pull -q
    $ ls ../mycache
    2f/
```


* `protected` - makes files in the workspace read-only. Run `dvc checkout` for
the change go into effect. It affects only files that are under DVC control and
adds an additional layer of security to your data. Due to the way DVC handles
linking between the data files in the cache and their counterparts in the
working directory it's easy to accidentally corrupt the cached version of a
file by editing or overwriting it. Turning this option on forces you to run`dvc
unprotect` before updating a file.

```dvc
    $ dvc config cache.protected true
```

* `type` - link type that dvc should use to link data files from cache to your
  workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy` or a
  combination of those separated by the comma: `reflink,copy`. By default, DVC
  will try `reflink` and `copy` link type in order to choose the most
  effectivelink type of those two. By default DVC is not trying `symlink` and
  `hardlink` to protect user from accidental cache and repository corruption.
  Here are pros and cons of different link types. Ordered from the best and the
  most efficient to the most inefficient. **Note!** Unless your workspace
  supports `reflinks` (if you are on a recent Mac then chances are you are using
  `reflinks`) or you've manually specified `cache.type copy`, you are
  **corrupting** the cache if you are editing the data file in the workspace.
  Check the `protected` mode option above and corresponding `dvc unprotect`
  command to modify files safely.

  1. **`reflink`** - this is the best link type that could be. It is as
    fast as hard/symlinks, but doesn't carry a risk of cache corruption,
    since filesystem takes care of copying the file if you try to edit it in
    place, thus keeping a linked cache file intact. Unfortunately reflinks
    are currently supported on a limited number of filesystems (Linux: Btrfs,
    XFS, OCFS2; MacOS: APFS), but they are coming to every new filesystem
    and in the future will be supported by the majority of filesystems in
    use.

  2. **`hardlink`** - the most efficient way to link your data to cache if
    both your repo and your cache directory are located on the same
    filesystem/drive. Please note that data file linked with hardlink should
    never be edited in place, but instead deleted and then replaced with a
    new file, otherwise it might cause cache corruption and automatic
    deletion of a cache file by dvc.

  3. **`symlink`** - The most efficient way to link your data to cache if
  your repo and your cache directory are located on different
  filesystems/drives (i.e. repo is located on ssd for performace, but cache
  dir is located on hdd for bigger storage). Please note that data file
  linked with symlink should never be edited in place, but instead deleted
  and then replaced with a new file, otherwise it might cause cache
  corruption and automatic deletion of a cache file by dvc.

  4. **`copy`** - The most inefficient link type, yet the most widely
  supported for any repo/cache fs combinations. Suitable for scenarios with
  relatively small data files, where copying them is not a
  performance/storage concern.

## state

State settings. Check the
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories) to learn
more about the state file that is used for optimization.

* `row_limit` - maximum number of entries in the state database which affects
  the physical size of the state file itself as well as the performance of
  certain DVC operations. The bigger the limit the more checksum history DVC can
  keep in order to avoid sequential checksum recalculations for the files.
  Default limit is set to 10 000 000 rows.

* `row_cleanup_quota` - percentage of the state database that is going to be
  deleted when it hits the `row_limit`. When an entry in the database is used
  (e.g. during the `dvc status`) dvc updates the timestamp on that entry so that
  when it needs to cleanup the database it could sort them by the timestamp and
  remove the oldest ones. Default quota is set to 50(percent).

## Examples

1. Use remote `myremote` by default:

```dvc
    $ dvc config core.remote myremote
```

2. Get default remote:

```dvc
    $ dvc config core.remote

    myremote
```

3. Clear default remote value:

```dvc
    $ dvc config core.remote --unset
```

4. Set cache type, if `reflink` is not available use `copy`:

```dvc
    $ dvc config cache.type reflink,copy
```

5. Protect files by making them read-only:

```dvc
    $ dvc config cache.protected true
```
