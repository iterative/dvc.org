# dvc.api.read()

Returns the contents of a tracked file.

## Usage

```py
import dvc.api

modelpkl = dvc.api.read(
    'model.pkl',
    repo='https://github.com/example/project.git'
    mode='rb')
```

### Signature

```py
read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

### Types

All **parameter** types are
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

The **return** type can be a
[bytes object](https://docs.python.org/3/glossary.html#term-bytes-like-object)
or a
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

No exceptions are raised by this function.

## Description

This function wraps [`dvc.api.open()`](/doc/api-reference/open) for a simple and
direct way to return the complete contents of files tracked in <abbr>DVC
projects</abbr> (by DVC or Git) – no _context manager_ (`with` keyword) needed.

> Internally, it uses the _file object_'s
> [`read()`](https://docs.python.org/3/tutorial/inputoutput.html#methods-of-file-objects)
> method.

## Parameters

- **`path`** - specifies the location of the target data within the source
  project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. If not supplied,
  defaults to the current DVC project. It can be a URL or a file system path.
  Both HTTP and SSH protocols are supported for online Git repos (e.g.
  `[user@]server:project.git`).

  A `dvc.api.UrlNotDvcRepoError` is raised if `repo` is not a valid DVC project.

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If not supplied, it uses the default
  Git revision, `HEAD`. If `repo` is a Git repo, this option is ignored.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to look for
  the target data. If not supplied, the cache directory is tried first for local
  projects; The default remote of `repo` is tried otherwise.

  A `dvc.exceptions.NoRemoteError` is raised if no `remote` is found.

- `mode` - mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open). Defaults to
  `"r"` (read).

- `encoding` - used to decode contents to a string. Mirrors the namesake
  parameter in builtin `open()`. Defaults to `"utf-8"`.

## Examples

```py
import pickle
import dvc.api

model = pickle.loads(
    dvc.api.read(
        'model.pkl',
        repo='https://github.com/example/project.git'
        mode='rb'
        )
    )
```

> We're using `'rb'` mode here for compatibility with `pickle.loads()`.
