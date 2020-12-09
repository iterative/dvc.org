---
title: 'How to Update Tracked Data'
description: 'Updating files or directories may mean either modifying some of
the data contents, or completely replacing them.'
---

# How to Update Tracked Data

Updating tracked files or directories may mean either
[modifying](#modifying-content) some of the data contents, or completely
[replacing](#replacing-file) them (under the same file name).

When the `cache.type` config option is set to `symlink` or `hardlink` (not the
default, see `dvc config cache` for more info.), updating tracked files has to
be carried out with caution, to avoid data corruption. This is due to the way in
which DVC handles linking data files between the <abbr>cache</abbr> and the
<abbr>workspace</abbr> (refer to
[Large Dataset Optimization](/doc/user-guide/large-dataset-optimization) for
details).

> For an example of the cache corruption problem see
> [issue #599](https://github.com/iterative/dvc/issues/599) in our GitHub repo.

If you use `dvc.yaml` files and `dvc repro`, there is no need to manage stage
<abbr>outputs</abbr> manually. DVC removes them for you before regenerating
them.

Otherwise (the data was tracked with `dvc add`), use one of the procedures below
to "unlink" the data from the cache prior to updating it. We'll be working with
a `train.tsv` file:

## Modifying content

Unlink the file with `dvc unprotect`. This will make `train.tsv` safe to edit:

```dvc
$ dvc unprotect train.tsv
```

Then edit the content of the file, for example with:

```dvc
$ echo "new data item" >> train.tsv
```

Add the new version of the file back with DVC:

```dvc
$ dvc add train.tsv
$ git add train.tsv.dvc
$ git commit -m "modify train data"
```

## Replacing files

If you want to replace the file altogether, you can take the following steps.

First, [stop tracking](/doc/user-guide/how-to/stop-tracking-data) the file by
using `dvc remove` on the `.dvc` file. This will remove `train.tsv` from the
workspace (and unlink it from the <abbr>cache</abbr>):

```dvc
$ dvc remove train.tsv.dvc
```

Next, replace the file with new content:

```dvc
$ echo new > train.tsv
```

And start tracking it again:

```dvc
$ dvc add train.tsv
$ git add train.tsv.dvc .gitignore
$ git commit -m "new train data"
```
