# metrics diff

Compare [metrics](/doc/command-reference/metrics) between two commits in the
<abbr>DVC repository</abbr>, or between a commit and the <abbr>workspace</abbr>.

> Requires that Git is being used to version the project.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v]
                        [--targets [<paths> [<paths> ...]]] [-R]
                        [--all] [--json] [--md] [--no-path]
                        [--precision <n>]
                        [a_rev] [b_rev]

positional arguments:
  a_rev                 Old Git commit to compare (defaults to HEAD)
  b_rev                 New Git commit to compare (defaults to the
                        current workspace)
```

## Description

Provides a quick way to compare metrics among experiments in the repository
history. The differences shown by this command include the new value, and
numeric difference (delta) from the previous value of metrics (rounded to 5
digits precision).

Without arguments, `dvc metrics diff` compares metrics currently present in the
<abbr>workspace</abbr> (uncommitted changes) with the latest committed versions
(required). Only metrics that changed are listed, by default (show everything
with `--all`).

`a_rev` and `b_rev` are optional Git commit hashes, tags, or branch names to
compare. A single specified revision results in comparing it against the
workspace.

> Note that targets don't necessarily have to be defined in `dvc.yaml`. For that
> reason, this command doesn't require an existing DVC project to run in; It
> works in any Git repo.

All metrics defined in `dvc.yaml` are used by default, but specific metrics
files can be specified with the `--targets` option.

Another way to display metrics is the `dvc metrics show` command, which lists
all the current metrics (without comparisons).

## Options

- `--targets <paths>` - specific metrics files to compare. It accepts `paths` to
  any valid metrics file, regardless of whether `dvc.yaml` is currently tracking
  any metrics in them. Using `-R`, directories to search metrics files in can
  also be given.

  When specifying arguments for `--targets` before `revisions`, you should use
  `--` after this option's arguments (POSIX terminals), e.g.:

  ```dvc
  $ dvc metrics diff --targets t1.json t2.yaml -- HEAD v1
  ```

- `-R`, `--recursive` - determines the metrics files to use by searching each
  target directory and its subdirectories for valid metrics files. If there are
  no directories among the `--targets`, this option has no effect.

- `--all` - list all metrics, including those without changes.

- `--json` - prints the command's output in JSON format (machine-readable)
  instead of a human-readable table.

- `--md` - prints the command's output in the Markdown table format
  ([GFM](https://github.github.com/gfm/#tables-extension-)).

- `--no-path` - hide the "Path" column that lists the param/metrics file
  location. Useful when only one metrics file exists, for example

- `--precision <n>` -
  [round](https://docs.python.org/3/library/functions.html#round) decimal values
  to `n` digits of precision (5 by default).

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Start by creating a metrics file and commit it (see the `-M` option of
`dvc stage add` for more details):

```dvc
$ dvc stage add -n eval -M metrics.json \
                'echo {"AUC": 0.9643, "TP": 527} > metrics.json'

$ dvc repro

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
had in the latest commit (`HEAD`):

```dvc
$ dvc metrics diff
Path          Metric    HEAD    workspace  Change
metrics.json  AUC       0.9643  0.9671     0.0028
metrics.json  TP        527     531        4
```

## Example: compare metrics among specific versions

Metrics files committed with Git can be compared by referencing the commits (any
two [revisions](https://git-scm.com/docs/revisions)):

```dvc
$ dvc metrics diff --targets metrics.json -- 305fb8b c7bef55
Path          Metric    305fb8b  c7bef55  Change
metrics.json  AUC       0.9643   0.9743   0.0100
metrics.json  TP        527      516      -11
```
