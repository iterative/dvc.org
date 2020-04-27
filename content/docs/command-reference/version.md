# version

Display the DVC version and system/environment information.

## Synopsis

```usage
usage: dvc version [-h] [-q | -v]
```

## Description

`dvc version` outputs the following information about the system/environment:

| Line                                        | Detail                                                                                                                                                                |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`DVC version`](#components-of-dvc-version) | Version of DVC (along with a Git commit hash in case of a development version)                                                                                        |
| `Python version`                            | Version of Python used in the environment where DVC is initialized                                                                                                    |
| `Platform`                                  | Information about the operating system of the machine                                                                                                                 |
| [`Binary`](#what-we-mean-by-binary)         | Shows whether DVC was installed from a package or from a binary release                                                                                               |
| `Package`                                   | Name of the package manager used to install DVC if any (`pip`, `conda`, etc)                                                                                          |
| `Supported remotes`                         | Remote types that have all needed dependencies installed for                                                                                                          |
| `Cache`                                     | [Type of links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache) supported between the <abbr>workspace</abbr> and the <abbr>cache</abbr> |
| `Filesystem type`                           | Shows the filesystem type (eg. ext4, FAT, etc.) and mount point of the cache and <abbr>workspace</abbr> directories                                                   |
| `Repo`                                      | Shows whether we are in a DVC repo and/or Git repo                                                                                                                    |

> If `dvc version` is executed outside a DVC project, no `Cache` is output and
> the `Filesystem type` output is of the current working directory.

> Note that if you've installed DVC using `pip`, you will need to install
> `psutil` manually with `pip install psutil` in order for `dvc version` to
> report file system information. Please see the original
> [issue on GitHub](https://github.com/iterative/dvc/issues/2284) for more info.

### Components of DVC version

The detail of DVC version depends upon the way of installing DVC.

- **Official release**: [These instructions](/doc/install) include ways to
  install DVC using the official package stored in Python Packaging Authority.
  We mark these official releases with tags on DVC's repository. Any issues
  reported with the official build can be traced using the `_BASE_VERSION`
  constant
  [in our core repo](https://github.com/iterative/dvc/blob/master/dvc/version.py).
  For example `0.40.2`.

- **Development version**: `pip install git+git://github.com/iterative/dvc` will
  install DVC using the `master` branch of DVC's repository. Another way of
  setting up the development version is to clone the repository and run
  `pip install .`. The master branch is continuously being updated with changes
  that might not be ready to publish yet. Therefore installing using the above
  command might have issues regarding its usage. So to trace any error reported
  with this setup, we need to know exactly which version is being used. For this
  we rely on a Git commit hash, that is displayed in this command's output like
  this: `0.40.2+292cab.mod`. The part before `+` is the `_BASE_VERSION`, and the
  following part is the SHA of the tip of the `master` branch. The optional
  suffix `.mod` means that code is modified.

### What we mean by "Binary"

The detail of `Binary` depends on the way DVC was downloaded and
[installed](/doc/install).

- **`Binary: True`** - displayed when DVC is downloaded/installed as one of:

  - Debian package (`.deb`) - file used to install packages in several Linux
    distributions, like Ubuntu
  - Red Hat package (`.rpm`) - file used to install packages in some Linux based
    distributions, such as Fedora, CentOS, etc.
  - PKG file (`.pkg`) - file used to install apps on MacOS
  - Windows executable (`.exe`) - file used to install applications on Windows

  These downloads are available from our [home page](/). They ultimately contain
  a binary bundle, which is the executable file of a software application,
  meaning that it will run natively on a specific platform (Linux, Windows,
  MacOS). In our case, we use
  [PyInstaller](https://pythonhosted.org/PyInstaller/) to bundle our source code
  into the binary package app.

- **`Binary: False`** - shown when DVC is downloaded and installed from:

  - [DVC's GitHub repository](https://github.com/iterative/dvc) - where core
    source code is hosted
  - [The Python Package Index (PyPI)](https://pypi.org/project/dvc/) - source
    code is stored as a Python package
  - [Homebrew package manager](https://formulae.brew.sh/formula/dvc) (for MacOS
    systems) - source code is stored as Python package

  This method of installation involves downloading DVC source code, and
  following certain setup instructions (see the
  [development](/doc/install/pre-release) guide) to build the application before
  being able to it.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Getting the DVC version and environment information:

Inside a DVC project:

```dvc
$ dvc version

DVC version: 0.41.3+f36162
Python version: 3.7.1
Platform: Linux-4.15.0-50-generic-x86_64-with-debian-buster-sid
Binary: False
Cache: reflink - False, hardlink - True, symlink - True
Supported remotes: azure, gdrive, gs, hdfs, http, https, s3, ssh, oss
Filesystem type (cache directory): ('ext4', '/dev/sdb3')
Repo: dvc, git
Filesystem type (workspace): ('ext4', '/dev/sdb3')
```

Outside a DVC project:

```dvc
$ dvc version

DVC version: 0.41.3+f36162
Python version: 3.7.1
Platform: Linux-4.15.0-50-generic-x86_64-with-debian-buster-sid
Binary: False
Supported remotes: azure, gdrive, gs, hdfs, http, https, s3, ssh, oss
Filesystem type (workspace): ('ext4', '/dev/sdb3')
```
