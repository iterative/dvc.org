# Comparing Experiments

After running the experiments, it's important to compare them by their
parameters and the metrics they produced. DVC provides three commands to list,
tabulate and compare the experiments. In this section we discuss various use
cases and options to streamline the work in experimentation.

## List experiments in the workspace

After running the experiments, you can get a list of them by `dvc exp list`.
Without any options this command lists the experiments after the most recent
commit.

```dvc
$ dvc exp list
```

If you want to list all the experiments in the repository independent of the
commits. you can use `--all` flag.

```dvc
$ dvc exp list --all
```

## List experiments in all commits

## List experiments in another Git remote

As we discussed in [Sharing Experiments] section, `dvc exp push` enables to
upload experiments to Git remotes. When you want to review these experiments,
you can do so by supplying the Git remote name to `dvc exp list`.

```dvc
$ dvc exp list origin
```

This command lists the experiments originated from `HEAD`. If you want to see
all the experiments in the repository, you need to add `--all` argument to this
command as well.

```dvc
$ dvc exp list origin --all
```

## List experiment names to use in scripts

When you want to get a _machine-oriented_ list of experiments to use in scripts,
`dvc exp list` may be printing more than the necessary information. You can use
get only the names of the experiments via `--names-only` flag. The following
command provides a flat list of experiment names that you can use in scripts
rather easily.

```dvc
$ dvc exp list --names-only --all
```

## List experiments of a particular commit, tag or branch

## Show a table of experiments

## Customize the table of experiments

## Get a JSON list of experiments to use scripts

## Compare two experiments

## Compare an experiment with the workspace

## Customize the output of diff table

### Get a JSON list of changes to use in scripts

### Get a Markdown table for the differences

### Ignore the path
