# Installation on Windows

> 💡 Please review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience using DVC on Windows.

> To use DVC [as a Python library](/doc/api-reference), please
> [install with pip](#install-with-pip) or [with conda](#install-with-conda).

## Install with choco

The easiest way to install from command line for most cases is to install
[Chocolatey](https://chocolatey.org/) on your machine, and use the `choco`
command:

```dvc
$ choco install dvc
```

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

You can use `conda` from
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win),
a POSIX-like command line terminal in Windows.

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports Python 3.6-3.8

## Install with pip

From Command Prompt or other
[recommended consoles](/doc/user-guide/running-dvc-on-windows):

```dvc
$ pip install dvc
```

Depending on the type of the [remote storage](/doc/command-reference/remote) you
plan to use, you might need to install optional dependencies: `[s3]`, `[azure]`,
`[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them all.

<details>

### Example: How to install DVC with support for Amazon S3 storage

```dvc
$ pip install "dvc[s3]"
```

In this case it installs `boto3` library as well, besides DVC.

</details>

## Windows installer

An easy way is to use the self-contained, executable installer (binary), which
is available from the big "Download" button on the [home page](/). You can also
get it from the [release page](https://github.com/iterative/dvc/releases/) on
GitHub.

You'll need to download and run the installer again each time you want to update
DVC. You may use Windows Uninstaller to
[remove the program](https://support.microsoft.com/en-us/help/4028054/windows-10-repair-or-remove-programs).

> Note that this method by default enables symlink permissions for all users, so
> they can use them to
> [optimize DVC](/doc/user-guide/large-dataset-optimization) operations.
