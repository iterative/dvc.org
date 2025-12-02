---
title: 'How to Update Tracked Data'
description: 'Updating files or directories may mean either modifying some of
the data contents, or completely replacing them.'
---

# How to Update Tracked Data

Updating tracked files or directories may mean either
[modifying](#modifying-content) some of the data contents, or completely
[replacing](#replacing-files) them (under the same file name).

> See also `dvc move`.

When the `cache.type` config option is set to `symlink` or `hardlink` (not the
default, see `dvc config cache` for more info.), updating tracked files has to
be carried out with caution, to avoid data corruption. This is due to the way in
which DVC handles linking data files between the <abbr>cache</abbr> and the
<abbr>workspace</abbr> (refer to
[Large Dataset Optimization](/user-guide/data-management/large-dataset-optimization)
for details).

If you use `dvc.yaml` files and `dvc repro`, there is no need to manage stage
<abbr>outputs</abbr> manually. DVC removes them for you before regenerating
them.

Otherwise (the data was tracked with `dvc add`), use one of the procedures below
to "unlink" the data from the cache prior to updating it. We'll be working with
a `train.tsv` file:

## Modifying content

Unlink the file with `dvc unprotect`. This will make `train.tsv` safe to edit:

```cli
$ dvc unprotect train.tsv
```

Then edit the content of the file, for example with:

```cli
$ echo "new data item" >> train.tsv
```

Add the new version of the file back with DVC:

```cli
$ dvc add train.tsv
$ dvc push # If you have remote storage.

$ git add train.tsv.dvc
$ git commit -m "modify train data"
$ git push # If you have an upstream repo.
```

## Replacing files

If you want to replace the file altogether, you can take the following steps.

First, [stop tracking](/user-guide/how-to/stop-tracking-data) the file by using
`dvc remove` on the `.dvc` file. This will remove the `train.tsv.dvc` file, and it 
will unlink `train.tsv` from the <abbr>cache</abbr>:

```cli
$ dvc remove train.tsv.dvc
```

Next, replace the file with new content:

```cli
$ echo new > train.tsv
```

And start tracking it again:

```cli
$ dvc add train.tsv
$ git add train.tsv.dvc .gitignore
$ git commit -m "new train data"

# If you have remote storage and/or an upstream repo:
$ dvc push
$ git push
```
