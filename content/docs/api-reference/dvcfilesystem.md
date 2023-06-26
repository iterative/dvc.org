# DVCFileSystem

DVCFileSystem provides a pythonic file interface (
[fsspec-compatible](https://filesystem-spec.readthedocs.io/)) for a DVC repo. It
is a read-only filesystem, hence it does not support any write operations, like
`put_file`, `cp`, `rm`, `mv`, `mkdir` etc.

DVCFileSystem provides a unified view of all the files/directories in your
repository, be it Git-tracked or DVC-tracked, or untracked (in case of a local
repository). It can reuse the files in DVC <abbr>cache</abbr> and can otherwise
stream from [supported remote storage].

[supported remote storage]:
  /doc/user-guide/data-management/remote-storage#supported-storage-types

```py
>>> from dvc.api import DVCFileSystem
# opening a local repository
>>> fs = DVCFileSystem("/path/to/local/repository")
# opening a remote repository
>>> url = "https://github.com/iterative/example-get-started.git"
>>> fs = DVCFileSystem(url, rev="main")
```

The optional positional argument can be a URL or a local path to the DVC
project. If unspecified, the DVC project in current working directory is used.

The optional `rev` argument can be passed to open a filesystem from a certain
Git commit (any [revision](https://git-scm.com/docs/revisions) such as a branch
or a tag name, a commit hash, or an [experiment name]).

The optional `config` argument can be passed through to the DVC project.

[experiment name]: /doc/command-reference/exp/run#-n

## Opening a file

```py
>>> with fs.open("model.pkl") as f:
        model = pickle.load(f)
```

This is similar to `dvc.api.open()` which returns a file-like object. Note that,
unlike `dvc.api.open()`, the `mode` defaults to binary mode, i.e. `"rb"`. You
can also specify `encoding` argument in case of text mode (`"r"`).

## Reading a file

```py
>>> text = fs.read_text("get-started/data.xml", encoding="utf-8")
```

This is similar to `dvc.api.read()`, which returns the contents of the file as a
string.

To get the binary contents of the file, you can use `read_bytes()` or
`cat_file()`.

```py
>>> contents = fs.read_bytes("get-started/data.xml")
```

## Listing all DVC-tracked files recursively

```py
>>> fs.find("/", detail=False, dvc_only=True)
[
    '/data/data.xml',
    '/data/features/test.pkl',
    '/data/features/train.pkl',
    '/data/prepared/test.tsv',
    '/data/prepared/train.tsv',
    '/evaluation/importance.png',
    '/model.pkl'
]
```

This is similar to `dvc ls --recursive --dvc-only` CLI command. Note that the
`"/"` is considered as the root of the Git repo. You can specify sub-paths to
only return entries in that directory. Similarly, there is `fs.ls()` that is
non-recursive.

## Listing all files (including Git-tracked)

```py
>>> fs.find("/", detail=False)
[
    ...
    '/.gitignore',
    '/README.md',
    '/data/.gitignore',
    '/data/data.xml',
    '/data/features/test.pkl',
    '/data/features/train.pkl',
    '/data/prepared/test.tsv',
    '/data/prepared/train.tsv',
    ...
    '/evaluation/.gitignore',
    '/evaluation/importance.png',
    '/evaluation/plots/confusion_matrix.json',
    '/evaluation/plots/precision_recall.json',
    '/evaluation/plots/roc.json',
    '/model.pkl',
    ...
]
```

This is similar to `dvc ls --recursive` CLI command. It returns all of the files
tracked by DVC and Git and if filesystem is opened locally, it also includes the
local untracked files.

## Downloading a file or a directory

```py
>>> fs.get_file("data/data.xml", "data.xml")
```

This downloads "data/data.xml" file to the current working directory as
"data.xml" file. The DVC-tracked files may be downloaded from the cache if it
exists or may get streamed from the remote.

```py
>>> fs.get("data", "data", recursive=True)
```

This downloads all the files in "data" directory - be it Git-tracked or
DVC-tracked into a local directory "data". Similarly, DVC might fetch files from
remote if they don't exist in the cache.

## API Reference

As DVCFileSystem is based on [fsspec](https://filesystem-spec.readthedocs.io/),
it is compatible with most of the APIs that it offers. For more details check
out the fsspec's
[API Reference](https://filesystem-spec.readthedocs.io/en/latest/api.html#fsspec.spec.AbstractFileSystem).
