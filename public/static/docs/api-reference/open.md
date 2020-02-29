### `dvc.api.open(path, repo=None, rev=None, remote=None, mode="r", encoding=None)`

Opens a tracked file.

```py
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```

All **parameter** types are
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

## Description

Open file or model (`path`) tracked in a <abbr>DVC projects</abbr> (by DVC or
Git), and return a corresponding
[file object](https://docs.python.org/3/glossary.html#term-file-object). If the
file cannot be found, a `PathMissingError` is raised.

> This function is analogous to the
> [`open()`](https://docs.python.org/3/library/functions.html#open) Python
> built-in.

`dvc.api.open()` may only be used as a
[context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library)
(using the `with` keyword, as shown in the **Examples** below).

> Use `dvc.api.read()` to get the file's contents directly – no _context
> manager_ involved.

This function reads (streams) the file trough a direct connection to the storage
whenever possible, so it does not require any space on the disc to save the file
before making it accessible. The only exception is when using a Google Drive
[remote type](/doc/command-reference/remote/add#supported-storage-types).

## Parameters

- **`path`** - location and file name of the file in `repo`, relative to the
  project's root.

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`).

  The current project is used by default (the current working directory tree is
  walked up to find it) if a `repo` argument is not given.

  A `dvc.api.UrlNotDvcRepoError` is raised if `repo` is not a valid DVC project.

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If `repo` is not a Git repo, this
  option is ignored.

  `HEAD` is used by default if a `rev` argument is not given.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to look for
  the target data.

  For online projects, the
  [default remote](/doc/command-reference/remote/default) of `repo` is tried if
  a `remote` argument is not given. For local projects, the default is to try
  the <abbr>cache</abbr> before the default remote.

  A `dvc.exceptions.NoRemoteError` is raised if no `remote` is found.

- `mode` - specifies the mode in which the file is opened. Defaults to `"r"`
  (read). Mirrors the namesake parameter in builtin
  [`open()`](https://docs.python.org/3/library/functions.html#open).

- `encoding` -
  [codec](https://docs.python.org/3/library/codecs.html#standard-encodings) used
  to decode the file contents to a string. This should only be used in text
  mode. Defaults to `"utf-8"`. Mirrors the namesake parameter in builtin
  `open()`.

## Example: Use data tracked in a DVC repository online

Any <abbr>data artifact</abbr> can be employed directly in your Python app by
using this API.

For example, an XML file from a public DVC repo online can be processed directly
in your Python app with:

```py
from xml.dom.minidom import parse
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    xmldom = parse(fd)
    # ... Process DOM
```

> Notice that you could read the contents of a tracked file faster with
> `dvc.api.read()`:
>
> ```py
> xmldata = dvc.api.read('get-started/data.xml',
>     repo='https://github.com/iterative/dataset-registry')
> xmldom = parse(xmldata)
> ```

Now let's imagine you want to unserialize and use a binary model from a private
repo online. For a case like this, we can use a SSH URL instead (assuming the
[credentials are configured](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)
locally):

```py
import pickle
import dvc.api

with dvc.api.open(
        'model.pkl',
        repo='git@server.com:path/to/repo.git'
        ) as fd:
    model = pickle.load(fd)
    # ... Use instanciated model
```

## Example: Use other versions of data or results

The `rev` argument lets you specify any Git commit to look for an artifact. This
way any previous version, or alternative experiment can be accessed
programmatically. For example, let's say your DVC repo has tagged releases of a
CSV dataset:

```py
import csv
import dvc.api

with dvc.api.open(
        'clean.csv',
        rev='v1.1.0'
        ) as fd:
    reader = csv.reader(fd)
    # ... Read clean data from version 1.1.0
```

Also, notice that in this case we didn't supply a `repo` argument in this
example. DVC will attempt to find a <abbr>DVC project</abbr> to use in the
current working directory tree, and look for the file contents of `clean.csv` in
its local <abbr>cache</abbr>; no download will happen if found. See the
[Parameters](#parameters) section for more info.

Note: to specify the file encoding of a text file, use:

```py
import dvc.api

with dvc.api.open(
        'data/nlp/words_ru.txt',
        encoding='koi8_r') as fd:
    # ...
```

## Example: Chose a specific remote as the data source

Sometimes we may want to choose the [remote](/doc/command-reference/remote) data
source, for example if the `repo` has no default remote set. This can be done by
providing a `remote` argument:

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
