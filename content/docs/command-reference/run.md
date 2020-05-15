# run

Generate a stage file ([DVC-file](/doc/user-guide/dvc-file-format)) from a given
command and execute the command.

## Synopsis

```usage
usage: dvc run [-h] [-q | -v] [-d <path>] [-o <path>] [-O <path>]
               [-p <params>] [-m <path>] [-M <path>] [-f <filename>]
               [-w <path>] [--no-exec] [--overwrite-dvcfile]
               [--no-run-cache] [--no-commit]
               [--outs-persist <path>] [--outs-persist-no-cache <path>]
               [--always-changed]
               command

positional arguments:
  command               Command to execute.
```

## Description

`dvc run` provides an interface to describe stages: individual commands and the
data input and output that go into creating a result. By specifying lists of
<abbr>dependencies</abbr> (`-d` option),
[parameters](/doc/command-reference/params) (`-p` option), <abbr>outputs</abbr>
(`-o`, `-O` options), and/or [metrics](/doc/command-reference/metrics) (`-m`,
`-M` options), DVC can later connect each stage by building a dependency graph
([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph)). This graph is
used by DVC to restore a full data [pipeline](/doc/command-reference/pipeline).

The remaining terminal input provided to `dvc run` after the command options
(`-`/`--` flags) will become the required `command` argument. Please wrap the
`command` with `"` quotes if there are special characters in it like `|` (pipe)
or `<`, `>` (redirection) that would otherwise apply to `dvc run` itself e.g.
`dvc run -d script.sh "./script.sh > /dev/null 2>&1"`. Use single quotes `'`
instead of `"` to wrap the `command` if there are environment variables in it,
that you want to be evaluated dynamically. E.g.
`dvc run -d script.sh './myscript.sh $MYENVVAR'`

Since `dvc run` provides a way to build a dependency graph using dependencies
and outputs to connect different stages, it checks the graph's integrity before
creating a new stage. For example, for every output there should be only one
stage that explicitly specifies it, there should be no cycles, etc.

Unless the `-f` options is used, the stage file (DVC-file) is generated in the
current working directory and named `<file>.dvc`, where `<file>` is file name of
the first output (`-o`, `-O`, `-m`, or `-M` option). If neither `-f` nor outputs
are specified, the file name defaults to `Dvcfile`.

Note that `dvc run` executes the given `command` in order to check its validity
and to write the defined outputs, unless the same `dvc run` command has already
been run in this workspace (meaning an identical stage file already exists, and
its outputs correspond to the stored file hash values).

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

Keep in mind that if the [pipeline](/doc/command-reference/pipeline)'s
reproducibility goals include consistent output data, its code should be as
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) as
possible (produce the same output for a given input). In this case, avoid code
that brings [entropy](https://en.wikipedia.org/wiki/Software_entropy) into your
data pipeline (e.g. random numbers, time functions, hardware dependency, etc.)

## Options

- `-d <path>`, `--deps <path>` - specify a file or a directory the stage depends
  on. Multiple dependencies can be specified like this:
  `-d data.csv -d process.py`. Usually, each dependency is a file or a directory
  with data, or a code file, or a configuration file. DVC also supports certain
  [external dependencies](/doc/user-guide/external-dependencies).

  DVC builds a dependency graph ([pipeline](/doc/command-reference/pipeline))
  connecting different stages with each other. When you use `dvc repro`, the
  list of dependencies helps DVC analyze whether any dependencies have changed
  and thus executing stages as required to regenerate their output. A special
  case is when no dependencies are specified.

  > Note that a DVC-file without dependencies is considered always changed, so
  > `dvc repro` always executes it.

- `-p [<filename>:]<params_list>`, `--params [<filename>:]<params_list>` -
  specify a set of [parameter dependencies](/doc/command-reference/params) the
  stage depends on, from a parameters file. This is done by sending a coma
  separated list as argument, e.g. `-p learning_rate,epochs`. The default
  parameters file name is `params.yaml`, but this can be redefined with a prefix
  in the argument sent to this option, e.g. `-p parse_params.yaml:threshold`.
  See `dvc params` to learn more about parameters.

- `-o <path>`, `--outs <path>` - specify a file or directory that is the result
  of running the `command`. Multiple outputs can be specified:
  `-o model.pkl -o output.log`. DVC builds a dependency graph (pipeline) to
  connect different stages with each other based on this list of outputs and
  dependencies (see `-d`). DVC tracks all output files and directories and puts
  them into the cache (this is similar to what's happening when you use
  `dvc add`).

- `-O <path>`, `--outs-no-cache <path>` - the same as `-o` except that outputs
  are not tracked by DVC. It means that they are not cached, and it's up to a
  user to save and version control them. This is useful if the outputs are small
  enough to be tracked by Git directly, or if these files are not of future
  interest.

- `--outs-persist <path>` - declare output file or directory that will not be
  removed upon `dvc repro`.

- `--outs-persist-no-cache <path>` - the same as `-outs-persist` except that
  outputs are not tracked by DVC.

- `-m <path>`, `--metrics <path>` - specify a metric file. This option behaves
  like `-o` but also adds `metric: true` in the output record of the resulting
  stage file. Metrics are usually small, human readable files (e.g. JSON or CSV)
  with numeric values or other information that describes a model (or any other
  regular output). See `dvc metrics` to learn more about using metrics.

- `-M <path>`, `--metrics-no-cache <path>` - the same as `-m` except that files
  are not tracked by DVC. It means that they are not cached, and it's up to a
  user to save and version control them. This is typically desirable with metric
  files, because they are small enough to be tracked by Git directly. See also
  the difference between `-o` and `-O`.

- `-f <filename>`, `--file <filename>` - specify a path and/or file name for the
  stage file generated by this command (e.g. `-f stages/stage.dvc`). This
  overrides the default file name: `<file>.dvc`, where `<file>` is the file name
  of the first output or metric.

- `-w <path>`, `--wdir <path>` - specifies a working directory for the `command`
  to run in. `dvc run` expects that dependencies, outputs, metric files are
  specified relative to this directory. This value is saved in the `wdir` field
  of the stage file generated (as a relative path to the location of the
  DVC-file) and is used by `dvc repro` to change the working directory before
  executing the `command`.

- `--no-exec` - create a stage file, but do not execute the `command` defined in
  it, nor track dependencies or outputs with DVC. In the DVC-file contents, the
  file hash values will be empty; They will be populated the next time this
  stage is actually executed. DVC will also add your outputs to `.gitignore`,
  same as it would do without `--no-exec`. This is useful if, for example, you
  need to build a pipeline (dependency graph) first, and then run it all at
  once.

- `--overwrite-dvcfile` - overwrite an existing DVC-file (with file name
  determined by the logic described in the `-f` option) without asking for
  confirmation.

- `--no-run-cache` - forcefully execute the `command` again, even if the same
  `dvc run` command has already been run in this workspace. Useful if the
  command's code is non-deterministic (meaning it produces different outputs
  from the same list of inputs).

