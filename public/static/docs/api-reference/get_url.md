# dvc.api.get_url()

Returns the URL to the storage location of a data file or directory tracked by
DVC.

## Usage

```py
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry')

# resource_url =
# https://remote.dvc.org/dataset-registry/a3/04af...
```

### Signature

```py
get_url(path, repo=None, rev=None, remote=None)
```

### Types

All **parameter** types as well as the **return** type are
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str).

Raises `UrlNotDvcRepoError` if `repo` is not a <abbr>DVC repository</abbr>.

## Description

Returns the full URL to the physical location (in a
[DVC remote](/doc/command-reference/remote)) where a target file or directory
(<abbr>artifact</abbr>), specified by its `path` in a `repo` (<abbr>DVC
project</abbr>), is stored. The URL is formed by reading the corresponding
[DVC-file](/doc/user-guide/dvc-file-format) (see [Examples](#examples) below) as
well as the project's
[default remote](https://dvc.org/doc/command-reference/remote/default).

The URL schema returned depends on the type of `remote`. Here's a full list of
[supported remote types](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).

⚠️ This function does not check for the actual existence of the target data in
the remote storage.

💡 Having the resource's URL, it should be possible to download it directly with
an appropriate library, such as
[`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Object.download_fileobj)
or
[`paramiko`](https://docs.paramiko.org/en/stable/api/sftp.html#paramiko.sftp_client.SFTPClient.get).

Note that if the target is a directory, the URL will end in `.dir`, as DVC
stores a special JSON file with `.dir` extension that contains the mapping of
files in the directory (as a JSON array), along with their hash values. Refer to
[Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
and `dvc add` to learn more about how DVC handles data directories.

## Parameters

- **`path`** - specifies the location of the target data within the source
  project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. If not supplied,
  defaults to the current DVC project. It can be a URL or a file system path.
  Both HTTP and SSH protocols are supported for online Git repos (e.g.
  `[user@]server:project.git`).

  A `dvc.api.UrlNotDvcRepoError` is raised if `repo` is not a valid DVC project.

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If not supplied, it uses the default
  Git revision, `HEAD`. If `repo` is a Git repo, this option is ignored.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to look for
  the target data. If not supplied, the cache directory is tried first for local
  projects; The default remote of `repo` is tried otherwise.

  A `dvc.exceptions.NoRemoteError` is raised if no `remote` is found.

## Examples

```py
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
    )
```

The value of `resource_url` in this case would result in:

`https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355`

This URL represents the physical location of the data, and is built by reading
the corresponding DVC-file
([`get-started/data.xml.dvc`](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc))
where the `md5` file hash is stored,

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: get-started/data.xml
```

and the project configuration
([`.dvc/config`](https://github.com/iterative/dataset-registry/blob/master/.dvc/config))
where the remote URL is saved:

```dvc
['remote "storage"']
url = https://remote.dvc.org/dataset-registry
```
