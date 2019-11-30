# Installation on Linux

## Install with pip

> It's highly recommended using
> [virtual environment](https://packaging.python.org/tutorials/installing-packages/#creating-virtual-environments)
> or
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.6+) to encapsulate your local environment.

```dvc
$ pip install dvc
```

Depending on the type of the [remote storage](/doc/user-guide/remotes) you plan
to use, you might need to install optional dependencies: `[s3]`, `[ssh]`,
`[gs]`, `[azure]`, and `[oss]`. Use `[all]` to include them all.

<details>

### Example: How to install DVC with support for Amazon S3 storage

```dvc
$ pip install 'dvc[s3]'
```

In this case it installs `boto3` library as well, besides DVC.

</details>

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

## Install from repository

<details>

### On Debian/Ubuntu

```dvc
$ sudo wget \
       https://dvc.org/deb/dvc.list \
       -O /etc/apt/sources.list.d/dvc.list
$ sudo apt update
$ sudo apt install dvc
```

</details>

<details>

### On Fedora/CentOS

```dvc
$ sudo wget \
       https://dvc.org/rpm/dvc.repo \
       -O /etc/yum.repos.d/dvc.repo
$ sudo yum update
$ sudo yum install dvc
```

</details>

## Install from package

Get the binary package from the big "Download" button on the [home page](/), or
from the [release page](https://github.com/iterative/dvc/releases/) on GitHub.
Then install it with the following command.

<details>

### On Debian/Ubuntu

```dvc
$ sudo apt install ./dvc_0.62.1_amd64.deb
```

</details>

<details>

### On Fedora/CentOS

```dvc
$ sudo yum install dvc-0.62.1-1.x86_64.rpm
```

</details>
