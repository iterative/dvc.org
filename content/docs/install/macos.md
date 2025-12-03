# Installation on macOS

<admon type="tip">

To use DVC [as a Python library](/api-reference), you can install it
[with `pip`](#install-with-pip) or [with `conda`](#install-with-conda).

</admon>

<admon type="warn">

To use DVC on ARM (Apple Silicon) macOS, you must install
[with homebrew](#install-with-homebrew) or [with `pip`](#install-with-pip). The
PKG binary and `conda` installation methods can only be used on x86 (Intel)
macOS.

</admon>

## Install with brew

Recommended. Requires [Homebrew](https://brew.sh/).

```cli
$ brew install dvc
```

## Install from package

Get the PKG (binary) from the big "Download" button on the
[home page](https://dvc.org).

> Note that currently, in order to open the PKG file, you must go to the
> **Downloads** directory in Finder and do a
> [secondary click](https://support.apple.com/guide/mac-help/right-click-mh35853/mac)
> on it, then select "Open With" > **Installer.app**, and click the **Open**
> button.

> You may try
> [these instructions](https://stackoverflow.com/questions/25925752/uninstall-packages-in-mac-os-x/42120328#42120328)
> to uninstall the macOS package.

## Install with pip

<admon type="tip">

We **strongly** recommend creating a
[virtual environment](https://docs.python.org/3/library/venv.html) or using
[pipx](https://packaging.python.org/en/latest/guides/installing-stand-alone-command-line-tools/)
to encapsulate your local environment.

</admon>

<admon type="info">

Note that Python 3.9+ is needed to get the latest version of DVC.

</admon>

```cli
$ pip install dvc
```

Depending on the type of the [remote storage] you plan to use, you might need to
install optional dependencies: `[s3]`, `[gdrive]`, `[gs]`, `[azure]`, `[ssh]`,
`[hdfs]`, `[webdav]`, `[oss]`. Use `[all]` to include them all.

[remote storage]: /user-guide/data-management/remote-storage

<details id="example-pip-with-support-for-amazon-s3-storage">

### Example: with support for Amazon S3 storage

```cli
$ pip install "dvc[s3]"
```

In this case it installs the `boto3` library along with DVC.

</details>

## Install with conda

<admon type="info">

Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
[Anaconda Distribution](https://www.anaconda.com/docs/getting-started/anaconda/main).

</admon>

```cli
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc
```

Depending on the type of the [remote storage] you plan to use, you might need to
install optional dependencies: `dvc-s3`, `dvc-azure`, `dvc-gdrive`, `dvc-gs`,
`dvc-oss`, `dvc-ssh`.

<details id="example-conda-with-support-for-amazon-s3-storage">

### Example: with support for Amazon S3 storage

```cli
$ conda install -c conda-forge mamba # installs much faster than conda
$ mamba install -c conda-forge dvc-s3
```

In this case it installs the `boto3` library along with DVC.

</details>
