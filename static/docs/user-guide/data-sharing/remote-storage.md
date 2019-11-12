# Sharing Data Through a Remote DVC Storage

This is the recommended and the most common case of data sharing. In this case
we setup a [remote storage](/doc/command-reference/remote) on a data storage
provider, to store data files online, where others can reach them. Currently DVC
supports Amazon S3, Google Cloud Storage, Microsoft Azure Blob Storage, SSH,
HDFS, and other remote locations, and the list is constantly growing.

## S3 Remote Example

As an example, let's take a look at how you could setup an S3
[remote storage](/doc/command-reference/remote) for a <abbr>DVC project</abbr>,
and push/pull to/from it.

### Create an S3 bucket

If you don't already have one available in your S3 account, follow instructions
in
[Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).
As an advanced alternative, you may use the
[`aws s3 mb`](https://docs.aws.amazon.com/cli/latest/reference/s3/mb.html)
command instead.

### Setup DVC remote

To actually configure a S3 remote in the <abbr>project</abbr>, supply the URL to
the bucket where the data should be stored to the `dvc remote add` command. For
example:

```dvc
$ dvc remote add -d myremote s3://mybucket/myproject
Setting 'myremote' as a default remote.
```

> The `-d` (`--default`) option sets `myremote` as the default remote storage
> for this project.

This will add `myremote` to your `.dvc/config`. The `config` file now have a
section like this:

```dvc
['remote "myremote"']
url = s3://mybucket/myproject
[core]
remote = myremote
```

`dvc remote` provides a wide variety of options to configure S3 bucket. For more
information see `dvc remote modify`.

Let's commit your changes and push your code:

```dvc
$ git add .dvc/config
$ git push
```

### Upload data and code

After adding data to the <abbr>project</abbr> with `dvc run` or other commands,
it should be stored in your local <abbr>cache</abbr>. Upload it to remote
storage with the `dvc push` command:

```dvc
$ dvc push
```

Code and [DVC-files](/doc/user-guide/dvc-file-format) should be committed and
pushed with Git.

### Download code

Please use regular Git commands to download code and DVC-files from your Git
servers. For example:

```dvc
$ git clone https://github.com/myaccount/myproject.git
$ cd myproject
```

or

```dvc
$ git pull
```

### Download data

To download data files for your <abbr>project</abbr>, run:

```dvc
$ dvc pull
```

`dvc pull` will download the missing data files from the default remote storage
configured in the `.dvc/config` file.

## SSH Remote Example

As an other example, let's see how to setup an SSH remote storage for a project
and share data through it.

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/ssh-storage).

In this example we will assume a central data storage server that can be
accessed through SSH from two different users. For the sake of example the
central Git repository will be located in this server too, but in general it can
be anywhere, it doesn't have to be on the same server with the DVC data storage.

<p align="center">
<img src="/static/img/user-guide/data-sharing/ssh-storage.png"/>
</p>

### Setup the server

Usually we need to do these configurations on a SSH server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/srv/project.git/`) and an empty
  directory for the DVC storage (for example on `/srv/project.cache/`).

- Grant users read/write access to these directories (through the groups).

### Setup each user

When we have to access a SSH server, we definitely want to generate ssh key
pairs and setup the SSH config so that we can access the server without a
password.

Let's assume that for each user we can use the private ssh key
`~/.ssh/dvc-server` to access the server without a password, and we have also
added on `~/.ssh/config` lines like these:

```
Host dvc-server
    HostName host01
    User user1
    IdentityFile ~/.ssh/dvc-server
    IdentitiesOnly yes
```

Here `dvc-server` is the name or alias that we can use for our server, `host01`
can actually be the IP or the FQDN of the server, and `user1` is the username of
the first user on the server.

### Setup DVC remote

The configuration of the project with the SSH remote storage can be done with a
command like this:

```dvc
$ dvc remote add --default \
      ssh-cache ssh://dvc-server:/srv/project.cache
```

This command will add a default remote configuration on `.dvc/config` that looks
like this:

```
['remote "ssh-cache"']
url = ssh://dvc-server:/srv/project.cache
[core]
remote = ssh-cache
```

Note that this configuration is the same for all the users, so we can add it to
Git in order to share it with the other users:

```dvc
$ git add .dvc/config
$ git commit -m 'Add a SSH remote cache'
$ git push
```

### Sharing data

After adding data to the project with `dvc add` and `dvc run`, it is stored in
`.dvc/cache`. We can upload to the server both the code changes and the data
like this:

```dvc
$ git push
$ dvc push
```

On the other end, we can receive the code changes and data like this:

```dvc
$ git pull
$ dvc pull
```
