---
name: 'Remote Storage'
match:
  [
    'DVC remote',
    'DVC remotes',
    'remote',
    'remote storage',
    'data remote',
    'data remotes',
  ]
tooltip: >-
  [DVC remotes](/doc/user-guide/glossary/remote-storage) provide a location to
  store and share data and models. You can pull data assets created by
  colleagues from DVC remotes without spending time and resources to build or
  process them locally. Remote storage can also save space on your local
  environment.
---

# Remote Storage

<!-- _from `dvc remote`_ -->

The same way as GitHub provides storage hosting for Git repositories, DVC
remotes provide a location to store and share data and models. You can pull data
assets created by colleagues from DVC remotes without spending time and
resources to build or process them locally.

Remote storage can also save space on your local environment – DVC can
[fetch](/doc/command-reference/fetch) into the <abbr>cache directory</abbr> only
the data you need for a specific branch/commit.

> DVC remotes are **not** Git remotes. They are cache backups, not distributed
> copies of the <abbr>DVC project</abbr>.

Using DVC with remote storage is optional. DVC commands use the local
<abbr>cache</abbr> (usually in dir `.dvc/cache`) as data storage by default.
This enables the main DVC usage scenarios out of the box.

<!-- cache/remote/workspace relationship #53-->

## Types of remote storage

DVC supports several types of remote storage: local file system, SSH, Amazon S3,
Google Cloud Storage, HTTP, HDFS, among others. Refer to `dvc remote add` for
more details.

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to
> include them all. The command should look like this: `pip install "dvc[s3]"`.
> (This example installs `boto3` library along with DVC to support S3 storage.)
