# Add Files

DVC allows storing and versioning source data files, ML models, directories,
intermediate results with Git, without checking the file contents into Git.
Let's get a sample StackOverflow data set to play with:

```dvc
    $ wget https://dvc.org/s3/get-started/data.xml
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
and if you check the `data.xml.dvc` meta-file you will see that it has this hash
inside.

Unless your workspace supports reflinks (if you are on a recent Mac then chances
are you are using reflinks) or you've manually specified `cache.type copy`, you
are corrupting the cache if you are editing the file in your workspace. We are
currently [working](https://github.com/iterative/dvc/issues/799) on protecting
hard/symlinks with read-only permissions to avoid such inconvenience.

</details>
