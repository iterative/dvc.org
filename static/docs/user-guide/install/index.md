# Install

There are a few ways to install DVC: using `pip` or `conda`, which are system
agnostic, and using packages/installers for specific systems.

> It may happen that you install DVC first for testing and then try to install
> it again via a different way. This may cause any conflicts or confusion. So,
> before trying to install it, make sure that it is not already installed, using
> a command like: `which dvc`.

## Install with pip

```dvc
$ pip install dvc
```

Depending on the type of the
[remote storage](/doc/user-guide/external-dependencies) you plan to use you
might need to install optional dependencies: `[s3]`, `[ssh]`, `[gs]`, `[azure]`,
and `[oss]`. Use `[all]` to include them all.

<details>

### Example: How to install DVC with support for Amazon S3 storage

```dvc
$ pip install 'dvc[s3]'
```

In this case it installs `boto3` library as well, besides DVC.

</details>

> It is recommended to install
> [shell autocompletion](/doc/user-guide/install/completion) scripts as well.
>
> Check out some other [plugins](/doc/user-guide/install/plugins) that might be
> useful too.

## Install with conda

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

## Alternative installation ways

- [Install on Mac OS](/doc/user-guide/install/mac)

- [Install on Windows](/doc/user-guide/install/win)

- Install on Linux

  - [DEB package (Ubuntu, Debian)](/doc/user-guide/install/deb)

  - [RPM package (Fedora, CentOS)](/doc/user-guide/install/rpm)

  - [Install on Arch Linux](/doc/user-guide/install/arch)

- [Install for testing and development](/doc/user-guide/install/dev)
