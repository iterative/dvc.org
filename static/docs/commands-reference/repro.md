# repro

Run again commands recorded in the [stages](/doc/commands-reference/run) of one
or more [pipelines](/doc/get-started/pipeline), in the correct order. The
commands to be run are determined by recursively analyzing target stages and
changes in their dependencies.

## Synopsis

```usage
usage: dvc repro [-h] [-q | -v] [-f] [-s] [-c CWD] [-m] [--dry] [-i]
                 [-p] [-P] [-R] [--ignore-build-cache] [--no-commit]
                 [--downstream] [targets [targets ...]]

positional arguments:
  targets               DVC-file to reproduce. 'Dvcfile' by default.
```

## Description

`dvc repro` provides an interface to run the commands in a computational graph
(a.k.a. pipeline) again, as defined in the stage files (DVC-files) found in the
workspace. (A pipeline is typically defined using the `dvc run` command, while
data input nodes are defined by the `dvc add` command.)

There's a few ways to restrict the stages that will be run again by this
command: by specifying stage file(s) as `targets`, or by using the
`--single-item`, `--cwd`, or other options.

If specific [DVC-files](/doc/user-guide/dvc-file-format) (`targets`) are
omitted, `Dvcfile` will be assumed.

By default, this command recursively searches in pipeline stages, starting from
the `targets`, to determine which ones have changed. Then it executes the
corresponding commands again.

`dvc repro` does not run `dvc fetch`, `dvc pull` or `dvc checkout` to get source
data files, intermediate or final results. It saves all the data files,
intermediate or final results into the DVC cache (unless `--no-commit` option is
specified), and updates stage files with the new checksum information.

## Options

- `-f`, `--force` - reproduce a pipeline, regenerating its results, even if no
  changes were found. By default this runs all of its stages but it can be
  limited with the `targets` argument and `-s`, `-p`, or `-c` options.

- `-s`, `--single-item` - reproduce only a single stage by turning off the
  recursive search for changed dependencies. Multiple stages are run
  (non-recursively) if multiple stage files are given as `targets`.

- `-c`, `--cwd` - directory within your project to reproduce from. If no
  `targets` are given, it attempts to use `Dvcfile` in the specified directory.
  Instead of using `--cwd`, one can alternately specify a target in a
  subdirectory as `path/to/target.dvc`. This option can be useful for example
  with subdirectories containing a separate pipeline that can either be
  reproduced as part of the pipeline in the parent directory, or as an
  independent unit.

- `-R`, `--recursive` - `targets` is expected to contain at least one directory
  path for this option to have effect. Determines the stages to reproduce by
  searching each target directory and its subdirectories for DVC-files to
  inspect.

- `--no-commit` - do not save outputs to cache. Useful when running different
  experiments and you don't want to fill up your cache with temporary files. Use
  `dvc commit` when you are ready to save your results to cache.

- `-m`, `--metrics` - show metrics after reproduction. The target pipeline(s)
  must have at least one metrics file defined either with the `dvc metrics`
  command, or by the `-M` or `-m` options on the `dvc run` command.

- `--dry` - only print the commands that would be executed without actually
  executing the commands.

- `-i`, `--interactive` - ask for confirmation before reproducing each stage.
  The stage is only run if the user types "y".

- `-p`, `--pipeline` - reproduce the entire pipeline(s) that the target stage
  file(s) belong(s) to. Use `dvc pipeline show <target>.dvc` to show the parent
  pipeline of a target stage.

- `-P`, `--all-pipelines` - reproduce all pipelines, for all the stage files
  present in `DVC` repository.

- `--ignore-build-cache` - in cases like `... -> A (changed) -> B -> C` it will
  reproduce `A` first and then `B` even if `B` was previously executed with the
  same inputs from `A` (cached). It might be useful when we have a common
  dependency among all stages and want to specify it once (for the stage `A`
  here). For example, if we know that all stages - `A` and below - depend on
  `requirements.txt`, we can specify it only once in `A` and omit in `B` and
  `C`. To be precise - it reproduces all descendants of a changed stage, or the
  stages following the changed stage, even if their direct dependencies did not
  change. Like with the same option on `dvc run`, this is a way to force stages
  without changes to run again. This can also be useful for pipelines containing
  stages that produce nondeterministic (semi-random) outputs. For
  nondeterministic stages the outputs can vary on each execution, meaning the
  cache cannot be trusted for such stages.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully run, otherwise exit
  with 1. The command run by the stage is free to make output irregardless of
  this flag.

