# Retrieve Data

To retrieve data files to your local machine and your project workspace run:

```dvc
   $ dvc pull
```

This commands retrieves data files that are specified in `.dvc` files in the
current Git branch. So, you usually run it after `git clone`, `git pull`, or
`git checkout`.

DVC remotes, `dvc push`, and `dvc pull` provide basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Share Data and Model Files](/doc/use-cases/share-data-and-model-files)
for more information.
