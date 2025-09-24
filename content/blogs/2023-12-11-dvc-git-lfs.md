---
title: Integrating DVC and Git LFS via libgit2 filters
date: 2024-01-03
description: |
  Read about how we built a Python Git LFS client to support integrating
  projects which use Git LFS into your DVC workflow.
descriptionLong: |
  Learn how the latest DVC release (version 3.31.0) now supports reading Git LFS
  objects, allowing users to import files from platforms like Hugging Face
  without additional dependencies. The implementation utilizes the Dulwich and
  pygit2 libraries, providing compatibility with Git LFS within DVC and
  enhancing its capabilities in managing datasets across Git repositories.
picture: 2024-01-03/dvc-dulwich-libgit2.png
pictureComment: DVC, Dulwich and libgit2
authors:
  - peter_rowlands
tags:
  - Open Source
  - DVC
  - Git
  - Version Control
  - Company
  - Hugging Face
  - Git LFS
  - Dulwich
  - pygit2
  - libgit2
---

One of the main features provided by DVC is the ability to [import][import] and
[download][get] files from any Git repository. In prior releases this came with
the caveat where projects which use [Git LFS](https://git-lfs.com/) were
unsupported. As of version 3.31.0, DVC now supports reading Git LFS objects, so
you can now `dvc import` upstream datasets from platforms like
[Hugging Face](https://huggingface.co/) which use Git LFS, without needing to
install any additional dependencies! Read on for an overview on how the DVC Git
LFS client was implemented.

_To get started using DVC with Hugging Face, please refer to the DVC
integrations [documentation][hf-integration]_

[import]:
  https://dvc.org/doc/command-reference/import#example-importing-from-any-git-repository
  'dvc import'
[get]:
  https://dvc.org/doc/command-reference/get#examples-get-a-misc-git-tracked-file
  'dvc get'
[hf-integration]:
  https://dvc.org/doc/user-guide/integrations/huggingface
  'DVC/Hugging Face Integration'

DVC builds on top of Git's versioning capabilities using the open source
libraries [Dulwich](https://www.dulwich.io/) and
[pygit2](https://www.pygit2.org/) (which provides Python bindings for the C
library [libgit2](https://github.com/libgit2/libgit2)). Using these libraries
provides DVC with access to Git functionality without requiring a traditional
command line Git installation, which can be particularly useful in containerized
environments. When integrating support for Git LFS support into DVC, we wanted
to keep the same approach, so DVC users could simply install DVC, and then
import and download files from any Git repository, regardless of whether or not
that repository uses Git LFS. Neither Dulwich nor libgit2/pygit2 support Git LFS
natively, but libgit2 does provide an API for the low level Git filters
functionality used by Git LFS. We have [contributed][pygit2-pr] to pygit2 so
that pygit2 users (like DVC) can now write libgit2 filters purely in Python,
without needing to use the lower level libgit2 C API.

_DVC's Git client library (which wraps Dulwich and pygit2) is available
[here](https://github.com/iterative/scmrepo)_

[pygit2-pr]:
  https://github.com/libgit2/pygit2/pull/1237
  'pygit2 filters pull request'

## Git filters overview

Git supports using attribute [filters][git-filter] to manipulate how objects are
stored internally in Git compared to how they are stored in your workspace. One
commonly used built-in filter is the CRLF filter, which will adjust line endings
in text files. The CRLF filter is typically used to ensure that files are
checked out into the workspace using the appropriate line endings for the user's
platform (linefeed on Unix and carriage return + linefeed on Windows), but are
only stored in Git with Unix-style line endings.

Git LFS also works by using Git filters. When you add a file with the
`filter=lfs` attribute to Git, The Git LFS filter generates a "pointer" for Git
to store internally. The LFS pointer is a small text file containing a SHA256
LFS object ID for the original file. The Git LFS filter places the original file
in Git LFS storage, and then outputs the pointer to Git (instead of the original
file). Upon checkout, Git passes the pointer to the Git LFS filter, which then
reads the LFS object ID and checks out the appropriate original file into your
workspace.

```
version https://git-lfs.github.com/spec/v1
oid sha256:b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c
size 4
```

_Example Git LFS pointer_

[git-filter]:
  https://git-scm.com/docs/gitattributes#_filter
  'Git attributes filters'

## libgit2 and pygit2 filters

When saving objects in Git and when checking them back out to the workspace,
libgit2 runs a chain of registered filters. Each filter in the chain modifies
the object data as needed, and then passes the modified result into the next
filter. While writing a libgit2 filter in C is fairly complex and requires
implementing multiple levels of callback structs for handling the underlying
buffered write streams in addition to the filter itself, this is simplified by
our newly contributed support for Python filters in pygit2. The low level
libgit2 APIs are abstracted away, and a subclassed `pygit2.Filter`implementation
only needs to implement three basic methods, `check()`, `write()` and `close()`.

- `Filter.check()` is called prior to processing any object with Git attributes
  which match the registered filter, and the filter can verify whether or not it
  should be used with the given object, or indicate that the filter does not
  need to be applied.
- `Filter.write()` is called one or more times and is used to “write” input data
  chunks to the filter.
- `Filter.close()` is called after all of the input data has been written to the
  filter.

The filter can send output data chunks to the next filter in the chain as needed
via the `write_next()` callback.

_Note: in Git, `smudge` filters are run when checking out objects from the Git
object database into the workspace, and `clean` filters are run when saving
objects from the workspace into the Git object database. In libgit2 and pygit2,
a single filter is registered which is used in both cases, and the direction is
indicated by the `mode` parameter._

## The scmrepo Git LFS filter

Thanks to this higher level abstraction in pygit2, implementing the Git LFS
`smudge` filter in Python is straightforward:

```python
 def check(self, src: "FilterSource", attr_values: List[str]):
    if attr_values[0] == "lfs":
        if src.mode != GIT_FILTER_CLEAN:
            self._smudge_buf = io.BytesIO()
            self._smudge_root = src.repo.workdir or src.repo.path
            return
    raise Passthrough
```

In `check()`, the first element in `attr_values` will contain the object’s
`filter` Git attribute. We verify that the object has `filter=lfs` set and that
we are in `smudge` mode (our filter is currently read-only and does not need to
implement `clean` mode). When in `smudge` mode we initialize an internal buffer
which will be used for reading the pointer data from Git, as well as storing the
original Git repository root path (which will be needed later).

```python
def write(
    self, data: bytes, src: "FilterSource", write_next: Callable[[bytes], None]
):
    …
    self._smudge_buf.write(data)
```

In `write()` we append the input chunk to our buffer and then return. We do not
write to the next filter, since Git LFS `smudge` depends on reading the entire
pointer input before we can output any data.

```python
def close(self, write_next: Callable[[bytes], None]):
    …
    self._smudge(write_next)

def _smudge(self, write_next: Callable[[bytes], None]):
    …
    self._smudge_buf.seek(0)
    with Git(self._smudge_root) as scm:
        try:
            url = get_fetch_url(scm)
        except InvalidRemote:
            url = None
        fobj = smudge(scm.lfs_storage, self._smudge_buf, url=url)
        data = fobj.read(io.DEFAULT_BUFFER_SIZE)
        try:
            while data:
                write_next(data)
                data = fobj.read(io.DEFAULT_BUFFER_SIZE)
        except KeyboardInterrupt:
            return
```

In `close()`, we get the configured Git LFS remote URL (if it is set) and then
run our actual `smudge()` implementation. scmrepo’s `smudge()` method will
return a Python file-like object stream for the original file (and not the
internal pointer). We then just need to do a series of chunked reads and writes
to send the original file data to the next filter in the chain.

Since Git LFS `smudge` behavior is well defined by the [Git LFS
specification][smudge-spec] we will not go into a detailed explanation of our
Python implementation here. In short, `smudge()` verifies that the input data is
a valid Git LFS pointer, reads the Git LFS object ID from the pointer, and then
loads the appropriate object from Git LFS storage. If the specified object ID is
not available in the local Git LFS storage, it will be fetched from the remote
Git LFS server.

_The complete source code for our scmrepo Git LFS filter is available on Github:
[filter.py][filter.py], [smudge.py][smudge.py]_

[smudge-spec]:
  https://github.com/git-lfs/git-lfs/blob/main/docs/spec.md#intercepting-git
  'Git LFS specification'
[filter.py]:
  https://github.com/iterative/scmrepo/blob/main/src/scmrepo/git/backend/pygit2/filter.py
  'scmrepo filter.py'
[smudge.py]:
  https://github.com/iterative/scmrepo/blob/main/src/scmrepo/git/lfs/smudge.py
  'scmrepo smudge.py'

## Conclusion

This recent update to DVC marks a significant milestone by eliminating the prior
limitation associated with Git LFS incompatibility. With version 3.31.0, DVC
users can seamlessly import files from Git repositories, including platforms
like Hugging Face, without needing extra dependencies. The integration of Git
LFS support, facilitated by the Dulwich and pygit2 libraries, streamlines
managing datasets and large objects in a Git repository.

This reinforces DVC's commitment to providing a versatile and user-friendly
open-source version control solution for diverse Git repositories.

---

[Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq) 
to stay up to date with news and contributions from the Community!
