# File Link Types for the DVC Cache

File links are entries in the file system that don't necessarily hold the file
contents, but which point to where the file is actually stored. DVC can use file
links in your project's workspace instead of copies to avoid duplicating
contents that will exist in the DVC cache.

The DVC cache is a hidden storage (by default located in the `.dvc/cache`
directory) for files that are under DVC control, and their different versions.
(See `dvc cache` and
[DVC internal files](/doc/user-guide/dvc-files-and-directories) for more
details.)

File links are more common in file systems used with UNIX-like operating systems
and come in different flavors that have to do with how they connect filenames to
inodes in the system. Inodes are metadata file records to locate and manage
permissions to the actual file contents. Hard links, Soft or Symbolic links, and
Reflinks (in more recent systems) are the types of file links that DVC leverages
for performance.

> See **Linking files** in
> [this doc](http://www.tldp.org/LDP/intro-linux/html/sect_03_03.html) for
> technical details on Linux.  
> Some versions of Windows (e.g. Windows Server 2012+ and Windows 10 Enterprise)
> also support hard or soft links on the
> [NTFS](https://support.microsoft.com/en-us/help/100108/overview-of-fat-hpfs-and-ntfs-file-systems)
> and
> [ReFS](https://docs.microsoft.com/en-us/windows-server/storage/refs/refs-overview)
> file systems.

## Supported file links types and their tradeoffs

There are pros and cons to the 3 supported link types (`reflink`, `hardlink`,
`symlink` or soft link). While reflinks have all the benefits and none of the
worries, they're not commonly supported in most platforms yet. Hard/soft links
also optimize speed and space in the file system, but carry the risk of breaking
your workflow, since updating tracked files in the workspace causes data
corruption. These 2 link types thus require using cache protected mode (see the
`cache.protected` config option in `dvc config cache`). Finally, a 4th "linking"
option is to actually `copy` files from/to the cache, which is safe but quite
inefficient for large files (not recommended for GBs of data).

Each file linking option is further detailed below, in order of efficiency:

1. **`reflink`** - copy-on-write\* links or "reflinks" are the best possible
   link type, when available. They're is as fast as hard/symlinks, but don't
   carry a risk of cache corruption since the file system takes care of copying
   the file if you try to edit it in place, thus keeping a linked cache file
   intact.  
   Unfortunately reflinks are currently supported on a limited number of file
   systems only (Linux: Btrfs, XFS, OCFS2; MacOS: APFS), but in the future they
   will be supported by the majority of file systems in use.

2. **`hardlink`** - hard links are the most efficient way to link your data to
   cache if both your repo and your cache directory are located on the same file
   system/drive.  
   > Please note that hardlinked data files should never be edited in place, but
   > instead deleted and then replaced with a new file, otherwise it might cause
   > cache corruption and automatic deletion of cached files by DVC.

3. **`symlink`** - symbolic (aka "soft") links are the most efficient way to
   link your data to cache if your repo and your cache directory are located on
   different file systems/drives (i.e. repo is located on SSD for performance,
   but cache dir is located on HDD for bigger storage).  
   > Please note that symlinked data files should never be edited in place, but
   > instead deleted and then replaced with a new file, otherwise it might cause
   > cache corruption and automatic deletion of cached files by DVC.

4. **`copy`** - the most inefficient "linking" strategy, yet the most widely
   supported for any repo/cache file system combination. Using `copy` means
   there will be no links but the actual files will be duplicated by making
   copies from the cache into the workspace. Suitable for scenarios with
   relatively small data files, where copying them is not a storage performance
   concern

> DVC avoids `symlink` and `hardlink` types by default to protect user from
> accidental cache and repository corruption. Refer to the
> [Update a Tracked File](/doc/user-guide/update-tracked-file) guide to learn
> more.

## Configuring DVC cache file link type

By default DVC tries to use reflinks if available on your system, however this
is not the most common case at this time, so it falls back to the copying
strategy. If you wish to enable hard or soft links you can configure DVC like
this:

```dvc
$ dvc config cache.type reflink,hardlink,symlink
$ dvc config cache.protected true
```

> Refer to `dvc config cache` for more options.

Setting `cache.protected` is important with `hardlink` and/or `symlink` cache
file link types. Please refer to the
[Update a Tracked File](/docs/user-guide/update-tracked-file) to how to manage
tracked files under such a cache configuration.

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.
