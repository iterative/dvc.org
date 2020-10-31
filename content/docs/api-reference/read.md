# dvc.api.read()

Returns the contents of a tracked file.

```py
def read(path: str,
         repo: str = None,
         rev: str = None,
         remote: str = None,
         mode: str = "r",
         encoding: str = None)
```

#### Usage:

```py
import dvc.api

modelpkl = dvc.api.read(
    'model.pkl',
    repo='https://github.com/example/project.git',
    mode='rb')
```

## Description

This function wraps `dvc.api.open()`, for a simple way to return the complete
contents of a file tracked in a <abbr>DVC project</abbr>. The file can be
tracked by DVC (as an <abbr>output</abbr>) or by Git.

> This is similar to the `dvc get` command in our CLI.

The returned contents can be a
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)
or a [bytearray](https://docs.python.org/3/library/stdtypes.html#bytearray).
These are loaded to memory directly (without using any disc space).

> The type returned depends on the `mode` used. For more details, please refer
> to Python's [`open()`](https://docs.python.org/3/library/functions.html#open)
> built-in, which is used under the hood.

## Parameters

- **`path`** (required) - location and file name of the target to read, relative
  to the root of the project (`repo`).

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project is used
  (the current working directory tree is walked up to find it).

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If `repo` is not a Git repo, this
  option is ignored. _Default_: `HEAD`.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to look for
  the target data. _Default_: The
  [default remote](/doc/command-reference/remote/default) of `repo` is used if a
  `remote` argument is not given. For local projects, the <abbr>cache</abbr> is
  tied before the default remote.

- `mode` - specifies the mode in which the file is opened. Defaults to `"r"`
  (read). Mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open).

- `encoding` -
  [codec](https://docs.python.org/3/library/codecs.html#standard-encodings) used
  to decode the file contents to a string. This should only be used in text
  mode. Defaults to `"utf-8"`. Mirrors the namesake parameter in builtin
  `open()`.

## Exceptions

- `dvc.exceptions.FileMissingError` - file in `path` is missing from `repo`.

- `dvc.exceptions.PathMissingError` - `path` cannot be found in `repo`.

- `dvc.exceptions.NoRemoteError` - no `remote` is found.

## Example: Load data from a DVC repository

Any file tracked in a <abbr>DVC project</abbr> (and
[stored remotely](/doc/command-reference/remote/add)) can be loaded directly in
your Python code with this API. For example, let's say that you want to load and
unserialize a binary model from a repo on GitHub:

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
