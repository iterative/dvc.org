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
 a subdirectory as `path/to/target.dvc`.  This could be useful for
 subdirectories containing a semi-independent pipeline, that can 
 either be rerun as part of the pipeline in the parent directory, or
 as an independent unit.

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
 (semi-random) outputs, such as the example below containing a stage that
 sorts its output into a random order.  For nondeterministic stages 
 the outputs can vary on each execution, meaning the cache cannot
 be trusted for such stages.

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

    echo "hello\n1231\nworld\n3\n434\nsomething" > dep1.txt
    dvc run -d dep1.txt -o sorted.txt -f sort.dvc "sort <dep1.txt > sorted.txt"
    dvc run -d sorted.txt -o random.txt -f random.dvc "sort --random-sort <sorted.txt >random.txt"
    dvc run -d random.txt -o numbers.txt -f numbers.dvc "egrep '[0-9]+' <random.txt >numbers.txt"
    dvc run -d numbers.txt --metrics-no-cache numcount.txt -f Dvcfile "wc -l numbers.txt sorted.txt >numcount.txt"
```

Reproduce the pipeline (defaulting to `Dvcfile`) after making a change:

```dvc
    $ vi dep1.txt 
    $ dvc repro

    Warning: assuming default target 'Dvcfile'.
    Warning: Dependency 'dep1.txt' of 'sort.dvc' changed.
    Stage 'sort.dvc' changed.
    Reproducing 'sort.dvc'
    Running command:
	sort <dep1.txt > sorted.txt
    Saving 'sorted.txt' to cache '.dvc/cache'.
    Saving information to 'sort.dvc'.
    Warning: Dependency 'sorted.txt' of 'random.dvc' changed.
    Stage 'random.dvc' changed.
    Reproducing 'random.dvc'
    Running command:
	sort --random-sort <sorted.txt >random.txt
    Saving 'random.txt' to cache '.dvc/cache'.
    Saving information to 'random.dvc'.
    Warning: Dependency 'random.txt' of 'numbers.dvc' changed.
    Stage 'numbers.dvc' changed.
    Reproducing 'numbers.dvc'
    Running command:
	egrep '[0-9]+' <random.txt >numbers.txt
    Saving 'numbers.txt' to cache '.dvc/cache'.
    Saving information to 'numbers.dvc'.
    Warning: Dependency 'numbers.txt' of 'Dvcfile' changed.
    Stage 'Dvcfile' changed.
    Reproducing 'Dvcfile'
    Running command:
	wc -l numbers.txt sorted.txt >numcount.txt
    Output 'numcount.txt' doesn't use cache. Skipping saving.
    Saving information to 'Dvcfile'.
```

Reproduce a single stage:

```dvc
    $ dvc repro random.dvc --force --single-item

    Stage 'random.dvc' didn't change.
    Reproducing 'random.dvc'
    Running command:
	sort --random-sort <sorted.txt >random.txt
    Checking out '{'scheme': 'local', 'path': '/Volumes/Extra/dvc/simple2/random.txt'}' with cache '3978209308cd24ed94ab1ad2fdacaa28'.
    Output 'random.txt' didn't change. Skipping saving.
    Saving 'random.txt' to cache '.dvc/cache'.
    Saving information to 'random.dvc'.
```

If `--single-item` is not given, stages `random.dvc` and `sort.dvc` will be rerun.

Inspect what would happen (dry run):

```dvc
    $ dvc repro sorted2.dvc --force --dry

    Stage 'sort.dvc' didn't change.
    Reproducing 'sort.dvc'
    Running command:
	sort <dep1.txt > sorted.txt
    Stage 'random.dvc' didn't change.
    Reproducing 'random.dvc'
    Running command:
	sort --random-sort <sorted.txt >random.txt
    Stage 'sorted2.dvc' didn't change.
    Reproducing 'sorted2.dvc'
    Running command:
	sort <random.txt >sorted2.txt
```
