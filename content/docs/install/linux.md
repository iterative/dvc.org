# Installation on Linux

> To use DVC [as a Python library](/doc/api-reference), please
> [install with pip](#install-with-pip) or [with conda](#install-with-conda).

## Install with pip

> 💡 We **strongly** recommend creating a
> [virtual environment](https://python.readthedocs.io/en/stable/library/venv.html)
> or using
> [pipx](https://packaging.python.org/guides/installing-stand-alone-command-line-tools/)
> to encapsulate your local environment.

> ⚠️ Note that Python 3.7+ is needed to get the latest version of DVC.

```dvc
$ pip install dvc
```

Depending on the type of the [remote storage](/doc/command-reference/remote) you
plan to use, you might need to install optional dependencies: `[s3]`,
`[gdrive]`, `[gs]`, `[azure]`, `[ssh]`, `[hdfs]`, `[webdav]`, `[oss]`. Use
`[all]` to include them all.

<details>

### Example: with support for Amazon S3 storage

```dvc
$ pip install "dvc[s3]"
```

In this case it installs the `boto3` library along with DVC.

</details>

> Please restart your terminal or re-source the shell configuration file
> (`.bashrc`, `.zshrc`, etc.) if you get `Command 'dvc' not found` after
> installation. If restarting the terminal isn't desirable (e.g. containers),
> it's also possible to manually edit the `PATH` env variable.

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
$ conda install -c conda-forge mamba
$ mamba install -c conda-forge dvc-s3
```

In this case it installs the `boto3` library along with DVC.

</details>

## Install with snap

> Requires [snapd](https://snapcraft.io/docs/installing-snapd).

```dvc
$ snap install --classic dvc
```

> 💡 When connected to the internet, `snap` will automatically look for updates
> every 6 hours.

## Install from repository

<details>

### On Debian/Ubuntu

```dvc
$ sudo wget \
       https://dvc.org/deb/dvc.list \
       -O /etc/apt/sources.list.d/dvc.list
$ wget -qO - https://dvc.org/deb/iterative.asc | sudo apt-key add -
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
$ sudo rpm --import https://dvc.org/rpm/iterative.asc
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
