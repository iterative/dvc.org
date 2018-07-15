# destroy

Remove DVC files from your repository.

It removes `.dvc` and `Dvcfile` files, `.dvc` folder. It means cache will be
removed as well by default, if it's not set to an external location (by
default local cache is located in the `.dvc/cache` directory).

```usage
    usage: dvc destroy [-h] [-q] [-v]

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
```

## Example

```dvc
    $ dvc init
    $ echo foo > foo
    $ dvc add foo
    $ ls -a

    .dvc .git code.py foo foo.dvc

    $ dvc destroy
    $ ls -a

    .git code.py
```
