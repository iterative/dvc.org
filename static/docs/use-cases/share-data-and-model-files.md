# Share Data And Model Files

Same as git, dvc allows for distributed environment and collaboration. It is
dead easy to consistently get all your data files and code to any machine.
All you need to do is to setup a remote DVC repository, that will store cache
files for your project. Currently DVC supports AWS S3, Google Cloud Storage,
Microsoft Azure Blob Storage, SSH and HDFS as remote location and the list is
constantly growing. To get a full info about supported remote types and their
configuration take a look at `dvc remote`. As an example, let's take a look
at how you could setup DVC remote on Amazon S3 as an example.

## Create a bucket at Amazon S3
If you don't already have it, get Amazon S3 account and them follow
instructions at
[Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
to create your bucket.

## Setup DVC remote

To setup DVC remote on s3, you need to supply an URL to the location where you
wish to store data:

```dvc
    $ dvc remote add -d myremote s3://mybucket/myproject
    Setting 'myremote' as a default remote.
```

NOTE: `-d|--default` option sets myremote as a default repository for the project.

This will add `myremote` to your `.dvc/config`. Commit your changes and push
your code:

```dvc
    $ git add .dvc/config
    $ git push
```

## Upload data

To upload data from your project run:

```dvc
    $ dvc push

    (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
    (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
    (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
    (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
    (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```

## Download data

To download data for your project run:

```dvc
    $ dvc pull

    (1/5): [##############################] 100% 3caf879afa11fc750cac4e15721a8741
    (2/5): [##############################] 100% f83c01a5634a9e7b8a04177a5533f67b
    (3/5): [##############################] 100% 2579801f17b00b0014d4e2a4847e3064.dir
    (4/5): [##############################] 100% 82986e112ecefabbcfbaf960e2c8fb36
    (5/5): [##############################] 100% 18d51187e9602848514499047bb6de7f
```
