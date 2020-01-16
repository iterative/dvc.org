# dvc.api.read()

Returns the contents of a file <abbr>artifact</abbr> as a bytes object or as a
string.

> Wrapper for [`dvc.api.open()`](/doc/api-reference/open) that returns the
> complete file contents directly, by using the file object's
> [`read()`](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects)
> method.

## Signature

```py
read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Parameters

- **`path`** - used to specify the location of the target artifact within the
  source project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. Both HTTP and SSH
  protocols are supported for online Git repository URLs (e.g.
  `[user@]server:project.git`). `repo` can also be a local file system path to
  an "offline" project. If not supplied, this defaults to the current working
  directory.

  > A `NotDvcRepoError` is thrown if `repo` is not a valid DVC project.

- `rev` - (optional)
  [Git-revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). `rev` only has an effect
  when a URL is supplied as parameter to `repo`. If not supplied, it uses the
  default Git revision, `HEAD`.

- `remote` - (optional) name of the [DVC remote](/doc/command-reference/remote)
  to fetch the target artifact from. If not supplied, the default depends on the
  value of `repo`. The local cache is used when `repo` is the current working
  directory (default value of `repo`). when `repo` is an external repository
  URL, the default project remote is used.

  > A `NoRemoteError` is thrown if no `remote` is specified and the project has
  > no default remote.

- `mode` - (optional) mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open). Defaults to
  `"r"` (read).

- `encoding` - (optional) used to decode contents to a string. Mirrors the
  namesake parameter in builtin `open()`. Defaults to `"utf-8"`.

## Examples

```py
import pickle
import dvc.api

model = pickle.loads(
  dvc.api.read("model.pkl", repo="https://github.com/my-org/my-repo.git")
)
```
