# Updating pipelines

If you need to rename or relocate the file paths and/or dependencies of a
specific DVC-file, then you can 

- use `dvc move` to edit file paths of outputs or dependencies.
- `dvc run` to make edits in the files and/or dependencies and `dvc commit` to
  save changes.

If your source file is a data file, then use `dvc move`:

`dvc move` is used if a file or a directory has been added to DVC with `dvc 
add`. The source file or directory is moved to its destination path, renamed 
and corresponding DVC-file is updated.

First add DVC files to get tracked by DVC file-tree. Use `dvc add data.dvc`
and the updated content of the `data.tsv.dvc`:

md5: 3d1a3e5a5b666390e198d6a6ae83784b
outs:
  - cache: true
    md5: c8263e8422925b0872ee1fb7c959451a
    path: data.tsv

Then use `dvc move` to rename the files and/or direcories and `dvc move`
change its location and our initial file is also moved.

If your source file isn't data file then use `dvc run`. Change the location of
the files and/or directories by hand. It will create a pipeline to show the
changes made to the connected graph.

$ dvc run -d test.txt -f stages/test.dvc -o result.out \
  "cat test.txt | wc -l > result.out"

$ tree .

.
├── result.out
├── stages
│   └── test.dvc
└── test.txt


If you check your file using `git mv` then it shows that your path isn't
updated but the DVC files and/or directories are relocated to destination. So,
using `git mv` is not an option.
