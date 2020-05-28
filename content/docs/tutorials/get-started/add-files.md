# Add Files or Directories

DVC allows storing and versioning data files, ML models, directories,
intermediate results with Git, without tracking the file contents with Git.
Let's get a dataset example to play with:

```dvc
$ mkdir data
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can use any <abbr>DVC repository</abbr> to find the appropriate
> [remote storage](/doc/command-reference/remote) and download <abbr>data
> artifacts</abbr> from it (analogous to `wget`, but for repositories). In this
> case we use [dataset-registry](https://github.com/iterative/dataset-registry))
> as the source repo. (Refer to
> [Data Registries](/doc/use-cases/data-registries) for more info about this
> setup.)

To track a file (or a directory) with DVC just run `dvc add` on it. For example:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added data in a special file called a **`.dvc`
file**. `.dvc` files are small text files with a human-readable
[format](/doc/user-guide/dvc-file-format) and they can be committed with Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data to project"
```

Committing `.dvc` files with Git allows us to track different versions of the
<abbr>project</abbr> data as it evolves with the source code tracked by Git.

<details>

### Expand to learn about DVC internals

`dvc add` moves the actual data file to the <abbr>cache</abbr> directory (see
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)), while
the entries in the workspace may be file links to the actual files in the DVC
cache.

```dvc
$ ls -R .dvc/cache
    .dvc/cache/a3:
    04afb96060aad90176268345e10355
```

`a304afb96060aad90176268345e10355` above is the hash value of the `data.xml`
file we just added with DVC. If you check the `data/data.xml.dvc` `.dvc` file,
you will see that it has this string inside.

### Important note on cache performance

DVC tries to use reflinks\* by default to link your data files from the DVC
cache to the workspace, optimizing speed and storage space. However, reflinks
are not widely supported yet and DVC falls back to actually copying data files
to/from the cache. **Copying can be very slow with large files**, and duplicates
storage requirements.

Hardlinks and symlinks are also available for optimized cache linking but,
(unlike reflinks) they carry the risk of accidentally corrupting the cache if
tracked data files are modified in the workspace.

See [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) and
`dvc config cache` for more information.

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.

</details>

If your workspace uses Git, without DVC you would have to manually put each data
file or directory into `.gitignore`. DVC commands that track data files
automatically takes care of this for you! (You just have to add the changes with
Git.)

Refer to
[Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.
