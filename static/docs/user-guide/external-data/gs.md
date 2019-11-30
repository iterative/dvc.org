# External Data on Google Cloud Storage

## External Dependencies

Let's take as an example a stage that simply downloads a file from a GS
location:

```dvc
$ dvc run \
      -d gs://mybucket/file.csv \
      -o file.csv \
      'gsutil cp gs://mybucket/file.csv file.csv'
```

It is even easier to download a file if we use the command `dvc import-url`:

```dvc
$ dvc import-url gs://mybucket/file.csv
```

Or, using a remote:

```dvc
$ dvc remote add gs-data gs://mybucket
$ dvc import-url remote://gs-data/file.csv
```

## External Data and Outputs

For cached external outputs (specified using `-o`) we need to setup an external
cache location that will be used by DVC to store versions of the external file:

```dvc
# Add GS remote to be used as cache location for GS files
$ dvc remote add gscache gs://mybucket/cache

# Tell dvc to use the 'gscache' remote as GS cache location
$ dvc config cache.gs gscache
```

> Non-cached external outputs (specified using `-O`) do not require an external
> cache to be setup.

Now we can track remote data or create a stage with remote output. Let's take as
example a stage that simply copies a local file to a GS location:

```dvc
# Track data that is located on GS
$ dvc add gs://mybucket/data/file.csv

# Create a stage with a GS external output
$ dvc run \
      -d model.pkl \
      -o gs://mybucket/data/model.pkl \
      'gsutil cp model.pkl gs://mybucket/data/model.pkl'
```
