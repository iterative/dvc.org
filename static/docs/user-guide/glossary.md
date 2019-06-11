# Glossary

This guide is aimed to familiarize the users with definitions to relevant DVC
concepts and terminologies which are frequently used.

## Workspace directory

Also abbreviated as workspace, it is the root directory of a project where DVC
is initialized by running `dvc init` command. Therefore, this directory will
contain a `.dvc` directory as well.

## Cache directory

DVC cache is a hidden storage which is found at `.dvc/cache`. This storage is
used to manage different versions of files which are under DVC control. For more
information on cache, please refer to the this
[guide](/doc/commands-reference/config#cache).

## Pipeline

In our documentation, it has also been referred to as a computation graph. It is
an ordered set of some executable commands, each of them stored in a Dvcfile. To
get familiar with its usage, please refer to this
[tutorial](/doc/get-started/example-pipeline#example-pipelines).

## DAG

It is an abbreviation for Directed Acyclic Graph. DVC pipeline is also a graph
of this type which stores a chain of commands which can be applied in a
particular order.
