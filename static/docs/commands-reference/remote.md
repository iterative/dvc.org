# remote

Manage set of tracked repositories.

```sh
    usage: dvc remote [-h] [-q] [-v] {add,remove,modify,list} ... 

    positional arguments:
        add                   Add remote
        remove                Remove remote
        modify                Modify remote
        list                  List remotes

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Examples

```sh
    $ dvc remote add myremote s3://mybucket/myproject
    $ dvc remote list
      myremote
    $ dvc remote modify myremote region us-east-2
    $ dvc remote remove myremote
```
