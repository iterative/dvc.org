# Undo Adding Data

There are situations where you want to stop tracking data added previously.
Follow the steps listed here to undo `dvc add`.

Let's first add a data file into an example <abbr>project</abbr> using
`dvc add`, which creates a `.dvc` file to track the data:

```dvc
$ dvc add data.csv
$ ls
data.csv    data.csv.dvc
```

> Note, if you are using `symlink` or `hardlink` as
> [link](doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
> type for DVC <abbr>cache</abbr>, you will have to unprotect the tracked file
> first (see `dvc unprotect`):
>
> ```dvc
> $ dvc unprotect data.csv
> ```

Now let's reverse `dvc add`. You'll need to remove the corresponding `.dvc` file
and `.gitignore` entry using `dvc remove`:

```dvc
$ dvc remove data.csv.dvc
```

Data file `data.csv` is now no longer being tracked by DVC.

```dvc
$ git status
    Untracked files:
        data.csv
```

You can run `dvc gc` with the `-w` option to remove the data that isn't
referenced in the current workspace from the cache:

```dvc
$ dvc gc -w
```
