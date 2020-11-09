# Undo Adding Data

There are situations where you want to stop tracking data added previously.
Follow the steps listed here to undo `dvc add`.

Let's first add a data file into an example <abbr>project</abbr>, which creates
a `.dvc` file to track the data:

```dvc
$ dvc add data.csv
$ ls
data.csv    data.csv.dvc
```

> Note, if you're using `symlink` or `hardlink` as the project's
> [link type](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache),
> you'll have to unprotect the tracked file first (see `dvc unprotect`).

Now let's reverse that with `dvc remove`. This removes the `.dvc` file (and
corresponding `.gitignore` entry). The data file is now no longer being tracked
after this:

```dvc
$ dvc remove data.csv.dvc

$ git status
    Untracked files:
        data.csv
```

You can run `dvc gc` with the `-w` option to remove the data that isn't
referenced in the current workspace from the <abbr>cache</abbr>:

```dvc
$ dvc gc -w
```
