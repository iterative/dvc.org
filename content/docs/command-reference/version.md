# version

Display the DVC version along with environment and project information.

## Synopsis

```usage
usage: dvc version [-h] [-q | -v]
```

## Description

`dvc version` outputs the following information about the system/environment:

| Line                                        | Detail                                                                                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`DVC version`](#components-of-dvc-version) | Version of DVC, and name of the binary or package manager (`pip`, `conda`, etc.) used to install DVC (along with a Git commit hash in case of a development version) |
| `Platform`                                  | Version of Python in the environment where DVC is initialized, and information about the operating system                                                            |
| `Supports`                                  | Types of [remote storage](/doc/command-reference/remote/add#supported-storage-types) supported by the current DVC setup (their required dependencies are installed)  |
| `Cache types`                               | [Types of links](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache) supported (between <abbr>workspace</abbr> and <abbr>cache</abbr>)     |
| `Cache directory`                           | Filesystem type (e.g. ext4, FAT, etc.) and drive on which the <abbr>cache</abbr> directory is mounted                                                                |
| `Caches`                                    | Cache [location types](/doc/user-guide/managing-external-data) configured in the repo (e.g. local, SSH, S3, etc.)                                                    |
| `Remotes`                                   | Remote [location types](/doc/command-reference/remote/add#supported-storage-types) configured in the repo (e.g. SSH, S3, Google Drive, etc.)                         |
| `Workspace directory`                       | Filesystem type (e.g. ext4, FAT, etc.) and drive on which the <abbr>workspace</abbr> is mounted                                                                      |
| `Repo`                                      | Shows whether we are in a DVC repo and/or Git repo                                                                                                                   |

> No info about `Cache` or `Workspace directory` is printed if `dvc version` is
> used outside a DVC project.

> Note that if you've installed DVC using `pip`, you will need to install
> `psutil` manually with `pip install psutil` in order for `dvc version` to
> report file system information. Please see the original
> [issue on GitHub](https://github.com/iterative/dvc/issues/2284) for more info.

### Components of DVC version

The detail of DVC version depends upon the way of installing DVC.

- **Official release**: a stable version of DVC (for example `1.10.0`), that can
  be [installed](/doc/install) using the official package stored in
  [Python Packaging Authority](https://www.pypa.io/) or with a binary. These
  releases are tagged in the DVC repository (see
  [changelog](https://github.com/iterative/dvc/releases) for release history).

  If there are any issues reported with the official build, they can be traced
  using the official version number.

- **Development version**: contains all the changes done to the `master` branch
  of DVC's repository, following the latest official release. It can be
  [installed](/doc/user-guide/contributing/core#development-environment) after
  cloning DVC's repo. Running this setup may result in usage issues, as it
  contains changes that might not be ready to release yet.

  Any errors reported with the development version can be traced using the Git
  commit hash displayed in the output of `dvc version`, for example:
  `1.10.0+292cab.mod`. The part before `+` is the official version number, and
  the following part is the commit hash of the tip of the `master` branch. The
  optional suffix `.mod` means that code is modified.

- **Binary or Package manager**: shows how DVC was downloaded and
  [installed](/doc/install).

  DVC can be installed from one of the binary releases:

  - Debian package (`.deb`) - file used to install packages in several Linux
    distributions, like Ubuntu
  - Red Hat package (`.rpm`) - file used to install packages in some Linux based
    distributions, such as Fedora, CentOS, etc.
  - PKG file (`.pkg`) - file used to install apps on MacOS
  - Windows executable (`.exe`) - file used to install applications on Windows

  These downloads are available from our [home page](/). They ultimately contain
  a binary bundle, which is the executable file of a software application,
  meaning that it will run natively on a specific platform (Linux, Windows,
  MacOS).

  > We use [PyInstaller](https://pythonhosted.org/PyInstaller/) to bundle our
  > source code into the binary package app.

  DVC can also be downloaded and installed using a package manager:

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

DVC version: 1.10.0 (pip)
---------------------------------
Platform: Python 3.8.3 on Linux-5.4.0-47-generic-x86_64-with-debian-buster-sid
Supports: gs, hdfs, http, https, s3
Cache types: hardlink, symlink
Cache directory: ext4 on /dev/sda1
Caches: local
Remotes: https, s3, ssh
Workspace directory: ext4 on /dev/sda1
Repo: dvc, git
```

Outside a DVC project:

```dvc
$ dvc version

DVC version: 1.10.0 (pip)
---------------------------------
Platform: Python 3.8.3 on Linux-5.4.0-47-generic-x86_64-with-debian-buster-sid
Supports: All remotes
```
