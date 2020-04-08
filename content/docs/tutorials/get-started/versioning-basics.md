# Data Versioning Basics

DVC allows storing and versioning data files or directories, ML models, and
intermediate results with a regular Git workflow, without actually tracking the
file contents with Git. Let's get a dataset example to play with:

```dvc
$ mkdir data
$ dvc get https://github.com/iterative/dataset-registry \
          get-started/data.xml -o data/data.xml
```

> `dvc get` can download any <abbr>data artifact</abbr> tracked in a <abbr>DVC
> repository</abbr>, using the appropriate
> [remote storage](/doc/command-reference/remote) (analogous to `wget`, but for
> DVC/Git repos). In this case we use our
> [dataset-registry](https://github.com/iterative/dataset-registry)) as the
> source repository (refer to [Data Registries](/doc/use-cases/data-registries)
> for more info.)

## Start tracking data

To track a file with DVC, just run `dvc add` on it:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added data in a special **DVC-file**
(`data/data.xml.dvc`), a small text file with a human-readable
[format](/doc/user-guide/dvc-file-format). The above command also tells Git to
ignore the actual data contents, so that this version of the data can be safely
committed to the <abbr>repository</abbr>, using Git:

```dvc
$ git add data/.gitignore data/data.xml.dvc
$ git commit -m "Add raw data"
```

<details>

### Expand to learn about DVC internals

`dvc add` moves the data file to the project's <abbr>cache</abbr> (see
[DVC Files and Directories](/doc/user-guide/dvc-files-and-directories)), and
makes file links (or copies) with the original file names back in the
<abbr>workspace</abbr>, which is what you see inside the project.

```dvc
$ ls -R .dvc/cache
...
    .dvc/cache/a3:
    04afb96060aad90176268345e10355
```

The hash value of the `data/data.xml` file we just added,
`a304afb96060aad90176268345e10355` determines the path and file name shown
above. And if you check the `data/data.xml.dvc` DVC-file created by DVC, you
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

Refer to
[Versioning Data and Model Files](/doc/use-cases/versioning-data-and-model-files),
`dvc add`, and `dvc run` for more information on storing and versioning data
files with DVC.

## Store and share data

Now that your raw data is tracked by DVC, you can push it from your repository
to the default [remote storage](/doc/command-reference/remote).

> As seen in the intro's [Configure](/doc/tutorials/get-started#configure)
> section, we are using a **local remote** in this section for illustrative
> purposes.

```dvc
$ dvc push
```

Similar to pushing source code to a _Git remote_, `dvc push` ensures that your
data files and models are safely backed up remotely. This means that the data
can be pulled by yourself or by colleagues when and where needed. Usually, we
also want to `git commit` and `git push`, to save the new (or changed versions
of) [DVC-files](/doc/user-guide/dvc-file-format).

<details>

### Expand to learn more about DVC internals

You can check that the data has been backed up to the remote (`/tmp/dvc-storage`
local directory) with:

```dvc
$ ls -R /tmp/dvc-storage
...
/tmp/dvc-storage/a3:
04afb96060aad90176268345e10355
```

</details>

## Retrieve data

Imagine you're just cloning the Git repo that has been created so far in another
computer. This can be simulated by cloning our **example-get-started** repo from
GitHub, and checking out the
[`3-add-file`](https://github.com/iterative/example-get-started/tree/3-add-file)
tag:

```dvc
$ cd ~
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 3-add-file
```

If you list the files in this fresh <abbr>workspace</abbr>, or even in the
cache, you'll notice that the `data/data.xml` file is not there yet. This is
because it's not stored by Git! To get it, simply run:

```dvc
$ dvc pull
```

`dvc pull` downloads data files that are referenced in all present
[DVC-files](/doc/user-guide/dvc-file-format) from the <abbr>project</abbr>'s
remote storage, so usually we run it after `git clone`, `git pull`, or
`git checkout`.

Alternatively, if you want to retrieve a single file or directory, you can
specify the target like this:

```dvc
$ dvc pull data/data.xml.dvc
```

> In this case, both commands have the same result, as there's currently just
> one DVC-tracked file in the repo.

[DVC remotes](/doc/command-reference/remote), `dvc push`, and `dvc pull` provide
a basic collaboration workflow, the same way as Git remotes, `git push` and
`git pull`. See
[Sharing Data and Model Files](/doc/use-cases/sharing-data-and-model-files) for
more information.

## Import data

We've seen how to [push](#store-and-share-date) and [pull](#retrieve-data) data
from/to a remote storage. But what if we wanted to integrate a dataset or ML
model produced in one project into another one?

One way is to manually download the data and use `dvc add` to track it, like in
the beginning of this page. But the connection between the projects is only
known by the person doing this. Others wouldn't be able to tell where the data
came from or whether there are new versions available.

A better alternative is the `dvc import` command! Let's go back to the
<abbr>project</abbr> we're building, and replace `data/data.xml` by importing it
from the same source:

```dvc
$ cd ~/so-tag-predict
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

This downloads and overwrites the same `data/data.xml`, checks that it's in
`data/.gitignore`, and creates the `data/data.xml.dvc`
[DVC-file](/doc/user-guide/dvc-file-format). So far this seems identical to our
previous strategy, except that this time `data.xml.dvc` has additional metadata
that allows DVC to track changes in the source data. This allows `dvc update` to
bring in changes from the data source.

<details>

### Expand to learn more about DVC internals

DVC-files created by `dvc import` are called _import stages_. If we check the
difference against the regular DVC-file we previously had, we can see that the
latter has more fields, such as the data source `repo`, and `path` within it:

```dvc
$ git diff
...
--- a/data/data.xml.dvc
+++ b/data/data.xml.dvc
...
+deps:
+- path: get-started/data.xml
+  repo:
+    url: https://github.com/iterative/dataset-registry
+    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

> `dvc update` updates the `rev_lock` field of the corresponding DVC-file (when
> there are changes to bring in).

Note that the [dataset-registry](https://github.com/iterative/dataset-registry)
repository doesn't actually contain a `get-started/data.xml` file. Like,
`dvc get`, importing also downloads the data from the appropriate
[remote storage](/doc/command-reference/remote).

</details>

Let's wrap up by committing the import stage with Git:

```dvc
$ git add data/data.xml.dvc
$ git commit -m "Import raw data (overwrite)"
$ dvc push  # so others can pull the imported data in their repo copies
```
