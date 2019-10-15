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

> It is recommended to install [shell autocompletion](install/completion)
> scripts as well.
>
> Check out some other [plugins](install/plugins) that might be useful too.

## Install with conda

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

## Alternative installation ways

- [Install on Mac OS](install/mac)

- [Install on Windows](install/win)

- Install on Linux

  - [DEB package (Ubuntu, Debian)](install/deb)

  - [RPM package (Fedora, CentOS)](install/rpm)

  - [Install on Arch Linux](install/arch)

- [Install for testing and development](install/dev)
