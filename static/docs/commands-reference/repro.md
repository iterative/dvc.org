# repro

Reproduce a stage that is specified by a `.dvc` file and all stages the file
lists as dependencies (recursively).

See `dvc run` for more information on creating pipelines.

DVC file (`target`) can have any name followed by the `.dvc` suffix. If file
name is omitted, `Dvcfile` will be used by default.

```usage
    usage: dvc repro [-h] [-q] [-v] [-f] [-s] [-c CWD] [-m]
                     [targets [targets ...]]

    positional arguments:
        target                DVC file to reproduce.

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
        -f, --force           Reproduce even if dependencies were not changed.
        -s, --single-item     Reproduce only single data item without recursive
                              dependencies check.
        -c CWD, --cwd CWD     Directory within your project to reproduce from.
        -m, --metrics         Show metrics after reproduction
        --dry                 Only print the commands that would be executed without
                              actually executing.
        -i, --interactive     Ask for confirmation before reproducing each stage.
        -p, --pipeline        Reproduce the whole pipeline that the specified stage
                              file belongs to.
```

`dvc repro` does not run `dvc fetch`, `dvc pull` or `dvc checkout` to get source
data files, intermediate or final results.

## Examples

Reproduce default stage file:

```dvc
    $ dvc repro

    Verifying data sources in 'data/Posts.xml.zip.dvc'
    Stage 'extract.dvc' changed.
    Reproducing 'extract.dvc':
            unzip data/Posts.xml.zip -d data
    Stage 'extract.dvc' changed.
    Reproducing 'prepare.dvc':
            python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
    Stage 'featurize.dvc' changed.
    Reproducing 'featurize.dvc':
            python code/split_train_test.py data/Posts.tsv 0.33 20170426 \
                   data/Posts-train.tsv data/Posts-test.tsv
    Stage 'train.dvc' changed.
    Reproducing 'train.dvc':
            python code/train_model.py data/matrix-train.p 20170426 data/model.p
```

Reproduce the part of the pipeline where `Posts.tsv.dvc` is the target DVC file:

```dvc
    $ dvc repro Posts.tsv.dvc

    Reproducing 'Posts.xml.dvc':
            unzip data/Posts.xml.zip -d data/
    Reproducing 'Posts.tsv.dvc':
            python code/xml_to_tsv.py data/Posts.xml data/Posts.tsv python
```
