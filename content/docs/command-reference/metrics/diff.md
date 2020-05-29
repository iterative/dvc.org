# metrics diff

Show changes in [project metrics](/doc/command-reference/metrics), between
commits in the <abbr>DVC repository</abbr>, or between a commit and the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v] [--targets [<paths> [<paths> ...]]]
                        [-R] [--all] [--show-json] [--show-md] [--no-path]
                        [--old] [a_rev] [b_rev]

positional arguments:
  a_rev                 Old Git commit to compare (defaults to HEAD)
  b_rev                 New Git commit to compare (defaults to the
                        current workspace)
```

## Description

This command provides a quick way to compare metrics among experiments in the
repository history. It requires that Git is being used to version the metrics.

> Metrics can be defined with the `-m` (`--metrics`) and `-M` options of
> `dvc run`.

Run without arguments, this command compares metrics currently present in the
<abbr>workspace</abbr> uncommitted changes) with the latest committed version.

The differences shown by this command include the new value, and numeric
difference (delta) from the previous value of metrics (with 3-digit accuracy).
They're calculated between two commits (hash, branch, tag, or any
[Git revision](https://git-scm.com/docs/revisions)) for all metrics in the
<abbr>project</abbr>, found by examining all of the
[DVC-files](/doc/user-guide/dvc-file-format) in both references.

Another way to display metrics is the `dvc metrics show` command, which just
lists all the current metrics without comparisons.

## Options

- `--targets <paths>` - limit the comparison to these specific metric files.

- `-R`, `--recursive` - determines the metric files to use by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `--all` - list all metrics, even those without changes.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in Markdown table format.

- `--old` - Show old metric value in addition to the new value.

- `--no-path` - Don't show metric path in the result table. This option is
  useful when only one metrics file is in use or there is no intersection
  between the metrics names.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Start by creating a simple metrics file and commit it:

```dvc
$ dvc run -M metrics.json \
          'echo {\"AUC\": 0.9643, \"TP\": 527} > metrics.json'
$ git add metrics.json metrics.json.dvc
$ git commit -m "Add metrics file"
```

```
$ cat metrics.json
{"AUC":0.9643, "TP":527}
```

Now let's mock a change in our AUC metric:

```
$ echo {\"AUC\":0.9671, \"TP\":531} > metrics.json

$ git diff
--- a/metrics.json
+++ b/metrics.json
@@ -1 +1 @@
-{"AUC":0.9643, "TP":527}
+{"AUC":0.9671, "TP":531}
```

To see the change, let's run `dvc metrics diff`. This compares our current
<abbr>workspace</abbr> (including uncommitted local changes) metrics to what we
had in the previous commit:

```
$ dvc metrics diff
Path          Metric    Value    Change
metrics.json  TP        531      4
metrics.json  AUC       0.967    0.003
```
