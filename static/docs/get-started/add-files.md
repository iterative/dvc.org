# Add Files

DVC allows storing and versioning source data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
Let's get a sample StackOverflow data set to play with:

<details>

### Expand to learn how to download on Windows

Windows does not ship `wget` utility by default, so you'll need to use a browser
to download `data.xml`and save it into `data` subdirectory.

</details>

```dvc
    $ mkdir data
    $ wget https://dvc.org/s3/get-started/data.xml -O data/data.xml
```

To take a file (or a directory) under DVC control just run `dvc add`, it accepts
any **file** or a **directory**:

```dvc
    $ dvc add data/data.xml
```

DVC stores information about your data file in a special `.dvc` file, that has a
human-readable [description](/doc/user-guide/dvc-file-format) and can be
committed to Git to track versions of your file:

```dvc
    $ git add data/.gitignore data/data.xml.dvc
    $ git commit -m "add source data to DVC"
```

To modify or replace a data file that is under DVC control you may need to run
`dvc unprotect` or `dvc remove` first (check the
[Update Tracked File](/doc/user-guide/update-tracked-file) guide). Refer to
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning)
and `dvc add` for more information. Use `dvc move` to rename or move a data file
that is under DVC control.

<details>

### Expand to learn more about DVC internals

You can see that actual data file has been moved (usually hardlink or reflink is
created, so no physical copying is happening) to the `.dvc/cache`:

```dvc
    $ ls -R .dvc/cache
        .dvc/cache/a3:
        04afb96060aad90176268345e10355
```

where `a304afb96060aad90176268345e10355` is an MD5 hash of the `data.xml` file,
and if you check the `data/data.xml.dvc` meta-file you will see that it has this
hash inside.

</details>
