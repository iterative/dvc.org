# Install

There are three recommended ways to install DVC: OS-specific package/installer,
`pip`, and Homebrew. (Depending on your OS, some of these may be not available.)

To install DVC from terminal, run:

```dvc
$ pip install dvc
```

> Depending on the [remote storage](/doc/commands-reference/remote) type you
> plan to use to keep and share your data, you might need to specify one of the
> optional dependencies: `s3`, `gs`, `azure`, `ssh`. Or `all_remotes` to include
> them all. The command should look like this: `pip install "dvc[s3]"` - it
> installs the `boto3` library along with DVC to support the AWS S3 storage.
> This is valid for `pip install` option only. Other ways to install DVC already
> include support for all remotes.

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

To install the most recent development version, See our
[development](/doc/user-guide/development) guide.

### Shell autocomplete

Visit the [Shell Autocomplete](/doc/user-guide/autocomplete) guide to learn how
to install the completion scripts for your command-line shell.

### Editors and IDEs integration

Visit [Vim and IDE Integrations](/doc/user-guide/plugins) for how to enable
shell syntax highlighting and install DVC support on different IDEs.
