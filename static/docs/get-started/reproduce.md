# Reproduce

In the previous section, we described our first pipeline. Basically, we created
a number of [DVC-file](/doc/user-guide/dvc-file-format). Each file describes a
single stage we need to run (a pipeline) towards a final result. Each depends on
some data (either raw data files or intermediate results from another DVC-file)
and code files.

If you just cloned the
[project](https://github.com/iterative/example-get-started), make sure you first
fetch the input data from DVC by calling `dvc pull`.

It's now extremely easy for you or anyone in your team to reproduce the result
end-to-end:

```dvc
$ dvc repro train.dvc
```

`train.dvc` file internally describes what data files and code we should take
and how to run the command to get the binary model file. For each data file it
depends on, we can, in turn, do the same analysis - find a corresponding
DVC-file that includes the data file in its outputs, get dependencies and
commands, and so on. It means that DVC can recursively build a complete tree of
commands it needs to execute to get the model file.

`dvc repro` is, essentially, building this execution graph, detects stages with
modified dependencies or missing outputs and recursively executes this graph
starting from these stages.

Thus, `dvc run` and `dvc repro` provide a powerful framework for _reproducible
experiments_ and _reproducible projects_.
