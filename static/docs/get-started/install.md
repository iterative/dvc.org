# Install

There are three ways to install DVC: `pip`, OS-specific package, and Homebrew
(depending on your OS some of these ways may be not available for you).

To install DVC from terminal, run:

```dvc
$ pip install dvc
```

> Depending on the [remote storage](/doc/commands-reference/remote) type you
> plan to use to keep and share your data, you might need to specify one of the
> optional dependencies: `s3`, `gs`, `azure`, `ssh`. Or `all_remotes` to include
> them all. The command should look like this: `pip install 'dvc[s3]'` - it
> installs the `boto3` library along with DVC to support the AWS S3 storage.
> This is valid for `pip install` option only. Other ways to install DVC already
> include support for all remotes.

As an easier option, self-contained binary packages are also available. Use the
Download button in the [home page](/) to the left or get them
[here](https://github.com/iterative/dvc/releases/). We also provide `deb`, `rpm`
and `homebrew` repositories:

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

### Expand to install from pkg installer (Mac OS)

Click the `Download` button on the main page and download `.pkg` to install it.
Alternatively, you can always find the latest version of this installer
[here](https://github.com/iterative/dvc/releases).

</details>

<details>

### Expand to install using installer (Windows)

If you have any problems with `pip install`, click the `Download` button on the
main page and download `.exe` to install DVC. Alternatively, you can always find
the latest version of this binary installer here:
[here](https://github.com/iterative/dvc/releases).

</details>

See [Development](/doc/user-guide/development) if you want to install the most
recent development version.

### Shell autocomplete

Visit [Shell Autocomplete](/doc/user-guide/autocomplete) section to find and
install the completion scripts for your shell.

### Editors and IDEs integration

Visit [Vim and IDE Integrations](/doc/user-guide/plugins) for reference on how
to enable shell syntax highlighting and install DVC support for different IDEs.
