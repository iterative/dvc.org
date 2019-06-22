# list

Show connected groups (pipelines) of [stage](/doc/commands-reference/run) that
are independent of each other.

## Synopsis

```usage
usage: dvc pipeline list [-h] [-q | -v]
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
