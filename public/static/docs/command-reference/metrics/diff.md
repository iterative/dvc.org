# metrics diff

Show a table of changes between
[metrics](/doc/command-reference/metrics#description) among <abbr>DVC
repository</abbr> revisions.

> This command requires that the <abbr>project</abbr> is a
> [Git](https://git-scm.com/) repository.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v]
                        [--targets [TARGETS [TARGETS ...]]]
                        [-t TYPE] [-x XPATH] [-R] [--show-json]
                        [a_ref] [b_ref]

positional arguments:
  a_ref     Git reference from which the diff begins. If omitted,
           `HEAD` (latest commit) is used.
  b_ref     Git reference until which the diff ends. If omitted,
            the current workspace is used instead.
```

## Description

The changes shown by this command includes the new value, and numeric difference
(delta) from the previous value of metrics. They're calculated between two
different
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(commit SHA hash, branch or tag name, etc.) for all metrics in the
<abbr>project</abbr>, found by examining all of the
[DVC-files](/doc/user-guide/dvc-file-format) in both revisions.

The metrics to use in this command can be limited with the `--targets` option.
target can also be directories (with the `-R` option), so that DVC recursively
shows changes for all metric files in it.

## Options

- `--targets` - specific metric files or directories to calculate metrics
  differences for. If omitted (default), this command uses all metric files
  found in both Git revisions.

- `-R`, `--recursive` - determines the metric files to use by searching each
  target directory and its subdirectories for DVC-files to inspect. `targets` is
  expected to contain one or more directories for this option to have effect.

- `-t`, `--type` - specify a type of the metric file. Accepted values are: `raw`
  (default), `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be used to determine
  how to parse and format metics for display. See `dvc metrics modify` for more
  details.

  This option will override `type` and `xpath` defined in the corresponding
  DVC-file. If no `type` is provided or found in the DVC-file, DVC will try to
  detect it based on file extension.

- `-x`, `--xpath` - specify a path within a metric file to show changes for a
  specific metric value only. Should be used if the metric file contains
  multiple numbers and you want to use only one of them. Only a single path is
  allowed. It will override `xpath` defined in the corresponding DVC-file. See
  `dvc metrics modify` for more details.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's create a metrics file using a dummy command and commit it with Git:

```
$ dvc run -M metrics.json 'echo "{\"AUC\": 0.5}" > metrics.json'
$ git commit -a -m "add metrics"
```

Now let's say we've adjusted our scripts and our AUC has changed:

```
$ dvc run -M metrics.json 'echo "{\"AUC\": 0.6}" > metrics.json'
```

To see the change, let's run `dvc metrics diff` without arguments. This compares
our current <abbr>workspace</abbr> metrics to what we had in the previous
commit:

```
$ dvc metrics diff
    Path       Metric   Value   Change
metrics.json   AUC      0.600   0.100
```
