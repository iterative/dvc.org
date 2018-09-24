# Update a Tracked File

Due to the way dvc handles linking between the data files in the cache and
their counterparts in the working directory (see
[#799](https://github.com/iterative/dvc/issues/799) and
[#599](https://github.com/iterative/dvc/issues/599) for example), updating
tracked files has to be carried out with caution.

Assume `train.tsv` is tracked by dvc and you want to update it.
Here updating may mean either replacing `train.tsv` with a new file having the
same name or editing the content of the file.

## Replacing

If you want to replace the file you should take the following steps.

First, un-track the file. This will remove `train.tsv` from the working dir:

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
    $ git add train.tsv.dvc
    $ git commit -m 'new train data'
```

## Modifying content

This case is very similar to the previous one:

First, save a backup of the file

```dvc
   $ cp train.tsv train.tsv.tmp
```

Next, un-track the file. This will remove train.tsv from the working dir

```dvc
    $ dvc remove train.tsv.dvc
```

Edit the content of the file:

```dvc
    $ echo new >> train.tsv
```

And start tracking the file again:

```dvc
    $ dvc add train.tsv
    $ git add train.tsv.dvc
    $ git commit -m 'modify train data'
```

### Careful

If `train.tsv` is generated during your pipeline (e.g. some intermidate
result), you have to be careful and remove it from tracking prior to the
execution of the pipeline which will alter it.
