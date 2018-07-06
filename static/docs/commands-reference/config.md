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
those separated by the comma: `reflink,copy`.

##### Example
```sh
dvc config cache.type reflink,copy
```

## Examples

```sh
    $ dvc config core.remote myremote
    $ dvc config core.remote

    myremote
    $ dvc config core.remote --unset
```
