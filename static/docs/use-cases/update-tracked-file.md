# Update a tracked file

Due to the way dvc handles linking between the data files in the cache and
their counterparts in the working directory (see
[#799](https://github.com/iterative/dvc/issues/799) and
[#599](https://github.com/iterative/dvc/issues/599) for example), updating
tracked files has to be carried out with caution.
Assume `train.tsv` is tracked by dvc and you want to update it.
Here updating may mean either replacing `train.tsv` with a new file having the
same name or editing the content of the file.

## Replacing `train.tsv`

If you want to replace the file you should take the following steps:

```bash
# First un-track the file. This will remove train.tsv from the working dir
dvc remove train.tsv.dvc
# Replace the file with new content
echo new > train.tsv
# Track the file again
dvc add train.tsv
git add train.tsv.dvc
git commit -m New
```

## Editing the content of `train.tsv`

This case is very similar to the previous one:

```bash
# Save a backup of the file
cp train.tsv train.tsv.tmp
# Next, un-track the file. This will remove train.tsv from the working dir
dvc remove train.tsv.dvc
# Edit the content of the file
echo new >> train.tsv
# Track the file again
dvc add train.tsv
git add train.tsv.dvc
git commit -m Edit
```

### Careful

If `train.tsv` is generated during your pipeline (e.g. some intermidate
result), you have to be careful and remove it from tracking prior to the
execution of the pipeline which will alter it.
