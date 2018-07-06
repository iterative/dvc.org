# config

Get or set config options. This command reads and overwrites the DVC config file
`.dvc/config`.


```sh
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

### Core
This is the main section with the core options.

#### Log Level
Log level that dvc should use. Possible values: info, debug, warning, error.

##### Example
```sh
dvc config core.loglevel debug
```

#### Remote
Name of the remote that should be used by default.

##### Example
```sh
dvc remote add myremote s3://bucket/path
dvc config core.remote myremote
```

### Remote
Sections that describe particular remotes. See
[`dvc remote`](https://dvc.org/doc/commands-reference/remote) for more info.

### Cache

#### LOCAL
Remote name to use for local cache.

#### S3
Remote name to use for s3 cache.

#### GS
Remote name to use for gs cache.

#### SSH
Remote name to use for ssh cache.

#### HDFS
Remote name to use for hdfs cache.

#### Cache dir
Directory to use for local cache.

#### Cache type
Link type that dvc should use to link data files from cache to your repository.
Possbile values: `reflink`, `symlink`, `hardlink`, `copy` or a combination of
those separated by the comma: `reflink,copy`. By default, dvc will try every
link type in order to choose the most effective link type. Here is a default
priority of link types:

1. reflink
2. hardlink
3. symlink
4. copy

##### Example
```sh
dvc config cache.type reflink,copy
```

##### reflink
This is the best link type that could be. It is as fast as hard/symlinks, but
doesn't carry a risk of cache corruption, since filesystem takes care of
copying the file if you try to edit it in place, thus keeping a linked cache
file intact. Unfortunately reflinks are currently supported on a limited number
of filesystems(Linux: Btrfs, XFS, OCFS2; MacOS: APFS;), but they are coming
to every new filesystem and in future will be supported by the majority of
filesystems in use.

##### hardlink
The most efficient way to link your data to cache if both your repo and your
cache directory are located on the same filesystem/drive. Please note that
data file linked with hardlink should never be edited in place, but instead
deleted and then replaced with a new file, otherwise it might cause cache
corruption and automatic deletion of a cache file by dvc.

##### symlink
The most efficient way to link your data to cache if your repo and your cache
directory are located on different filesystems/drives(i.e. repo is located
on ssd for performace, but cache dir is located on hdd for bigger storage).
Please note that data file linked with symlink should never be edited in
place, but instead deleted and then replaced with a new file, otherwise it
might cause cache corruption and automatic deletion of a cache file by dvc.

##### copy
The most inefficient link type, yet the most widely supported for any
repo/cache fs combinations. Suitable for scenarios with relatively small data
files, where copying them is not a performance/storage concern.

## Examples

```sh
    $ dvc config core.remote myremote
    $ dvc config core.remote

    myremote
    $ dvc config core.remote --unset
```
