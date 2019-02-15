# repro

Rerun all commands recorded in the pipeline in the same order, 
or rerun specific commands associated with stages named on the command line.

See `dvc run` for more information on creating pipelines.

DVC file (`target`) can have any name followed by the `.dvc` suffix. If file
name is omitted, `Dvcfile` will be used by default.

```usage
    usage: dvc repro [-h] [-q] [-v] [-f] [-s] [-c CWD] [-m]
                     [targets [targets ...]]

    positional arguments:
        target                DVC file to reproduce.

```


## Description

`dvc repro` provides an interface to rerun the commands in the 
computational graph (a.k.a. pipeline) defined by the stage files 
in the current workspace.  By default, this command searches, 
starting from the `Dvcfile`, the pipeline stages to find any
which have changed.  It then reruns the corresponding commands.  The
pipeline is defined using the `dvc run` command.

There are several ways to limit the stages to rerun:

* Listing stage file(s) as `targets`
* The `--single-item` option ensures that only a single stage is rerun.
* The `--pipeline` option limits execution to the pipeline
 containing the named stage, especially useful if the
 workspace contains multiple pipelines.  
* The `--cwd` option limits execution to the pipeline 
 located in a subdirectory.

There are two ways to ensure rerunning additional stages beyond
a changed stage:

* The `--force` option causes the entire pipeline to be rerun
* The `--ignore-build-cache` causes all stages following a changed stage
 to be rerun.

`dvc repro` does not run `dvc fetch`, `dvc pull` or `dvc checkout` to get source
data files, intermediate or final results.

## Options

* `-q`, `--quiet` do not write anything to standard output.  The command
  run by the stage is free to make output irregardless of this flag.
  Exit with 0 if all stages are up to date or if all stages
  are successfully rerun, otherwise exit with 1. 

* `-v`, `--verbose` displays detailed tracing information from executing the
  `dvc repro` command.

* `-f`, `--force`  Rerun the pipeline, reproducing its results, even
 if no changes were found.  By default this reruns the entire pipeline.
 To rerun a single stage, specify the stage name on the command-line
 along with the `--single-item` option.

* `-s`, `--single-item`  Reproduce only a single data item without 
 recursively checking for changed dependencies.
 Multiple stages are rerun if multiple stage names are listed on the command-line.

* `-c`, `--cwd`  Directory within your project to reproduce from.  If no 
 target names are given, it attempts to use `Dvcfile`, if it exists
 in the named directory, for stages to rerun.
 Instead of using `--cwd` one can alternately specify a target in
 a subdirectory as `path/to/target.dvc`.

* `-m`, `--metrics`  Show metrics after reproduction.  The pipeline must
 have at least one metrics file defined either with the `dvc metrics` command,
 or by the `--metrics-no-cach` option on the `dvc run` command.

* `--dry`  Only print the commands that would be executed without
 actually executing the commands.

* `-i`, `--interactive`  Ask for confirmation before reproducing each stage.
 The stage is rerun if the user types "y".

* `-p`, `--pipeline`  Reproduce the whole pipeline that the specified stage
 file belongs to.  Use `dvc pipeline show target.dvc` to show the entire
 pipeline the named stage belongs to.

* `--ignore-build-cache`  Reproduce all descendants of a changed stage, or 
 the stages following the changed stage, even if their direct dependencies
 did not change.  Like with the same option on `dvc run`, this is a way to
 force certain stages to run if they would not otherwise be rerun.


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

Reproduce a stage located in a subdirectory:

```dvc
    $ dvc repro --force --single-item --cwd data Posts.xml.zip.dvc 
    Stage 'Posts.xml.zip.dvc' didn't change.
    Reproducing 'Posts.xml.zip.dvc'
    Verifying data sources in 'Posts.xml.zip.dvc'
    Output 'Posts.xml.zip' didn't change. Skipping saving.
    Saving information to 'Posts.xml.zip.dvc'.
```

