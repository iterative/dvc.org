# Basic Concepts

The DVC user guide constitutes DVC files and directories, DVC file format,
external dependencies, external outputs, update a tracked file, anonymized usage
analytics which are part of basic. Customizations has DVC autocomplete, plugins,
developement version and contributing guide.

Let's understand the basic concepts as you use dvc.

## Workspace

Work space is the current work directory.

## Cache

DVC cache is a hidden (by default it's located in the `.dvc/cache` directory)
storage. For files that are under DVC control it keeps them and their different
versions. You can find more information on cache as described in this [doc](https://dvc.org/doc/commands-reference/config#cache).

## Remote

In DVC you can have remote data storage or a remote git hosted code server.
A remote can be specified by the remote type prefix and a path. You can find
more information on DVC remote in this [doc](https://dvc.org/doc/commands-reference/config#remote).

## DVC file

When you add a file or a stage to your pipeline, DVC creates a special `.dvc`
file that contains all the needed information to track your data. The file
itself is in a simple YAML format and could be easily written or altered
(after being created by dvc run or dvc add) by hand. You can find more
information present in [this](https://dvc.org/doc/user-guide/dvc-files-and-directories#dvc-files-and-directories) doc.
