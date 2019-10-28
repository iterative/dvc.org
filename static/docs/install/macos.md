# Installation on MacOS

## Install with brew

Recommended. Requires [Homebrew](https://brew.sh/).

```dvc
$ brew install dvc
```

## Install from package

Get the PKG package (binary) from the big "Download" button on the
[home page](/), or from the
[release page](https://github.com/iterative/dvc/releases/) on GitHub.

> You may try [these instructions](https://stackoverflow.com/a/27546100/761963)
> to uninstall a MacOS package.

## Install with pip

> It's highly recommended using
> [virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> or
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.6+) to encapsulate your local environment.

```dvc
$ pip install dvc
```

Depending on the type of the
[remote storage](/doc/user-guide/external-dependencies) you plan to use, you
might need to install optional dependencies: `[s3]`, `[ssh]`, `[gs]`, `[azure]`,
and `[oss]`. Use `[all]` to include them all.

<details>

### Example: How to install DVC with support for Amazon S3 storage

```dvc
$ pip install 'dvc[s3]'
```

In this case it installs `boto3` library as well, besides DVC.

</details>

> To uninstall, use
> [`pip uninstall`](https://pip.pypa.io/en/stable/reference/pip_uninstall/)

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.htm) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

> To uninstall, use
> [`conda remove`](https://docs.conda.io/projects/conda/en/latest/commands/remove.html)
