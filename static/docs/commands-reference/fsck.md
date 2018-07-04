# fsck

Data file consistency check.
By default the commands outputs statuses of all corrupted data files (if any).
Use `--all` option to see statuses of all data files.

The command checks:

1. Cache file name which is equal to the file content checksum when DVC created
the file.
2. Checksum from local state file.
3. Checksum regarding DVC files.
4. The actual recomputed checksum. This is a computation heavy command for large
data files. Enabled only by `--physical` option.

Data file is considered to be corrupted if one of the checksums does not match
all others.

```sh
    dvc fsck [-h] [-q] [-v] [-p] [-a] [targets [targets ...]]

    positional arguments:
        targets               Data files to check

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -p, --physical        Compute actual md5
        -a, --all             Show all data files including correct ones
```

## Examples

Check list of corrupted data files:

```sh
    $ dvc fsck --physical

    File data/matrix-test.p:
        Error status:           Checksum missmatch!!!
        Actual checksum:        7c4521365288d69a03fa22ad3d399f32
        Cache file name:        7c4521365288d69a03fa22ad3d399f32
        Local state checksum:   7c4521365288d69a03fa22ad3d399f32
        Local state mtime:      1517048086.0
        Actual mtime:           1517048086.0
        Stage file: eval_auc.txt.dvc
            Checksum:           7c4521365288d69a03fa22ad3d399f32
            Type:               Dependency
        Stage file: matrix-train.p.dvc
            Checksum:           7c4521365288d69a03fa22ad3d399f32
            Type:               Output
            Use cache:          true
```
