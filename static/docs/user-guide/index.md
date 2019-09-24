# User Guides

This section of the documentation provides detailed implementation details on
important DVC features and concepts. These guides cover the internal DVC
specifications in a descriptive manner and are ordered from more basic and
impactful to more advanced. We also include a few guides related to contributing
to this open-source project.

- [DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)
  describes the internal `.dvc/` directory, and it's contents.

- [DVC-File Format](/doc/user-guide/dvc-file-format) explains how the special
  metafiles that DVC creates to track <abbr>project</abbr> data are constructed.

- [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization)
  covers the topic of how cached data can be automatically file linked to the
  workspace to avoid duplication of storage or slow and unnecessary file
  operations.

- [External Dependencies](/doc/user-guide/external-dependencies) goes over the
  ways in which DVC can keep track of files external to the project (or even
  remote on a network or cloud location) as
  [DVC-file](/doc/user-guide/dvc-files-and-directories) dependencies.
- [Managing External Data](/doc/user-guide/external-outputs) explains both
  external outputs and external <abbr>cache</abbr>.
- [Dvcignore](/doc/user-guide/dvcignore) specifies how the optional `.dvcignore`
  file works in DVC projects.
- [Development Version](/doc/user-guide/development),
  [Contributing](/doc/user-guide/contributing), and
  [Contributing Documentation](/doc/user-guide/contributing-documentation) are
  related with getting involved directly in developing DVC. Contributors are
  very welcomed in our [community](/support)!

The remaining guides are about other helpful tips and tools related to DVC and
its usage.
