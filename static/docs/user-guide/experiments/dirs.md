# How to Manage Experiments by Directories

Using a separate directory for each experiment is the most intuitive solution
for managing experiments and is the first thing that comes to mind. Most of
DS/ML practitioners are already familiar with this approach.

<p align="center">
<img src="/static/img/user-guide/experiments/dirs.png" />
</p>

This approach is most suitable when the different experiments that are being
managed do not have significant differences in their code or the pipeline, but
maybe change on the input datasets, processing parameters, configuration
settings, etc.

Often it is possible to generate these experiment directories automatically (or
almost automatically) from the code of the main project (using the parameters or
configuration settings), so keeping them in Git is not interesting or useful.
What we would like to track instead are just the parameters that were used to
generate the experiment directory and the results of the evaluation (metrics),
so that we can figure out which parameters give the best results.

## Examples

There is a very basic example of using directories for each experiment at the
end of
[this interactive tutorial](https://katacoda.com/dvc/courses/basics/pipelines).

## How it works

If we have a directory named `experiment1/` which contains the pipeline of the
first experiment, and we want to create another experiment on `experiment2/`,
which is based on the first one, often it is as easy as:

```dvc
$ cp --reflink -R experiment1/ experiment2/
```

Then we can continue with modifying `experiment2/`, and finally we can produce
its results with:

```dvc
$ dvc repro -R experiment2/
```

The most important DVC commands, like `dvc commit`, `dvc checkout`, `dvc repro`,
`dvc pull`, `dvc push`, etc. can take the option `-R, --recursive` which is very
convenient for experiment directories.

The command `dvc metrics show` as well can take this option:

```dvc
$ dvc metrics show -R experiment2/
```

However, if we use just `dvc merics show`, without any options or targets, it
will show the metrics of all the experiments, so that we can compare them.

Deleting an experiment is as easy as:

```dvc
$ rm -rf experiment2/
```

However we should make sure to save first the parameters that we used for this
experiment and its metrics (results).

<details>

### Tip: Use a script to create experiments

When we build a pipeline we have to use some long `dvc run` commands, with lots
of options, to define stages. Doing all this manually is long and tedious and
error-prone. The recommended Linux practice in such cases is to record all the
commands in a bash script, which can then be used to build the whole pipeline at
once.

Some of the benefits of this approach are these:

- Typing mistakes while building the pipeline are avoided.
- Modification of the pipeline becomes easier and consistent (for example using
  find/replace).
- Building pipelines becomes flexible (for example bash variables can be used).
- Pipelines become reusable (other projects can copy/paste and customize them)

Using a script to create a pipeline is also very convenient when we want to
manage experiments with directories, because it allows us to customize the
experiment based on some options and parameters that we pass to the script.

This can further automate the process of creating a new experiment, producing
its results, saving them, and finally deleting the experiment directory. This
way we can automatically iterate for example over a large number of
hyper-parameters and save the corresponding results.

The implementation details actually depend on the specifics of each project.

</details>
