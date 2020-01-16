# dvc.api.open()

Opens a file <abbr>artifact</abbr> as a
[file object](https://docs.python.org/3/glossary.html#term-file-object). May
only be used as
[context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library).

> This has similar uses as the `dvc get` and `dvc import` CLI commands.

💡 Note that `dvc.api.open` is able to
[stream](https://docs.python.org/3/library/io.html) the file directly from
**some** [remote](/doc/command-reference/remote) types. Otherwise, the file is
downloaded regularly into a temporary local path before the file object is made
available.

## Signature

```py
open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)
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

## Example: process XML file from an external DVC repository

```py
from xml.dom.minidom import parse

import dvc.api

with dvc.api.open(
  "get-started/data.xml",
  "https://github.com/iterative/dataset-registry"
) as fd:
  xmldom = parse(fd)
  # ... Process elements
```

> See also `dvc.api.read` for a more direct way to read the complete contents of
> a file <abbr>artifact</abbr>.

## Example: use a file from the local cache

In this case we don't supply a `repo` value, which means the current working
directory will be tried instead, so make sure that the code is run from within a
<abbr>DVC project</abbr>:

```py
import dvc.api

with dvc.api.open('data/nlp/words.txt') as fd:
  print(fd.name)
```

DVC will look for `data/nlp/words.txt` in the local cache of the
<abbr>project</abbr>. (If it's not found there, the default
[remote](/doc/command-reference/remote) will be tried.)

The output of the script above should be something like
`.dvc/cache/3a/01762e96060aa04a68345fbd910355` – the physical data location.

## Example: process CSV file from a private repository

For this we'll have to use the SSH URL to the Git repo (assuming the local
[SSH credentials](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
are configured locally):

```py
import csv
import dvc.api

with dvc.api.open(
  "sea_ice.csv",
  repo="git@github.com:iterative/df_sea_ice_no_header.git"
) as fd:
  reader = csv.reader(fd)
  for row in reader:
    # ... Process columns
```

## Example: stream file from a specific remote

Sometimes we may want to chose the [remote](/doc/command-reference/remote) data
source, for example to ensure that file streaming is enabled. This can be done
by providing a `remote` argument:

```py
import dvc.api

with dvc.api.open(
  'model.pkl',
  repo='https://github.com/example/dvc-repository'
  remote='my-s3-bucket'
) as fd:
  for line in fd:
    # ... Process lines
```
