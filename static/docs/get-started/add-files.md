# Add Files

DVC allows storing and versioning source data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
Let's get a sample StackOverflow data set to play with:

```dvc
    $ wget https://dvc.org/s3/so/25K/data.xml
```

To take a file under DVC control just run `dvc add`, it accepts any file or
directory:

```dvc
    $ dvc add data.xml
```

DVC stores information about your data file in a special `.dvc` file, that has a
human-readable [description](/doc/user-guide/dvc-file-format) and can be
committed to Git to track versions of your file:

```dvc
    $ git add .gitignore data.xml.dvc
    $ git commit -m "add source data to DVC"
```

See [Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning)
and `dvc add` for more information.

**Internals**: you can see that actual data file has been moved (usually hardlink or
reflink is created, so no physical copying is happening) to the `.dvc/cache`:

```dvc
    $ ls -R .dvc/cache
        .dvc/cache/a3:
        04afb96060aad90176268345e10355
```

