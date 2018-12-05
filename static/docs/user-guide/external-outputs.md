# External Outputs

With DVC you can specify external files as outputs for your pipeline stages.
DVC will track changes in those files and will reflect that in your pipeline
state. Currently DVC supports such types of external outputs:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HFDS;

In order to specify an external output for your stage use usual `-o` and
`-O` keys with URLs pointing to your desired files. For cached external outputs
(specified using `-o`) you will need to setup an external cache location, that
will be used by dvc to store versions of your external file. Non-cached
external outputs(specified using `-O`) do not require external cache to be
setup.

## Examples

As an example, let's take a look at dvc stages that simply upload your local
file to external location:

### Local

Your local cache location already defaults to `.dvc/cache`, so there is no
need to specify it explicitly.

```dvc
    $ dvc run -d /home/shared/data.txt \
              -o data.txt \
              cp /home/shared/data.txt data.txt
```

### Amazon S3

```dvc
    # Add S3 remote that will be used as a cache location for your s3 files
    $ dvc remote add s3cache s3://mybucket/cache

    # Tell dvc to use your 's3cache' remote as s3 cache location
    $ dvc config cache.s3 s3cache

    # Run your stage with external S3 output
    $ dvc run \
              -d data.txt \
              -o s3://mybucket/data.txt \
              aws s3 cp data.txt s3://mybucket/data.txt
```

### Google Cloud Storage

```dvc
    # Add GS remote that will be used as a cache location for your gs files
    $ dvc remote add gscache gs://mybucket/cache

    # Tell dvc to use your 'gscache' remote as gs cache location
    $ dvc config cache.gs gscache

    # Run your stage with external GS output
    $ dvc run \
              -d data.txt \
              -o gs://mybucket/data.txt \
              gsutil cp data.txt gs://mybucket/data.txt
```

### SSH

```dvc
    # Add SSH remote that will be used as a cache location for your ssh files
    $ dvc remote add sshcache ssh://user@example.com:/cache

    # Tell dvc to use your 'sshcache' remote as ssh cache location
    $ dvc config cache.ssh sshcache

    # Run your stage with external SSH output
    $ dvc run \
              -d data.txt \
              -o ssh://user@example.com:/home/shared/data.txt \
              scp data.txt user@example.com:/home/shared/data.txt
```

### HDFS

```dvc
    # Add HDFS remote that will be used as a cache location for your hdfs files
    $ dvc remote add hdfscache hdfs://user@example.com/cache

    # Tell dvc to use your 'hdfscache' remote as hdfs cache location
    $ dvc config cache.hdfs hdfscache

    # Run your stage with external HDFS output
    $ dvc run \
              -d data.txt \
              -o hdfs://user@example.com/home/shared/data.txt \
              hdfs fs -copyFromLocal \
                                data.txt \
                                hdfs://user@example.com/home/shared/data.txt
```
