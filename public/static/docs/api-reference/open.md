# dvc.api.open()

Opens an artifact as a file, may only be used as context manager

## Signature

```py
open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Parameters

- `path` - a path to an artifact, relative to repo root

- `repo` - a path or git url of a repo

- `rev` - revision, i.e. a branch, a tag, a SHA. This only works with an url in
  repo

- `remote` - a name of a remote to fetch artifact from/give url to

- `encoding` - an encoding used to decode contents to a string
