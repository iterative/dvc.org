# Install

There are three ways to install DVC: `pip`, OS-specific package, and Homebrew
(depending on your OS some of these ways may be not available for you).

Too install DVC from terminal, run:

```dvc
    $ pip install dvc
```

> Depending on the [remote storage](/doc/commands-reference/remote) type you
plan to use to keep and share your data, you might need to specify one of the
optional dependencies: `s3`, `gs`, `azure`, `ssh`. Or `all_remotes` to include
them all. The command should look like this: `pip install dvc[s3]` - it installs
the `boto3` library along with DVC to support the AWS S3 storage. This is valid
for `pip install` option only. Other ways to install DVC already include support
for all remotes.

As an easier option, self-contained binary packages are also available. Use the
Download button in the [home page](https://dvc.org/) to the left or get them
[here](https://github.com/iterative/dvc/releases/). We also provide `deb`, `rpm`
and `homebrew` repositories:

<details>

### Expand to install from deb repository (Ubuntu, Debian)

```dvc
    $ wget https://dvc.org/deb/dvc.list
    $ sudo cp dvc.list /etc/apt/sources.list.d/
    $ sudo apt-get update
    $ sudo apt-get install dvc
```

</details>


<details>

### Expand to install from rpm repository (Fedora, CentOS)

```dvc
    $ wget https://dvc.org/rpm/dvc.repo
    $ sudo cp dvc.repo /etc/yum.repos.d/
    $ sudo dnf update
    $ sudo dnf install dvc
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

See [Development](/doc/user-guide/development) if you want to install the most
recent development version.


### Shell autocomplete

Visit [Shell Autocomplete](/doc/user-guide/autocomplete) section to find and
install the completion scripts for your shell.

### Editors and IDEs integration

Visit [Vim and IDE Integrations](/doc/user-guide/plugins) for reference on how
to enable shell syntax highlighting and install DVC support for different IDEs.
