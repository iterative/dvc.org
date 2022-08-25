# Defining Pipelines

DVC pipelines are written as collections of data processing <abbr>stages</abbr>
in `dvc.yaml` files. These represent data workflows that you want to
**reproduce** reliably later. Here's a sample 3-stage structure:

```yaml
stages:
  prepare: ... # stage 1 definition
  train: ... # stage 2 definition
  evaluate: ... # stage 3 definition
```

<admon>

This _codification_ has the added benefit of allowing you to develop pipelines
on standard Git workflows (GitOps).

</admon>

A pipeline is formed by making [stages](#stages) interdependent, meaning that
the output of one becomes the input of another, and so on. Technically, this is
called a _dependency graph_ (DAG).

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

Each stage wraps around an executable shell [command] and specifies the
necessary inputs as well as expected [outputs](#outputs) (if any). Let's look at
a sample stage that [depends](#simple-dependencies) on a script file it runs as
well as on a raw data directory it processes (ideally [tracked by DVC] already):

```yaml
stages:
  prepare:
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
pipelines. Let's add another stage this way and look at the resulting
`dvc.yaml`:

```dvc
$ dvc stage add --name train \
                --deps src/model.py \
                --deps data/clean.csv \
                --outs data/predict.dat \
                python src/model.py data/clean.csv
```

```yaml
stages:
  prepare:
    ...
    outs:
      - data/clean.csv
  train:
    cmd: python src/model.py data/model.csv
    deps:
      - src/model.py
      - data/clean.csv
    outs:
      - data/predict.dat
```

<admon type="tip">

One advantage of using `dvc stage add` is that it will verify the validity of
the arguments provided (otherwise stage definition won't be checked until
execution). A disadvantage is that some advanced features such as [templating]
are not available this way.

[command]: /doc/user-guide/project-structure/dvcyaml-files#stage-commands
[templating]: /doc/user-guide/project-structure/pipelines-files#templating

</admon>

Notice that the new `train` stage depends on the output from stage `prepare`
(`data/clean.csv`), forming the [DAG](#directed-acyclic-graph-dag).

[tracked by dvc]: /doc/start/data-management

## Simple dependencies

There's more than one type of stage dependency. A simple dependency is a file or
directory used as input by the stage command. When it's contents have changed,
DVC "invalidates" the stage -- it knows that it needs to run again. This in turn
may cause a chain reaction in which subsequent stages of the
<abbr>pipeline</abbr> are also reproduced.

<admon type="info">

DVC [calculates a hash] of file/dir contents to compare vs. previous versions.
This is a distinctive mechanism over traditional build tools like `make`.

[calculates a hash]:
  /doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory

</admon>

File system-level dependencies are defined in the `deps` list of `dvc.yaml`
stages; Alternatively, using the `--deps` (`-d`) option of `dvc stage add` (see
the previous section's example).

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

A more narrow type of dependency is the parameter (`params` list in `dvc.yaml`
stages), or _hyperparameters_ in machine learning. These represent simple values
used inside your code to tune data processing, or that affect stage execution in
any other way. For example, a [random forest classifier] may require a _maximum
depth_ value.

Instead of hard-coding param values, your code can read them from a parameters
file. `dvc params` can track any key/value pair inside structured YAML 1.2,
JSON, TOML 1.0, or Python files (see also `dvc.api.params_show()`). DVC
considers params as granular dependencies: it only invalidates stages when the
corresponding part of the params file has changed.

```yaml
stages:
  train:
    cmd: ...
    deps: ...
    params:
      - learning_rate # from params.yaml
      - deep_learning.json:
          - epochs # from deep_learning.json
      - config.json: # all params in config.json
    outs: ...
```

<admon type="info">

See [more details] about this syntax.

</admon>

[random forest classifier]:
  https://medium.com/all-things-ai/in-depth-parameter-tuning-for-random-forest-d67bb7e920d
[more details]:
  /doc/user-guide/project-structure/dvcyaml-files#parameter-dependencies

## Outputs

Stage outputs are files written by <abbr>pipelines</abbr> such as machine
learning models, intermediate artifacts, as well as data [plots] and performance
[metrics]. These files are <abbr>cached</abbr> by DVC automatically, and tracked
with the help of `dvc.lock` files (or `.dvc` files, see `dvc add`).

Output definitions can connect stages to one another (as explained earlier). So
when they change, DVC may need to reproduce subsequent stages as well (handled
automatically).

The types of outputs are:

- Files and directories: Typically data to feed to intermediate stages, as well
  as the final results of a pipeline (e.g. a dataset or an ML model).

- [Metrics]: DVC supports small text files that usually contain model
  performance metrics from the evaluation, validation, or testing phases of the
  ML lifecycle. DVC allows to compare produced metrics with one another using
  `dvc metrics diff` and presents the results as a table with
  `dvc metrics show`.

- [Plots]: Different kinds of data that can be visually graphed. For example
  contrast ML performance statistics or continuous metrics from multiple
  experiments. `dvc plots show` can generate charts for certain data files or
  render custom image files for you.

[plots]: /doc/user-guide/visualizing-plots
[metrics]: /doc/command-reference/metrics

<admon type="info">

Outputs are produced by [stage commands][command]. DVC does not make any
assumption regarding this process; they should just match the path specified in
`dvc.yaml`.

</admon>
