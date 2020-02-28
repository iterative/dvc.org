### `dvc.api.read(path, repo=None, rev=None, remote=None, mode="r", encoding=None)`

Returns the contents of a tracked file.

```py
import dvc.api

modelpkl = dvc.api.read(
    'model.pkl',
    repo='https://github.com/example/project.git'
    mode='rb')
```

All **parameter** types are
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

## Description

This function wraps [`dvc.api.open()`](/doc/api-reference/open) for a simple and
direct way to return the complete contents of files tracked in <abbr>DVC
projects</abbr> (by DVC or Git).

The current project is used by default (the current working directory tree is
walked up to find it), unless a `repo` argument is supplied.

Unless a `remote` argument is given, it first tries to find the file in the
<abbr>cache</abbr> for local projects. If not found there or for online
projects, the [default remote](/doc/command-reference/remote/default) of `repo`
is tried. If the file cannot be found, a `PathMissingError` is raised.

For Git-tracked <abbr>DVC repositories</abbr>, unless a `rev` argument is
provided, the repo's `HEAD` version is used.

The returned contents can be a
[bytes object](https://docs.python.org/3/glossary.html#term-bytes-like-object)
or a
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

> This is similar to the `dvc get` command in our CLI.

## Parameters

- **`path`** - location and file name of the file in `repo`, relative to the
  project's root.

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`).

  A `dvc.api.UrlNotDvcRepoError` is raised if `repo` is not a valid DVC project.

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If `repo` is not a Git repo, this
  option is ignored.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to look for
  the target data.

  A `dvc.exceptions.NoRemoteError` is raised if no `remote` is found.

- `mode` - specifies the mode in which the file is opened. Defaults to `"r"`
  (read). Mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open).

- `encoding` -
  [codec](https://docs.python.org/3/library/codecs.html#standard-encodings) used
  to decode the file contents to a string. This should only be used in text
  mode. Defaults to `"utf-8"`. Mirrors the namesake parameter in builtin
  `open()`.

## Example: Use artifacts from online DVC repositories

Any <abbr>data artifact</abbr> can be employed directly in your Python app by
using this API.

For example, let's say that you want to unserialize and use a binary model from
an online repo:

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
