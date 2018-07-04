# repro

Reproduce DVC file and all stages the file depends on (recursively).

Default file name is `Dvcfile`. However, DVC files can have any name followed by
the `.dvc` suffix.

```sh
    usage: dvc repro [-h] [-q] [-v] [-f] [-s] [targets [targets ...]]

    positional arguments:
        target                DVC file to reproduce.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -f, --force           Reproduce even if dependencies were not changed.
        -s, --single-item     Reproduce only single data item without recursive
                              dependencies check.
```

## Examples

Reproduce default stage file:

```sh
    $ dvc repro

    Verifying data sources in 'data/Posts.xml.tgz.dvc'
    Reproducing 'Posts.xml.dvc':
            tar zxf data/Posts.xml.tgz -C data/
    Reproducing 'Posts.tsv.dvc':
            python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
    Reproducing 'Posts-train.tsv.dvc':
            python code/split_train_test.py data/Posts.tsv 0.33 20170426 \
                   data/Posts-train.tsv data/Posts-test.tsv
    Reproducing 'matrix-train.p.dvc':
            python code/featurization.py data/Posts-train.tsv \
            data/Posts-test.tsv data/matrix-train.p data/matrix-test.p
    Reproducing 'model.p.dvc':
            python code/train_model.py data/matrix-train.p 20170426 data/model.p
```

Reproduce the part of the pipeline where `Posts.tsv.dvc` is the target DVC file:

```sh
    $ dvc repro Posts.tsv.dvc

    Reproducing 'Posts.xml.dvc':
            tar zxf data/Posts.xml.tgz -C data/
    Reproducing 'Posts.tsv.dvc':
            python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
```
