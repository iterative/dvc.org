# config

Get or set repository or global options.

You can query/set/replace/unset options with this command. The name is actually
the section and the key separated by a dot. This command reads and overwrites
the DVC config file `.dvc/config`. If value is not provided and `--unset` is not
specified this command returns current value of the option.


```usage
    usage: dvc config [-h] [-q] [-v] [-u] name [value]

    positional arguments:
        name                  Option name
        value                 Option value

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -u, --unset           Unset option
        --local               Use local config
```

## Options

1. **`core`** - this is the main section with the global options.

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

2. **`remote`** - sections that describe particular remotes. See
[`dvc remote`](https://dvc.org/doc/commands-reference/remote) for more info.

3. **`cache`** - cache settings.

    * `dir` - directory to use for the local cache.

    * `type` - link type that dvc should use to link data files from cache to
    your workspace. Possible values: `reflink`, `symlink`, `hardlink`, `copy`
    or a combination of those separated by the comma: `reflink,copy`. By
    default, dvc will try every link type in order to choose the most effective
    link type. Here is a default priority of link types. From the best and the
    most efficient to the most inefficient. **Note!** Unless your workspace
    supports `reflinks` (if you are on a recent Mac then chances are you are
    using `reflinks`) or you've manually specified `cache.type copy`, you are
    **corrupting** the cache if you are editing the data file in your workspace.
    We are currently [working](https://github.com/iterative/dvc/issues/799) on
    protecting hard/symlinks with read-only permissions to avoid such
    inconvenience.

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

4. **`state`** - state settings.

    * `row_limit` - maximum number of entries in the state database which will
    affect the physical size of the state file itself as well as the performance
    of dvc. The bigger the limit the more checksum history dvc can keep in order
    to avoid sequential checksum recalculations for the files. Default limit is
    set to 10 000 000 rows.
    
    * `row_cleanup_quota` - percentage of the state database that is going to be
    deleted when it hits the `row_limit`. When an entry in the database is used
    (e.g. during the `dvc status`) dvc updates the timestamp on that entry so
    that when it needs to cleanup the database it could sort them by the timestamp
    and remove the oldest ones. Default quota is set to 50(percent).
    
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
