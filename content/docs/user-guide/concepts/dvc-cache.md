---
name: 'DVC Cache'
match: ['DVC cache', 'cache', 'caches', 'cached', 'cache directory']
tooltip: >-
  The [DVC cache](/doc/user-guide/concepts/dvc-cache) is a user-hidden storage
  (by default located in the `.dvc/cache` directory) for data files that are
  tracked by DVC, and their different versions.
description: >-
  The DVC cache adds a layer of indirection between code and data to efficiently
  version large datasets, data science features, and machine learning models.
---

<!-- keywords: data versioning, version control, large dataset versioning, machine learning model management, data science model management, git for data science, git machine learning, ml model version control, data model versioning, "what is versioning through codification?" (can also use all/some of these for dvc-metafiles) -->

# DVC Cache

<!-- Diagram of cache/remote/workspace... -->

The DVC cache is where the _content_ of tracked data files and directories are
found. It's a key-value store similar to git objects. DVC cache contains whole
binary files and tracks them using their hash values. The data files and
directories visible in the <abbr>workspace</abbr> are links to (or copies of)
the content in cache. By default DVC cache for a <abbr>DVC project</abbr> is in
`.dvc/cache` directory.

There may be multiple caches for a <abbr>project</abbr>. These can reside in a
system wide directory, a <abbr>remote</abbr> URL (in S3, Azure, file server
etc.) or in a project-local directory.

Internally DVC cache is a
[content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage).
It indexes content of each file with the hash value of the content to eliminate
duplication.

Internally DVC uses MD5 hash of the content to create an address within the
cache for a file. For details see
[Structure of the Cache Directory](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory)

DVC can cache entire directories as a single unit similar to files. A `.dir`
file for each tracked directory is created that lists names and hash values of
files in the directory. This eliminates the need to create corresponding `*.dvc`
files for each file in a directory, which can contain thousands of files.

## Further Reading

- [Internal Files](/doc/user-guide/project-structure/internal-files) in User's
  Guide
- [Shared Development Server](/doc/use-cases/shared-development-server) in Use
  Cases
