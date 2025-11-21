# `.dvc` Files

You can use `dvc add` to track data files or directories located in your current
<abbr>workspace</abbr>\*. Additionally, `dvc import` and `dvc import-url` let
you bring data from external locations to your project, and start tracking it
locally. See [Data Versioning] for more info.

[data versioning]: /start

Files ending with the `.dvc` extension ("dot DVC file") are created by these
commands as data placeholders that can be versioned with Git. They contain the
information needed to track the target data over time. Here's an example:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    desc: Cats and dogs dataset
    remote: myremote
```

These files use the [YAML 1.2](https://yaml.org/) file format, and a
human-friendly schema described below. We encourage you to get familiar with it
so you may modify, write, or generate `.dvc` files on your own.

> See also
> [How to Merge Conflicts](/user-guide/how-to/resolve-merge-conflicts#dvc-files).

## Specification

These are the fields that are accepted at the root level of the `.dvc` file
schema:

| Field  | Description                                                                                                                                                                                                                   |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outs` | (Required) list of [output entries](#output-entries) (details below) that represent the files or directories tracked with DVC. Typically there is only one (but several can be added or combined manually).                   |
| `deps` | List of [dependency entries](#dependency-entries) (details below). Only present when `dvc import` or `dvc import-url` are used to generate this `.dvc` file. Typically there is only one (but several can be added manually). |
| `wdir` | Working directory for the `outs` and `deps` paths (relative to the `.dvc` file's location). It defaults to `.` (the file's location).                                                                                         |
| `md5`  | (Only for <abbr>imports</abbr>) MD5 hash of the `.dvc` file itself.                                                                                                                                                           |

Comments can be entered using the `# comment` format.

## Output entries

The following subfields may be present under `outs` entries:

| Field                           | Description                                                                                                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`                          | (Required) Path to the file or directory (relative to `wdir` which defaults to the file's location)                                                                                                                       |
| `hash`                          | Hash algorithm for the file or directory being tracked with DVC (only `md5` is currently supported).                                                                                                                      |
| `md5`<br/>`etag`<br/>`checksum` | Hash value for the file or directory being tracked with DVC. MD5 is used for most locations (local file system and SSH); [ETag] for HTTP, S3, or Azure [external outputs]; and a special _checksum_ for HDFS and WebHDFS. |
| `version_id`                    | Version ID native to the cloud provider. Used to track each file in the cloud if [cloud versioning] is enabled.                                                                                                           |
| `size`                          | Size of the file or directory (sum of all files)                                                                                                                                                                          |
| `nfiles`                        | If this output is a directory, the number of files inside (recursive).                                                                                                                                                    |
| `isexec`                        | Whether this is an executable file. DVC preserves execute permissions upon `dvc checkout` and `dvc pull`. This has no effect on directories, or in general on Windows.                                                    |
| `cache`                         | Whether or not this file or directory is <abbr>cached</abbr> (`true` by default). See the `--no-commit` option of `dvc add`.                                                                                              |
| `remote`                        | Name of the remote to use for pushing/fetching                                                                                                                                                                            |
| `persist`                       | Whether the output file/dir should remain in place while `dvc repro` runs (`false` by default: outputs are deleted when `dvc repro` starts)                                                                               |
| `push`                          | Whether or not this file or directory, when previously <abbr>cached</abbr>, is uploaded to remote storage by `dvc push` (`true` by default).                                                                              |

[etag]: https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation
[external outputs]: /user-guide/pipelines/external-dependencies-and-outputs
[cloud versioning]: /user-guide/data-management/cloud-versioning

## Dependency entries

The following subfields may be present under `deps` entries:

| Field                           | Description                                                                                                                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `path`                          | (Required) Path to the dependency (relative to `wdir`, which defaults to the file's location)                                                                                                                                                    |
| `hash`                          | Hash algorithm for the file or directory being tracked with DVC (only `md5` is currently supported).                                                                                                                                             |
| `md5`<br/>`etag`<br/>`checksum` | Only in <abbr>external dependencies</abbr> created with `dvc import-url`: Hash value of the imported file or directory. MD5 is used for local paths and SSH; [ETag] for HTTP, S3, GCS, and Azure; and a special _checksum_ for HDFS and WebHDFS. |
| `size`                          | Size of the file or directory (sum of all files).                                                                                                                                                                                                |
| `nfiles`                        | If this dependency is a directory, the number of files inside (recursive).                                                                                                                                                                       |
| `repo`                          | Only in external dependencies created with `dvc import`: It can contain `url`, `rev`, `rev_lock`, `config` and `remote` (detailed below).                                                                                                        |
| `db`                            | Only in db dependencies created with `dvc import-db`: It can contain `connection`, `file_format`, `query` and `table` (detailed below).                                                                                                          |

### Dependency `repo` subfields:

| Field      | Description                                                                                                                                                                                                                                                                                                                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`      | URL of Git repository with source DVC project                                                                                                                                                                                                                                                                               |
| `rev`      | Only when `dvc import --rev` is used: Specific commit hash, branch or tag name, etc. (a [Git revision]) used to import the dependency from.                                                                                                                                                                                 |
| `rev_lock` | Git commit hash of the external <abbr>DVC repository</abbr> at the time of importing or updating the dependency (with `dvc update`)                                                                                                                                                                                         |
| `config`   | When `dvc import --config` is used: Path to a [config file](/command-reference/config) that will be merged with the config in the target repository. When both `--remote` and `--remote-config` are used: config options that will be merged with the config in the target repository. See examples section in`dvc import`. |
| `remote`   | Only when `dvc import --remote` or `--remote-config` is used: name of the `dvc remote` to set as a default or remote config options to merge with a default remote's config in the target repository. See examples section in `dvc import`.                                                                                 |

### Dependency `db` subfields:

| Field         | Description                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `connection`  | Name of the connection to use. The connection has to be set in the config before use. See [Database Connections](/command-reference/import-db#database-connections). |
| `query`       | SQL query to snapshot. It is only set if `--sql` option was used on `dvc import-db`. `dvc update` will use this field to re-import.                                  |
| `table`       | Name of the database table to snapshot. It is only set if `--table` option was used on `dvc import-db`. `dvc update` will use this field to re-import.               |
| `file_format` | Export format to use. At the moment, it can be set to either `csv` or `json`.                                                                                        |

[git revision]: https://git-scm.com/docs/revisions
