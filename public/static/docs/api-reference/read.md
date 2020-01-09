# dvc.api.read()

Returns the contents of a file <abbr>artifact</abbr> as a bytes object or as a
string.

> Wrapper for [`dvc.api.open()`](/doc/api-reference/open) that returns the
> results of the file object's
> [`read()`](https://docs.python.org/3.7/tutorial/inputoutput.html#methods-of-file-objects)
> method.

## Signature

```py
read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
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

- `mode` - (optional) mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3.7/library/functions.html#open). Defaults
  to `"r"` (read).

- `encoding` - (optional) used to decode contents to a string. Mirrors the
  namesake parameter in builtin `open()`.

## Example

```py
import pickle
import dvc.api

model = pickle.loads(
  dvc.api.read("model.pkl", repo="https://github.com/my-org/my-repo.git")
)
```
