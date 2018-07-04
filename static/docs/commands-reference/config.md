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

## Examples

```sh
    $ dvc config core.remote myremote
    $ dvc config core.remote

    myremote
    $ dvc config core.remote --unset
```
