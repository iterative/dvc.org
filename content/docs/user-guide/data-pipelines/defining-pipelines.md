# Defining Pipelines

DVC pipelines are written as collections of data processing <abbr>stages</abbr>
in `dvc.yaml` files. These represent data workflows that you want to
**reproduce** reliably later. Here's a sample 3-stage structure (in alphabetical
order):

```yaml
stages:
  extract: ... # stage 1 definition
  load: ... # stage 3 definition
  transform: ... # stage 2 definition
```

<admon>

This _codification_ has the added benefit of allowing you to develop pipelines
on standard Git workflows (GitOps).

</admon>

A pipeline is formed by making stages inter-dependent, meaning that the output
of one becomes the input of another, and so on. Technically, this is called a
_dependency graph_ (DAG).

## Directed Acyclic Graph (DAG)

DVC represents a pipeline internally as a _graph_ where the nodes are stages and
the edges are _directed_ dependencies (e.g. A before B). In order for DVC to
execute the pipeline reliably, its topology should be _acyclic_ -- because
executing cycles (e.g. A -> B -> C -> A ...) would continue indefinitely. [More
about DAGs].

<admon type="info">

Stage execution will be determined entirely by the DAG, not by the order in
which stages are found in `dvc.yaml`.

</admon>

Use `dvc dag` to visualize (or export) pipeline DAGs.

[more about dags]: https://en.wikipedia.org/wiki/Directed_acyclic_graph

## Stages

<admon type="tip">

See the full [specification] of stage entries.

[specification]: /doc/user-guide/project-structure/dvcyaml-files#stage-entries

</admon>

Each stage wraps around an executable shell [command](#stage-commands) and
specifies the necessary inputs as well as expected outputs (if any). Let's look
at an example that depends on a script file it runs and on a raw data directory
(ideally [tracked by DVC] already):

```yaml
stages:
  extract:
    cmd: source src/cleanup.sh
    deps:
      - src/cleanup.sh
      - data/raw
    outs:
      - data/clean.csv
```

<admon type="info">

We use [GNU/Linux](https://www.gnu.org/software/software.html) in these
examples, but Windows or other shells can be used too.

</admon>

Besides writing `dvc.yaml` files manually (recommended), you can also create
stages with `dvc stage add` -- a limited command-line interface to setup
pipelines. Let's add another one this way and look at the resulting `dvc.yaml`
file:

```dvc
$ dvc stage add --name transform \
                --deps src/process.py \
                --deps data/clean.csv \
                --outs data/features.dat \
                python src/process.py data/clean.csv
```

```yaml
stages:
  extract:
    ...
    outs:
      - data/clean.csv
  transform:
    cmd: python src/process.py data/clean.csv
    deps:
      - src/preprocess.py
      - data/clean.csv
    outs:
      - data/features.dat
```

<admon type="tip">

One advantage of using `dvc stage add` is that it will verify the validity of
the arguments provided (otherwise they won't be checked until execution). A
disadvantage is that some advanced pipelining features such as [templating] are
not available this way.

[templating]: /doc/user-guide/project-structure/pipelines-files#templating

</admon>

Notice that the new `transform` stage [depends](#simple-dependencies) on the
output from stage `extract` (`data/clean.csv`), forming the
[DAG](directed-acyclic-graph-dag).

[tracked by dvc]: /doc/start/data-management

## Stage commands

The command(s) defined in the `stages` (`cmd` field) can be anything your system
terminal would accept and run, for example a shell built-in, an expression, or a
binary found in `PATH`.

Surround the command with double quotes `"` if it includes special characters
like `|` or `<`, `>`. Use single quotes `'` instead if there are environment
variables in it that should be evaluated dynamically.

The same applies to `dvc` helpers -- otherwise they would apply to the DVC call
itself:

```cli
$ dvc stage add -n a_stage "./a_script.sh > /dev/null 2>&1"
$ dvc exp init './another_script.sh $MYENVVAR'
```

<admon type="warn">

While DVC is platform-agnostic, commands defined in `dvc.yaml` (`cmd` field) may
only work on some operating systems and require certain software packages or
libraries in the environment.

</admon>

## Simple dependencies

There's more than one type of stage dependency. A simple dependency is a file or
directory needed for the stage `cmd` to run successfully. When it's contents
have changed, DVC "invalidates" the stage -- it knows that it needs to run
again.

<admon type="info">

DVC [calculates a hash] of file/dir contents to compare vs. previous versions.
This is a distinctive mechanism over traditional build tools like `make`.

[calculates a hash]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

</admon>

File system-level dependencies are defined in the `deps` list of `dvc.yaml`;
Alternatively, using the `--deps` (`-d`) option of `dvc stage add` (see the
previous section's example).

<details>

### External dependencies: click to learn more.

A less common kind of dependency is a _URL dependency_. Instead of files in a
local disk, you can `dvc import` data from another <abbr>DVC project</abbr> (for
example hosted on GitHub). External dependencies establish relationships between
different projects or systems (see `dvc import-url`).
[Get all the details](/doc/user-guide/external-dependencies).

<admon type="info">

DVC will use special methods to check whether the contents of an URL have
changed for the purpose of stage invalidation.

</admon>

</details>

## Parameter dependencies

A more narrow type of dependency is the parameter (`params` field), or
_hyperparameters_ in machine learning. These are simple values used inside your
code to tune data processing, modeling attributes, or that determine stage
execution in any other way. For example, a [random forest classifier] may
require a _maximum depth_ value.

Instead of hard-coding it, your code can read param values from a parameters
file. `dvc params` can track any key/value pair inside structured YAML, JSON,
TOML, or Python files (see also `dvc.api.params_show()`). DVC will keep track of
params as granular dependencies: it will only invalidate the stage if that part
of the file has changed.

Parameters are defined under `params` fields in `dvc.yaml` stages. Each entry is
the key string to look for a param value or group in the default params file,
`params.yaml`. You may also track all the params in any params file by ending
the entry in `:`. Or provide a sub-list to include specific params from there.

```yaml
stages:
  featurize:
    cmd: ...
    ...
    params:
      - learning_rate  # from params.yaml
      - configuration.json:  # all params from here
      - deep_learning.json:
          - epochs     # from custom deep_learning.json file
```

[random forest classifier]:
  https://medium.com/all-things-ai/in-depth-parameter-tuning-for-random-forest-d67bb7e920d
