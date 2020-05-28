# Reproduce

In the previous chapters, we described our first
[pipeline](/doc/command-reference/pipeline). Basically, we generated a number of
[stage files](/doc/command-reference/run)
([`.dvc` files](/doc/user-guide/dvc-file-format)). These stages define individual
commands to execute towards a final result. Each depends on some data (either
raw data files or intermediate results from previous stages) and code files.

If you just cloned the
[project](https://github.com/iterative/example-get-started), make sure you first
fetch the input data from DVC by calling `dvc pull`.

It's now extremely easy for you or your colleagues to reproduce the result
end-to-end:

```dvc
$ dvc repro train.dvc
```

> If you've just followed the previous chapters, the command above will have
> nothing to reproduce since you've recently executed all the pipeline stages.
> To easily try this command, clone this example
> [GitHub project](https://github.com/iterative/example-get-started) and run it
> from there.

`train.dvc` describes which source code and data files to use, and how to run
the command in order to get the resulting model file. For each data file it
depends on, we can in turn do the same analysis: find a corresponding `.dvc` file
that includes the data file in its outputs, get dependencies and commands, and
so on. It means that DVC can recursively build a complete sequence of commands
it needs to execute to get the model file.

`dvc repro` essentially builds a dependency graph, detects stages with modified
dependencies or missing outputs and recursively executes commands (nodes in this
graph or pipeline) starting from the first stage with changes.

Thus, `dvc run` and `dvc repro` provide a powerful framework for _reproducible
experiments_ and _reproducible projects_.
