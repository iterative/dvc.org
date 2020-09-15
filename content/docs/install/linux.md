# Installation on Linux

> To use DVC [as a Python library](/doc/api-reference), please
> [install with pip](#install-with-pip) or [with conda](#install-with-conda).

## Install with pip

> We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> (on Python 3.6+) to encapsulate your local environment.

```dvc
$ pip install dvc
```

Depending on the type of the [remote storage](/doc/command-reference/remote) you
plan to use, you might need to install optional dependencies: `[s3]`, `[azure]`,
`[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Use `[all]` to include them all.

> Please restart your terminal or re-source the shell configuration file
> (`.bashrc`, `.zshrc`, etc.) if you get `Command 'dvc' not found` after
> installation. If restarting the terminal isn't desirable (e.g. containers),
> it's also possible to manually edit the `PATH` env variable.

<details>

### Example: How to install DVC with support for Amazon S3 storage

```dvc
$ pip install "dvc[s3]"
```

In this case it installs `boto3` library as well, besides DVC.

</details>

## Install with conda

> Requires [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or
> [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports Python 3.6-3.8

## Install with snap

> Requires [snapd](https://snapcraft.io/docs/installing-snapd).

```dvc
$ snap install --classic dvc
```

Add `--beta` for the latest tagged release candidate, or `--edge` for the latest
`master` version.

> 💡 When connected to the internet, `snap` will automatically look for updates
> every 6 hours.

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
