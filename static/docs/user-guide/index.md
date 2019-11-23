# User Guide

This section describes the main DVC concepts and features comprehensively,
explaining when and how to use them, as well as connections between them. These
guides don't focus on specific scenarios, but have a general scope – like a user
manual. Their topics range from more technical foundations, impacting more parts
of DVC, to more advanced and specific things you can do. We also include a few
guides related to contributing to this
[open-source project](https://github.com/iterative/dvc).

- [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)
  describes the internal `.dvc/` directory and it's contents.
- [DVC-File Format](/doc/user-guide/dvc-file-format) explains how the special
  metafiles that DVC creates to track <abbr>project</abbr> data are constructed.
- [Dvcignore](/doc/user-guide/dvcignore) explains how to exclude files from DVC
  operations with the optional `.dvcignore` file.
- [Update a Tracked File](/doc/use-cases/updating-tracked-files) explains how to
  modify protected data under DVC control (related to the `cache.type` option of
  DVC).
- [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization)
  covers the topic of how <abbr>caches</abbr> data can be automatically file
  linked to the workspace to avoid duplication of storage or slow and
  unnecessary file operations.
- [External Dependencies](/doc/user-guide/external-dependencies) goes over the
  ways in which DVC can keep track of files external to the project (or even
  remote on a network or cloud location) as
  [DVC-file](/doc/user-guide/dvc-files-and-directories) dependencies.
- [Managing External Data](/doc/user-guide/managing-external-data) explains both
  external outputs and external cache.
- [Contributing](/doc/user-guide/contributing) is related with getting involved
  directly in developing DVC. Contributors are very welcomed in our
  [community](/support)!
- [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) contains
  useful information for our Windows users.
- [Using Docker](/doc/user-guide/using-docker) explains how to set up a Docker
  image to develop with DVC and which considerations to have.

The remaining guides are about optional productivity enhancements and other tips
and tools related to advanced usage of DVC.
