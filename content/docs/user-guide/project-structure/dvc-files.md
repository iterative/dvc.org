# `.dvc` Files

You can use `dvc add` to track data files or directories located in your current
<abbr>workspace</abbr>\*. Additionally, `dvc import` and `dvc import-url` let
you bring data from external locations to your project, and start tracking it
locally. See [Data Versioning](/doc/start/data-and-model-versioning) for more
info.

> \* Certain [external locations](/doc/user-guide/managing-external-data) are
> also supported.

Files ending with the `.dvc` extension ("dot DVC file") are created by these
commands as data placeholders that can be versioned with Git. They contain the
information needed to track the target data over time. Here's an example:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    desc: Cats and dogs dataset
    remote: myremote

# Comments and user metadata are supported.
meta:
  name: 'Devee Bird'
  email: devee@dvc.org
```

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema described below. We encourage you to get familiar with it
so you may modify, write, or generate `.dvc` files on your own.

> See also
> [How to Merge Conflicts](/doc/user-guide/how-to/merge-conflicts#dvc-files).

## Specification

These are the fields that are accepted at the root level of the `.dvc` file
schema:

| Field  | Description                                                                                                                                                                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outs` | (Required) list of [output entries](#output-entries) (details below) that represent the files or directories tracked with DVC. Typically there is only one (but several can be added or combined manually).                   |
| `deps` | List of [dependency entries](#dependency-entries) (details below). Only present when `dvc import` or `dvc import-url` are used to generate this `.dvc` file. Typically there is only one (but several can be added manually). |
| `wdir` | Working directory for the `outs` and `deps` paths (relative to the `.dvc` file's location). It defaults to `.` (the file's location).                                                                                         |
| `md5`  | (Only for <abbr>imports</abbr>) MD5 hash of the `.dvc` file itself.                                                                                                                                                           |
| `meta` | (Optional) arbitrary user metadata can be added manually with this field. Any YAML content is supported. `meta` contents are ignored by DVC.                                                                                  |

Comments can be entered using the `# comment` format.

> `meta` fields and `#` comments are preserved among executions of `dvc repro`
> and `dvc commit`, but not when the file is overwritten by `dvc add`,
> `dvc move`, `dvc import`, or `dvc import-url`.

## Output entries

The following subfields may be present under `outs` entries:

| Field                           | Description                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                          | (Required) Path to the file or directory (relative to `wdir`, which defaults to the file's location)                                                                                                                                                                                                                                  |
| `md5`<br/>`etag`<br/>`checksum` | Hash value for the file or directory being tracked with DVC. MD5 is used for most locations (local file system and SSH); [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for HTTP, S3, or Azure [external outputs](/doc/user-guide/managing-external-data); and a special _checksum_ for HDFS and WebHDFS. |
| `size`                          | Size of the file or directory (sum of all files).                                                                                                                                                                                                                                                                                     |
| `nfiles`                        | If this output is a directory, the number of files inside (recursive).                                                                                                                                                                                                                                                                |
| `isexec`                        | Whether this is an executable file. DVC preserves execute permissions upon `dvc checkout` and `dvc pull`. This has no effect on directories, or in general on Windows.                                                                                                                                                                |
| `cache`                         | Whether or not this file or directory is <abbr>cached</abbr> (`true` by default). See the `--no-commit` option of `dvc add`.                                                                                                                                                                                                          |
| `remote`                        | (Optional) name of the remote to use for pushing/fetching                                                                                                                                                                                                                                                                             |
| `persist`                       | Whether the output file/dir should remain in place while `dvc repro` runs (`false` by default: outputs are deleted when `dvc repro` starts)                                                                                                                                                                                           |
| `desc`                          | (Optional) user description for this output (supported in metrics and plots too). This doesn't affect any DVC operations.                                                                                                                                                                                                             |

## Dependency entries

The following subfields may be present under `deps` entries:

| Field                           | Description                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                          | (Required) Path to the dependency (relative to `wdir`, which defaults to the file's location)                                                                                                                                                                                                                        |
| `md5`<br/>`etag`<br/>`checksum` | Only in <abbr>external dependencies</abbr> created with `dvc import-url`: Hash value of the imported file or directory. MD5 is used for local paths and SSH; [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) for HTTP, S3, GCS, and Azure; and a special _checksum_ for HDFS and WebHDFS. |
| `size`                          | Size of the file or directory (sum of all files).                                                                                                                                                                                                                                                                    |
| `nfiles`                        | If this dependency is a directory, the number of files inside (recursive).                                                                                                                                                                                                                                           |
| `repo`                          | Only in external dependencies created with `dvc import`: It can contain `url`, `rev`, and `rev_lock` (detailed below).                                                                                                                                                                                               |

### Dependency `repo` subfields:

| Field      | Description                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`      | URL of Git repository with source DVC project                                                                                                                                   |
| `rev`      | Only when `dvc import --rev` is used: Specific commit hash, branch or tag name, etc. (a [Git revision](https://git-scm.com/docs/revisions)) used to import the dependency from. |
| `rev_lock` | Git commit hash of the external <abbr>DVC repository</abbr> at the time of importing or updating the dependency (with `dvc update`)                                             |
