# External Dependencies

There are cases when data is so large, or its processing is organized in a way
that you would like to avoid moving it out of its external/remote location. For
example from a network attached storage (NAS) drive, processing data on HDFS,
running [Dask](https://dask.org/) via SSH, or having a script that streams data
from S3 to process it. A mechanism for external dependencies and
[external outputs](/doc/user-guide/external-outputs) provides a way for DVC to
control data externally.

## Description

With DVC you can specify external files as dependencies for your pipeline
stages. DVC will track changes in those files and will reflect that in your
pipeline state. Currently, the following types of external dependencies
(protocols) are supported:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HDFS;
6. HTTP;

> Note that these match with the remote storage types supported by `dvc remote`.

In order to specify an external dependency for your stage, use the usual '-d'
option in `dvc run` with the external path or URL pointing to your desired file
or directory.

## Examples

As examples, let's take a look at a [stage](/doc/commands-reference/run) that
simply moves local file from an external location, producing a `data.txt.dvc`
stage file (DVC-file).

> Note that some of these commands use the `/home/shared` directory, typical in
> Linux distributions.

### Local file system path

```dvc
$ dvc run -d /home/shared/data.txt \
          -o data.txt \
          cp /home/shared/data.txt data.txt
```

### Amazon S3

```dvc
$ dvc run -d s3://mybucket/data.txt \
          -o data.txt \
          aws s3 cp s3://mybucket/data.txt data.txt
```

### Google Cloud Storage

```dvc
$ dvc run -d gs://mybucket/data.txt \
          -o data.txt \
          gsutil cp gs://mybucket/data.txt data.txt
```

### SSH

```dvc
$ dvc run -d ssh://user@example.com:/home/shared/data.txt \
          -o data.txt \
          scp user@example.com:/home/shared/data.txt data.txt
```

### HDFS

```dvc
$ dvc run -d hdfs://user@example.com/home/shared/data.txt \
          -o data.txt \
           hdfs fs -copyToLocal \
                            hdfs://user@example.com/home/shared/data.txt \
                            data.txt
```

### HTTP

> Including HTTPs

```dvc
$ dvc run -d https://example.com/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

## Example: DVC remote aliases

If instead of a URL you'd like to use an alias that can be managed
independently, or if the external dependency location requires access
credentials, you may use `dvc remote add` to define this location as a DVC
Remote, and then use a special `remote://{remote_name}/{path}` URL to define an
external dependency.

For example, for an HTTPs remote/dependency:

```dvc
$ dvc remote add example https://example.com
$ dvc run -d remote://example/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

Please refer to `dvc remote add` for more details like setting up access
credentials for certain remotes.

## Example: import-url command

In the previous examples, downloading commands were used: `aws s3 cp`, `scp`,
`wget`, etc. `dvc import-url` simplifies the downloading for all the supported
external path or URL types.

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml
Importing 'https://data.dvc.org/get-started/data.xml' -> 'data.xml'
[##############################] 100% data.xml
...
```

The command above creates the <abbr>import stage</abbr> (DVC-file)
`data.xml.dvc`, that uses an external dependency (in this case an HTTPs URL).

<details>

### Expand to see resulting DVC-file

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

DVC checks the headers returned by the server, looking for a strong
[ETag](https://en.wikipedia.org/wiki/HTTP_ETag) or a
[Content-MD5](https://tools.ietf.org/html/rfc1864) header, and uses it to know
if the file has changed and we need to download it again.

</details>

## Example: Using import

`dvc import` can download a <abbr>data artifact</abbr> from an external DVC
repository. It also creates an external dependency in its <abbr>import
stage</abbr> (DVC-file).

```dvc
$ dvc import git@github.com:iterative/example-get-started model.pkl
Importing 'model.pkl (git@github.com:iterative/example-get-started)' -> 'model.pkl'
Preparing to download data from 'https://remote.dvc.org/get-started'
...
```

The command above creates `model.pkl.dvc`, where a special `repo` external
dependency is specified.

<details>

### Expand to see resulting DVC-file

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

For external sources that are DVC repositories, `url` and `rev_lock` fields are
used to specify the origin and version of the dependency.

</details>
