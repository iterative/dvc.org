# Installation on macOS

> To use DVC [as a Python library](/doc/api-reference), please
> [install with pip](#install-with-pip) or [with conda](#install-with-conda).

## Install with brew

Recommended. Requires [Homebrew](https://brew.sh/).

```dvc
$ brew install dvc
```

## Install from package

Get the PKG (binary) from the big "Download" button on the [home page](/), or
from the [release page](https://github.com/iterative/dvc/releases/) on GitHub.

> Note that currently, in order to open the PKG file, you must go to the
> **Downloads** directory in Finder and do a
> [secondary click](https://support.apple.com/en-us/HT207700) on it, then select
> "Open With" > **Installer.app**, and click the **Open** button.

> You may try [these instructions](https://stackoverflow.com/a/42120328/761963)
> to uninstall the macOS package.

## Install with pip

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.7+) to encapsulate your local environment.

```dvc
$ pip install dvc
```

Depending on the type of the [remote storage](/doc/command-reference/remote) you
plan to use, you might need to install optional dependencies: `[s3]`, `[azure]`,
`[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them all.

<details>

### Example: with support for Amazon S3 storage

```dvc
$ pip install "dvc[s3]"
```

In this case it installs the `boto3` library along with DVC.

</details>

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

```dvc
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc
```

Depending on the type of the [remote storage](/doc/command-reference/remote) you
plan to use, you might need to install optional dependencies: `dvc-s3`,
`dvc-azure`, `dvc-gdrive`, `dvc-gs`, `dvc-oss`, `dvc-ssh`.

<details>

### Example: with support for Amazon S3 storage

```dvc
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc-s3
```

In this case it installs the `boto3` library along with DVC.

</details>
