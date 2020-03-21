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

DVC stores information about the added data in a special file called a
**DVC-file**. DVC-files are small text files with a human-readable
[format](/doc/user-guide/dvc-file-format) and they can be committed with Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data to project"
```

Committing DVC-files with Git allows us to track different versions of the
<abbr>project</abbr> data as it evolves with the source code tracked by Git.

<details>

### Expand to learn about DVC internals

`dvc add` moves the actual data file to the cache directory (see
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)), while
the entries in the workspace may be file links to the actual files in the DVC
cache.

```dvc
$ ls -R .dvc/cache
    .dvc/cache/a3:
    04afb96060aad90176268345e10355
```

`a304afb96060aad90176268345e10355` above is the hash value of the `data.xml`
file we just added with DVC. If you check the `data/data.xml.dvc` DVC-file, you
will see that it has this string inside.

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

# Store and Share Data

Now, that your data files are managed by DVC (see
[Add Files](/doc/tutorials/get-started/add-files)), you can push them from your
repository to the default [remote](/doc/command-reference/remote) storage\*:

```dvc
$ dvc push
```

The same way as with Git remote, it ensures that your data files and your models
are safely stored remotely and are shareable. This means that the data can be
pulled by yourself or your colleagues whenever you need it.

Usually, you run it along with `git commit` and `git push` to save the changed
[DVC-files](/doc/user-guide/dvc-file-format).

The `dvc push` command allows one to upload data to remote storage. It doesn't
save any changes in the code or DVC-files. Those should be saved by using
`git commit` and `git push`.

> \*As noted in the DVC [configuration](/doc/tutorials/get-started/configure)
> chapter, we are using a **local remote** in this section for illustrative
> purposes.

<details>

### Expand to learn more about DVC internals

You can check now that actual data file has been copied to the remote we created
in the [configuration](/doc/tutorials/get-started/configure) chapter:

```dvc
$ ls -R /tmp/dvc-storage
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

`a304afb96060aad90176268345e10355` above is the hash value of the `data.xml`
file. If you check the `data.xml.dvc`
[DVC-file](/doc/user-guide/dvc-file-format), you will see that it has this
string inside.

</details>

# Import Data

We've seen how to [push](/doc/tutorials/get-started/store-data) and
[pull](/doc/tutorials/get-started/retrieve-data) data from/to a <abbr>DVC
project</abbr>'s [remote](/doc/command-reference/remote). But what if we wanted
to integrate a dataset or ML model produced in one project into another one?

One way is to manually download the data (with `wget` or `dvc get`, for example)
and use `dvc add` to track it, but the connection between the projects would be
lost. We wouldn't be able to tell where the data came from or whether there are
new versions available. A better alternative is the `dvc import` command:

<!--
In the [Add Files](/doc/tutorials/get-started/add-files) chapter, for example, we download
raw data using the `dvc get` command, and then track it with `dvc add`. Let's
replace this previous step with an _import stage_:

```dvc
$ ...
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```
-->

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml
```

This downloads `data.xml` from our
[dataset-registry](https://github.com/iterative/dataset-registry) project into
the current working directory, adds it to `.gitignore`, and creates the
`data.xml.dvc` [DVC-file](/doc/user-guide/dvc-file-format) to track changes in
the source data. With _imports_, we can use `dvc update` to bring in changes in
the external data source before
[reproducing](/doc/tutorials/get-started/reproduce) any <abbr>pipeline</abbr>
that depends on this data.

<details>

### Expand to learn more about imports

Note that the [dataset-registry](https://github.com/iterative/dataset-registry)
repository doesn't actually contain a `get-started/data.xml` file. Instead, DVC
inspects
[get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
and tries to retrieve the file using the project's default remote (configured
[here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

DVC-files created by `dvc import` are called _import stages_. They use the
`repo` field in the dependencies section (`deps`) in order to track source data
changes (as an [external dependency](/doc/user-guide/external-dependencies)),
enabling the reusability of data artifacts. For example:

```yaml
md5: fd56a1794c147fea48d408f2bc95a33a
locked: true
deps:
  - path: get-started/data.xml
    repo:
      url: https://github.com/iterative/dataset-registry
      rev_lock: 7476a858f6200864b5755863c729bff41d0fb045
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
    cache: true
    metric: false
    persist: false
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

> Note that `dvc update` updates the `rev_lock` field of the corresponding
> DVC-file (when there are changes to bring in).

</details>

Since this is not an official part of this _Get Started_, bring everything back
to normal with:

```dvc
$ git reset --hard
$ rm -f data.*
```

> See also `dvc import-url`.

# Retrieve Data

> You'll need to complete the
> [initialization](/doc/tutorials/get-started/initialize) and
> [configuration](/doc/tutorials/get-started/configure) chapters before being
> able to run the commands explained here.

To retrieve data files into the <abbr>workspace</abbr> in your local machine,
run:

```dvc
$ rm -f data/data.xml
$ dvc pull
```

This command downloads data files that are referenced in all
[DVC-files](/doc/user-guide/dvc-file-format) in the <abbr>project</abbr>. So,
you usually run it after `git clone`, `git pull`, or `git checkout`.

Alternatively, if you want to retrieve a single dataset or a file you can use:

```dvc
$ dvc pull data/data.xml.dvc
```

DVC remotes, `dvc push`, and `dvc pull` provide a basic collaboration workflow,
the same way as Git remotes, `git push` and `git pull`. See
[Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files) for
more information.
