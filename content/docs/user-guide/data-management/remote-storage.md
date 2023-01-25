# Remote Storage

_DVC remotes_ provide optional/additional storage to backup and share your data
and ML model. For example, you can download data artifacts created by colleagues
without spending time and resources to regenerate them locally. See `dvc push`
and `dvc pull`.

<admon type="info">

DVC remotes are similar to [Git remotes], but for <abbr>cached</abbr> data.

[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

</admon>

This is somehow like GitHub or GitLab providing hosting for source code
repositories. However, DVC does not provide or recommend a specific storage
service. Instead, it adopts a bring-your-own-platform approach, supporting a
wide variety of [storage types](#supported-storage-types).

The main uses of remote storage are:

- Synchronize DVC-tracked data (previously <abbr>cached</abbr>).
- Centralize or distribute large file storage for sharing and collaboration.
- Back up different versions of your data and models.
- Save space in your working environment (by deleting pushed files/directories).

## Configuration

You can set up one or more remote storage locations, mainly with the
`dvc remote add` and `dvc remote modify` commands. These read and write to the
[`remote`] section of the project's configuration file (`.dvc/config`), which
you could edit manually as well.

Typically, you'll first register a DVC remote by adding its name and URL (or
file path), e.g.:

```cli
$ dvc remote add mybucket s3://my-bucket
```

Then, you'll usually need or want to configure the remote's authentication
credentials or other properties, etc. For example:

```cli
$ dvc remote modify --local \
                    mybucket credentialpath ~/.aws/alt

$ dvc remote modify mybucket connect_timeout 300
```

<admon type="warn">

Make sure to use the `--local` flag when writing secrets to configuration. This
creates a second config file in `.dvc/config.local` that is ignored by Git. This
way your secrets do not get to the repository. See `dvc config` for more info.

This also means each copy of the <abbr>DVC repository</abbr> may have to
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

Finally, you can `git commit` the changes to share the general configuration of
your remote (`.dvc/config`) via the Git repo.

[`remote`]: /doc/command-reference/config#remote

## Supported storage types

> See more [details](/doc/command-reference/remote/add#supported-storage-types).

### Cloud providers

- Amazon S3 (AWS)
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
