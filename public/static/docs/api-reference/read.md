# dvc.api.read()

Returns the contents of a <abbr>data artifact</abbr> as a bytes object or as a
string.

## Signature

```py
read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Parameters

- `path` - path to the target artifact relative to the repository's root

- `repo` - path or Git URL of a DVC repository

- `rev` -
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). This only works with `repo`
  URLs.

- `remote` - (optional) name of the [DVC remote](/doc/command-reference/remote)
  to fetch the target artifact from

- `mode` - (optional) mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3.7/library/functions.html#open). Defaults
  to "r" (read).

- `encoding` - (optional) used to decode contents to a string. Mirrors the
  namesake parameter in builtin `open()`.

## Example: loading from content

```py
import pickle
import dvc.api

model = pickle.loads(
  dvc.api.read("model.pkl", repo="https://github.com/my-org/my-repo.git")
)
```
