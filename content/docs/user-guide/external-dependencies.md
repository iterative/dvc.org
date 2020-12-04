# External Dependencies

There are cases when data is so large, or its processing is organized in such a
way, that its preferable to avoid moving it from its original location. For
example data on a network attached storage (NAS), processing data on HDFS,
running [Dask](https://dask.org/) via SSH, or for a script that streams data
from S3 to process it.

External dependencies and
[external outputs](/doc/user-guide/managing-external-data) provide ways to track
data outside of the <abbr>project</abbr>.

## How external dependencies work

External <abbr>dependencies</abbr> are considered part of the (extended) DVC
project: DVC will track them, detecting when they change (triggering stage
executions on `dvc repro`, for example).

To define files or directories in an external location as
[stage](/doc/command-reference/run) dependencies, put their remote URLs or
external paths in `dvc.yaml` (`deps` field). Use the same format as the `url` of
certain `dvc remote` types. Currently, the following protocols are supported:

- Amazon S3
- Microsoft Azure Blob Storage
- Google Cloud Storage
- SSH
- HDFS
- HTTP
- Local files and directories outside the <abbr>workspace</abbr>

> Note that [remote storage](/doc/command-reference/remote) is a different
> feature.

## Examples

Let's take a look at defining and running a `download_file` stage that simply
downloads a file from an external location, on all the supported location types.

<details>

### Click for Amazon S3

```dvc
$ dvc run -n download_file \
          -d s3://mybucket/data.txt \
          -o data.txt \
          aws s3 cp s3://mybucket/data.txt data.txt
```

</details>

<details>

### Click for Microsoft Azure Blob Storage

```dvc
$ dvc run -n download_file \
          -d azure://mycontainer/data.txt \
          -o data.txt \
          az storage copy \
                     -d data.json \
                     --source-account-name my-account \
                     --source-container mycontainer \
                     --source-blob data.txt
```

</details>

<details>

### Click for Google Cloud Storage

```dvc
$ dvc run -n download_file \
          -d gs://mybucket/data.txt \
          -o data.txt \
          gsutil cp gs://mybucket/data.txt data.txt
```

</details>

<details>

### Click for SSH

```dvc
$ dvc run -n download_file \
          -d ssh://user@example.com/path/to/data.txt \
          -o data.txt \
          scp user@example.com:/path/to/data.txt data.txt
```

⚠️ DVC requires both SSH and SFTP access to work with remote SSH locations.
Please check that you are able to connect both ways with tools like `ssh` and
`sftp` (GNU/Linux).

> Note that your server's SFTP root might differ from its physical root (`/`).

</details>

<details>

### Click for HDFS

```dvc
$ dvc run -n download_file \
          -d hdfs://user@example.com/data.txt \
          -o data.txt \
          hdfs fs -copyToLocal \
                  hdfs://user@example.com/data.txt data.txt
```

</details>

<details>

### Click for HTTP

> Including HTTPs

```dvc
$ dvc run -n download_file \
          -d https://example.com/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

</details>

<details>

### Click for local file system paths

```dvc
$ dvc run -n download_file \
          -d /home/shared/data.txt \
          -o data.txt \
          cp /home/shared/data.txt data.txt
```

</details>

## Example: Using DVC remote aliases

You may want to encapsulate external locations as configurable entities that can
be managed independently. This is useful if multiple dependencies (or stages)
reuse the same location, or if its likely to change in the future. And if the
location requires authentication, you need a way to configure it in order to
connect.

[DVC remotes](/doc/command-reference/remote) can do just this. You may use
`dvc remote add` to define them, and then use a special URL with format
`remote://{remote_name}/{path}` (remote alias) to define the external
dependency.

Let's see an example using SSH. First, register and configure the remote:

```dvc
$ dvc remote add myssh ssh://myserver.com
$ dvc remote modify --local myssh user myuser
$ dvc remote modify --local myssh password mypassword
```

> Please refer to `dvc remote add` for more details like setting up access
> credentials for the different remote types.

Now, use an alias to this remote when defining the stage:

```dvc
$ dvc run -n download_file \
          -d remote://myssh/path/to/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

## Example: `import-url` command

In the previous examples, special downloading tools were used: `scp`,
`aws s3 cp`, etc. `dvc import-url` simplifies the downloading for all the
supported external path or URL types.

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml
Importing 'https://data.dvc.org/get-started/data.xml' -> 'data.xml'
```

The command above creates the import `.dvc` file `data.xml.dvc`, that contains
an external dependency (in this case an HTTPs URL).

<details>

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
    metric: false
    persist: false
```

DVC checks the headers returned by the server, looking for an
[HTTP ETag](https://en.wikipedia.org/wiki/HTTP_ETag) or a
[Content-MD5](https://tools.ietf.org/html/rfc1864) header, and uses it to
determine whether the source has changed and we need to download the file again.

</details>

## Example: Imports

`dvc import` can download a file or directory from any <abbr>DVC project</abbr>,
or from a Git repository. It also creates an external dependency in its import
`.dvc` file.

```dvc
$ dvc import git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)'
-> 'model.pkl'
```

The command above creates `model.pkl.dvc`, where the external dependency is
specified (with the `repo` field).

<details>

### Expand to see resulting `.dvc` file

```yaml
# ...
deps:
  - path: model.pkl
    repo:
      url: git@github.com:iterative/example-get-started
      rev_lock: 6c73875a5f5b522f90b5afa9ab12585f64327ca7
outs:
  - md5: 3863d0e317dee0a55c4e59d2ec0eef33
    path: model.pkl
    cache: true
    metric: false
    persist: false
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

</details>
