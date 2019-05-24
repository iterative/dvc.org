# Share Data and Model Files

Same as Git, DVC allows for distributed environment and collaboration. It is
dead easy to consistently get all your data files and code to any machine. All
you need to do is to setup a remote DVC repository, that will store cache files
for your project. Currently DVC supports AWS S3, Google Cloud Storage, Microsoft
Azure Blob Storage, SSH and HDFS as remote location and the list is constantly
growing. For complete information about supported remote types and their
configuration take a look at `dvc remote`.

![](/static/img/model-sharing-digram.png)

As an example, let's take a look at how you could setup DVC remote on Amazon S3
and push/pull to/from it.

### Create a bucket at Amazon S3

If you don't already have it, get Amazon S3 account and then follow instructions
at
[Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
to create your bucket.

### Setup DVC remote

To setup DVC remote on s3, you need to supply an URL to the location where you
wish to store data:

```dvc
$ dvc remote add -d myremote s3://mybucket/myproject
Setting "myremote" as a default remote.
```

> The `-d` (`--default`) option sets `myremote` as a default repository for the
> project.

This will add `myremote` to your `.dvc/config`. Commit your changes and push
your code:

```dvc
$ git add .dvc/config
$ git push
```

### Upload data

To upload data from your project run:

```dvc
$ dvc push

(1/5): [##############################] 100% images/0001.jpg
(2/5): [##############################] 100% images/0002.jpg
(3/5): [##############################] 100% images/0001.jpg
(4/5): [##############################] 100% images
(5/5): [##############################] 100% model.pkl
```

### Upload code

Code with DVC metafiles should be uploaded through Git:

```dvc
$ git push
```

### Download code

Please use regular Git commands to download code and DVC metafiles from your Git
servers.

```dvc
$ git clone https://github.com/myaccount/myproject.git
$ cd myproject
```

or

```dvc
$ git pull
```

### Download data

To download data files for your project run:

```dvc
$ dvc pull

(1/5): [##############################] 100% images/0001.jpg
(2/5): [##############################] 100% images/0002.jpg
(3/5): [##############################] 100% images/0003.jpg
(4/5): [##############################] 100% images
(5/5): [##############################] 100% model.pkl
```
