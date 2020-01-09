# dvc.api.get_url()

Returns the URL of a <abbr>data artifact</abbr>.

## Signature

```py
get_url(path, repo=None, rev=None, remote=None)
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

## Example

```py
import dvc.api

resource_url = dvc.api.get_url("data/prepared.tsv", repo="https://github.com/my-org/my-repo.git", remote="my-s3")
```
