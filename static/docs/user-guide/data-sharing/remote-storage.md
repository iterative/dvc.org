# Sharing Data Through a Remote DVC Storage

We can setup a _default_ [remote storage](/doc/user-guide/external-data) to a
data storage provider, where we can upload the cached data files, so that the
other users can access them.

> Currently DVC supports Amazon S3, Google Cloud Storage, Microsoft Azure Blob
> Storage, SSH, HDFS, and other remote storage types/providers, and the list is
> constantly growing.

We can share data using `git push` (to upload DVC-files) and `dvc push` (to
upload cached data files). The other users can use `git pull` followed by
`dvc pull` to receive them.

> This is the recommended and the most common case of data sharing.

## Example: S3 Remote Storage

As an example, let's take a look at how we could setup an
[Amazon S3 remote storage](/doc/user-guide/external-data/amazon) for a <abbr>DVC
project</abbr>, and share data through it.

<details>

### Prerequisite: Create first an S3 bucket

If you don't already have one available in your S3 account, follow instructions
in
[Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html).
As an advanced alternative, you may use the
[`aws s3 mb`](https://docs.aws.amazon.com/cli/latest/reference/s3/mb.html)
command instead.

</details>

### Set the DVC storage

To setup an S3 DVC storage we need to create a _default_ remote like this:

```dvc
$ dvc remote add --default s3storage s3://mybucket/myproject
Setting 's3storage' as a default remote.

$ dvc remote list
s3storage	s3://mybucket/myproject
```

This command will add to `.dvc/config` some lines like these:

```dvc
['remote "s3storage"']
url = s3://mybucket/myproject
[core]
remote = s3storage
```

This configuration is the same for all the users, so let's commit it to Git:

```dvc
$ git add .dvc/config
$ git commit -m 'Setup S3 storage'
$ git push
```

### Sharing data

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created and the data is stored in `.dvc/cache/`. We can upload DVC-files to the
Git server with `git push`, and upload the cached files to the remote storage
with `dvc push`:

```dvc
$ git push
$ dvc push
```

The other users can receive the DVC-files and the cached data files like this:

```dvc
$ git pull
$ dvc pull
```

## Example: SSH Remote Storage

As an other example, let's see how to setup an
[SSH remote storage](/doc/user-guide/external-data/ssh) for a project and share
data through it.

> For more detailed instructions check out this
> [interactive example](https://katacoda.com/dvc/courses/examples/ssh-storage).

In this example we will assume a central data storage server that can be
accessed through SSH from two different users.

> For the sake of example the central Git repository will be located in this
> server too, but in general it can be anywhere, it doesn't have to be on the
> same server with the DVC data storage.

<p align="center">
<img src="/static/img/user-guide/data-sharing/ssh-storage.png"/>
</p>

<details>

### Prequisite: Setup the SSH server

Usually we need to do these configurations on a SSH server:

- Create accounts for each user and add them to groups for accessing the Git
  repository and the DVC storage.
- Create a bare git repository (for example on `/srv/project.git/`) and an empty
  directory for the DVC storage (for example on `/srv/project.cache/`).
- Grant users read/write access to these directories (through the groups).

</details>

<details>

### Prerequisite: Setup each user

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

</details>

### Set the DVC storage

We can setup the project to use the
[SSH remote storage](/doc/user-guide/external-data/ssh) by adding a _default
remote_ like this:

```dvc
$ dvc remote add --default \
      ssh-storage ssh://dvc-server:/srv/project.cache
Setting 'ssh-storage' as a default remote.

$ dvc remote list
ssh-storage	ssh://dvc-server:/srv/project.cache
```

The configuration file `.dvc/config` now should look like this:

```
['remote "ssh-storage"']
url = ssh://dvc-server:/srv/project.cache
[core]
remote = ssh-storage
```

This configuration is the same for all the users, so we can add it to Git in
order to share it with the other users:

```dvc
$ git add .dvc/config
$ git commit -m 'Add a SSH remote storage'
$ git push
```

### Sharing data

When we add data to the project with `dvc add` or `dvc run`, some DVC-files are
created and the data is stored in `.dvc/cache/`. We can upload DVC-files to the
Git server with `git push`, and upload the cached files to the remote storage
with `dvc push`:

```dvc
$ git push
$ dvc push
```

The other users can receive the DVC-files and the cached data like this:

```dvc
$ git pull
$ dvc pull
```
