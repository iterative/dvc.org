# Importing External Data

To version data that lives outside of your local <abbr>project</abbr>, you can
import it. You can choose whether to download that data and whether to push
copies of it to your [DVC remote]. This makes importing the data useful even if
you want to track the data in-place at its original source location.

## How importing external data works

Import external data using `import-url`:

```cli
$ dvc import-url https://data.dvc.org/get-started/data.xml
Importing 'https://data.dvc.org/get-started/data.xml' -> 'data.xml'
```

This downloads the file to `data.xml` (see
[Avoiding duplication](#avoiding-duplication) if you want to skip this step). It
also creates the `data.xml.dvc`file, which tracks the source data.

<details id="import-url-expand-to-see-resulting-dvc-file">

### Expand to see resulting `.dvc` file

```yaml
# ...
deps:
  - etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
    path: https://data.dvc.org/get-started/data.xml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    cache: true
    persist: false
```

DVC checks the headers returned by the server, looking for an
[HTTP ETag](https://en.wikipedia.org/wiki/HTTP_ETag) or a
[Content-MD5](https://tools.ietf.org/html/rfc1864) header, and uses it to
determine whether the source has changed and we need to download the file again.

</details>

To check the source location for updates, run `dvc update`:

```cli
$ dvc update data.xml.dvc
'data.xml.dvc' didn't change, skipping
```

During `dvc push`, DVC will upload the version of the data tracked by
`data.xml.dvc` to the [DVC remote] so that it is backed up in case you need to
recover it.

## Avoiding duplication

Uploading and downloading copies of the external data may be unnecessary and
impractical in some cases, like if your data is large or static, or you stream
it directly from its source location, or you use cloud versioning to backup old
versions already.

### Skipping downloads

You can use `--no-download` to skip the download step when you import or update
the data:

```cli
$ dvc import-url --no-download https://data.dvc.org/get-started/data.xml
Importing 'https://data.dvc.org/get-started/data.xml' -> 'data.xml'

$ ls
data.xml.dvc
```

If you don't have time or space to download the data but still want to make a
backup of the data on your [DVC remote] to be able to recover a copy later, you
can instead use `--to-remote`, which will upload the data to remote storage
without saving a local copy.

### Skipping uploads

You can also skip pushing the data to the [DVC remote], and DVC will try to
recover the data from its source location. However, if you don't push the data
and the source location has changed, you may be unable to recover the data.

[Cloud versioning](/doc/user-guide/data-management/cloud-versioning) enables you
to recover data without having to push a copy to DVC remote storage. If you have
cloud versioning enabled for the source location, you can import it with
`--version-aware`. DVC will track the version ID of all imported files and be
able to recover them from source as long as those versions remain in the source
location. DVC will also know to skip uploading these files during `dvc push`
since it assumes they are available from the source location.

[dvc remote]: /doc/user-guide/data-management/remote-storage
