# Sharing Data and Model Files

DVC allows for a distributed environment and collaboration, making it easy to
consistently relocate data files and directories into any machine, along with
matching source code using Git. The key is to setup your own
[remote storage](/doc/command-reference/remote), and push the data there so
others (or yourself) can pull it later. DVC supports Amazon S3, Microsoft Azure
Blob Storage, Google Drive, Google Cloud Storage, SSH, HDFS, and other
providers. The list is constantly growing!

![](/img/model-sharing-digram.png) _Data lives in storage you control, separate
from code._

## Example: Share with an S3 remote

If you don't already have an S3 bucket available in your S3 account, follow
instructions in [Create a Bucket]. As an advanced alternative, you may use the
[`aws s3 mb`] command instead. Let's say the bucket name is `mybucket`.

[create a bucket]:
  https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html
[`aws s3 mb`]: https://docs.aws.amazon.com/cli/latest/reference/s3/mb.html

### Setup DVC remote

To actually configure an S3 remote in the <abbr>DVC project</abbr>, supply the
URL to the bucket where the data should be stored to the `dvc remote add`
command:

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

`dvc remote modify` provides a wide variety of options to configure S3 buckets,
including setting up access credentials if needed.

Let's commit your changes and push your code:

```dvc
$ git add .dvc/config
$ git push
```

### Upload data and code

After adding data to the <abbr>project</abbr> with `dvc add` or other commands,
it'll be stored in your local <abbr>cache</abbr>. Upload it to remote storage
with the `dvc push` command:

```dvc
$ dvc push
```

Code and [DVC project files] can be safely committed and pushed with Git as
usual.

[dvc project files](/doc/user-guide/project-structure/pipelines-files)

### Download code and data

You can use regular Git commands to download code and DVC files from your Git
servers:

```dvc
$ git clone https://github.com/example/project.git
$ cd myproject

# or if you already have an older version of the repo

$ git pull
```

To download data files for your <abbr>project</abbr>, run:

```dvc
$ dvc pull
```

`dvc pull` will download the missing data files from the default remote storage
configured in the `.dvc/config` file.
