# Sharing Data and Model Files

Like Git, DVC allows for a distributed environment and collaboration. We make it
easy to consistently get all your data files and directories into any machine,
along with matching source code. All you need to do is to setup
[remote storage](/doc/command-reference/remote) for your <abbr>DVC
project</abbr>, and push the data there, so others can reach it. Currently DVC
supports Amazon S3, Microsoft Azure Blob Storage, Google Drive, Google Cloud
Storage, SSH, HDFS, and other remote locations. The list is constantly growing.
(For a complete list and configuration instructions, refer to `dvc remote add`.)

![](/img/model-sharing-digram.png)

As an example, let's take a look at how you could setup an S3
[remote storage](/doc/command-reference/remote) for a <abbr>DVC project</abbr>,
and push/pull to/from it.

## Create an S3 bucket

If you don't already have one available in your S3 account, follow instructions
in
[Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).
As an advanced alternative, you may use the
[`aws s3 mb`](https://docs.aws.amazon.com/cli/latest/reference/s3/mb.html)
command instead.

## Setup DVC remote

To actually configure an S3 remote in the <abbr>project</abbr>, supply the URL
to the bucket where the data should be stored to the `dvc remote add` command.
For example:

```dvc
$ dvc remote add -d myremote s3://mybucket/path
Setting 'myremote' as a default remote.
```

> The `-d` (`--default`) option sets `myremote` as the default remote storage
> for this project.

This will add `myremote` to your `.dvc/config`. The `config` file now has a
remote section for it:

```dvc
['remote "myremote"']
url = s3://mybucket/path
[core]
remote = myremote
```

`dvc remote modify` provides a wide variety of options to configure S3 buckets.

Let's commit your changes and push your code:

```dvc
$ git add .dvc/config
$ git push
```

## Upload data and code

After adding data to the <abbr>project</abbr> with `dvc run` or other commands,
it'll be stored in your local <abbr>cache</abbr>. Upload it to remote storage
with the `dvc push` command:

```dvc
$ dvc push
```

Code and [DVC-files](/doc/user-guide/dvc-files-and-directories) can be safely
committed and pushed with Git.

## Download code

Please use regular Git commands to download code and DVC-files from your Git
servers. For example:

```dvc
$ git clone https://github.com/example/project.git
$ cd myproject
```

or

```dvc
$ git pull
```

## Download data

To download data files for your <abbr>project</abbr>, run:

```dvc
$ dvc pull
```

`dvc pull` will download the missing data files from the default remote storage
configured in the `.dvc/config` file.
