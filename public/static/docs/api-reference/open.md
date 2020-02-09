# dvc.api.open()

[Context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library)
to open a DVC-tracked file <abbr>artifact</abbr> as a
[file object](https://docs.python.org/3/glossary.html#term-file-object).

## Signature

```py
open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
```

## Description

This function is analogous to the
[`open()`](https://docs.python.org/3/library/functions.html#open) Python
builtin, but for files tracked in <abbr>DVC projects</abbr>. However, it may
only be used as a _context manager_ (using the `with` keyword as shown in the
examples below). There is no `close()`.

💡 Note that `dvc.api.open()` is able to
[stream](https://docs.python.org/3/library/io.html) the file directly from
**most**
[remote types](/doc/command-reference/remote/add#supported-storage-types)
(local, S3, Azure, GCP, OSS, SSH, HDFS). Otherwise, the file is downloaded
regularly into a temporary local path before the file object is made available.

> This has similar uses as the `dvc get` and `dvc import` CLI commands.

## Parameters

- **`path`** - specifies the location of the target artifact within the source
  project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. Both HTTP and SSH
  protocols are supported for online Git repository URLs (e.g.
  `[user@]server:project.git`). `repo` can also be a local file system path to
  an "offline" project. If not supplied, defaults to the current working
  directory.

  A `dvc.api.UrlNotDvcRepoError` is thrown if `repo` is not a valid DVC project.

- `rev` -
  [Git-revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). It only has an effect when
  `repo` is a Git repository. If not supplied, it uses the default Git revision,
  `HEAD`.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to fetch
  the target artifact from. If not supplied, the default remote or `repo` is
  used (or the cache directory for local projects).

  A `dvc.exceptions.NoRemoteError` is thrown if no `remote` is specified and the
  project has no default remote.

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

> See also `dvc.api.read` for a more direct way to read the complete contents of
> a file <abbr>artifact</abbr>.

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

Sometimes we may want to chose the [remote](/doc/command-reference/remote) data
source, for example to ensure that file streaming is enabled (as only certain
remote storage types support streaming). This can be done by providing a
`remote` argument:

```py
import pandas as pd

import dvc.api

with open(
        'activity.log',
        repo='https://example.com/dvc/repo',
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
    pickle.load(fd)
    # ... Use model
```

> For a faster shorthand way to perform a similar example, please see the
> [read() example](/doc/api-reference/read#examples).
