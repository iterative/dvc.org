# Undo dvc add

There are situations where you `dvc add` a data file by mistake and want DVC to
stop tracking that file. Follow the steps listed here to undo `dvc add`.

Lets first add a data file into our example <abbr>project</abbr>:

```dvc
$ dvc add data.csv
$ tree
.
├── data.csv
└── data.csv.dvc
```

As you can see `dvc add` creates a `.dvc` file to track the added data. Now
let's reverse this action.

In the first step, if you are using `symlink` or `hardlink` as
[link](doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache)
type for DVC <abbr>cache</abbr>, you will have to unprotect the tracked file
(see `dvc unprotect`):

```dvc
$ dvc unprotect data.csv
```

Next, remove the corresponding `.dvc` file and `.gitignore` entry using
`dvc remove`:

```dvc
$ dvc remove data.csv.dvc
```

Data file `data.csv` is now no longer being tracked by DVC.

```dvc
$ git status
    Untracked files:
        data/data.xml
```

You can run `dvc gc` to remove the unused file contents from the cache.

```dvc
$ dvc gc -w
```
