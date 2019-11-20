# External Data on a Local Filesystem

Sometimes we would like to keep the data and cache outside the project
directory, so that we can search easily the code of the project.

Keeping the data outside of the project, on a fixed absolute path, is also
useful in case that there are several projects that use the same data.

Another case when this would be desirable is if we want to keep the data on an
[external drive](https://whatis.techtarget.com/definition/external-hard-drive)
because the data is too big to fit on our home directory, or for some other
reasons.

A similar case is also when the data is on a
[network-attached storage (NAS)](https://searchstorage.techtarget.com/definition/network-attached-storage)
and is mounted through NFS, SSHFS, Samba, etc.

## Tracking External Data

Let's say that we want to track the directory `/var/data/mydata/`. We can simply
do it like this:

```dvc
$ dvc add /var/data/mydata/
```

This will create the tracking file `mydata.dvc` with a content like this:

```yaml
outs:
  - path: /var/data/mydata/
    metric: false
    cache: true
    persist: false
    md5: 800be79fa2d0c411def72cd04e8600c8.dir
md5: 22ee63d16fe8c622fd1a4f138533b036
```

### Using an environment variable

If the data directory has a long path, it could save us some typing and make our
commands a bit easier if we define an environment variable for it. For example
we could do it by adding on `~/.bashrc` a line like this:

```bash
export DATA=/var/data
```

Then the command for tracking our data would be like this:

```dvc
$ dvc add $DATA/mydata/
```

The content of the tracking file `mydata.dvc` will be the same as before:

```yaml
outs:
  - path: /var/data/mydata/
    metric: false
    cache: true
    persist: false
    md5: 800be79fa2d0c411def72cd04e8600c8.dir
md5: 22ee63d16fe8c622fd1a4f138533b036
```

### Using a DVC remote

We can also use a DVC remote as a name or alias of the data directory. First, we
should define it like this:

```dvc
$ dvc remote add data /var/data

$ dvc remote list
data	/var/data

$ cat .dvc/config
['remote "data"']
url = /var/data
```

Now we can track the data directory like this:

```dvc
$ dvc add remote://data/mydata/
```

The tracking file `mydata.dvc` that is created has a content like this:

```yaml
outs:
  - path: remote://data/mydata/
    metric: false
    cache: true
    persist: false
    md5: 800be79fa2d0c411def72cd04e8600c8.dir
```

## External Deps and Outs

This is very similar to tracking external data. We can just use the absolute
paths of dependencies and outputs, like this:

```dvc
$ dvc run \
      -f clean.dvc \
      -d /var/data/raw/ \
      -o /var/data/clean/ \
      clean.py \
          /var/data/raw/ \
          /var/data/clean/
```

We can also define a variable `DATA=/var/data` and use it to define the stage,
like this:

```dvc
$ dvc run \
      -f clean.dvc \
      -d $DATA/raw/ \
      -o $DATA/clean/ \
      clean.py \
          $DATA/raw/ \
          $DATA/clean/
```

Or we can define first a DVC remote, and then use it to specify the dependencies
and outputs of the stage, like this:

```dvc
$ dvc remote add data /var/data
$ dvc run \
      -f clean.dvc \
      -d remote://data/raw/ \
      -o remote://data/clean/ \
      clean.py \
          remote://data/raw/ \
          remote://data/clean/
```

<details>

### Using environment variables vs. using a DVC remote

It seems like using an environment variable is simpler, since less configuration
is needed. However using a DVC remote is more flexible. To understand why, let's
consider the following case.

Let's assume that our dataset is located on `/var/data/raw/`, same as before,
but we have created as well the directory `/var/data-dev/raw/` which contains a
small amount of the original data, which we can use to test the pipeline before
running it on the original data.

We could first define a remote like this:

```dvc
$ dvc remote add data /var/data-dev

$ dvc remote list
data	/var/data-dev

$ cat .dvc/config
['remote "data"']
url = /var/data-dev
```

Then track the dataset and proceed with constructing and testing the pipeline:

```dvc
$ dvc add remote://data/raw
$ dvc run \
      -f clean.dvc \
      -d remote://data/raw/ \
      -o remote://data/clean/
      clean.py \
          remote://data/raw/ \
          remote://data/clean/
...
```

Once we are sure that the pipeline works as we want, we can modify the directory
of the remote "data" like this:

```dvc
$ dvc remote modify data url /var/data

$ dvc remote list
data	/var/data

$ cat .dvc/config
['remote "data"']
url = /var/data
```

Then we can proceed with re-running the pipeline, and this time the real data
will be used:

```dvc
$ dvc repro ...
```

Notice that in this case we don't need to change the DVC-files (and the
pipeline) when we switch from using the development data to using the real data.
We just modify the url of the remote directory. This is the flexibility that we
gain by using this method.

> However we have to make sure that we use the
> [DVC API](https://github.com/iterative/dvc/blob/master/dvc/api.py) inside the
> command `clean.py`, when reading data from a remote dependency or writing data
> to a remote output.

To summarize, using environment variables is simpler, however using DVC remotes
is more flexible. Choose the method that suits best your situation.

</details>

## Using an External Cache

Usually we need to use an external cache in cases when we want to keep both the
data and cache outside the project directory. Some of these cases are mentioned
at the beginning of this page.

> For a detailed example see also:
> [How to Keep Data and Cache Outside the Project](/doc/user-guide/howto/external-data-and-cache)

Assuming that we want to use the directory `/var/data/dvc-cache/` as DVC cache,
we can configure it like this:

```dvc
$ dvc config cache.dir /var/data/dvc-cache/

$ dvc config cache.dir
/var/data/dvc-cache/

$ cat .dvc/config
[cache]
dir = /var/data/dvc-cache/
```

It is also possible to use a relative path for the cache directory, but it
should be given relative to the directory of the config file (which is `.dvc/`).
In this case it is more suitable to use the command `dvc cache dir`, which gets
as argument a directory relative to the current directory, and saves in the
configuration file the same directory, but relative to the configuration file.
For example:

```dvc
$ dvc cache dir ../dvc-cache

$ cat .dvc/config
[cache]
dir = ../../dvc-cache/
```

## Local DVC Storage

A local DVC storage might be useful in these cases:

- When we are using a
  [shared development server](/doc/user-guide/data-sharing/shared-server)
- When our data storage is
  [network-mounted](/doc/user-guide/data-sharing/mounted-storage)
- When our data storage is
  [synchronized with a central storage](/doc/user-guide/data-sharing/synched-storage)

Assuming that we want to use `/var/data/dvc-storage/` as a local DVC storage, we
can configure it by creating a **default** remote (which can be used by
`dvc push` and `dvc pull`), like this:

```dvc
$ dvc remote add --default storage /var/data/dvc-storage
Setting 'storage' as a default remote.

$ dvc remote list
storage	/var/data/dvc-storage

$ cat .dvc/config
['remote "storage"']
url = /var/data/dvc-storage
[core]
remote = storage
```
