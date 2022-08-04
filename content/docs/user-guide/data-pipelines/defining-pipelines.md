# Defining Pipelines

DVC helps define programmatic workflows so that anyone can reliably
**reproduce** them later. This way you can ensure that steps are followed when
necessary (and only when necessary).

Specifically, pipelines are written as a set of `stages` in
[`dvc.yaml` metafiles](#dvcyaml-metafiles). This _codification_ has the added
benefit of bringing your pipelining process onto standard Git workflows
(GitOps).

## Stages

A pipeline is a collection of data processing stages related to one another.
Stages wrap around an executable shell command and specify its inputs and
outputs (if any).

Stage execution order is determined by defining outputs that feed into
subsequent stage inputs, e.g. if an output of stage X is used as an input in
stage Y, then DVC deduces that X should be run before Y. Technically, this is
called a _dependency graph_ (specifically a DAG).

<admon type="info">

Note that the order of execution is entirely based on their DAG, and not on the
order in which stages are found in `dvc.yaml`.

</admon>

[specification]: /doc/user-guide/project-structure/dvcyaml-files#stage-entries

<details>

### Avoiding unexpected behavior

We don't want to tell anyone how to write their code or what programs to use!
However, please be aware that in order to prevent unexpected results when DVC
reproduces pipeline stages, the underlying code should ideally follow these
rules:

- Read/write exclusively from/to the specified <abbr>dependencies</abbr> and
  <abbr>outputs</abbr> (including parameters files, metrics, and plots).

- Completely rewrite outputs. Do not append or edit.

- Stop reading and writing files when the `command` exits.

Also, if your pipeline reproducibility goals include consistent output data, its
code should be
[deterministic](https://en.wikipedia.org/wiki/Deterministic_algorithm) (produce
the same output for any given input): avoid code that increases
[entropy](https://en.wikipedia.org/wiki/Software_entropy) (e.g. random numbers,
time functions, hardware dependencies, etc.).

</details>

## Directed Acyclic Graph (DAG)

DVC represents a pipeline internally as a graph where the nodes are stages and
the edges are _directed_ dependencies (e.g. A before B). In order for DVC to
execute the pipeline reliably, its topology should be _acyclic_ -- because
executing cycles (e.g. A -> B -> C -> A ...) would continue indefinitely. [More
about DAGs].

Use `dvc dag` to visualize (or export) pipeline DAGs.

[more about dags]: https://en.wikipedia.org/wiki/Directed_acyclic_graph

## `dvc.yaml` metafiles

There are two ways to define <abbr>stages</abbr>. The first and recommended
method is by writing `dvc.yaml` files directly (`stages` list). The other one is
via `dvc stage add`, a limited command-line interface to stage setup.

<admon type="tip">

See the full [specification] of `stage` entries.

</admon>

Let's look at a sample `preprocess` stage that runs command
`python src/preprocess.py`. It depends on the corresponding Python script and on
a raw data file (ideally already [tracked with DVC]).

```yaml
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - data/raw
      - src/preprocess.py
    outs:
      - data/preprocessed
```

<admon type="info">

We use [GNU/Linux](https://www.gnu.org/software/software.html) in our examples,
but Windows or other shells can be used too. Note that while DVC is
platform-agnostic, the commands you define may have environment-specific
requirements.

</admon>

You can write the `dvc.yaml` file above directly, or DVC can do it for you with
the following call:

```dvc
$ dvc stage add --name preprocess \
                --deps src/preprocess.py \
                --deps data/raw \
                --outs data/preprocessed \
                python src/preprocess.py
```

<admon type="tip">

One advantage of using `dvc stage add` is that it will verify the validity of
the arguments provided (otherwise they won't be checked until execution). A
disadvantage is that advanced pipelining features such as [templating] are not
always available this way.

</admon>

[tracked with dvc]: /doc/start/data-management
[templating]: /doc/user-guide/project-structure/pipelines-files#templating

DVC writes lock files (`dvc.lock`) to complement `dvc.yaml` operations. Both are
small text files that can be versioned with Git.

<details>

### `dvc.lock` files: click to learn more.

<admon type="info">

You should never need to see the contents `dvc.lock` for regular DVC work.

</admon>

Lock files help DVC fix the state of the pipeline as it was last executed in
order to compare it against the current state of the <abbr>workspace</abbr>. The
following sample shows the kind of details saved.

```yaml
schema: '2.0'
stages:
  preprocess:
    cmd: src/preprocess.py
    deps:
      - path: data/raw
        md5: 687552951726b99c2eee15d29b4ccf0e
        size: 17397976
      - path: src/preprocess.py
        md5: 51627ab6d865c51a634959dbc4914d24
        size: 14623
    outs:
      - path: data/preprocessed
        md5: 21188b73b5661d4730d769f795462485.dir
        size: 154683
        nfiles: 312
```

</details>

## Stage commands

The command(s) defined in the `stages` (`cmd` field) can be anything your system
terminal would accept and run directly, for example a shell built-in, an
expression, or a binary found in `PATH`.

Surround the command with double quotes `"` if it includes special characters
like `|` or `<`, `>`. Use single quotes `'` instead if there are environment
variables in it that should be evaluated dynamically.

The same applies to `dvc` helpers -- otherwise they would apply to the DVC call
itself:

```cli
$ dvc stage add -n first_stage "./a_script.sh > /dev/null 2>&1"
$ dvc exp init './another_script.sh $MYENVVAR'
```

<admon type="warn">

While DVC is platform-agnostic, commands defined in `dvc.yaml` (`cmd` field) may
only work on some operating systems and require certain software packages or
libraries in the environment.

</admon>

Commands are executed sequentially until all are finished or until one of them
fails (see `dvc repro`).

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

Parameters are defined under the `params` set of `dvc.yaml`. Each entry is the
key string to look for the param value in the default params file, `params.yaml.
Sub-list under custom params file names can also be included.

```yaml
stages:
  featurize:
    cmd: ...
    ...
    params:
      - learning_rate  # from params.yaml
      - deep_learning.json:
          - epochs     # from custom deep_learning.json file
```

[random forest classifier]:
  https://medium.com/all-things-ai/in-depth-parameter-tuning-for-random-forest-d67bb7e920d