- `-v`, `--verbose` - displays detailed tracing information.

- `--downstream` - only run again the stages after the given `targets` in their
  corresponding pipeline(s), including the target stages themselves.

## Examples

For simplicity, let's build a pipeline defined below (if you want get your hands
on something more real, see this
[mini-tutorial](/doc/get-started/example-pipeline)). It takes this `text.txt`
file:

```
dvc
1231
is
3
the
best
```

And runs a few simple transformations to filter and count numbers:

```dvc
$ dvc run -f filter.dvc -d text.txt -o numbers.txt \
           "cat text.txt | egrep '[0-9]+' > numbers.txt"

$ dvc run -f Dvcfile -d numbers.txt -d process.py -M count.txt \
           "python process.py numbers.txt > count.txt"
```

> Note that using `-f Dvcfile` with `dvc run` above is optional, the stage file
> name would otherwise default to `count.txt.dvc`. We use `Dvcfile` in this
> example because that's the default stage file name `dvc repro` will read
> without having to provide any `targets`.

Where `process.py` is a script which for simplicity just prints the number of
lines:

```python
import sys
num_lines = 0
with open(sys.argv[1], 'r') as f:
    for line in f:
        num_lines += 1
print(num_lines)
```

The result of executing these `dvc run` commands should look like this:

```dvc
$ tree
.
├── Dvcfile        <---- second stage with a default DVC name
├── count.txt      <---- result: "2"
├── filter.dvc     <---- first stage
├── numbers.txt    <---- intermediate result of the first stage
├── process.py     <---- code that runs some transformation
└── text.txt       <---- text file to process
```

You may want to check the contents of `Dvcfile` and `count.txt` for later
reference.

Ok, now, let's run the `dvc repro` command (remember, by default it reproduces
outputs defined in `Dvcfile`, `count.txt` in this case):

```dvc
$ dvc repro
WARNING: assuming default target 'Dvcfile'.
Stage 'filter.dvc' didn't change.
Stage 'Dvcfile' didn't change.
Pipeline is up to date. Nothing to reproduce.
```

It makes sense, since we haven't changed neither of the dependencies this
pipeline has: `text.txt` or `process.py`. Now, let's imagine we want to print a
description and we add this line to the `process.py`:

```python
...
print('Number of lines:')
print(num_lines)
```

If we now run `dvc repro`, that's what we should see:

```dvc
$ dvc repro
WARNING: assuming default target 'Dvcfile'.
Stage 'filter.dvc' didn't change.
Stage 'Dvcfile' changed.
Reproducing 'Dvcfile'
Running command:
  python process.py numbers.txt > count.txt
Output 'count.txt' doesn't use cache. Skipping saving.
Saving information to 'Dvcfile'.
```

You can now check that `Dvcfile` and `count.txt` have been updated with the new
information, new `md5` checksums and a new result respectively.

## Examples: Downstream

The `--downstream` option allows us to only reproduce results from commands
after a specific stage in a pipeline. To demonstrate how it works, lets make a
change in `text.txt` (the input of our first stage, defined in the previous
example):

```
...
The answer to universe is 42
- The Hitchhiker's Guide to the  Galaxy
```

Now, using the `--downstream` option results in the following output:

```dvc
$ dvc repro --downstream
WARNING: assuming default target 'Dvcfile'.
Stage 'Dvcfile' didn't change.
Pipeline is up to date. Nothing to reproduce.
```

The reason being that the `text.txt` is a file which is a dependency in the
target DVC-file (`Dvcfile` by default). Instead, it's dependent on `filter.dvc`,
which happens before the target stage in this pipeline (shown above in the
following figure).

```dvc
$ dvc pipeline show --ascii

    .------------.
    | filter.dvc |
    `------------'
           *
           *
           *
      .---------.
      | Dvcfile |
      `---------'
```
