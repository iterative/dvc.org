# Retrieve Data

> You'll need to complete the
> [initialization](/doc/tutorials/get-started/initialize) and
> [configuration](/doc/tutorials/get-started/configure) chapters before being
> able to run the commands explained here.

To retrieve data files into the <abbr>workspace</abbr> in your local machine,
run:

```dvc
$ rm -f data/data.xml
$ dvc pull
```

This command downloads data files that are referenced in all
[`.dvc` files](/doc/user-guide/dvc-file-format) in the <abbr>project</abbr>. So,
you usually run it after `git clone`, `git pull`, or `git checkout`.

Alternatively, if you want to retrieve a single dataset or a file you can use:

```dvc
$ dvc pull data/data.xml.dvc
```

DVC remotes, `dvc push`, and `dvc pull` provide a basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files) for
more information.
