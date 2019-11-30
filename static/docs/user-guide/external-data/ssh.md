# External Data on a SSH Server

A SSH server may be used to keep and process data remotely (for example with
[Dask](https://dask.org/)).

## External Dependencies

Let's take as an example a stage that simply downloads a file from a SSH
location:

```dvc
$ dvc run \
      -d ssh://user@example.com/srv/data/file.csv \
      -o file.csv \
      'scp user@example.com:/srv/data/file.csv file.csv'
```

We can do the same thing with a remote, like this:

```dvc
$ dvc remote add ssh-data ssh://user@example.com/srv/data
$ dvc run \
      -d remote://ssh-data/file.csv \
      -o file.csv \
      'scp.py remote://ssh-data/file.csv file.csv'
```

> In this case the command `scp.py` should get the real location of
> `remote://ssh-data/file.csv` using the
> [DVC API](https://github.com/iterative/dvc/blob/master/dvc/api.py)

It is even easier to download a file if we use the command `dvc import-url`:

```dvc
$ dvc import-url ssh://user@example.com/srv/data/file.csv
```

Or, using a remote:

```dvc
$ dvc remote add ssh-data ssh://user@example.com/srv/data
$ dvc import-url remote://ssh-data/file.csv
```

## External Data and Outputs

For tracked data and for cached external outputs (specified using `-o`) we need
to setup an external cache location that will be used by DVC to store versions
of the external file:

```dvc
# Add SSH remote to be used as cache for the remote files
$ dvc remote add ssh-cache ssh://user@example.com:/srv/cache

# Tell dvc to use the remote 'ssh-cache' as a SSH cache
$ dvc config cache.ssh ssh-cache
```

> Non-cached external outputs (specified using `-O`) do not require an external
> cache to be setup.

Now we can track remote data or create a stage with remote output. Let's take as
example a stage that simply copies a local file to a SSH server:

```dvc
# Track data that is located on the SSH server
$ dvc add ssh://user@example.com:/srv/data/file.csv

# Create a stage with an SSH external output
$ dvc run \
      -d model.pkl \
      -o ssh://user@example.com:/srv/data/model.pkl \
      'scp model.pkl user@example.com:/srv/data/model.pkl'
```
