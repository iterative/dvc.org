# exp gc

Remove unnecessary `dvc experiments` from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp gc [-h] [-q | -v] [-w]
                  [-a] [-T] [--all-commits] [--queued] [-f]
```

## Description

This command can delete (garbage collect) experiments that exist in the project
but are no longer needed.

> See **How does DVC track experiments?** in `dvc exp run` to learn more about
> DVC experiment storage.

To avoid accidentally deleting work, `dvc exp gc` doesn't do anything unless one
or a combination of scope options are provided (`--workspace`, `--all-branches`,
`--all-tags`, `--all-commits`). Use these to indicate which experiments are
still needed. See the [Options](#options) section for more details.

Note that after removing experiments, the corresponding data which may no longer
be needed still remains in the <abbr>cache</abbr>. You can use `dvc gc`
separately to delete it.

## Options

- `-w`, `--workspace` - keep _only_ experiments derived from the current
  workspace. This option is enabled automatically if `--all-tags`,
  `--all-branches`, or `--all-commits` are used.

- `-a`, `--all-branches` - keep experiments derived from the tips of all Git
  branches as well as the workspace (implies `-w`). Note that this can be
  combined with `-T` below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace (implies `-w`). Note that both options can be combined, for
  example using the `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace (implies `-w`). This is mainly only needed when
  clearing the experiments run queue.

- `--queued` - keep experiments that haven't been run yet (defined via
  `dvc exp run --queue`). The experiment run queue will typically be cleared if
  this option isn't used.

- `-f`, `--force` - force garbage collection. Skip confirmation prompt.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.
