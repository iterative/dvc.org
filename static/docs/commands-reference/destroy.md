# destroy

Remove DVC from your repository.

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
