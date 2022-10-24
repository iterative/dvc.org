# Remote Storage (Optional)

_DVC remotes_ provide additional storage for your data or ML models and allow
sharing them. For example, you can pull data artifacts created by colleagues
without spending time and resources to recreate them locally. See `dvc push` and
`dvc pull`.

This is similar to how GitHub provides hosting for source code repositories (Git
repos). However, DVC does not provide or recommend a specific storage service.
Instead, it adopts a bring-your-own-platform approach, supporting a
[wide variety of storage types](#supported-storage-types).

<admon type="info">

DVC remotes are similar to [Git remotes], but for <abbr>cached</abbr> data.

[git remotes]: https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes

</admon>

The main uses of remote storage are:

- Synchronize <abbr>cached</abbr> data assets (pull and push).
- Share data in a distributed way to better collaborate.
- Back up your data and its different versions.
- Save space in your working environment (by deleting data that has been
  pushed).

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

Then, you may need or want to further configure the remote by authentication
information or other properties, etc. For example:

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

Finally, you can `git add` and `git commit` the changes to share the general
configuration of your remote (in `.dvc/config`) via the Git repo.

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

### Self-hosted/ On-prem/ Others

- SSH servers; Like `scp`
- HDFS & WebHDFS
- HTTP
- WebDAV
- Local directories, mounted drives; Like `rsync`
  > Includes network resources e.g. network-attached storage (NAS) or other
  > external devices
