# Retrieve Data

To retrieve data files to your local machine and your project's workspace run:

```dvc
$ dvc pull
```

This command retrieves data files that are referenced in _all_ `.dvc` files in
the current workspace. So, you usually run it after `git clone`, `git pull`, or
`git checkout`.

As an easy way to test it:

```dvc
$ rm -f data/data.xml
$ dvc pull
```

> Note, make sure that the steps described in
> [initialization](/doc/get-started/initialize) and
> [configuration](/doc/get-started/configure) are completed before you run the
> `dvc pull` command in a newly cloned or just initialized Git repository.

Alternatively, if you want to retrieve a single dataset or a file:

```dvc
$ dvc pull data/data.xml.dvc
```

DVC remotes, `dvc push`, and `dvc pull` provide a basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Share Data and Model Files](/doc/use-cases/share-data-and-model-files) for more
information.
