# exp rename

Rename a specific experiment from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp rename [-h] [-q | -v] [--rev <commit>]
                      [-g <git_remote>]
                      [experiment] [name]

positional arguments:
   experiment    Experiments to rename.
   name          Name of new experiment.
```

## Description

Renames one experiment, indicated by name (see `dvc exp run`) or rev.

## Options

- `--rev <commit>` - rename experiments derived from the specified `<commit>` as
  baseline.

- `-g`, `--git-remote` - Name or URL of the Git remote to rename the experiment
  from

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's say we have `dvc exp run` 3 experiments in our project:

```cli
$ dvc exp list
master:
        major-mela
        conic-ease
        lucid-lair
```

To rename any of them, give their names to `dvc exp rename`:

```cli
$ dvc exp rename conic-ease renamed-exp

$ dvc exp list
master:
        major-mela
        renamed-exp
        lucid-lair
```

The experiment named "conic-ease" has now been renamed to "renamed-exp" as seen
from the output of `dvc exp list`.

We can also remove experiments from a remote Git repository:

```cli
$ dvc exp push myremote

$ dvc exp list myremote
master:
        conic-ease
        urban-sign
        major-mela

$ dvc exp rename -g myremote urban-sign renamed-exp
$ dvc exp list myremote
master:
        conic-ease
        renamed-exp
        major-mela
```
