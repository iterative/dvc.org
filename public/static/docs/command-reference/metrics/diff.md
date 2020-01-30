# metrics diff

Show a table of changes between
[metrics](/doc/command-reference/metrics#description) among versions of the
<abbr>DVC repository</abbr>.

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
(delta) from the previous value of metrics (with 3-digit accuracy). They're
calculated between two commit SHA hashes, branch or tag names, etc.
([Git references](https://git-scm.com/book/en/v2/Git-Internals-Git-References))
for all metrics in the <abbr>project</abbr>, found by examining all of the
[DVC-files](/doc/user-guide/dvc-file-format) in both references.

The metrics to use in this command can be limited with the `--targets` option.
target can also be directories (with the `-R` option), so that DVC recursively
shows changes for all metric files in it.

## Options

- `--targets` - specific metric files or directories to calculate metrics
  differences for. If omitted (default), this command uses all metric files
  found in both Git references.

- `-R`, `--recursive` - determines the metric files to use by searching each
  target directory and its subdirectories for DVC-files to inspect. `targets` is
  expected to contain one or more directories for this option to have effect.

- `-t`, `--type` - specify a type of the metric file. Accepted values are: `raw`
  (default), `json`, `tsv`, `htsv`, `csv`, `hcsv`. It will be used to determine
  how to parse and format metics for display. See `dvc metrics show` for more
  details.

  This option will override `type` and `xpath` defined in the corresponding
  DVC-file. If no `type` is provided or found in the DVC-file, DVC will try to
  detect it based on file extension.

- `-x`, `--xpath` - specify a path within a metric file to show changes for a
  specific metric value only. Should be used if the metric file contains
  multiple numbers and you want to use only one of them. Only a single path is
  allowed. It will override `xpath` defined in the corresponding DVC-file. See
  `dvc metrics show` for more details.

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created in our
[Get Started](/doc/get-started) section. Then we can see what happens with
`dvc install` in different situations.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

</details>

Notice that we have an `auc.metric` metric file:

```
$ cat auc.metric
0.602818
```

Now let's mock a change in our AUC metric:

```
$ echo '0.5' > auc.metric
```

To see the change, let's run `dvc metrics diff`. This compares our current
<abbr>workspace</abbr> (including uncommitted local changes) metrics to what we
had in the previous commit:

```
$ git diff
--- a/auc.metric
+++ b/auc.metric
@@ -1 +1 @@
-0.602818
+0.5

$ dvc metrics diff
   Path      Metric   Value   Change
auc.metric            0.500   -0.103
```

> Note that metric files are typically versioned with Git, so we can use both
> `git diff` and `dvc metrics diff` to understand their changes, as seen above.
