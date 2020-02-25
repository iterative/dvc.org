# dvc.api.open()

[Context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library)
to open a tracked file.

## Usage

```py
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... Process data
```

### Signature

```py
open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

### Types

All **parameter** types are
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

The **return** type is a
[file object](https://docs.python.org/3/glossary.html#term-file-object).

No exceptions are raised by this function.

## Description

This function is analogous to the
[`open()`](https://docs.python.org/3/library/functions.html#open) Python
builtin, but for files tracked in <abbr>DVC projects</abbr> (by DVC or Git).
However, it may only be used as a _context manager_ (using the `with` keyword as
shown in the [Examples](#examples) below). There is no `dvc.api.close()`.

> See also `dvc.api.read()` for a shorthand way to read the complete contents of
> a tracked file.

`dvc.api.open()` avoids downloading files from **most**
[remote types](/doc/command-reference/remote/add#supported-storage-types). It
returns an open connection to the storage, though which file can be used
directly. Only Google Drive storage does not support this, requiring this
function to completely download the file in `path` (into a temporary directory)
before the file object is made available.

> This has similar uses as the `dvc get` CLI command.

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

- `mode` - (optional) mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open). Defaults to
  `"r"` (read).

- `encoding` - (optional) used to decode contents to a string. Mirrors the
  namesake parameter in builtin `open()`. Defaults to `"utf-8"`.

## Example: Process XML file from an external DVC repository

```py
from xml.dom.minidom import parse

import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    xmldom = parse(fd)
    # ... Process elements
```

> See `dvc.api.read()` for a shorthand way to read the contents of a tracked
> file.

## Example: Use a file from the local cache

In this case we don't supply a `repo` value. DVC will walk up the current
working directory tree to find the <abbr>DVC project</abbr>:

```py
import dvc.api

with dvc.api.open('data/nlp/words.txt') as fd:
    for word in fd:
        # ... Process words
```

DVC will look for `data/nlp/words.txt` in the local cache of the
<abbr>project</abbr>. (If it's not found there, the default
[remote](/doc/command-reference/remote) will be tried.)

To specify the file encoding of a text file:

```py
with dvc.api.open('data/nlp/words.txt', encoding='utf-8') as fd:
    # ...
```

## Example: Process CSV file from a private repository

For this we'll have to use the SSH URL to the Git repo (assuming the local
[SSH credentials](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
are configured locally):

```py
import csv
import dvc.api

with dvc.api.open(
        'sea_ice.csv',
        repo='git@github.com:iterative/df_sea_ice_no_header.git'
        ) as fd:
    reader = csv.reader(fd)
    for row in reader:
        # ... Process columns
```

> Note that we're using an SSH Git URL for the `repo` argument above.

## Example: Stream file from a specific remote

Sometimes we may want to choose the [remote](/doc/command-reference/remote) data
source, for example to ensure that file streaming is enabled (as only certain
remote storage types support streaming). This can be done by providing a
`remote` argument:

```py
import dvc.api

with open(
        'activity.log',
        repo='location/of/dvc/project',
        remote='my-s3-bucket'
        ) as fd:
    for line in fd:
        match = re.search(r'user=(\w+)', line)
        # ...
```

## Example: Unserialize and employ a binary model

```py
import pickle
import dvc.api

with dvc.api.open('model.pkl', repo='...') as fd:
    model = pickle.load(fd)
    # ... Use model
```

> For a faster way to perform a similar example, please see the
> [read() example](/doc/api-reference/read#examples).
