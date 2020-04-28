# Installation on Windows

> 💡 Please review
> [Running DVC on Windows](/doc/user-guide/running-dvc-on-windows) for important
> tips to improve your experience using DVC on Windows.

> To use DVC [as a Python library](/doc/api-reference), please
> [install with pip](#install-with-pip) or [with conda](#install-with-conda).

## Windows installer

The easiest way is to use the self-contained, executable installer (binary),
which is available from the big "Download" button on the [home page](/). You can
also get it from the [release page](https://github.com/iterative/dvc/releases/)
on GitHub.

> You may use Windows Uninstaller to
> [remove the program](https://support.microsoft.com/en-us/help/4028054/windows-10-repair-or-remove-programs).

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

You can use `conda` from
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win),
a POSIX-like command line terminal in Windows.

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports Python 3.5-3.7

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
