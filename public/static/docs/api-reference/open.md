# dvc.api.open()

Opens a tracked file.

```py
def open(path: str,
         repo: str = None,
         rev: str = None,
         remote: str = None,
         mode: str = "r",
         encoding: str = None)
```

#### Usage:

```py
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
    # ... fd is a file descriptor that can be processed normally.
```

## Description

Open a data or model file tracked in a <abbr>DVC project</abbr> and generate a
corresponding
[file object](https://docs.python.org/3/glossary.html#term-file-object). The
file can be tracked by DVC or by Git.

> The exact type of file object depends on the `mode` used. For more details,
> please refer to Python's
> [`open()`](https://docs.python.org/3/library/functions.html#open) built-in,
> which is used under the hood.

`dvc.api.open()` may only be used as a
[context manager](https://www.python.org/dev/peps/pep-0343/#context-managers-in-the-standard-library)
(using the `with` keyword, as shown in the examples).

> Use `dvc.api.read()` to get the complete file contents in a single function
> call – no _context manager_ involved.

This function makes a direct connection to the
[remote storage](/doc/command-reference/remote/add#supported-storage-types)
(except for Google Drive), so the file contents can be streamed as they are
read. This means it does not require space on the disc to save the file before
making it accessible. The only exception is when using Google Drive as
[remote type](/doc/command-reference/remote/add#supported-storage-types).

## Parameters

- **`path`** - location and file name of the file in `repo`, relative to the
  project's root.

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

- `dvc.api.UrlNotDvcRepoError` - `repo` is not a DVC project.

- `dvc.exceptions.NoRemoteError` - no `remote` is found.

## Example: Use data or models from DVC repositories

Any <abbr>data artifact</abbr> can be employed directly in your Python app by
using this API. For example, an XML file tracked in a public DVC repo on Github
can be processed directly in your Python app with:

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

> Notice that if you just need to load the complete file contents to memory, you
> can use `dvc.api.read()` instead:
>
> ```py
> xmldata = dvc.api.read('get-started/data.xml',
>     repo='https://github.com/iterative/dataset-registry')
> xmldom = parse(xmldata)
> ```

Now let's imagine you want to deserialize and use a binary model from a private
repo. For a case like this, we can use an SSH URL instead (assuming the
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

## Example: Use different versions of data

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

Also, notice that we didn't supply a `repo` argument in this example. DVC will
attempt to find a <abbr>DVC project</abbr> to use in the current working
directory tree, and look for the file contents of `clean.csv` in its local
<abbr>cache</abbr>; no download will happen if found. See the
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
