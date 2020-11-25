# How to Un-track Data

There are situations where you may want to stop tracking data added previously.
Let's see how it can be done using an example `data.csv` file.

<details>

## Click to add the sample data first

Let's `dvc add` a `data.csv` file into an example <abbr>project</abbr>, which
creates a `.dvc` file to track the data and adds it to `.gitignore`:

```dvc
$ dvc add data.csv

$ ls
data.csv    data.csv.dvc
$ cat .gitignore
/data.csv
```

</details>

> Note that if you are using `symlink` or `hardlink` as
> [link type](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache),
> you will have to `dvc unprotect` the tracked file first.

Let's undo `dvc add` with `dvc remove`. This removes the `.dvc` file (and
corresponding `.gitignore` entry). The data file is now no longer being tracked
after this:

```dvc
$ dvc remove data.csv.dvc

$ git status
    Untracked files:
        data.csv
```

You can run `dvc gc` with the `-w` option to remove the data that isn't
referenced in the current <abbr>workspace</abbr> from the <abbr>cache</abbr>:

```dvc
$ dvc gc -w
```
