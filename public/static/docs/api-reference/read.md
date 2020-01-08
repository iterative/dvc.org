# dvc.api.read()

Returns the contents of an artifact as a bytes object or a string.

## Signature

```py
read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Parameters

- `path` - a path to an artifact, relative to repo root

- `repo` - a path or git url of a repo

- `rev` - revision, i.e. a branch, a tag, a SHA. This only works with an url in
  repo

- `remote` - a name of a remote to fetch artifact from/give url to

- `mode` - Mirrors their namesake builtin `open()` has.

- `encoding` - an encoding used to decode contents to a string. Mirrors their
  namesake builtin `open()` has.
