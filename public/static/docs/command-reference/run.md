# run

Generate a stage file ([DVC-file](/doc/user-guide/dvc-file-format)) from a given
command and execute the command.

## Synopsis

```usage
usage: dvc run [-h] [-q | -v] [-d DEPS] [-o OUTS] [-O OUTS_NO_CACHE]
               [-m METRICS] [-M METRICS_NO_CACHE] [-f FILE] [-c CWD]
               [-w WDIR] [--no-exec] [-y] [--overwrite-dvcfile]
               [--ignore-build-cache] [--remove-outs] [--no-commit]
               [--always-changed]
               command

positional arguments:
  command               Command to execute.
```

## Description

`dvc run` provides an interface to describe stages: individual commands and the
data input and output that go into creating a result. By specifying a list of
dependencies (`-d` option) and <abbr>outputs</abbr> (`-o`, `-O`, `-m`, or `-M`
options) DVC can later connect each stage by building a dependency graph
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)). This graph is
used by DVC to restore a full data [pipeline](/doc/command-reference/pipeline).

The remaining terminal input provided to `dvc run` after the options (`-`/`--`
arguments) will become the required `command` argument. Please wrap the
`command` with `"` quotes if there are special characters in it like `|` (pipe)
or `<`, `>` (redirection) that would otherwise apply to `dvc run` itself e.g.
`dvc run -d script.sh "./script.sh > /dev/null 2>&1"`. Use single quotes `'`
instead of `"` to wrap the `command` if there are environment variables in it,
that you want to be evaluated dynamically. E.g.
`dvc run -d script.sh './myscript.sh $MYENVVAR'`

Unless the `-f` options is used, by default the DVC-file name generated is
`<file>.dvc`, where `<file>` is file name of the first output (`-o`, `-O`, `-m`,
or `-M` option). If neither `-f`, nor outputs are specified, the stage name
defaults to `Dvcfile`.

Since `dvc run` provides a way to build a dependency graph using dependencies
and outputs to connect different stages, it checks the graph's integrity before
creating a new stage. For example, for every output there should be only one
stage that explicitly specifies it. There should be no cycles, etc.