- `--no-commit` - do not save outputs to cache. A DVC-file is created and an
  entry is added to `.dvc/state`, while nothing is added to the cache.
  (`dvc status` will report that the file is `not in cache`.) Use `dvc commit`
  when ready to commit outputs with DVC. Useful to avoid caching unnecessary
  data repeatedly when running multiple experiments.

- `--always-changed` - always consider this DVC-file as changed. As a result
  `dvc status` will report it as `always changed` and `dvc repro` will always
  execute it.

  > Note that DVC-files without dependencies are automatically considered
  > "always changed", so this option has no effect in those cases.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

A first example to play with is to try the different command options, to see
what they do. No pre-existing data or source code is needed, as we can use
placeholders and in-line commands directly in `dvc run`:

```dvc
$ mkdir example && cd example
$ git init
$ dvc init
$ mkdir data
$ dvc run -d data -o metric -f metric.dvc \
    "echo '{ \"AUC\": 0.86252 }' >> metric"
Running command:
    echo '{ "AUC": 0.86252 }' >> metric
WARNING: 'data' is empty.

To track the changes with git, run:

	git add .gitignore metric.dvc
```

> See [DVC-File Format](/doc/user-guide/dvc-file-format) for more details on the
> text format above.

Execute a Python script as a DVC [pipeline](/doc/command-reference/pipeline)
stage. The stage file name is not specified, so a `model.p.dvc` DVC-file is
created by default based on the registered output (`-o):

```dvc
# Train ML model on the training dataset. 20180226 is a seed value.
$ dvc run -d matrix-train.p -d train_model.py \
          -o model.p \
          python train_model.py matrix-train.p 20180226 model.p
```

Place the stage file in a subdirectory:

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

## Example: Using specific hyperparameter dependencies

To use granular [parameter dependencies](/doc/command-reference/params), create
a simple YAML parameters file named `params.yaml` (default params file name, see
`dvc params` to learn more):

```yaml
seed: 20180226

train:
  lr: 0.0041
  epochs: 75
  layers: 9

processing:
  threshold: 0.98
  bow_size: 15000
```

Define a pipeline stage with both regular and parameter dependencies:

```dvc
$ dvc run -d matrix-train.p -d train_model.py -o model.p \
          -p seed,train.lr,train.epochs
          python train_model.py matrix-train.p model.p
```

## Example: chaining stages (build a pipeline)

DVC [pipelines](/doc/command-reference/pipeline) are constructed by connecting
one stage outputs to the next's dependencies:

Extract an XML file from an archive to the `data/` folder:

```dvc
$ mkdir data
$ dvc run -d Posts.xml.zip \
          -o data/Posts.xml \
          -f extract.dvc \
          unzip Posts.xml.zip -d data/
```

Execute an R script:

```dvc
$ dvc run -d parsingxml.R -d data/Posts.xml \
          -o data/Posts.csv \
          Rscript parsingxml.R data/Posts.xml data/Posts.csv
```
