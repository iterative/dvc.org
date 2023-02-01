# Remote Storage

_DVC remotes_ provide optional/additional storage to backup and share your data
and ML models. For example, you can download data artifacts created by
colleagues without spending time and resources to regenerate them locally. See
`dvc push` and `dvc pull`.

<admon type="info">

DVC remotes are similar to [Git remotes], but for <abbr>cached</abbr> data.

[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

</admon>

This is somewhat like GitHub or GitLab providing hosting for source code
repositories. However, DVC does not provide or recommend a specific storage
service. Instead, it adopts a bring-your-own-platform approach, supporting a
wide variety of [storage types](#supported-storage-types).

The main uses of remote storage are:

- Synchronize DVC-tracked data (previously <abbr>cached</abbr>).
- Centralize or distribute large file storage for sharing and collaboration.
- Back up different versions of your data and models.
- Save space in your working environment (by deleting pushed files/directories).

## Configuration

You can set up one or more remote storage locations with `dvc remote` commands.
These read and write to the [`remote`] section of the project's configuration
file (`.dvc/config`), which you could edit manually as well.

First, `dvc remote add` a storage name and valid URL (or file path), e.g.:

[`remote`]: /doc/command-reference/config#remote

```cli
$ dvc remote add mybucket s3://my-bucket
```

You may also need to `dvc remote modify` its authentication or other
configuration, e.g.:

```cli
$ dvc remote modify --local \
                    mybucket credentialpath ~/.aws/alt

$ dvc remote modify mybucket connect_timeout 300
```

<admon type="warn">

The `--local` flag is needed to write sensitive user info to a Git-ignored
config file (`.dvc/config.local`) so that no secrets are leaked through Git. See
`dvc config` for more info.

This also means that each copy of the <abbr>DVC repository</abbr> may have to
re-configure remote storage authentication.

</admon>

<details>

### Click to see the resulting config files.

```ini
# .dvc/config
['remote "mybucket"']
    url = s3://my-bucket
    connect_timeout = 300
```

```ini
# .dvc/config.local
['remote "mybucket"']
    credentialpath = ~/.aws/alt
```

```ini
# .gitignore
.dvc/config.local
```

</details>

Finally, you can `git commit` the changes to share the remote location with your
team.

## Supported storage types

### Cloud providers

- [Amazon S3](/doc/user-guide/data-management/remote-storage/amazon-s3) (AWS)
- S3-compatible e.g. MinIO
- Microsoft Azure Blob Storage
- Google Drive
- Google Cloud Storage (GCP)
- Aliyun OSS

### Self-hosted / On-premises

- SSH servers; Like `scp`
- HDFS & WebHDFS
- HTTP
- WebDAV
- Local directories, mounted drives; Like `rsync`
  > Includes network resources e.g. network-attached storage (NAS) or other
  > external devices
