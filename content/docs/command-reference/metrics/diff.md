# metrics diff

Show changes in [project metrics](/doc/command-reference/metrics), between
commits in the <abbr>DVC repository</abbr>, or between a commit and the
<abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v]
                        [--targets [<path> [<path> ...]]]
                        [-t <type>] [-x <path>] [-R]
                        [--show-json] [--show-md]
                        [a_ref] [b_ref]

positional arguments:
  a_rev                 Old Git commit to compare (defaults to HEAD)
  b_rev                 New Git commit to compare (defaults to the
                        current workspace)
```

## Description

This command provides a quick way to compare metrics among experiments in the
repository history. Requires that Git is being used to version the project
metrics.

> Metrics can be defined with `dvc metrics add`, ot the `-m` and `-M` options of
> `dvc run`.

Run without arguments, this command compares metrics currently present in the
<abbr>workspace</abbr> uncommitted changes) with the latest committed version.

The differences shown by this command include the new value, and numeric
difference (delta) from the previous value of metrics (with 3-digit accuracy).
They're calculated between two commits (hash, branch, tag, or any
[Git revision](https://git-scm.com/docs/revisions)) for all metrics in the
<abbr>project</abbr>, found by examining all of the
[DVC-files](/doc/user-guide/dvc-file-format) in both references.

## Options

- `--targets <paths>` - limit the comparison to these specific metric files.

- `-R`, `--recursive` - determines the metric files to use by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `-t <type>`, `--type <type>` - specify a type of the metric file. Accepted
  values are: `json`. It will be saved into the corresponding DVC-file, and used
  to determine how to handle displaying metrics. See `dvc metrics show` for more
  details.

  This option will override any `type` and `xpath` values defined in the
  corresponding DVC-file. If no `type` is provided or found in the DVC-file, DVC
  will try to detect it based on file extension.

- `-x <path>`, `--xpath <path>` - specify a path within a metric file to show
  changes for a specific metric value only. Should be used if the metric file
  contains multiple numbers and you want to use only one of them. Only a single
  path is allowed. It will override `xpath` defined in the corresponding
  DVC-file. See `dvc metrics show` for more details.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in Markdown table format.

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
