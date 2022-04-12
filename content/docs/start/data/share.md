## Storing and sharing

You can upload DVC-tracked data or model files with `dvc push`, so they're
safely stored [remotely](/doc/command-reference/remote). This also means they
can be retrieved on other environments later with `dvc pull`. First, we need to
set up a remote storage location:

```dvc
$ dvc remote add -d storage s3://mybucket/dvcstore
$ git add .dvc/config
$ git commit -m "Configure remote storage"
```

> DVC supports many remote storage types, including Amazon S3, SSH, Google
> Drive, Azure Blob Storage, and HDFS. See `dvc remote add` for more details and
> examples.

<details>

### ⚙️ Expand to set up remote storage.

DVC remotes let you store a copy of the data tracked by DVC outside of the local
cache (usually a cloud storage service). For simplicity, let's set up a _local
remote_ in a temporary `dvcstore/` directory (create the dir first if needed):

<toggle>
<tab title="Mac/Linux">

```dvc
$ dvc remote add -d myremote /tmp/dvcstore
$ git commit .dvc/config -m "Configure local remote"
```

</tab>
<tab title="Windows (Cmd)">

```dvc
$ dvc remote add -d myremote %TEMP%\dvcstore
$ git commit .dvc\config -m "Configure local remote"
```

</tab>
</toggle>

> While the term "local remote" may seem contradictory, it doesn't have to be.
> The "local" part refers to the type of location: another directory in the file
> system. "Remote" is what we call storage for <abbr>DVC projects</abbr>. It's
> essentially a local data backup.

</details>
