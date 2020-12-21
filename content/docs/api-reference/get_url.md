# dvc.api.get_url()

Returns the URL to the storage location of a data file or directory tracked in a
<abbr>DVC project</abbr>.

```py
def get_url(path: str,
            repo: str = None,
            rev: str = None,
            remote: str = None) -> str
```

#### Usage:

```py
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry')

# resource_url is now "https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355"
```

## Description

Returns the URL string of the storage location (in a
[DVC remote](/doc/command-reference/remote)) where a target file or directory,
specified by its `path` in a `repo` (<abbr>DVC project</abbr>), is stored.

The URL is formed by reading the project's
[remote configuration](/doc/command-reference/config#remote) and the `dvc.yaml`
or `.dvc` file where the given `path` is found (`outs` field). The schema of the
URL returned depends on the
[type](/doc/command-reference/remote/add#supported-storage-types) of the
`remote` used (see the [Parameters](#parameters) section).

If the target is a directory, the returned URL will end in `.dir`. Refer to
[Structure of cache directory](/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory)
and `dvc add` to learn more about how DVC handles data directories.

⚠️ This function does not check for the actual existence of the file or
directory in the remote storage.

💡 Having the resource's URL, it should be possible to download it directly with
an appropriate library, such as
[`boto3`](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Object.download_fileobj)
or
[`paramiko`](https://docs.paramiko.org/en/stable/api/sftp.html#paramiko.sftp_client.SFTPClient.get).

## Parameters

- **`path`** (required) - location and file name of the target, relative to the
  root of the project (`repo`).

- `repo` - specifies the location of the DVC project. It can be a URL or a file
  system path. Both HTTP and SSH protocols are supported for online Git repos
  (e.g. `[user@]server:project.git`). _Default_: The current project is used
  (the current working directory tree is walked up to find it).

- `rev` - Git commit (any [revision](https://git-scm.com/docs/revisions) such as
  a branch or tag name, or a commit hash). If `repo` is not a Git repo, this
  option is ignored. _Default_: `HEAD`.

- `remote` - name of the [DVC remote](/doc/command-reference/remote) to use to
  form the returned URL string. _Default_: The
  [default remote](/doc/command-reference/remote/default) of `repo` is used.

## Exceptions

- `dvc.exceptions.NoRemoteError` - no `remote` is found.

## Example: Getting the URL to a DVC-tracked file

```py
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
    )

print(resource_url)
```

The script above prints

`https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355`

This URL represents the location where the data is stored, and is built by
reading the corresponding `.dvc` file
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

```ini
['remote "storage"']
url = https://remote.dvc.org/dataset-registry
```
