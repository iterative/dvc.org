# Add Files

DVC allows storing and versioning source data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
To take a file under DVC control just run `dvc add`:

```dvc
    # It takes any file or directory
    $ dvc add model.pkl
```

DVC stores information about your data file in a special `.dvc` file, that has a
human-readable [description](/doc/user-guide/dvc-file-format) and can be
committed to Git to track versions of your file:

```dvc
    $ git status

    Untracked files:
        .gitignore
        model.pkl.dvc

    $ git add .gitignore model.pkl.dvc
    $ git commit -m "track model with dvc"
```

See [Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning)
and `dvc add` for more information.
