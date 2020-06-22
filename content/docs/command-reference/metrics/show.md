# metrics show

Print [metrics](/doc/command-reference/metrics), with optional formatting.

## Synopsis

```usage
usage: dvc metrics show [-h] [-q | -v] [-a] [-T] [--all-commits] [-R]
                        [--show-json] [targets [targets ...]]

positional arguments:
  targets               Limit command scope to these metric files.
                        Using -R, directories to search metric files
                        in can also be given.
```

## Description

Finds and prints all metrics in the <abbr>project</abbr> by examining all of its
[DVC-files](/doc/user-guide/dvc-files-and-directories).

> This kind of metrics can be defined with the `-m` (`--metrics`) and `-M`
> (`--metrics-no-cache`) options of `dvc run`.

If `targets` are provided, it will show those specific metric files instead.
With the `-a` or`-T` options, this command shows the different metrics values
across all Git branches or tags, respectively. With the `-R` option, some of the
target can even be directories, so that DVC recursively shows all metric files
inside.

An alternative way to display metrics is the `dvc metrics diff` command, which
compares them with a previous version.

## Options

- `-a`, `--all-branches` - print metric file contents in all Git branches
  instead of just those present in the current workspace. It can be used to
  compare different experiments. Note that this can be combined with `-T` below,
  for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - the same as `-a` or `-T` above, but applies to _all_ Git  
  commits as well as the workspace. Useful for printing metric file contents for
  the entire existing commit history of the project.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `-R`, `--recursive` - determines the metric files to show by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

> This example is based on the `evaluate.dvc` stage file of our
> [Get Started](/doc/tutorials/get-started/experiments#project-metrics), where
> you can find the actual source code.

The basic use case shows the values in the current workspace:

```dvc
$ dvc metrics show
        eval.json:
                AUC: 0.66729
                error: 0.16982
                TP: 516
```

To see the history of the metrics starting with the workspace and down the Git
history use `--all-commits` option:

```dvc
$ dvc metrics show --all-commits
workspace:
        eval.json:
                AUC: 0.66729
                error: 0.16982
                TP: 516
cf5e7f87b72028e42e7ea05f17915b68645e93dc:
        eval.json:
                AUC: 0.65115
                error: 0.17304
                TP: 528
c7bef5524541dabf8556ed504fd02f55231f875e:
        eval.json:
                AUC: 0.65115
                error: 0.17304
                TP: 528
```

Metrics from different branches can be shown by `--all-branches` (`-a`) option:

```dvc
$ dvc metrics show -a
workspace:
        eval.json:
                AUC: 0.66729
                error: 0.16982
                TP: 516
master:
        eval.json:
                AUC: 0.65115
                error: 0.17304
                TP: 528
increase_bow:
        eval.json:
                AUC: 0.66524
                error: 0.17074
                TP: 521
```

The
[Compare Experiments](/doc/tutorials/get-started/experiments#compare-experiments)
chapter of our _Get Started_ covers the `-a` option to collect and print a
metric file value across all Git branches.
