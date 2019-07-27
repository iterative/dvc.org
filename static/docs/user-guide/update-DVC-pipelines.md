# Updating pipelines



> 1) Using `dvc move` to edit file paths of outputs or dependencies.
> 2) Editting by hand the outputs paths.
> 3) `dvc run` to make edits in the dependency files and `dvc commit` to save
> changes.

If your source file is a data file, then use `dvc move`:

`dvc move` is used if a file or a directory has been added to DVC with `dvc 
add`. The source file or directory is moved to its destination path, renamed 
and corresponding DVC-file is updated.

If your source file isn't data file then use `dvc run`. Then add the new file
with `dvc add`. If you check your file using `git mv` then it shows that your
path isn't updated. So, using `git mv` is not an option.

`dvc run` is used to create a pipeline. It can be shown in a connected
graph. While using `dvc run` and executing it with [-f,-o,-O,-m,-M] you can
edit your file paths by hand. `dvc run` connects each individual staged
commands to a graph.
