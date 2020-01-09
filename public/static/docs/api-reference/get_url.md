# dvc.api.get_url()

Returns the full URL to the <abbr>data artifact</abbr> specified by its `path`
in a `repo` (<abbr>DVC project</abbr>).

## Signature

```py
get_url(path, repo=None, rev=None, remote=None)
```

## Parameters

- **`path`** - used to specify the location of the target artifact within the
  source project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. Both HTTP and SSH
  protocols are supported for online Git repositories (e.g.
  `[user@]server:project.git`). `repo` can also be a local file system path to
  an "offline" project.

- `rev` - (optional)
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
