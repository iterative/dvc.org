# External Data on Amazon S3

## External Dependencies

Let's take as an example a stage that simply downloads a file from an Amazon S3
bucket:

```dvc
$ dvc run \
      -d s3://mybucket/file.csv \
      -o file.csv \
      'aws s3 cp s3://mybucket/file.csv file.csv'
```

It is even easier to download a file if we use the command `dvc import-url`:

```dvc
$ dvc import-url s3://mybucket/file.csv
```

Or, using a remote:

```dvc
$ dvc remote add s3-data s3://mybucket
$ dvc import-url remote://s3-data/file.csv
```

## External Data and Outputs

For tracked data and for cached external outputs (specified using `-o`) we need
to setup an external cache location that will be used by DVC to store versions
of the external file:

```dvc
# Add S3 remote to be used as cache location for S3 files
$ dvc remote add s3cache s3://mybucket/cache

# Tell dvc to use the 's3cache' remote as S3 cache location
$ dvc config cache.s3 s3cache
```

> Non-cached external outputs (specified using `-O`) do not require an external
> cache to be setup.

Now we can track remote data or create a stage with remote output. Let's take as
example a stage that simply copies a local file to an Amazon S3 bucket:

```dvc
# Track data that is located on Amazon S3
$ dvc add s3://mybucket/data/file.csv

# Create a stage with an S3 external output
$ dvc run \
      -d model.pkl \
      -o s3://mybucket/data/model.pkl \
      'aws s3 cp model.pkl s3://mybucket/data/model.pkl'
```
