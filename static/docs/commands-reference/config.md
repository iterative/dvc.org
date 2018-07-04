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
```

## Examples

Specify an option name to get the option's value from config file:

```sh
    $ dvc config config Global.Cloud

    AWS
```

Overwrite the value::

```sh
    $ dvc config Global.Cloud GCP
    $ git add .dvc/config
    $ git commit -m 'Change cloud to GCP'

    [input_100K a4c985f] Change cloud to GCP
     1 file changed, 1 insertion(+), 1 deletion(-)
```
