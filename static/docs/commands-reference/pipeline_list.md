# list

Show connected groups (pipelines) of DVC stages (files) that are independent of
each other.

## Synopsis

```usage
usage: dvc pipeline list [-h] [-q | -v]

List pipelines.
```

## Examples

- List available pipelines:

```dvc
$ dvc pipeline list

Dvcfile
===============
raw.dvc
data.dvc
output.dvc

2 pipeline(s) total
```
