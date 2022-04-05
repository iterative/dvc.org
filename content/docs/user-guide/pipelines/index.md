
# What is a (DVC) pipeline?

A machine learning pipeline is like an assembly line in a factory. As raw materials input to a factory and processed at each step to achieve a final product, a machine learning pipeline gets the data as an input, processes it in every stage and outputs a model. 

If you are repeating a set of commands to get to the final artifacts (models, results), then you already have a pipeline, albeit in a manual fashion. DVC allows to automate your workflow, be it comprised of a single command or many commands with complex relationships. 


## Stages

A pipeline is a collection of stages. At each stage, we define a (shell) command to run and specify the inputs and outputs for this stage. By defining stage input and outputs, we can find the order to run the stages. If an output of stage `A` is fed as an input to stage `B`, then DVC infers to run `A` before `B`. 

`dvc stage` set of commands are used to create a pipeline by defining its stages. Each stage is required to have a `name`, and a `command`. 

## Directed-Acyclic Graph (DAG)

* Why?
* How?

## Dependencies

* Why?
* How?

## Outputs

* Why?
* How?

## Reproduction

* Why?
* How?

## Experiments with Pipelines

* Why?
* How?


