# Installation on Windows

<admon type="tip">

To use DVC [as a Python library](/api-reference), you can install it
[with `conda`](#install-with-conda) or [with `pip`](#install-with-pip).

</admon>

<admon type="tip">

See [Running DVC on Windows](/user-guide/how-to/run-dvc-on-windows) for
important tips to improve your experience on Windows.

</admon>

## Install with winget

Install
[winget](https://learn.microsoft.com/en-us/windows/package-manager/winget/) if
you don't have it. Then run the following command in command prompt or
Powershell.

```cli
$ winget install --id Iterative.DVC
```

### Install with choco

You can also use [Chocolatey](https://chocolatey.org) to install dvc.

```cli
$ choco install dvc
```

## Install with scoop

Install dvc using [scoop](https://scoop.sh/):

```cli
$ scoop install dvc
```

## Install with conda

<admon type="info">

Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
[Anaconda Distribution](https://www.anaconda.com/docs/getting-started/anaconda/main).

</admon>

You can use `conda` from
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win),
a POSIX-like command line terminal in Windows.

```cli
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc
```

Depending on the type of the [remote storage] you plan to use, you might need to
install optional dependencies: `dvc-s3`, `dvc-azure`, `dvc-gdrive`, `dvc-gs`,
`dvc-oss`, `dvc-ssh`.

[remote storage]: /user-guide/data-management/remote-storage

<details id="example-conda-with-support-for-amazon-s3-storage">

### Example: with support for Amazon S3 storage

```cli
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc-s3
```

In this case it installs the `boto3` library along with DVC.

</details>

## Install with pip

<admon type="tip">

We **strongly** recommend creating a
[virtual environment](https://docs.python.org/3/library/venv.html) or using
[pipx](https://packaging.python.org/en/latest/guides/installing-stand-alone-command-line-tools/)
to encapsulate your local environment.

</admon>

<admon type="info">

Note that Python 3.8+ is needed to get the latest version of DVC.

</admon>

```cli
$ pip install dvc
```

Depending on the type of the [remote storage] you plan to use, you might need to
install optional dependencies: `[s3]`, `[azure]`, `[gdrive]`, `[gs]`, `[oss]`,
`[ssh]`. Use `[all]` to include them all.

<details id="example-pip-with-support-for-amazon-s3-storage">

### Example: with support for Amazon S3 storage

```cli
$ pip install "dvc[s3]"
```

In this case it installs the `boto3` library along with DVC.

</details>

## Windows installer

A quick way is to use the self-contained, executable installer (binary), which
is available from the big "Download" button on the [home page](/).

You'll need to download and run the installer again each time you want to update
DVC. You may use Windows Uninstaller to
[remove the program](https://support.microsoft.com/en-us/windows/repair-apps-and-programs-in-windows-e90eefe4-d0a2-7c1b-dd59-949a9030f317).

> Note that this method by default enables symlink permissions for all users, so
> they can use them to
> [optimize DVC](/user-guide/data-management/large-dataset-optimization)
> operations.
