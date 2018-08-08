# Retrieve Data

To retrieve data files to your local machine and your project workspace run:

```dvc
    $ dvc pull
```

This commands retrieves data files that are specified in `.dvc` files in the
current Git branch. So, you usually run it after `git clone`, `git pull`, or
`git checkout`.

As a an easy way to test it:

```dvc
    $ rm -f data.xml
    $ dvc pull
```
Note, make sure that the steps described in  
[initialization](/doc/get-started/initialization) and 
[configuration](/doc/get-started/configuration) are compeleted before
you run the `dvc pull` command in the newly cloned or initialized Git
repository.

DVC remotes, `dvc push`, and `dvc pull` provide basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Share Data and Model Files](/doc/use-cases/share-data-and-model-files)
for more information.

