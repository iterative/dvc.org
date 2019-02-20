# repro

Rerun commands recorded in the pipeline in the same order, 
depending on command line options and the current workspace status.

## Synopsis

```usage
    usage: dvc repro [-h] [-q] [-v] [-f] [-s] [-c CWD] [-m]
                     [targets [targets ...]]

    positional arguments:
        target                DVC file to reproduce.

```


## Description

DVC file (`target`) can have any name followed by the `.dvc` suffix. If file
name is omitted, `Dvcfile` will be used by default.

`dvc repro` provides an interface to rerun the commands in the 
computational graph (a.k.a. pipeline) defined by the stage files 
in the current workspace.  By default, this command searches, 
starting from the `Dvcfile`, the pipeline stages to find any
which have changed.  It then reruns the corresponding commands.  The
pipeline is defined using either the `dvc run` command 
or the `dvc add` command.

To find stages to rerun, a recursive search is performed through
the pipeline stage files.

There are several ways to restrict the stages to rerun, by listing
stage file(s) as targets, or using the `--single-item`, `--pipeline`,
or `--cwd` options.

`dvc repro` does not run `dvc fetch`, `dvc pull` or `dvc checkout` to get source
data files, intermediate or final results.

## Options

* `-f`, `--force`  Rerun the pipeline, reproducing its results, even
 if no changes were found.  By default this reruns the entire pipeline.
 To rerun a single stage, specify the stage name on the command-line
 along with the `--single-item` option.

* `-s`, `--single-item`  Reproduce only a single stage by 
 turning off the recursive search for changed dependencies.
 Multiple stages are rerun if multiple stage names are listed on the command-line.

* `-c`, `--cwd`  Directory within your project to reproduce from.  If no 
 target names are given, it attempts to use `Dvcfile` in the 
 specified directory, if it exists, for stages to rerun.
 Instead of using `--cwd` one can alternately specify a target in
 a subdirectory as `path/to/target.dvc`.

* `-m`, `--metrics`  Show metrics after reproduction.  The pipeline must
 have at least one metrics file defined either with the `dvc metrics` command,
 or by the `--metrics-no-cache` (`-M`) option on the `dvc run` command.

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
 force certain stages to run if they would not otherwise be rerun.  This
 can be useful for pipelines containing stages that produce nondeterministic
 (semi-random) outputs.  For nondeterministic stages the outputs can vary on each
 execution, meaning the cache cannot be trusted for such stages.

* `-q`, `--quiet` do not write anything to standard output.  The command
  run by the stage is free to make output irregardless of this flag.
  Exit with 0 if all stages are up to date or if all stages
  are successfully rerun, otherwise exit with 1. 

* `-v`, `--verbose` displays detailed tracing information from executing the
  `dvc repro` command.

* `-h`, `--help` Prints the usage/help message, and exit.

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

