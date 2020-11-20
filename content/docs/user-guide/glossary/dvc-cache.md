---
name: 'DVC Cache'
match: ['DVC cache', 'cache', 'caches', 'cached']
tooltip: >-
  The [DVC cache](/doc/user-guide/glossary/dvc-cache) is a hidden storage (by
  default located in the `.dvc/cache` directory) for files that are tracked by
  DVC, and their different versions. Learn more about it's
  [structure](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).
---

# DVC Cache

<!-- Diagram of cache/remote/workspace...

_From `dvc cache`_ -->

The DVC Cache is where your data files, models, etc. (anything you want to
version with DVC) are actually stored. The data files and directories visible in
the <abbr>workspace</abbr> are links\* to (or copies of) the ones in cache.
Learn more about it's
[structure](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).
