# Add Files or Directories

DVC allows storing and versioning data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
Let's get a sample dataset to play with:

```dvc
$ mkdir data
$ wget https://data.dvc.org/get-started/data.xml -O data/data.xml
```

<details>

### Expand if you're on Windows or having problems downloading from command line

If you experienced problems using `wget` or you're on Windows and you don't want
to install it, you'll need to use a browser to download `data.xml` and save it
into `data` subdirectory. To download, right-click
[this link](https://data.dvc.org/get-started/data.xml) and click `Save link as`
(Chrome) or `Save object as` (Firefox).

</details>

To take a file (or a directory) under DVC control just run `dvc add` on it. For
example:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added data in a special **DVC-file** that has a
human-readable [format](/doc/user-guide/dvc-file-format). It can be committed to
Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data to project"
```

Committing these special files to Git allows us to tack different versions of
the data as it evolves with the source code under Git control.

<details>

### Expand to learn about DVC internals

You can see that actual data file has been moved to the cache directory, while
the entries in the workspace may be file links to the actual files in the DVC
cache.

```dvc
$ ls -R .dvc/cache
    .dvc/cache/a3:
    04afb96060aad90176268345e10355
```

`a304afb96060aad90176268345e10355` from above is an MD5 hash of the `data.xml`
file we just added to DVC. And if you check the `data/data.xml.dvc` DVC-file you
will see that it has this hash inside.

</details>

<details>

### Expand for an important note on cache performance

DVC tries to use reflinks\* by default to link your data files from the DVC
cache to the workspace, optimizing speed and storage space. However, reflinks
are not widely supported yet and DVC falls back to actually copying data files
to/from the cache **which can be very slow with large files**, and duplicates
storage requirements.

Hardlinks and symlinks are also available for optimized cache linking but,
(unlike reflinks) they carry the risk of accidentally corrupting the cache if
tacked data files are modified in the workspace.

See [Large Dataset Optimization](/docs/user-guide/large-dataset-optimization)
and `dvc config cache` for more information.

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.

</details>

If your workspace uses Git, without DVC you would have to manually put each data
file or directory in into `.gitignore`. DVC commands that take or make files
that will go under its control automatically takes care of this for you! (You
just have to add the changes to Git.)

Refer to
[Data and Model Files Versioning](/doc/use-cases/data-and-model-files-versioning),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.
