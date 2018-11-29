# External Dependencies

With DVC you can specify external files as dependencies for your pipeline
stages. DVC will track changes in those files and will reflect that in your
pipeline state. Currently DVC supports such types of external dependencies:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HFDS;
6. HTTP;

In order to specify an external dependency for your stage use usual '-d' keys
with URLs pointing to your desired files. As an example, let's take a look at
dvc stages that simply download your external dependency file to local
workspace:

## Examples

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
    $ dvc run -d https://dvc.org/s3/examples/versioning/data.tgz \
              -o data \
               'wget -q -O - https://dvc.org/s3/examples/versioning/data.tgz \
                  | tar -xzvf -'
```
