# metrics diff

Compare [metrics](/doc/command-reference/metrics) between two commits in the
<abbr>DVC repository</abbr>, or between a commit and the <abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v]
                        [--targets [<paths> [<paths> ...]]] [-R]
                        [--all] [--show-json] [--show-md] [--no-path]
                        [--old] [--precision <n>]
                        [a_rev] [b_rev]

positional arguments:
  a_rev                 Old Git commit to compare (defaults to HEAD)
  b_rev                 New Git commit to compare (defaults to the
                        current workspace)
```

## Description

This command provides a quick way to compare metrics among experiments in the
repository history. All metrics defined in `dvc.yaml` are used by default. The
differences shown by this command include the new value, and numeric difference
(delta) from the previous value of metrics (rounded to 5 digits precision).

`a_rev` and `b_rev` are Git commit hashes, tag, or branch names. If none are
specified, `dvc metrics diff` compares metrics currently present in the
<abbr>workspace</abbr> (uncommitted changes) with the latest committed versions
(required). A single specified revision results in comparing the workspace and
that version.

Another way to display metrics is the `dvc metrics show` command, which just
lists all the current metrics, without comparisons.

## Options

- `--targets <paths>` - limit command scope to these metrics files. Using `-R`,
  directories to search metrics files in can also be given. When specifying
  arguments for `--targets` before `revisions`, you should use `--` after this
  option's arguments, e.g.:

  ```dvc
  $ dvc metrics diff --targets t1.json t2.yaml -- HEAD v1
  ```

  Alternatively, you can also run the above statement as:

  ```dvc
  $ dvc metrics diff HEAD v1 --targets t1.json t2.json
  ```

- `-R`, `--recursive` - determines the metrics files to use by searching each
  target directory and its subdirectories for DVC-files to inspect. If there are
  no directories among the `targets`, this option is ignored.

- `--all` - list all metrics, even those without changes.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in Markdown table format.

- `--old` - show old metric value in addition to the new value.

- `--no-path` - don't show metric path in the result table. This option is
  useful when only one metrics file is in use or there is no intersection
  between the metric names.

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) metrics to `n`
  digits precision after the decimal point. Rounds to 5 digits by default.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Start by creating a metrics file and commit it (see the `-M` option of `dvc run`
for more details):

```dvc
$ dvc run -n eval -M metrics.json \
          'echo {"AUC": 0.9643, "TP": 527} > metrics.json'

$ cat metrics.json
{"AUC": 0.9643, "TP": 527}

$ git add dvc.* metrics.json
$ git commit -m "Add metrics file"
```

Now let's simulate a change in our AUC metric:

```dvc
$ echo '{"AUC":0.9671, "TP":531}' > metrics.json

$ git diff
...
-{"AUC":0.9643, "TP":527}
+{"AUC":0.9671, "TP":531}
```

To see the change, let's run `dvc metrics diff`. This compares our current
<abbr>workspace</abbr> (including uncommitted local changes) metrics to what we
had in the previous commit:

```dvc
$ dvc metrics diff
Path          Metric    Value    Change
metrics.json  AUC       0.9671   0.0028
metrics.json  TP        531      4
```

## Example: compare metrics among specific versions

Metrics files committed with Git can be compared by referencing the commits (any
two [revisions](https://git-scm.com/docs/revisions)):

```dvc
$ dvc metrics diff --targets metrics.json -- HEAD c7bef55
Path       Metric    Value    Change
eval.json  ACU       0.66729  0.01614
eval.json  TP        516      -12
```
