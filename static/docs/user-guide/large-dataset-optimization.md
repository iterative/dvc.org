# Large Dataset Optimization

In order to track the data files and directories added with `dvc add` or
`dvc run`, DVC moves all these files to a special cache directory. The DVC cache
is a hidden storage (by default located in `.dvc/cache`) for files that are
under DVC control, and their different versions. (See `dvc cache` and
[DVC internal files](/doc/user-guide/dvc-files-and-directories) for more
details.)

However, the versions of the tracked files that
[match the current code](/doc/get-started/connect-code-and-data) are also needed
in the workspace, so a subset of the cached files must be kept in the working
directory (using `dvc checkout`). Does this mean that some files will be
duplicated between the workspace and the cache? **That would not be efficient!**
Especially with large files (several Gigabytes or larger).

In order to have the files present in both directories without duplication, DVC
can automatically create **file links** in the workspace that "point" to the
data in cache. In fact, by default it will attempt to use reflinks\* if
supported by the file system.

## File link types for the DVC cache

File links are entries in the file system that don't necessarily hold the file
contents, but which point to where the file is actually stored. File links are
more common in file systems used with UNIX-like operating systems and come in
different kinds, that differ in how they connect filenames to inodes in the
system.

> **Inodes** are metadata file records to locate and store permissions to the
> actual file contents. See **Linking files** in
> [this doc](http://www.tldp.org/LDP/intro-linux/html/sect_03_03.html) for
> technical details (Linux). Use `ls -i` to list inodes on Linux.

There are pros and cons to the 3 supported link types: Hard links, Soft or
Symbolic links, and Reflinks in more recent systems. While reflinks bring all
the benefits and none of the worries, they're not commonly supported in most
platforms yet. Hard/soft links optimize **speed** and **space** in the file
system, but may break your workflow since updating hard/sym-linked files tracked
by DVC in the workspace causes cache corruption. These 2 link types thus require
using cache **protected mode** (see the `cache.protected` config option in
`dvc config cache`). Finally, a 4th "linking" option is to actually copy files
from/to the cache, which is safe but inefficient, especially for large files
(several GBs or more data).

> Some versions of Windows (e.g. Windows Server 2012+ and Windows 10 Enterprise)
> support hard or soft links on the
> [NTFS](https://support.microsoft.com/en-us/help/100108/overview-of-fat-hpfs-and-ntfs-file-systems)
> and
> [ReFS](https://docs.microsoft.com/en-us/windows-server/storage/refs/refs-overview)
> file systems.

File link type benefits summary:

| `cache.type` | speed | space | no protected mode |
| ------------ | ----- | ----- | ----------------- |
| `reflink`    | x     | x     | x                 |
| `hardlink`   | x     | x     |                   |
| `symlink`    | x     | x     |                   |
| `copy`       |       |       | x                 |

Each file linking option is further detailed below, in function of their
efficiency:

1. **`reflink`** - copy-on-write\* links or "reflinks" are the best possible
   link type, when available. They're is as efficient as hard/symlinks, but
   don't carry a risk of cache corruption since the file system takes care of
   copying the file if you try to edit it in place, thus keeping the linked
   cache file intact.

   > Unfortunately reflinks are currently supported on a limited number of file
   > systems only (Linux: Btrfs, XFS, OCFS2; MacOS: APFS), but in the future
   > they will be supported by the majority of file systems in use.

2. **`hardlink`** - hard links are the most efficient way to link your data to
   cache if both your repo and your cache directory are located on the same
   partition or storage device.

   > Please note that hardlinked data files should never be edited in place, but
   > instead deleted and then replaced with a new file, otherwise it might cause
   > cache corruption – and automatic deletion of cached files by DVC.

3. **`symlink`** - symbolic (aka "soft") links are the most efficient way to
   link your data to cache if your repo and your cache directory are located on
   different file systems/drives (i.e. repo is located on SSD for performance,
   but cache dir is located on HDD for bigger storage).

   > Please note that symlinked data files should never be edited in place, but
   > instead deleted and then replaced with a new file, otherwise it might cause
   > cache corruption – and automatic deletion of cached files by DVC.

4. **`copy`** - an inefficient "linking" strategy, yet supported on all file
   systems. Using `copy` means there will be no file links, but that the tracked
   files will be duplicated as copies existing in both the cache and workspace.
   Suitable for scenarios with relatively small data files, where copying them
   is not a storage performance concern.

> DVC avoids `symlink` and `hardlink` types by default to protect user from
> accidental cache corruption. Refer to the
> [Update a Tracked File](/doc/user-guide/update-tracked-file) guide to learn
> more.

## Configuring DVC cache file link type

By default DVC tries to use reflinks if available on your system, however this
is not the most common case at this time, so it falls back to the copying
strategy. If you wish to enable hard or soft links, you can configure DVC like
this:

```dvc
$ dvc config cache.type hardlink,symlink
$ dvc config cache.protected true
```

> Refer to `dvc config cache` for more options.

Setting `cache.protected` is important with `hardlink` and/or `symlink` cache
file link types. Please refer to the
[Update a Tracked File](/docs/user-guide/update-tracked-file) on how to manage
tracked files under these cache configurations.

---

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.
