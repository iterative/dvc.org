# Update a Tracked File

Due to the way DVC handles linking between the data files in the cache and
their counterparts in the working directory (see
[#799](https://github.com/iterative/dvc/issues/799) and
[#599](https://github.com/iterative/dvc/issues/599) for example), updating
tracked files has to be carried out with caution.

Assume `train.tsv` is tracked by dvc and you want to update it. Here updating
may mean either replacing `train.tsv` with a new file having the same name or
editing the content of the file.

If use DVC to track a file that is generated during your pipeline (e.g. some
intermediate result or a final model file - `model.pkl`) and you don't use
`dvc run` and `dvc repro` to manage your pipeline, use the procedure below
(`dvc remove`, execute, `dvc add`) to remove it from tracking prior to the
execution of the script which modifies it.

If you run `dvc repro` there is no need to remove generated (output) files
manually, DVC removes them for you before running the stage which generates
them.

## Replacing file

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

First, save a backup of the file:

```dvc
   $ cp train.tsv train.tsv.tmp
```

Next, un-track the file. This will remove `train.tsv` from the working dir:

```dvc
    $ dvc remove train.tsv.dvc
```

Edit the content of the file:

```dvc
    $ echo "new data item" >> train.tsv.tmp
```

And start tracking the file again:

```dvc
    $ mv train.tsv.tmp train.tsv
    $ dvc add train.tsv
    $ git add train.tsv.dvc
    $ git commit -m 'modify train data'
```

