# metrics show

Print [metrics](/command-reference/metrics), with optional formatting.

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

Let's imagine we have a simple [stage](/command-reference/run) that produces an
`eval.json` metrics file. The basic use case shows the values in the current
workspace:

```cli
$ dvc metrics show
Path       AUC      TP    error
eval.json  0.66729  516   0.16982
```

To see the history of the metrics starting with the workspace and down the Git
history use `--all-commits` option:

```cli
$ dvc metrics show --all-commits
Revision                                  Path       AUC      TP    error
workspace                                 eval.json  0.66729  516   0.16982
85acdb826754d175c2981510e183625bc817b2e6  eval.json  0.66524  521   0.17074
0335250a77cc9c196a40ff7fff1f53300a849ead  eval.json  0.66729  516   0.16982
fe0af34f66bb713d5a0ae8d8affeb8bda1512d00  eval.json  0.65115  528   0.17304
a9918370c0761e78a12d9a7b7fa7ededb073937d  eval.json  0.65115  528   0.17304
```

Metrics from different branches can be shown by `--all-branches` (`-a`) option:

```cli
$ dvc metrics show -a
Revision      Path       AUC      TP    error
increase_bow  eval.json  0.66524  521   0.17074
main          eval.json  0.66729  516   0.16982
```
