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

| Type                                        | Detail                                                                                                                                                    |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`DVC version`](#components-of-dvc-version) | Version of DVC (along with a Git commit hash in case of a development version)                                                                            |
| `Python version`                            | Version of the Python being used for the project in which DVC is initialized                                                                              |
| `Platform`                                  | Information about the operating system of the machine                                                                                                     |
| [`Binary`](#what-we-mean-by-binary)         | Shows whether the package is installed from a binary release or source                                                                                    |
| `Cache`                                     | [Type of links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache) supported between the DVC workspace and the cache directory |
| `Filesystem type`                           | Shows the filesystem type (eg. ext4, FAT, etc.) and mount point of workspace and the cache directory                                                      |

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

#### What we mean by "Binary"

The detail of `Binary` depends on the way DVC was downloading and
[installed](/doc/get-started/install).

- **`Binary: True`** - displayed when DVC is downloaded/installed as one of:

  - Debian package (`.deb`) - file used to install packages in several Linux
    distributions, like Ubuntu.
  - Red Hat package (`.rpm`) - file used to install packages in some Linux based
    distributions, such as Fedora, CentOS, etc.
  - PKG file (`.pkg`) - file used to install apps on macOS.
  - Windows executable (`.exe`) - file used to install applications on Windows.

  These downloads are available from our [home page](/). They ultimately contain
  a binary bundle, which is the executable version of a software program,
  meaning that it will run natively on a specific platform (Linux, Windows,
  Mac). In our case, we use [PyInstaller](https://pythonhosted.org/PyInstaller/)
  to bundle our source code into the binary package app.

* **`Binary: False`** - shown when DVC is downloaded and installed from:

  - [DVC's GitHub repository](https://github.com/iterative/dvc) - where core
    source code is hosted.
  - [The Python Package Index (PyPI)](https://pypi.org/project/dvc/) - source
    code is stored as a Python package.
  - [Homebrew package manager](https://github.com/iterative/homebrew-dvc) (for
    macOS systems) - source code is stored as Python package.

  This method of installation involves downloading DVC source code, and
  following certain setup instructions (See the
  [development](/doc/user-guide/development) guide) to build the application
  before being able to it.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

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
