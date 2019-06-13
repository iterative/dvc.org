# version

This command shows the system/environment information along with the DVC
version.

## Synopsis

```usage
usage: dvc version [-h] [-q | -v]
```

## Description

Running the command `dvc version` outputs the following information about the
system/environment:

| Type              | Detail                                                                                                                                                    |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DVC version`     | Version of DVC (along with a Git commit hash in case of a development version)                                                                            |
| `Python version`  | Version of the Python being used for the project in which DVC is initialized                                                                              |
| `Platform`        | Information about the operating system of the machine                                                                                                     |
| `Binary`          | Shows whether the package is installed from a binary release or source                                                                                    |
| `Cache`           | [Type of links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache) supported between the DVC workspace and the cache directory |
| `Filesystem type` | Shows the filesystem type (eg. ext4, FAT, etc.) and mount point of workspace and the cache directory                                                      |

> If `dvc version` is executed outside a DVC workspace, the command outputs the
> filesystem type of the current working directory.

#### Components of DVC version

The detail of DVC version depends upon the way of installing the project.

- **Official release**: This [install guide](/doc/get-started/install) mentions
  ways to install DVC using the official package stored in Python Packaging
  Authority. We mark these official releases with tags on DVC's repository. Any
  issues reported with the official build can be traced using the `BASE_VERSION`
  itself. So the output is simply `0.40.2`.

- **Development version**: `pip install git+git://github.com/iterative/dvc` will
  install DVC using the `master` branch of DVC's repository. Another way of
  setting up the development version is to clone the repository and run
  `pip install .`. The master branch is continuously being updated with changes
  which might not be ready to publish yet. Therefore installing using the above
  command might have issues regarding its usage. So to trace any error reported
  with this setup, we need to know exactly which version is being used. For
  this, we rely on git commit hash which is displayed in output as
  `0.40.2+292cab.mod`. The part before `+` is the `BASE_VERSION` and the latter
  part is the git commit hash which is one of the commits in the `master` branch
  (also, optional suffix `.mod` means that code is modified).

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example

Getting the DVC version and environment information:

Inside a DVC workspace:

```dvc
$ dvc version

DVC version: 0.41.3+f36162
Python version: 3.7.1
Platform: Linux-4.15.0-50-generic-x86_64-with-debian-buster-sid
Binary: False
Cache: reflink - False, hardlink - True, symlink - True
Filesystem type (cache directory): ('ext4', '/dev/sdb3')
Filesystem type (workspace): ('ext4', '/dev/sdb3')
```

Outside a DVC workspace:

```dvc
$ dvc version

DVC version: 0.41.3+f36162
Python version: 3.7.1
Platform: Linux-4.15.0-50-generic-x86_64-with-debian-buster-sid
Binary: False
Filesystem type (workspace): ('ext4', '/dev/sdb3')
```
