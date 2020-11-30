---
name: 'DVC Cache'
match: ['DVC cache', 'cache', 'caches', 'cached']
tooltip: >-
  The [DVC cache](/doc/user-guide/glossary/dvc-cache) is a hidden storage (by
  default located in the `.dvc/cache` directory) for files that are tracked by
  DVC, and their different versions.
---

# DVC Cache

<!-- Diagram of cache/remote/workspace... -->

<!-- extracted from `dvc cache` -->

The DVC Cache is where your data files, models, etc. (anything you want to
version with DVC) are actually stored. The data files and directories visible in
the <abbr>workspace</abbr> are links\* to (or copies of) the ones in cache.
Learn more about its [structure](#structure-of-the-cache-directory).

<!-- extracted from DVC files and directories -->

## Structure of the cache directory

The DVC cache is a
[content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
(by default in `.dvc/cache`), which adds a layer of indirection between code and
data.

There are two ways in which the data is <abbr>cached</abbr>: As a single file
(eg. `data.csv`), or as a directory.

### Files

DVC calculates the file hash, a 32 characters long string (usually MD5). The
first two characters are used to name the directory inside the cache, and the
rest become the file name of the cached file. For example, if a data file has a
hash value of `ec1d2935f811b77cc49b031b999cbf17`, its path in the cache will be
`.dvc/cache/ec/1d2935f811b77cc49b031b999cbf17`.

> Note that file hashes are calculated from file contents only. 2 or more files
> with different names but the same contents can exist in the workspace and be
> tracked by DVC, but only one copy is stored in the cache. This helps avoid
> data duplication.

### Directories

Let's imagine [adding](/doc/command-reference/add) a directory with 2 images:

```dvc
$ tree data/images/
data/images/
├── cat.jpeg
└── index.jpeg

$ dvc add data/images
```

The directory is cached as a JSON file with `.dir` extension. The files it
contains are stored in the cache regularly, as explained earlier. It looks like
this:

```dvc
.dvc/cache/
├── 19
│   └── 6a322c107c2572335158503c64bfba.dir
├── d4
│   └── 1d8cd98f00b204e9800998ecf8427e
└── 20
    └── 0b40427ee0998e9802335d98f08cd98f
```

The `.dir` file contains the mapping of files in `data/images` (as a JSON
array), including their hash values:

```dvc
$ cat .dvc/cache/19/6a322c107c2572335158503c64bfba.dir
[{"md5": "dff70c0392d7d386c39a23c64fcc0376", "relpath": "cat.jpeg"},
{"md5": "29a6c8271c0c8fbf75d3b97aecee589f", "relpath": "index.jpeg"}]
```

That's how DVC knows that the other two cached files belong in the directory.