Note that `dvc repro` provides an interface to check state and reproduce this
graph (pipeline) later. This concept is similar to the one of the
[Make](https://www.gnu.org/software/make/) in software build automation, but DVC
captures data and <abbr>caches</abbr> relevant <abbr>data artifacts</abbr> along
the way. See [this tutorial](/doc/tutorials/pipelines) to learn more and try
creating a pipeline.

### Avoiding unexpected behavior

We don't want to tell you how to write your code! However, please be aware that
in order to prevent unexpected results when DVC executes or reproduces your
commands, they should ideally follow these rules:

- Read/write exclusively from/to the specified <abbr>dependencies</abbr> and
  <abbr>outputs</abbr>.
- Completely rewrite outputs (i.e. do not append or edit).<br/> Note that DVC
  removes cached outputs before running the stages that produce them (including
  at `dvc repro`).
- Stop reading and writing files when the `command` exits.

Keep in mind that if the pipeline's reproducibility goals include consistent
output data, its code should be as
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) as
possible (produce the same output for a given input). In this case, avoid code
that brings [entropy](https://en.wikipedia.org/wiki/Software_entropy) into your
data pipeline (e.g. random numbers, time functions, hardware dependency, etc.)

## Options

- `-d`, `--deps` - specify a file or a directory the stage depends on. Multiple
  dependencies can be specified like this: `-d data.csv -d process.py`. Usually,
  each dependency is a file or a directory with data, or a code file, or a
  configuration file. DVC also supports certain
  [external dependencies](/doc/user-guide/external-dependencies).

  DVC builds a dependency graph connecting different stages with each other.
  When you use `dvc repro`, the list of dependencies helps DVC analyze whether
  any dependencies have changed and thus executing stages as required to
  regenerate their output. A special case is when no dependencies are specified.

  > Note that a DVC-file without dependencies is considered always changed, so
  > `dvc repro` always executes it.

- `-o`, `--outs` - specify a file or directory that is the result of running the
  `command`. Multiple outputs can be specified: `-o model.pkl -o output.log`.
  DVC builds a dependency graph (pipeline) to connect different stages with each
  other based on this list of outputs and dependencies (see `-d`). DVC tracks
  all output files and directories and puts them into the cache (this is similar
  to what's happening when you use `dvc add`).

- `-O`, `--outs-no-cache` - the same as `-o` except that outputs are not tracked
  by DVC. It means that they are not cached, and it's up to a user to save and
  version control them. This is useful if the outputs are small enough to be
  tracked by Git directly, or if these files are not of future interest.

- `-m`, `--metrics` - specify a metric type of output. This option behaves like
  `-o` but also adds `metric: true` in the output record of the resulting stage
  file. Metrics are usually small, human readable files (e.g. JSON or CSV) with
  numeric values or other information that describes a model (or any other
  regular output). See `dvc metrics` to learn more about using metrics.

- `-M`, `--metrics-no-cache` - the same as `-m` except that files are not
  tracked by DVC. It means that they are not cached, and it's up to a user to
  save and version control them. This is typically desirable with metric files,
  because they are small enough to be tracked by Git directly. See also the
  difference between `-o` and `-O`.

- `-f`, `--file` - specify stage file name. By default the DVC-file name
  generated is `<file>.dvc`, where `<file>` is file name of the first output
  (`-o`, `-O`, `-m`, or `-M` option). By default, The stage file is placed in
  the same directory where `dvc run` is used, but `-f` can be used to change
  this location, by including a path in the provided value (e.g.
  `-f stages/stage.dvc`).

- `-c`, `--cwd` (_deprecated_) - Use `-f` and `-w` to change the name and
  location (working directory) of a stage file.

- `-w`, `--wdir` - specifies a working directory for the `command` to run in.
  `dvc run` expects that dependencies, outputs, metric files are specified
  relative to this directory. This value is saved in the `wdir` field of the
  stage file generated (as a relative path to the location of the DVC-file) and
  is used by `dvc repro` to change the working directory before executing the
  `command`.

- `--no-exec` - create a stage file, but do not execute the `command` defined in
  it, nor track dependencies or outputs with DVC. In the DVC-file contents, the
  file hash values will be empty; They will be populated the next time this
  stage is actually executed. This is useful if, for example, you need to build
  a pipeline (dependency graph) first, and then run it all at once.

- `-y`, `--yes` (_deprecated_) - See `--overwrite-dvcfile` below.

- `--overwrite-dvcfile` - overwrite an existing DVC-file (with file name
  determined by the logic described in the `-f` option) without asking for
  confirmation.

- `--ignore-build-cache` - has an effect if an equivalent stage file exists
  (same dependencies, outputs, and `command` to execute), that has been already
  executed, and is up to date. In this case, `dvc run` won't normally execute
  the `command` again. The exception is when the existing stage is considered
  always changed (see `--always-changed` option). This option gives a way to
  forcefully execute the `command` anyway. Useful if the command's code is
  non-deterministic (meaning it produces different outputs from the same list of
  inputs).

- `--remove-outs` (_deprecated_) - remove stage outputs before executing the
  `command`. If `--no-exec` specified outputs are removed anyway. See
  `dvc remove` as well for more details. This is the default behavior.

- `--no-commit` - do not save outputs to cache. A DVC-file is created, and an
  entry is added to `.dvc/state`, while nothing is added to the cache.
  (`dvc status` will report that the file is `not in cache`.) Useful when
  running different experiments and you don't want to fill up your cache with
  temporary files. Use `dvc commit` when ready to commit the results to cache.

- `--always-changed` - always consider this DVC-file as changed. As a result
  `dvc status` will report it as `always changed` and `dvc repro` will always
  execute it.

  > Note that a DVC-file without dependencies is considered always changed, so
  > this option has no effect in that case.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

A trivial example to play with, try different set of options to see how they
work. You don't need any actual data or scripts to play with this example:

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ mkdir data
$ dvc run -d data -o metric -f metric.dvc "echo '1' >> metric"

Running command:
  echo '1' >> metric
Saving information to 'metric.dvc'.

To track the changes with git run:

  git add .gitignore metric.dvc
```

> See [DVC-File Format](/doc/user-guide/dvc-file-format) for more details on the
> text format above.

Execute a Python script as a DVC pipeline stage. The stage file name is not
specified, so a `model.p.dvc` DVC-file is created:

```dvc
# Train ML model on the training dataset. 20180226 is a seed value.
$ dvc run -d matrix-train.p -d train_model.py \
          -o model.p \
          python train_model.py matrix-train.p 20180226 model.p
```

Execute an R script as s DVC pipeline stage:

```dvc
$ dvc run -d parsingxml.R -d Posts.xml \
          -o Posts.csv \
          Rscript parsingxml.R Posts.xml Posts.csv
```

Extract an XML file from an archive to the `data/` folder:

```dvc
$ mkdir data
$ dvc run -d Posts.xml.zip \
          -o data/Posts.xml \
          -f extract.dvc \
          unzip Posts.xml.zip -d data/
```

Place the generated stage file (DVC-file) into a subdirectory:

```dvc
$ dvc run -d test.txt -f stages/test.dvc -o result.out \
  "cat test.txt | wc -l > result.out"

$ tree .

.
├── result.out
├── stages
│   └── test.dvc
└── test.txt
```
