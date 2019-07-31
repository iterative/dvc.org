# Updating pipelines

If you need to rename or relocate a DVC-file and/or dependencies and outputs
of a specific DVC-file, then you can

- use `dvc move` to edit file paths of outputs or dependencies.
- `dvc run` to make edits in the files and/or dependencies and outputs then
  `dvc commit` to save changes to cache.

If you want to move or rename data files and/or directories, dependencies
and outputs use `dvc move`. It modifies the location of corresponding DVC-file
and changes the index of both the source and destination files. `dvc move` is
not permitted for stages that are not data sources. The DVC-files to be moved
by `dvc move` shouldn't be `.json`, `.py`, `.dvc` rather be `.tsv` or `.csv`
DVC-files.

```dvc
$ dvc move example1.json exam.json
ERROR: failed to move 'train.py' -> 'train1.py' - unable to find DVC-file with
output 'train.py'
```

`dvc move` is used if a file or a directory has been added to DVC with `dvc 
add`. The source file or directory is moved to its destination path, renamed 
and corresponding DVC-file is updated.

First add DVC-files to get tracked by DVC file-tree. Use `dvc add data.dvc`
and the updated content of the `data.tsv.dvc`:

```yaml
md5: 3d1a3e5a5b666390e198d6a6ae83784b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c959451a
    path: data.tsv
```

Then use `dvc move` to rename the files and/or direcories and `dvc move`
change its location and our initial file is also moved to the new location.

If your source file isn't data file then use `dvc run`. Change the location of
the files and/or directories by hand. It will create a pipeline to show the
changes made to the connected graph.

```dvc
$ dvc run -d test.txt -f stages/test.dvc -o result.out \
  "cat test.txt | wc -l > result.out"

$ tree .

.
├── result.out
├── stages
│   └── test.dvc
└── test.txt
```

If you change your file using `mv src dst` then it shows that your index isn't
updated but the DVC files and/or directories are relocated to destination. So,
after using regular `mv` you have to use `git add dst` and `git rm src` to
update the index for both source and destination paths.

While user doesn't need to use `git add` after `dvc move` or `dvc run` to
change the index of both the source and destination files i.e., it gets
updated automatically. 
