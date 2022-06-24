---
title: DVC Pipelines
---

# What is a (DVC) pipeline?

A machine learning pipeline is like an assembly line in a factory. As raw
materials input to a factory and processed at each step to achieve a final
product, a machine learning pipeline gets the data as an input, processes it in
every stage and outputs a model.

If you are using a sequence of commands to get the final artifacts (models,
results), then you already have a pipeline, albeit manually. DVC allows to
automate your workflow, be it comprised of a single command or many commands
with complex relationships.

## Stages

A DVC pipeline is a collection of connected <abbr>stages</abbr>. At each stage,
we define a shell command to run, and specify its inputs and outputs (if any).
By defining outputs that feed into future inputs, we can determine the stages'
execution order, e.g. if an output of stage X is used as an input in stage Y,
then DVC infers to run X before Y.

There are two ways to define stages. The first and more general method is
editing `dvc.yaml` files, and the other is by using `dvc stage add` helper
command that basically edits this file with supplied arguments.

The following YAML snippet defines a pipeline that runs
`python src/preprocess.py`. The command depends on `data/raw` directory and the
script file, and produces `data/preprocessed` directory.

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

In the following sections, we'll see how to build this file with it many
features.

The alternative to editing `dvc.yaml` is using `dvc stage` set of commands. The
command checks the required elements of stages, and modifies the file in the
format accepted by DVC. For example the above stage is defined with the
following command.

```dvc
$ dvc stage add --name preprocess \
                --deps src/preprocess.py \
                --deps data/raw \
                --outs data/preprocessed \
                python src/preprocess.py
```

<admon type="tip">

Some advanced configuration for the stages may only be available through editing
`dvc.yaml`.

</admon>

<admon type="warn">

DVC works with YAML 1.2 and any version before this may have some minor quirks
that cause subtle bugs.

</admon>

## Directed-Acyclic Graph (DAG)

By adding stages to the pipeline, we define a [graph] where the nodes are stages
and the edges are dependency relationships. The final topology of the graph
should be a [Directed Acyclic Graph]. We know why it's directed, stage A depends
on stage B is different from stage B depends on stage A. But why it should be
_acyclic_?

The pipeline graph shouldn't contain any cycles in the form
`A depends on B depends on C depends on A`. Otherwise, invalidating one of the
stages causes pipeline to run indefinitely. If we invalidate `B` in this
example, it will cause `A` to be run, and as `C` depends on `A`, it will be
invalidated and run too. Finally, as `B` depends on `C`, it will need be
invalidated again. It never ends, it's an infinite loop.

Because of this, DVC checks the stage dependencies for an existence of a cycle
in the graph, and ensures that the graph is a [DAG].

If you want to visualize the graph yourself, you can use `dvc dag` command. It
outputs a text representation of the stages by default.

```dvc
$ dvc dag
```

TODO: output of `dvc dag example`

It can also output the graph in DOT format, that you can supply to `dot` to get
an image.

```dvc
$ dvc dag --dot | dot -Tpng pipeline.png
```

TODO: output of `dvc dag --dot`

ASK: Tell `dvc dag --output` here or skip it?

<admon type="warning">
DVC assumes the command you specify in a stage changes the outputs you specify.
Otherwise, the stage may never be validated and the pipeline will always run.
</admon>

## Dependencies

A stage has three different types of ingredients, command, dependencies, and
outputs. Commands are a required part of `dvc stage add`, and the other two are
optional. Although optional, most of the features that characterize pipelines
are brought forward by dependency definitions.

DVC has more than one type of dependency: The basic one, that we call only
`dependency` is either a file or a directory. A stage that depends on a file or
directory is invalidated when this file or directory's _content_ changes.

<admon type="note">
DVC doesn't only check the timestamp of files, it calculates the hash
of their contents to invalidate the dependent stages. This is one of the
distinctive features over other build tools like  `make`. 
</admon>

