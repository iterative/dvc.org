# dvc.api.open()

Opens a file <abbr>artifact</abbr> as a
[file object](https://docs.python.org/3.7/glossary.html#term-file-object). May
only be used as
[context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library).

## Signature

```py
open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Parameters

- `path` -
  [path](https://docs.python.org/3.7/glossary.html#term-path-like-object) to the
  target artifact relative to the repository's root

- `repo` - path or Git URL of a DVC repository

- `rev` - (optional)
  [Git revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). This only works with `repo`
  URLs.

- `remote` - (optional) name of the [DVC remote](/doc/command-reference/remote)
  to fetch the target artifact from

- `mode` - (optional) mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3.7/library/functions.html#open). Defaults
  to `"r"` (read).

- `encoding` - (optional) used to decode contents to a string. Mirrors the
  namesake parameter in builtin `open()`.

## Example: open from a DVC remote

> See
> [PEP 343 -- The "with" Statement](https://www.python.org/dev/peps/pep-0343/)

```py
with dvc.api.open("data/raw.csv", remote="my-s3", encoding="utf-8") as f:
    for line in f:
        process(line)
```

## Example: open from a DVC repository

```py
import csv
import dvc.api

with dvc.api.open("dataset/", repo="https://github.com/my-org/my-repo.git") as f:
    reader = csv.reader(f)
    for row in reader:
        # ...
```
