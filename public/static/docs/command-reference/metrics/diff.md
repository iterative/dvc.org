# metrics diff

Find and print changes in [metrics](/doc/command-reference/metrics#description)
between <abbr>project</abbr> versions.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v]
                        [--targets [TARGETS [TARGETS ...]]]
                        [-t TYPE] [-x XPATH] [-R] [--show-json]
                        [a_ref] [b_ref]

positional arguments:
  a_ref     Git reference from which diff is calculated. If
            omitted, `HEAD` (latest commit) is used.
  b_ref     Git reference to which diff is calculated. If omitted,
            the current workspace is used instead.
```

## Description

Calculates the numeric difference (delta) between a metric's value in two
different
[Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References)
(such as a branch name, a tag, or a commit hash) for all metrics in the
<abbr>project</abbr> by examining all of its
[DVC-files](/doc/user-guide/dvc-file-format).

Note that `a_ref` and `b_ref` have different defaults than those in `dvc diff`,
and omitting `b_ref` causes the current <abbr>workspace</abbr> metrics (included
uncommitted local changes) to be used, instead of a Git reference.

If `--targets` are provided, it will show changes for those specific metric
files instead. With the `-R` option, a target can even be a directory, so that
DVC recursively shows changes for all metric files in it.

Providing a type of metric (`-t` option) overwrites the full metric
specification (both `type` and `xpath` fields) defined in the
[DVC-file](/doc/user-guide/dvc-file-format). If only the `--xpath` (`-x`) option
is used, just the `xpath` field is overwritten. (DVC will first try to read
`type` from the DVC-file, or it can be automatically detected by the file
extension.)

> See `dvc metrics modify` to learn how to apply `-t` and `-x` permanently.

## Options

- `--targets` - metric files or directories (see -R) to show changes for. If not
  specified, will show changes for all metric files, if not specified.

- `-t`, `--type` - specify a type of the metric file. Accepted values are:
  `raw`, `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be used to determine
  appropriate parsing and displaying format for this metric file and will
  override `type` defined in the corresponding DVC-file See `dvc metrics modify`
  for a full description of acceptable types. If no `type` is specified either
  as a CLI `-t|--type` nor in the corresponding DVC-file itself,
  `dvc metrics diff` will try to detect it on-the-fly.

- `-x`, `--xpath` - specify a path within a metric file to get a specific metric
  value to show changes for. If omitted, will show changes for all possible
  paths. It will override `xpath` defined in the corresponding DVC-file. See
  `dvc metrics modify` for a full description of `xpath` when applied to
  specific metric types.

  If multiple metric files exist in the <abbr>project</abbr>, the same parser
  and path will be applied to all of them. If `xpath` for a particular metric
  has been set using `dvc metrics modify`, the path passed with this option will
  overwrite it for the current command run only – It may fail to produce any
  results or parse files that are not in a corresponding format in this case.

- `-R`, `--recursive` - `path` is expected to be a directory for this option to
  have effect. Determines the metric files to show changes for by searching each
  target directory and its subdirectories for DVC-files to inspect.

- `--show-json` - prints diff in easily parsable JSON format instead of
  human-readable table.

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
