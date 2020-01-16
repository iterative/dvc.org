# dvc.api.get_url()

Returns the full URL
[string](https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str)
to the physical location (in a [DVC remote](/doc/command-reference/remote)) of a
<abbr>data artifact</abbr> specified by its `path` in a `repo` (<abbr>DVC
project</abbr>).

⚠️ Note that the returned URL is formed by analyzing the corresponding
[DVC-file](/doc/user-guide/dvc-file-format) (see [Examples](#examples) below).
**There is no guarantee that the file actually exists in that location**. Please
keep this in mind when using the URL string in your code.

💡 Having the resource's URL, it should be possible to download it directly with
an appropriate tool such as
[`urlretrieve`](https://docs.python.org/3/library/urllib.request.html#urllib.request.urlretrieve)
or `boto3`
[download_fileobj](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html#S3.Object.download_fileobj).

> For possible location protocols, refer to the
> [supported remote types](https://dvc.org/doc/command-reference/remote/add#supported-storage-types)

## Signature

```py
get_url(path, repo=None, rev=None, remote=None)
```

## Parameters

- **`path`** - used to specify the location of the target artifact within the
  source project in `repo`, relative to the project's root.

- `repo` - specifies the location of the source DVC project. Both HTTP and SSH
  protocols are supported for online Git repository URLs (e.g.
  `[user@]server:project.git`). `repo` can also be a local file system path to
  an "offline" project. If not supplied, this defaults to the current working
  directory.

  > A `NotDvcRepoError` is thrown if `repo` is not a valid DVC project.

- `rev` - (optional)
  [Git-revision](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
  (such as a branch name, a tag, or a commit hash). `rev` only has an effect
  when a URL is supplied as parameter to `repo`. If not supplied, it uses the
  default Git revision, `HEAD`.

- `remote` - (optional) name of the [DVC remote](/doc/command-reference/remote)
  to fetch the target artifact from. If not supplied, the default depends on the
  value of `repo`. The local cache is used when `repo` is the current working
  directory (default value of `repo`). when `repo` is an external repository
  URL, the default project remote is used.

  > A `NoRemoteError` is thrown if no `remote` is specified and the project has
  > no default remote.

## Examples

```py
import dvc.api

resource_url = dvc.api.get_url(
  'get-started/data.xml',
  repo='https://github.com/iterative/dataset-registry'
)
```

The value of `resource_url` in this case would be something like:

`https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355`

This URL represents the physical location of the data, built by interpreting the
corresponding [DVC-file](/doc/user-guide/dvc-file-format), where the file's
checksum `a304afb96060aad90176268345e10355` is stored, and the project's remote
configuration where the base URL `https://remote.dvc.org/dataset-registry/` is
saved.
