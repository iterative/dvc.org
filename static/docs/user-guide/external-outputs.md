# External Outputs

With DVC you can specify external files as outputs for your pipeline stages. DVC
will track changes in those files and will reflect that in your pipeline state.
Currently DVC supports such types of external outputs:

1. Local files and directories outside of your dvc repository;
2. Amazon S3;
3. Google Cloud Storage;
4. SSH;
5. HDFS;

In order to specify an external output for your stage use usual `-o` and `-O`
keys with URLs pointing to your desired files. For cached external outputs
(specified using `-o`) you will need to setup an external cache location, that
will be used by dvc to store versions of your external file. Non-cached external
outputs(specified using `-O`) do not require external cache to be setup.

## Examples

As an example, let's take a look at DVC stages that simply moves local file
to/from external location:

### Local

Your local cache location already defaults to `.dvc/cache`, so there is no need
to specify it explicitly.

```dvc
$ dvc add /home/shared/mydata
$ dvc run -d /home/shared/data.txt \
          -o data.txt \
          cp /home/shared/data.txt data.txt
```

### Amazon S3

```dvc
# Add S3 remote to be uses as cache location for S3 files
$ dvc remote add s3cache s3://mybucket/cache

# Tell dvc to use the 's3cache' remote as S3 cache location
$ dvc config cache.s3 s3cache

# Add data on S3 directly
$ dvc add s3://mybucket/mydata

# Run the stage with external S3 output
$ dvc run \
          -d data.txt \
          -o s3://mybucket/data.txt \
          aws s3 cp data.txt s3://mybucket/data.txt
```

### Google Cloud Storage

```dvc
# Add GS remote to be used as cache location for GS files
$ dvc remote add gscache gs://mybucket/cache

# Tell dvc to use the 'gscache' remote as GS cache location
$ dvc config cache.gs gscache

# Add data on GS directly
$ dvc add gs://mybucket/mydata

# Run the stage with external GS output
$ dvc run \
          -d data.txt \
          -o gs://mybucket/data.txt \
          gsutil cp data.txt gs://mybucket/data.txt
```

### SSH

```dvc
# Add SSH remote to be used as cache location for SSH files
$ dvc remote add sshcache ssh://user@example.com:/cache

# Tell dvc to use the 'sshcache' remote as SSH cache location
$ dvc config cache.ssh sshcache

# Add data on SSH directly
$ dvc add ssh://user@example.com:/mydata

# Run the stage with external SSH output
$ dvc run \
          -d data.txt \
          -o ssh://user@example.com:/home/shared/data.txt \
          scp data.txt user@example.com:/home/shared/data.txt
```

### HDFS

```dvc
# Add HDFS remote to be used as cache location for HDFS files
$ dvc remote add hdfscache hdfs://user@example.com/cache

# Tell dvc to use the 'hdfscache' remote as HDFS cache location
$ dvc config cache.hdfs hdfscache

# Add data on HDFS directly
$ dvc add hdfs://user@example.com/mydata

# Run the stage with external HDFS output
$ dvc run \
          -d data.txt \
          -o hdfs://user@example.com/home/shared/data.txt \
          hdfs fs -copyFromLocal \
                            data.txt \
                            hdfs://user@example.com/home/shared/data.txt
```

Note that as long as there is a `hdfs://...` path for your data, DVC can handle
it. So systems like Hadoop, Hive, and HBase are supported!
