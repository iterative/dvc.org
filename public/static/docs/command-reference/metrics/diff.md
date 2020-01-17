# metrics diff

Find and print [project metrics](/doc/command-reference/metrics) changes between
commits, commit and a working tree, etc.

## Synopsis

```usage
usage: dvc metrics diff [-h] [-q | -v] [--targets [TARGETS [TARGETS ...]]]
                        [-t TYPE] [-x XPATH] [-R] [--show-json]
                        [a_ref] [b_ref]

positional arguments:
  a_ref                 Git reference from which diff is calculated. If
                        omitted `HEAD`(latest commit) is used.
  b_ref                 Git reference to which diff is calculated. If omitted
                        current working tree is used.
```

## Description

Finds and prints changes between commits for all metrics in the
<abbr>project</abbr> by examining all of its
[DVC-files](/doc/user-guide/dvc-file-format). If `--targets` are provided, it
will show changes for those specific metric files instead.

The optional `--targets` argument can contain several metric files. With the
`-R` option, a target can even be a directory, so that DVC recursively shows
changes for all metric files in it.

Providing a `type` (`-t` option) overwrites the full metric specification (both
`type` and `xpath` fields) defined in the
[DVC-file](/doc/user-guide/dvc-file-format) (usually set originally with the
`dvc metrics modify` command).

If `type` (via `-t`) is not specified and only `xpath` (`-x` option) is, only
the `xpath` field is overwritten in its DVC-file. (DVC will first try to read
`type` from the DVC-file, but it can be automatically detected by the file
extension.)

> Alternatively, see `dvc metrics modify` command to learn how to apply `-t` and
> `-x` permanently.

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
  value to show changes for. If ommited, will show changes for all possible
  paths. It will override `xpath` defined in the correspodning DVC-file. See
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

- `--show-json` - prints diff in easilly parsable JSON format instead of
  human-readable table.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's create a metrics file using a dummy command and commit it to git:

```
$ dvc run -M metrics.json 'echo "{\"AUC\": 0.5}" > metrics.json'
$ git commit -a -m "add metrics"
```

Now let's say we've adjusted our scripts and our AUC has changed:

```
$ dvc run -M metrics.json 'echo "{\"AUC\": 0.6}" > metrics.json'
```

To see the change, let's run `dvc metrics diff` without arguments, that would
compare our current metrics to what we've had in the last commit (similar to
`git diff`):

```
$ dvc metrics diff
    Path       Metric   Value   Change
metrics.json   AUC      0.600   0.100
```
