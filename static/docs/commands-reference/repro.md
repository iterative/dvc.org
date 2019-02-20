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

For the following examples, assume a pipeline defined as so:

```dvc
    git init
    dvc init
    echo dep1 > dep1
    dvc run -d dep1 -o out1 -f 1.dvc "echo out1 > out1"
    dvc run -d out1 -o out2 -f 2.dvc "echo out2 > out2"
    dvc run -d out2 -o out3 -f 3.dvc "echo out3 > out3"
    dvc run -d out3 -o out4 -f 4.dvc "echo out4 > out4"
    dvc run -d out4 -o out5 -f 5.dvc "echo out5 > out5"
    dvc run -d out5 -o out6 -f Dvcfile "echo out6 > out6"
```

Reproduce default stage file, using `--force` to force rerunning every stage:

```dvc
    $ dvc repro --force
    
    Warning: assuming default target 'Dvcfile'.
    Stage '1.dvc' didn't change.
    Reproducing '1.dvc'
    Running command:
    	echo out1 > out1
    Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/simple/out1'}' with cache '9f0c0340f365f475723dfd8639783088'.
    Output 'out1' didn't change. Skipping saving.
    Saving 'out1' to cache '.dvc/cache'.
    Saving information to '1.dvc'.
    Stage '2.dvc' didn't change.
    Reproducing '2.dvc'
    Running command:
	echo out2 > out2
    Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/simple/out2'}' with cache '5639d8ce29228e40b5bcb7f763c06f98'.
    Output 'out2' didn't change. Skipping saving.
    Saving 'out2' to cache '.dvc/cache'.
    Saving information to '2.dvc'.
    Stage '3.dvc' didn't change.
    Reproducing '3.dvc'
    Running command:
	echo out3 > out3
    Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/simple/out3'}' with cache 'd24d3640da56f018b0925a67687769c0'.
    Output 'out3' didn't change. Skipping saving.
    Saving 'out3' to cache '.dvc/cache'.
    Saving information to '3.dvc'.
    ...
    Saving information to 'Dvcfile'.
```

Reproduce a single stage:

```dvc
    $ dvc repro 3.dvc --force --single-item

    Stage '3.dvc' didn't change.
    Reproducing '3.dvc'
    Running command:
	echo out3 > out3
    Checking out '{'path': '/Volumes/Extra/dvc/simple/out3', 'scheme': 'local'}' with cache 'd24d3640da56f018b0925a67687769c0'.
    Output 'out3' didn't change. Skipping saving.
    Saving 'out3' to cache '.dvc/cache'.
    Saving information to '3.dvc'.
```

If `--single-item` is not given, stages `1.dvc`, `2.dvc` and `3.dvc` will be rerun.

Inspect what would happen (dry run):

```dvc
    $ dvc repro 3.dvc --force --dry

    Stage '1.dvc' didn't change.
    Reproducing '1.dvc'
    Running command:
	echo out1 > out1
    Stage '2.dvc' didn't change.
    Reproducing '2.dvc'
    Running command:
	echo out2 > out2
    Stage '3.dvc' didn't change.
    Reproducing '3.dvc'
    Running command:
	echo out3 > out3
```
