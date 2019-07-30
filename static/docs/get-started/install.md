# Install

There are three recommended ways to install DVC: OS-specific package/installer,
`pip`, and Homebrew. (Depending on your OS, some of these may be not available.)

To install DVC from terminal, run:

```dvc
$ pip install dvc
```

> If you installed DVC via `pip`, depending on the
> [remote](/doc/commands-reference/remote) type you plan to use you might need
> to install optional dependencies: `[s3]`, `[ssh]`, `[gs]`, `[azure]`, and
> `[oss]`; or `[all]` to include them all. The command should look like this:
> `pip install "dvc[s3]"` - it installs `boto3` library along with DVC to
> support AWS S3 storage.

The easiest option, self-contained binary packages (or Windows installer), are
available by using the big "Download" button in the [home page](/). You may also
get them [here](https://github.com/iterative/dvc/releases/).

We also provide `deb`, `rpm` and `homebrew` repositories:

<details>

### Expand to install from deb repository (Ubuntu, Debian)

```dvc
$ sudo wget https://dvc.org/deb/dvc.list -O /etc/apt/sources.list.d/dvc.list
$ sudo apt-get update
$ sudo apt-get install dvc
```

</details>

<details>

### Expand to install from rpm repository (Fedora, CentOS)

```dvc
$ sudo wget https://dvc.org/rpm/dvc.repo -O /etc/yum.repos.d/dvc.repo
$ sudo yum update
$ sudo yum install dvc
```

</details>

<details>

### Expand to install via Homebrew (Mac OS)

```dvc
$ brew install iterative/homebrew-dvc/dvc
```

or:

```dvc
$ brew cask install iterative/homebrew-dvc/dvc
```

</details>

<details>

### Expand to install via conda package manager (Anaconda)

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only python version 2.7 and 3.6.

</details>

To install the most recent development version, See our
[development](/doc/user-guide/development) guide.

### Shell autocomplete

Visit the [Shell Autocomplete](/doc/user-guide/autocomplete) guide to learn how
to install the completion scripts for your command-line shell.

### Editors and IDEs integration

Visit [Vim and IDE Integrations](/doc/user-guide/plugins) for how to enable
shell syntax highlighting and install DVC support on different IDEs.
