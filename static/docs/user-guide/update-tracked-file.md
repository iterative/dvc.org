# Update a Tracked File

Due to the way DVC handles linking between the data files in the cache and their
counterparts in the working directory (refer to
[Large Dataset Optimization](/docs/user-guide/large-dataset-optimization)),
updating tracked files has to be carried out with caution to avoid data
corruption when the DVC config option `cache.type` is set to `hardlink` or/and
`symlink`. (See `dvc config cache` for more details on setting the cache file
link types.)

> For an example of the cache corruption problem see issue
> [#599](https://github.com/iterative/dvc/issues/599 in our code repository.

Assume `train.tsv` is tracked by dvc and you want to update it. Here updating
may mean either replacing `train.tsv` with a new file having the same name or
editing the content of the file.

If you run `dvc repro` there is no need to manage generated (output) files
manually, DVC removes them for you before running the stage which generates
them.

If you use DVC to track a file that is generated during your pipeline (e.g. some
intermediate result or a final model file - `model.pkl`) and you don't use
`dvc run` and `dvc repro` to manage your pipeline, use the procedure below (run
`dvc unprotect` or `dvc remove`) to unlink it from DVC cache prior to the
execution of the script that modifies it.

See also `dvc unprotect` and `dvc config cache` to learn more about the
recommended ways to protect your data files.

## Replacing file

If you want to replace the file you should take the following steps.

First, un-track the file. This will remove `train.tsv` from the workspace:

```dvc
$ dvc remove train.tsv.dvc
```

Next, replace the file with new content:

```dvc
$ echo new > train.tsv
```

And start tracking it again:

```dvc
$ dvc add train.tsv
$ git add train.tsv.dvc
$ git commit -m "new train data"
```

## Modifying content

"Unlink" the file with `dvc unprotect`. This will make `train.tsv` safe to edit:

```dvc
$ dvc unprotect train.tsv
```

Edit the content of the file:

```dvc
$ echo "new data item" >> train.tsv
```

Add a new version of the file back to DVC:

```dvc
$ dvc add train.tsv
$ git add train.tsv.dvc
$ git commit -m "modify train data"
```
