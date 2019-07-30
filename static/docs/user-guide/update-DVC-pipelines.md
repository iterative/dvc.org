# Updating pipelines

If you need to rename or relocate the file paths and/or dependencies and
outputs of a specific DVC-file, then you can

- use `dvc move` to edit file paths of outputs or dependencies.
- `dvc run` to make edits in the files and/or dependencies and outputs then
  `dvc commit` to save changes to cache.

If you want to relocate or rename data files and/or directories, dependencies
and outputs use `dvc move`. `dvc move` is not permitted for stages that are
not data sources.

```dvc
$ dvc move output/models/variables/risk_dict.json output/models/risk_dict.json
?[31mError?[39m: failed to move 'output/models/variables/risk_dict.json' -> 'output/models/risk_dict.json'

- move is not permitted for stages that are not data sources. You need to either move 

'output\model_01_pre_estimation.dvc' to a new location and edit it by hand, or remove

'output\model_01_pre_estimation.dvc' and create a new one at the desired location.
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

If you change your file using `mv source destination` then it shows that your
index isn't updated but the DVC files and/or directories are relocated to
destination. So, after using regular `mv` you have to use
`git add destination` and `git rm source` to update the index for both source
and destination paths.
