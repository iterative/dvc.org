# metrics show

Print [metrics](/doc/command-reference/metrics), with optional formatting.

## Synopsis

```usage
usage: dvc metrics show [-h] [-q | -v] [-a] [-T] [--all-commits]
                        [--json] [--md] [-R]
                        [targets [targets ...]]

positional arguments:
  targets               Limit command scope to these metrics files.
                        Using -R, directories to search metrics files
                        in can also be given.
```

## Description

Finds and prints all metrics in the <abbr>project</abbr> by examining all of its
`dvc.yaml` files (by default).

If `targets` are provided, it will show those specific metrics files instead.
With the `-a` or `-T` options, this command shows the different metrics values
across all Git branches or tags, respectively. With the `-R` option, some of the
target can even be directories, so that DVC recursively shows all metrics files
inside.

> Note that targets don't necessarily have to be defined in `dvc.yaml`. For that
> reason, this command doesn't require an existing DVC project or Git repo to
> run in.

An alternative way to display metrics is the `dvc metrics diff` command, which
compares them with a previous version.

## Options

- `-a`, `--all-branches` - print metrics file contents in all Git branches, as
  well as in the workspace. It can be used to compare different experiments.
  Note that this can be combined with `-T` below, for example using the `-aT`
  flags.

- `-T`, `--all-tags` - print metrics file contents in all Git tags, as well as
  in the workspace. Note that this can be combined with `-a` above, for example
  using the `-aT` flags.

- `-A`, `--all-commits` - print metrics file contents in all Git commits, as
  well as in the workspace. This prints metrics in the entire commit history of
  the project.

- `--json` - prints the command's output in easily parsable JSON format, instead
  of a human-readable table.

- `--md` - prints the command's output in Markdown table format.

- `-R`, `--recursive` - determines the metrics files to show by searching each
  target directory and its subdirectories for valid metrics files. If there are
  no directories among the `targets`, this option has no effect.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's imagine we have a simple [stage](/doc/command-reference/run) that produces
an `eval.json` metrics file. The basic use case shows the values in the current
workspace:

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
