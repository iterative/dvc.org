# dvc.api.get_url()

Returns an url of an artifact.

## Signature

```py
get_url(path, repo=None, rev=None, remote=None)
```

## Parameters

- `path` - a path to an artifact, relative to repo root

- `repo` - a path or git url of a repo

- `rev` - revision, i.e. a branch, a tag, a SHA. This only works with an url in
  repo

- `remote` - a name of a remote to fetch artifact from/give url to
