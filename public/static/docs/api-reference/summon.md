# dvc.api.summon()

Instantiate an object described in the summon file.

## Signature

```py
def summon(
  name,
  repo=None,
  rev=None,
  summon_file="dvcsummon.yaml",
  args=None
)
```

## Parameters

- `name` - object to summon

- `repo` - a path or git url of a repo

- `rev` - revision, i.e. a branch, a tag, a SHA. This only works with an url in
  repo

- `summon_file` - DVC summon configuration file

- `args` - other arguments
