# DvcFileSystem

DvcFileSystem provides a pythonic file interface (aka
[fsspec](https://filesystem-spec.readthedocs.io/)) for a DVC repo and provides a
read-only filesystem-like operations like `ls`, `du`, `glob`, `get`, `download`,
etc.

DvcFileSystem provides a single view of all the files/directories in your
repository, be it Git-tracked or DVC-tracked, or untracked (in case of a local
repository). DvcFileSystem is smart to reuse the files in your cache directory
(if present) and can otherwise stream/fetch the files from your default remote.

### Basic Usage

```py
>>> from dvc.fs.dvc import _DvcFileSystem as DvcFileSystem
# opening a local repository
>>> fs = DvcFileSystem("/path/to/local/repository")
# opening a remote repository
>>> remote_fs = DvcFileSystem("https://github.com/iterative/example-get-started.git", rev="main")
```

## Examples

### Listing all DVC-tracked files

```py
>>> fs = DvcFileSystem("https://github.com/iterative/example-get-started.git", rev="main")
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

### Downloading a file or a directory

```py
>>> fs = DvcFileSystem("https://github.com/iterative/example-get-started.git", rev="main")
>>> fs.get_file("data/data.xml", "data.xml")
```

This downloads "data/data.xml" file to the current working directory as
"data.xml" file. The DVC-tracked files may be downloaded from the cache if it
exists or may get streamed from the remote.

```py
>>> fs = DvcFileSystem("https://github.com/iterative/example-get-started.git", rev="main")
>>> fs.get("data", "data", recursive=True)
```

This downloads all the files in "data" directory - be it Git-tracked or
DVC-tracked into a local directory "data". Similarly, DVC might fetch files from
remote if they don't exist in the cache.

## API Reference

As DvcFileSystem is based on [fsspec](https://filesystem-spec.readthedocs.io/),
it is compatible with most of the APIs that it offers. Please check the fsspec's
[API Reference](https://filesystem-spec.readthedocs.io/en/latest/api.html#fsspec.spec.AbstractFileSystem)
for more details.
