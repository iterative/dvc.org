# Add Files or Directories

DVC allows storing and versioning source data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
Let's get a sample data set to play with:

<details>

### Expand to learn how to download on Windows

Windows does not ship `wget` utility by default, so you'll need to use a browser
to download `data.xml` and save it into `data` subdirectory. To download,
right-click [this link](https://dvc.org/s3/get-started/data.xml) and click
`Save link as`(Chrome) or `Save object as`(Firefox).

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

<details>

### Expand to learn about DVC internals

You can see that actual data file has been moved to the `.dvc/cache` directory
(usually hardlink or reflink is created, so no physical copying is happening).

```dvc
$ ls -R .dvc/cache
.dvc/cache/a3:
04afb96060aad90176268345e10355
```

where `a304afb96060aad90176268345e10355` is an MD5 hash of the `data.xml` file.
And if you check the `data/data.xml.dvc` meta-file you will see that it has this
hash inside.

</details>

Refer to
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.

Note that to modify or replace a data file that is under DVC control you may
need to run `dvc unprotect` or `dvc remove` first (check the
[Update Tracked File](/doc/user-guide/update-tracked-file) guide). Use
`dvc move` to rename or move a data file that is under DVC control.
