# Installation on Windows

## Install from exe

The easiest way is to use the self-contained Windows installer, which is
available from the big "Download" button on the [home page](/). You can also get
it from the [release page](https://github.com/iterative/dvc/releases/) on
GitHub.

## Install with conda

You can install with `conda` from
[Anaconda Prompt](https://docs.anaconda.com/anaconda/user-guide/getting-started/#open-prompt-win),
which is a POSIX-like command line terminal in Windows.

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

## Install with pip

You can install with `pip` from a command line terminal like
[Git Bash](https://gitforwindows.org/#bash) or
[WSL](https://blogs.windows.com/windowsdeveloper/2016/03/30/run-bash-on-ubuntu-on-windows/).

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
