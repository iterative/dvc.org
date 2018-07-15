# destroy

Remove DVC files from your repository.

It removes `.dvc` and `Dvcfile` files, `.dvc` directory. It means cache will be
removed as well by default, if it's not set to an external location (by
default local cache is located in the `.dvc/cache` directory).

```usage
    usage: dvc destroy [-h] [-q] [-v] [-f]

    optional arguments:
      -h, --help     show this help message and exit
      -q, --quiet    Be quiet.
      -v, --verbose  Be verbose.
      -f, --force    Force destruction
```

## Example

```dvc
    $ dvc init
    $ echo foo > foo
    $ dvc add foo
    $ ls -a

    .dvc .git code.py foo foo.dvc

    $ dvc destroy
    This will destroy all information about your pipelines as well as cache in .dvc/cache.
    Are you sure you want to continue?
    yes

    $ ls -a

    .git code.py
```
