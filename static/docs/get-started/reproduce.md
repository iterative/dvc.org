# Reproduce

In the previous chapters, we described our first pipeline. Basically, we created
a number of [stage files](/doc/commands-reference/run). Each of these
[DVC-files](/doc/user-guide/dvc-file-format) describes single stage we need to
run towards a final result (a [pipeline]](/doc/commands-reference/pipeline)).
Each depends on some data (either raw data files or intermediate results from
previous stages) and code files.

If you just cloned the
[project](https://github.com/iterative/example-get-started), make sure you first
fetch the input data from DVC by calling `dvc pull`.

It's now extremely easy for you or anyone in your team to reproduce the result
end-to-end:

```dvc
$ dvc repro train.dvc
```

> If you've just followed the previous chapters, the command above will have
> nothing to reproduce since you've already run all the pipeline stages. To
> easily try this command, you can clone this example
> [Github project](https://github.com/iterative/example-get-started) first.

`train.dvc` file internally describes what data files and code we should take
and how to run the command to get the binary model file. For each data file it
depends on, we can in turn do the same analysis – find a corresponding DVC-file
that includes the data file in its outputs, get dependencies and commands, and
so on. It means that DVC can recursively build a complete tree of commands it
needs to execute to get the model file.

`dvc repro` is, essentially, building this execution graph, detects stages with
modified dependencies or missing outputs and recursively executes this graph
starting from these stages.

Thus, `dvc run` and `dvc repro` provide a powerful framework for _reproducible
experiments_ and _reproducible projects_.
