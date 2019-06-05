# External Dependencies

With DVC you can specify external files as dependencies for your pipeline
stages. DVC will track changes in those files and will reflect that in your
pipeline state. Currently DVC supports the following types of external
dependencies:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HDFS;
6. HTTP;

> Note that these match with the types supported by `dvc remote`.

In order to specify an external dependency for your stage, use the usual '-d'
option in `dvc run` with the remote URL pointing to your desired file or
directory.

## Examples: Defined directly with URLs

### Local

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

```dvc
$ dvc run -d https://example.com/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

## Examples: Defined with DVC Remote aliases

If instead of a URL you'd like to use an alias that can be managed
independently, or if the external dependency location requires access
credentials, you may use `dvc remote add` to define this location as a DVC
Remote, and then use a special `remote://{remote_name}/{path}` URL to define an
external dependency.

For example, for an HTTP remote/dependency:

```dvc
$ dvc remote add example https://example.com
$ dvc run -d remote://example/data.txt \
          -o data.txt \
          wget https://example.com/data.txt -O data.txt
```

Please refer to `dvc remote add` for more details like setting up access
credentials for certain remotes.

## Using import

In the previous command examples, downloading commands were used: `aws s3 cp`,
`scp`, `wget`, etc. `dvc import` simplifies the downloading part for all the
supported types of dependencies.

```dvc
$ dvc import https://dvc.org/s3/get-started/data.xml
```

<details>

### Expand to learn more about DVC internals

If you open the resulting DVC file, you will see something like this:

```yaml
deps:
  - etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
    path: https://dvc.org/s3/get-started/data.xml
md5: bea9674331a4b1d165f2b0abaf2cb0ef
outs:
  - cache: true
    md5: a304afb96060aad90176268345e10355
    path: data.xml
```

DVC checks the headers returned by the server, looking for a strong
[ETag](https://en.wikipedia.org/wiki/HTTP_ETag) or a
[Content-MD5](https://tools.ietf.org/html/rfc1864) header, and uses it to know
if the file has changed and we need to download it again.

</details>
