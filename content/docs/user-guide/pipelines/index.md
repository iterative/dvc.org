---
title: Pipelines Management in DVC
---

# What is a (DVC) pipeline?

A machine learning pipeline is like an assembly line in a factory. As raw
materials input to a factory and processed at each step to achieve a final
product, a machine learning pipeline gets the data as an input, processes it in
every stage and outputs a model.

If you are repeating a set of commands to get to the final artifacts (models,
results), then you already have a pipeline, albeit in a manual fashion. DVC
allows to automate your workflow, be it comprised of a single command or many
commands with complex relationships.

## Stages

A pipeline is a collection of stages. At each stage, we define a (shell) command
to run and specify the inputs and outputs for this stage. By defining stage
input and outputs, we can find the order to run the stages. If an output of
stage `A` is fed as an input to stage `B`, then DVC infers to run `A` before
`B`.

`dvc stage` set of commands are used to create a pipeline by defining its
stages. Each stage requires a `name`, and a `command`. Additionally it describes
a set of dependencies and outputs. When these outputs are missing or the
dependencies are newer than the outputs, the command is run.

There are two equally valid ways to describe stages. The first is using
`dvc stage add` command, and the other is by editing `dvc.yaml`.

For example, to add a stage named `preprocess` depending on `preprocess.py`

```dvc
$ dvc stage add --name preprocess \
                --deps src/preprocess.py \
                --deps data/raw \
                --outs data/preprocessed \
                python src/preprocess.py
```

The other way to define a stage is through editing `dvc.yaml`. You could create
the file with the following content to create the above stage:

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

Essentially the command creates the stage by writing to `dvc.yaml`file. If you
are creating the pipeline for the first time, adding the stages by
`dvc stage add` may be easier. If you're editing the pipeline though, working
with the YAML file might be easier.

<admon type="tip">
Some advanced configuration for the stages may only be available through
editing `dvc.yaml`.
</admon>

<admon type="warning">
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

- Why?
- How?

## Outputs

- Why?
- How?

## Reproduction

- Why?
- How?

## Multiple Pipelines

## Experiments with Pipelines

- Why?
- How?
