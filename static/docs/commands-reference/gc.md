# gc

This command collects the garbage, removing unused cache files based on the
current Git branch.

If a data file was created in a different branch, then it will be removed by
`gc`, unless `--all-branches` option is specified. If a data file has a few
cached versions all of them except the current one will be removed.

Note, this action is not removing data files from the the remote storage. Make
sure thoufg that remote is configured and all the data you need in the future 
is pushed there. See `dvc remote` and `dvc config` for more information. This
command it just cleans a working cache which is usually located on the machine
your are running experiments on and helps to save some space. You can `dvc fetch`
all the needed files back anytime you want.

```usage
    usage: dvc gc [-h] [-q] [-v] [--all-branches]

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        --all-branches        Collect garbage for all branches.
```

## Examples

```dvc
    $ du -sh .dvc/cache/
    7.4G    .dvc/cache/

    $ dvc gc

    '.dvc/cache/27e30965256ed4d3e71c2bf0c4caad2e' was removed
    '.dvc/cache/2e006be822767e8ba5d73ebad49ef082' was removed
    '.dvc/cache/2f412200dc53fb97dcac0353b609d199' was removed
    '.dvc/cache/541025db4da02fcab715ca2c2c8f4c19' was removed
    '.dvc/cache/62f8c2ba93cfe5a6501136078f0336f9' was removed
    '.dvc/cache/7c4521365288d69a03fa22ad3d399f32' was removed
    '.dvc/cache/9ff7365a8256766be8c363fac47fc0d4' was removed
    '.dvc/cache/a86ca87250ed8e54a9e2e8d6d34c252e' was removed
    '.dvc/cache/f64d65d4ccef9ff9d37ea4cf70b18700' was removed

    $ du -sh .dvc/cache/
    3.1G    .dvc/cache/
```