The second type of dependency is _hyperparameters._ The hyperparameters are
values in YAML, JSON or Python files that affect stage commands in some way. For
example, if you have a `train.py` script to build deep learning model, it can
read certain parameters from such a file to change training attributes. DVC can
keep track of these dependencies as separate dependencies. If you have multiple
parameters in `params.yaml` file that changes behavior of multiple stages, when
you change a certain parameter, only the dependent stages are invalidated and
rerun. This is more granular than making the whole of `params.yaml` as a file
dependency.

Another kind of dependency is _URL dependency._ Instead of files that reside in
local disk, you can `dvc import-url` a dependency from the web. DVC will check
whether the contents of this URL changed, and invalidate the dependent stage if
so.

### File and Directory Dependencies

File and directory stages are defined using `--deps / -d` option of
`dvc stage add`:

```dvc
$ dvc stage add -n train
                --deps src/train.py \
                --deps data/ \
                python3 src/train.py
```

This means that when one of `deps/train.py` or `data/` changes, the command
associated with the stage has to be run.

Note that we also added the source file as a dependency, so that when we update
the code that trains the model, the stage will be run again.

Files are invalidated when their _content_ changes. Content of files and
directories are tracked by DVC using their MD5 hashes, and are kept in
`dvc.lock` file in the project root. When a pipeline is run, the dependencies'
MD5 hashes are calculated to check whether they have changed and compared with
their hashes in `dvc.lock`.

Normally, you should never need to see the internals of `dvc.lock`. The
following snippet shows what kind of information is kept.

```yaml
schema: '2.0'
stages:
  train:
    cmd: python3 src/train.py
    deps:
      - path: data
        md5: 687552951726b99c2eee15d29b4ccf0e.dir
        size: 17397976
        nfiles: 3
      - path: src
        md5: 51627ab6d865c51a634959dbc4914d24.dir
        size: 14623
        nfiles: 4
```

Note that, the number of files in directories are also kept in `dvc.lock` and
their content are kept in corresponding `.dir` files in DVC cache. This means,
if any file is added to or removed from the directory, the directory dependency
is invalidated.

### Hyperparameter Dependencies

Machine learning models depend various parameters that affect the _production_
process and models. These are called _hyperparameters_ to differ them from the
internal parameters. Learning rate for optimizers, the number of epochs for deep
learning models, or the maximum depth for random forest classifiers are examples
of hyperparameters.

DVC assumes hyperparameters are kept in a text file separate from the rest of
source files. As hyperparameters typically affect multiple stages in the
pipeline, that's a natural assumption.

It's possible to see the hyperparameters file, e.g., `params.yaml` as yet
another text file dependency. In this case, if any parameter changes, all
dependent stages become invalidated. However, this is usually not we want from
hyperparameter dependencies.

If the `train` stage depends on `learning_rate` parameter in `params.yaml`, but
no other parameters, we don't want it to be invalidated by other changes in the
file. Support for hyperparameters allows this kind of granular dependencies.

In order to create an hyperparameter dependency, we define the file and the name
of parameter in `dvc.yaml`:

```yaml

```

Now, when you change the value of `learning_rate` in `params.yaml`, DVC
invalidates the stages that depend on this parameter.

### URL Dependencies

Other than local dependencies, DVC allows to define dependencies described by
their URLs. There are two types of such dependencies.

- Dependencies that are found in other DVC repositories.
- Dependencies that are in arbitrary URLs.

The first kind of these is defined by `dvc import`, and the second kind is via
`dvc import-url`.

When you have files in other DVC projects that you want to employ in the current
one, you add them to the project as follows.

```dvc
$ dvc import git@github.com:iterative/example-get-started \
             data/data.xml
Importing 'data/data.xml (git@github.com:iterative/example-get-started)'
-> 'data.xml'
```

This adds a `data.xml.dvc` file to the project you use, with the respective
links to the other project. When that linked resource is changed, any stage that
depends on the file are invalidated too. This feature allows to define pipelines
spanning more than one DVC project.

