# repro

Run again commands recorded in the [stages](/doc/commands-reference/run) of one
or more [pipelines](/doc/get-started/pipeline), in the correct order. The
commands to be run are determined by recursively analyzing target stages and
changes in their dependencies.

## Synopsis

```usage
usage: dvc repro [-h] [-q | -v]
                 [-f] [-s] [-c CWD] [-m] [--dry] [-i] [-p] [-P] [-R]
                 [--ignore-build-cache] [--no-commit] [--downstream]
                 [targets [targets ...]]

positional arguments:
  targets               DVC-file to reproduce (default - 'Dvcfile').
```

## Description

If the [DVC-file](/doc/user-guide/dvc-file-format) (`target`) is omitted,
`Dvcfile` will be assumed.

`dvc repro` provides an interface to run the commands in the computational graph
(a.k.a. pipeline) again, as defined in the corresponding stage files (DVC-files)
found in the current workspace. By default, this command recursively searches
the pipeline stages, starting from the `targets`, to determine which ones have
changed. Then it runs again the corresponding commands. The pipeline is mostly
defined using the `dvc run` command, while data input nodes are defined by the
`dvc add` command.

There's a few ways to restrict the stages to run again: by specifying stage
file(s) as `targets`, or by using the `--single-item`, `--pipeline`, or `--cwd`
options.

`dvc repro` does not run `dvc fetch`, `dvc pull` or `dvc checkout` to get source
data files, intermediate or final results. It saves all the data files,
intermediate or final results into the DVC local cache (unless `--no-commit`
option is specified) and updates DVC-files with the new checksum information.

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

- `--no-commit` - do not save outputs to cache. Useful when running different
  experiments and you don't want to fill up your cache with temporary files. Use
  `dvc commit` when you are ready to save your results to cache.

- `-m`, `--metrics` - show metrics after reproduction. The pipeline must have at
  least one metrics file defined either with the `dvc metrics` command, or by
  the `-M` or `-m` options on the `dvc run` command.

- `--dry` - only print the commands that would be executed without actually
  executing the commands.

- `-i`, `--interactive` - ask for confirmation before reproducing each stage.
  The stage is only run if the user types "y".

- `-p`, `--pipeline` - reproduce the whole pipeline that the specified stage
  file belongs to. Use `dvc pipeline show target.dvc` to show the entire
  pipeline the named stage belongs to.

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

- `--downstream` - run again the commands down the pipeline(s) of the `targets`
  including the one in them.

## Examples

For simplicity, let's build a pipeline defined below (if you want get your hands
on something more real, check this
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

> Note that using `-f Dvcfile` with `dvc run` above isn't necessary as the
> default stage file name is `Dvcfile` when there are no outputs (option `-o`).

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

Ok, now, let's run the `dvc repro` command (remember, by default it reproduces
outputs defined in `Dvcfile`, `count.txt` in this case):

```dvc
$ dvc repro

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

Stage 'filter.dvc' didn't change.
Stage 'Dvcfile' changed.
Reproducing 'Dvcfile'
Running command:
  python process.py numbers.txt > count.txt

Saving information to 'Dvcfile'.
```

You can check now that `Dvcfile` and `count.txt` have been updated with the new
information, new `md5` checksums and a new result respectively.

## Examples: Downstream

There is also an option which allows one to reproduce results from a specific
command in the pipeline. Enabling this option requires adding flag
`--downstream` to command `dvc repro`.

To demonstrate working of this let us make a change in `text.txt`:

```
...
The answer to universe is 42
- The Hitchhiker's Guide to the  Galaxy
```

Now using the `--downstream` option results in the following output:

```dvc
$ dvc repro --downstream
WARNING: assuming default target 'Dvcfile'.
Stage 'Dvcfile' didn't change.
Pipeline is up to date. Nothing to reproduce.
```

The reason being that the `text.txt` is a file which is not directly dependent
on `Dvcfile`. Instead it is dependent on `filter.dvc` which is above our target
file in the pipeline.

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
