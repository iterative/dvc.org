---
name: 'DVC Cache'
match: ['DVC cache', cache, caches, cached, 'cache directory']
---

The DVC cache is where the _content_ of tracked data files reside. it's a
key-value store similar to git objects. DVC cache contains whole binary files
and tracks them using their hash values.

By default DVC cache for a <abbr>workspace</abbr> is in `.dvc/cache` directory.

There may be multiple caches for a <abbr>project</abbr>. These can reside in a
system wide directory, a <abbr>remote</abbr> URL (in S3, Azure, file server
etc.) or in a project-local directory.

The structure of a cache is documented
[here](/doc/user-guide/project-structure/internal-files#structure-of-the-cache-directory).