The second kind of URL dependencies don't even have this requirement to have the
files in a DVC project. You can add any resource as a dependency with its URL.

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml data.xml
```

This creates a `data.xml.dvc` file in the current folder that's linked to the
given URL.

<admon type="info">
DVC supports many different kinds of URLs, please see `dvc import-url`
reference for the full list.
</admon>

## Running and Reproducing Pipelines

The reason we describe the relationship between stages is to ensure that
pipeline is reproducible. Having a pipeline allows to run the stages when
needed.

After you define a pipeline by editing `dvc.yaml`, you can run it with
`dvc repro`. The name of the command is `reproduce` because running a pipeline
once and reproducing is the same operation in DVC.

The command checks whether the dependencies are invalidated. It only runs a
stage if its dependencies are invalid.

```dvc
$ dvc repro
'data.dvc' didn't change, skipping
Stage 'train' didn't change, skipping
Data and pipelines are up to date.
```

You can force to run a pipeline if its dependencies are valid with `--force`
flag. `dvc repro` runs the stages in topological order. It runs dependencies
before dependents. It doesn't run the stages in parallel if they are separate in
the pipeline DAG.

It shows the command output in the same terminal the command is issued. If you
want to redirect the command output, you can modify the commands in `dvc.yaml`.

DVC runs the `dvc.yaml` in the current directory by default.  
If the directory you are in doesn't contain a `dvc.yaml` file, you can specify
the directory with `--cd` option to `dvc`.

```
$ dvc --cd $HOME/myproject repro
```

You can have multiple pipelines distributed to multiple `dvc.yaml` files in
different directories. You can run all of them at once with `--all-pipelines`
flag. This works even if you're in a child directory in the project.

```dvc
$ dvc repro --all-pipelines
```

If you want to run the pipelines only in the child directories, you can also use
`--recursive` flag. Instead of all pipelines in the project, it runs the
pipeline in the current directory and its descendants.

<admon type="warn">
Note that DVC doesn't try to sort or find dependency relationship of multiple pipelines. 
</admon>

## Outputs

A pipeline is built to create outputs like models, intermediate data, plots, or
metrics. These outputs define the connection between stages and if a stage's
dependencies are newer than its outputs, the stage is considered invalid.

Outputs are produced using stage commands. DVC doesn't make any assumption
regarding how these outputs are produced so you can use any shell command to
produce outputs.

From more general to more specific, the types of outputs are as follows:

- **Files and Directories**: Both data to feed to intermediate stages, and
  models that are produced as final outputs are within this type. DVC tracks the
  changes in these files but doesn't make any assumptions regarding their use.

- **Metrics**: DVC pipelines has special support for metrics files. These files
  contain model comparison metrics that are output after training, validation or
  testing phases of model production. DVC allows to compare produced metrics
  with one another using `dvc metrics diff` and presents the results as a table
  with `dvc metrics show`.

- **Plots**: A more specialized kind of metrics files can be used to create plot
  graphs. In contrast to metrics files, plots are used to present progression of
  more than one training step, like epochs in deep learning projects. DVC
  supports to supply plots files to Vega-Lite and present them on browser with
  `dvc plots show`.

- **Image Plots**: Another kind of output is plots produced by the commands.
  These are standard image files that can be shown on browsers. DVC helps to add
  show these as well with `dvc plots show`.

## Experiments with Pipelines

DVC 2.0 introduced experiment management with `dvc exp` set of commands. We have
a dedicated part in the user's guide for [experiment management]. Here, we
briefly touch the relationship between experiments and pipelines.

[experiment management]: /doc/user-guide/experiment-management

DVC uses pipelines machinery to run the experiments. Experiments have a special
mechanism to modify the hyperparameter dependencies with `--set-param` option.
After running them, experiment outputs are collected in a special Git commit.

If your workflow has more than one pipeline runs by modifying hyperparameters,
you're better served with [experiment][experiment management] features, which
automates most of the boilerplate.
