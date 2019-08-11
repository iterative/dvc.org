# Retrieve Data

> Make sure that the steps described in
> [initialization](/doc/get-started/initialize) and
> [configuration](/doc/get-started/configure) are completed before you run the
> `dvc pull` command in a newly cloned or initialized Git repository.

To retrieve data files into the <abbr>workspace</abbr> in your local machine,
run:

```dvc
$ dvc pull
```

This command retrieves data files that are referenced in all
[DVC-files](/doc/user-guide/dvc-file-format) in the <abbr>project</abbr>. So,
you usually run it after `git clone`, `git pull`, or `git checkout`.

As an easy way to test it:

```dvc
$ rm -f data/data.xml
$ dvc pull
```

Alternatively, if you want to retrieve a single dataset or a file:

```dvc
$ dvc pull data/data.xml.dvc
```

DVC remotes, `dvc push`, and `dvc pull` provide a basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Share Data and Model Files](/doc/use-cases/share-data-and-model-files) for more
information.
