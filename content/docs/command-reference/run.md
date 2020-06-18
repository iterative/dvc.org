# run

Create a pipeline _stage_ in
[`dvc.yaml`](/doc/user-guide/dvc-files-and-directories) from a given command,
and execute the command.

## Synopsis

```usage
usage: dvc run [-h] [-q | -v] [-d <path>] [-n <name>] [-o <path>]
               [-O <path>] [-p [<path>:]<params_list>] [-m <path>]
               [-M <path>] [--plots <path>] [--plots-no-cache <path>]
               [--file <path>] [-w <path>] [--no-exec] [-f]
               [--no-run-cache] [--no-commit]
               [--outs-persist <path>] [--outs-persist-no-cache <path>]
               [--always-changed] [--external]
               command

positional arguments:
  command               Command to execute.
```

## Description

`dvc run` provides an interface to describe
[pipelines](/doc/command-reference/pipeline), stage by stage. _Stages_ represent
individual data processes, including their input and resulting outputs. They are
defined in a
[`dvc.yaml` file](/doc/user-guide/dvc-files-and-directories#dvcyaml-files),
which gets created or updated in the current working directory. This command
[executes](#stage-execution) stage upon creating or updating then, unless the
`--no-exec` option is used.

A stage name is required and can be provided using the `-n` (`--name`) option.
The other available [options](#options) are mainly meant to describe stage
[dependencies and outputs](#dependencies-and-outputs), which are explained
further down).

The remaining terminal input provided to `dvc run` after the command options
(`-`/`--` flags) will become the required `command` argument. For example, a
minimal stage definition is:

```dvc
$ dvc run --name hello_world echo Hi
```

This results in the following stage entry in `dvc.yaml`:

```yaml
stages:
  hello_world:
    cmd: echo Hi
```

Note that in order to update a stage that is already defined in this `dvc.yaml`,
the `-f` (`--force`) option is needed:

```dvc
$ dvc run -n hello_world -f echo "Hello world"
```

For longer `dvc run` usage (which is typical), its recommended to use new line
continuation (`\`) for readability:

```dvc
$ dvc run -n my_stage \
          -d input.dat \
          -o output.dat \
          -M metrics.json \
          ./my_script.sh input.dat
```

### Stage commands

The `command` argument should be the very last part of the full `dvc run ...`
line(s) written to the system terminal. It can be anything your terminal would
accept and run directly, for example a shell built-in, expression, or binary
found in `PATH`. Any flags sent after the command are interpreted by the command
itself, not by `dvc run`. Some illustrative examples:

```dvc
$ dvc run -n remove_word -d words.txt sed 's/word//' words.txt
$ dvc run -n my_sh-stage -d my_script.sh ./my_script.sh
$ dvc run -n my_py-stage -d my_script.py python my_script.py
$ dvc run -n my_py-maxsize python -c 'import sys; print(sys.maxsize)'
```

> Note how files needed for the command, including any scripts being run, are
> marked as [dependencies](#dependencies-and-outputs) with `-d`.

Wrap the command with double quotes `"` if there are special characters in it
like `|` (pipe) or `<`, `>` (redirection), otherwise they would apply to
`dvc run` as a whole. For example:

```dvc
$ dvc run -n my_stage "./my_script.sh > /dev/null 2>&1"
```

Use single quotes `'` instead if there are environment variables in it that
should be evaluated dynamically, for example:

```dvc
$ dvc run -n my_stage './my_script.sh $MYENVVAR'
```

⚠️Note that while DVC is platform-agnostic, the commands defined in your
[pipeline](/doc/command-reference/pipeline) stages may only work on specific
operating systems and require certain software packages to be installed on the
machine where they are executed. (This affects `dvc repro`.)

<details>

### 💡 Avoiding unexpected behavior

We don't want to tell anyone how to write their code or what programs to use!
However, please be aware that in order to prevent unexpected results when DVC
reproduce pipeline stages, the underlying implementation should ideally follow
these rules:

- Read/write exclusively from/to the specified <abbr>dependencies</abbr> and
  <abbr>outputs</abbr> (including parameters files, metrics, and plots).

- Completely rewrite outputs (i.e. do not append or edit).

  ⚠️ Note that DVC removes cached outputs before running the stages that produce
  them (including at `dvc repro`).

- Stop reading and writing files when the `command` exits.

Also, if your pipeline reproducibility goals include consistent output data, its
code should be
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) (produce
the same output for any given input). For this, avoid code that brings
[entropy](https://en.wikipedia.org/wiki/Software_entropy) into your data
pipeline (e.g. random numbers, time functions, hardware dependencies, etc.)

</details>

### Stage execution

`dvc run` executes the given `command` in order to check its validity and so the
defined outputs are written, unless the same `dvc run` has already happened in
this <abbr>workspace</abbr>. Put in other words, if an identical stage already
exists in [`dvc.yaml`](/doc/user-guide/dvc-files-and-directories#dvcyaml-files),
and its outputs correspond to the <abbr>cached</abbr> files (hash values are
compared), then `dvc run` does not execute the `command`.

Note that `dvc repro` provides an interface to check the
[status](/doc/command-reference/status), and reproduce pipelines created with
`dvc repro` by executing (again) the necessary stages. This concept is similar
to the one of [Make](https://www.gnu.org/software/make/) in software build
automation, but DVC captures data and caches relevant <abbr>data
artifacts</abbr> along the way.

> See [this tutorial](/doc/tutorials/pipelines) to learn more and try creating a
> pipeline.

## Dependencies and outputs

By specifying lists of <abbr>dependencies</abbr> (`-d` option) and/or
<abbr>outputs</abbr> (`-o` and `-O` options) for each stage, we can outline a
_dependency graph_ ([DAG](https://en.wikipedia.org/wiki/Directed_acyclic_graph))
that connects them, i.e. the output of a stage becomes the input of another, and
so on. This graph can be restored by DVC later to modify or
[reproduce](/doc/command-reference/repro) the full
[pipeline](/doc/command-reference/pipeline).

Let's see an illustrative pipeline with 3 stages, for example:

```dvc
$ dvc run -n printer -d write.sh -o pages/raw ./write.sh
$ dvc run -n signer -d sign.sh -d pages/raw -o pages/sgn ./sign.sh
$ dvc run -n scanner -d read.sh -d pages/sgn -o signed.pdf ./read.sh
```

<details>

### Expand to see how this pipeline looks

The resulting `dvc.yaml` structure looks like this:

```yaml
stages:
  printer:
    cmd: ./write.sh
    deps:
      - write.sh
    outs:
      - pages/raw
  signer:
    cmd: ./sign.sh
    deps:
      - pages/raw
      - sign.sh
    outs:
      - pages/sgn
  scanner:
    cmd: ./read.sh
    deps:
      - pages/sgn
      - read.sh
    outs:
      - signed.pdf
```

To visualize how these stages are connected into a pipeline (given their outputs
and dependencies), we can use `dvc dag`:

```dvc
$ dvc dag
+---------+
| printer |
+---------+
      *
      *
      *
+--------+
| signer |
+--------+
      *
      *
      *
+---------+
| scanner |
+---------+
```

</details>

Note that `dvc run` checks the dependency graph integrity before creating a new
stage. For example: two stage cannot explicitly specify the same output, there
should be no cycles, etc.

Also note that outputs are deleted from the <abbr>workspace</abbr> by `dvc run`
before executing the command, so the program or script should be able to
recreate any directories marked as outputs.

### For experiment management

A special type of key/value dependencies,
[parameters](/doc/command-reference/params) (`-p` option), is supported.
Multiple parameter dependencies can be specified from one or more YAML or JSON
parameters files (`params.yaml` by default). This allows controlling
experimental hyperparameters easily.

Special types of output files, [metrics](/doc/command-reference/metrics) (`-m`
and `-M` options) and [plots](/doc/command-reference/plots), are also supported.
Metrics and plots files have specific formats (JSON, YAML, CSV, or TSV) and
allow for managing data science experiments by different display and comparison
alternatives.

## Options

- `-n <stage>`, `--name <stage>` (required) - specify a name for the stage
  generated by this command (e.g. `-n train`). Stage names can only contain
  letters, numbers, `-` and `_`.

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

  > Note that staged without dependencies are considered always changed, so
  > `dvc repro` always executes them.

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

- `-p [<path>:]<params_list>`, `--params [<path>:]<params_list>` - specify a set
  of [parameter dependencies](/doc/command-reference/params) the stage depends
  on, from a parameters file. This is done by sending a coma separated list as
  argument, e.g. `-p learning_rate,epochs`. The default parameters file name is
  `params.yaml`, but this can be redefined with a prefix in the argument sent to
  this option, e.g. `-p parse_params.yaml:threshold`. See `dvc params` to learn
  more about parameters.

- `-m <path>`, `--metrics <path>` - specify a metrics file produces by this
  stage. This option behaves like `-o` but registers the file in a `metrics`
  field inside the `dvc.yaml` stage. Metrics are usually small, human readable
  files (JSON or YAML) with scalar numbers or other simple information that
  describes a model (or any other data artifact). See `dvc metrics` to learn
  more about _metrics_.

- `-M <path>`, `--metrics-no-cache <path>` - the same as `-m` except that DVC
  does not track the metrics file. This means that the file is not cached, so
  it's up to the user to save and version control it. This is typically
  desirable with _metrics_ because they are small enough to be tracked with Git
  directly. See also the difference between `-o` and `-O`.

- `--plots <path>` - specify a plot metrics file produces by this stage. This
  option behaves like `-o` but registers the file in a `plots` field inside the
  `dvc.yaml` stage. Plot metrics are data series stored in tabular (CSV or TSV)
  or hierarchical (JSON or YAML) files, with complex information that describes
  a model (or any other data artifact). See `dvc plots` to learn more about
  plots.

- `--plots-no-cache <path>` - the same as `--plots` except that DVC does not
  track the plots metrics file. This means that the file is not cached, so it's
  up to the user to save and version control it. See also the difference between
  `-o` and `-O`.

- `--external` - allow outputs that are outside of the DVC repository. See
  [Managing External Data](/doc/user-guide/managing-external-data).

- `--file <path>` - specify name of the YAML file this command will generate or
  update instead of the default `dvc.yaml`.

- `-w <path>`, `--wdir <path>` - specifies a working directory for the `command`
  to run in (uses the `wdir` field in `dvc.yaml`). Dependency and output files
  (including metrics and plots) should be specified relative to this directory.
  It's used by `dvc repro` to change the working directory before executing the
  `command`.

- `--no-exec` - create a stage file, but do not execute the `command` defined in
  it, nor cache dependencies or outputs (like with `--no-commit`, explained
  below). DVC will also add your outputs to `.gitignore`, same as it would do
  without `--no-exec`. Use `dvc commit` to force committing existing output file
  versions to cache.

  This is useful if, for example, you need to build a pipeline quickly first,
  and run it all at once later.

- `-f`, `--force` - overwrite an existing `dvc.yaml` file (or the file name
  determined by the logic described in the `--file` option) without asking for
  confirmation.

- `--no-run-cache` - forcefully execute the `command` again, even if the same
  `dvc run` command has already been run in this workspace. Useful if the
  command's code is non-deterministic (meaning it produces different outputs
  from the same list of inputs).

- `--no-commit` - do not save outputs to cache. A stage created and an entry is
  added to `.dvc/state`, while nothing is added to the cache. In the stage file,
  the file hash values will be empty; They will be populated the next time this
  stage is actually executed, or `dvc commit` can be used to force committing
  existing output file versions to cache.

  This is useful to avoid caching unnecessary data repeatedly when running
  multiple experiments.

- `--always-changed` - always consider this stage as changed (uses the
  `always_changed` field in `dvc.yaml`). As a result `dvc status` will report it
  as `always changed` and `dvc repro` will always execute it.

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

Execute a Python script as a DVC [pipeline](/doc/command-reference/pipeline)
stage. The stage file name is not specified, so a `model.p.dvc` file is created
by default based on the registered output (`-o):

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

## Example: Using granular hyperparameter dependencies

To use specific values inside a parameters file as dependencies, create a simple
YAML file named `params.yaml` (default params file name, see `dvc params` to
learn more):

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

Define a stage with both regular and parameter dependencies:

```dvc
$ dvc run -d matrix-train.p -d train_model.py -o model.p \
          -p seed,train.lr,train.epochs
          python train_model.py matrix-train.p model.p
```

Note that DVC doesn't pass the parameter values to the command being run. The
program (`train_model.py` in this case) will have to open and parse
`params.yaml` by itself and use the params specified above
(`seed,train.lr,train.epochs`). DVC will keep an eye on these param values (as
well as on the regular dependency files) and know that the stage should be
reproduced if/when they change. See `dvc params` for more details.

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
