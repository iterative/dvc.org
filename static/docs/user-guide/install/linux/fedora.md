# Installation on Fedora and CentOS

## Install with pip

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

## Install with conda

> Requires [Anaconda Distribution](https://docs.anaconda.com/anaconda/).

```dvc
$ conda install -c conda-forge dvc
```

> Currently, it supports only Python versions 2.7, 3.6, and 3.7.

## Install from repo

```dvc
$ sudo wget \
       https://dvc.org/rpm/dvc.repo \
       -O /etc/yum.repos.d/dvc.repo

$ sudo yum update

$ sudo yum install dvc
```

## Install from package

Get the RPM package (binary) from the big "Download" button on the
[home page](/), or from the
[release page](https://github.com/iterative/dvc/releases/) on GitHub. Then
install it like this:

```dvc
$ sudo yum install dvc-0.62.1-1.x86_64.rpm
```
