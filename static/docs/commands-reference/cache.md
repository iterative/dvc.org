# cache

Modify cache settings.

```usage
    usage: dvc cache [-h] [-q] [-v] {dir} ...

    positional arguments:
        dir          Configure cache directory location.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## dir

Set/unset cache directory location.

```usage
    usage: dvc cache dir [-h] [-q | -v] [--global] [--system] [--local] [-u]
                         [value]

    positional arguments:
        value          Path to cache directory. Relative paths are resolved
                       relative to the current directory and saved to config
                       relative to the config file location.

    optional arguments:
        -h, --help     show this help message and exit
        -q, --quiet    Be quiet.
        -v, --verbose  Be verbose.
        --global       Use global config.
        --system       Use system config.
        --local        Use local config.
        -d, --default  Set as default remote.
```

### Examples

Using relative path:

```dvc
    $ dvc cache dir ../dir
    $ cat .dvc/config
      ...
      [cache]
          dir = ../../dir
      ...
    $ # NOTE: `../dir` has been resolved relative to `.dvc/config` location,
    $ # resulting in `../../dir`.
```

Using absolute path:

```dvc
    $ dvc cache dir /path/to/dir
    $ cat .dvc/config
      ...
      [cache]
          dir = /path/to/dir
      ...
    $ # NOTE: absolute path `/path/to/dir` saved as is.
```
