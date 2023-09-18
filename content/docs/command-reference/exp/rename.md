# exp rename

Rename a specific experiment from the <abbr>project</abbr>.

## Synopsis

```usage
usage: dvc exp rename [-h] [-q | -v]
                      [-g <git_remote>]
                      [--force]
                      [experiment] [name]

positional arguments:
   experiment    Experiments to rename.
   name          Name of new experiment.
```

## Description

Renames one experiment, indicated by name (see `dvc exp run`) or rev.

## Options

- `-g`, `--git-remote` - Name or URL of the Git remote to rename the experiment
  from

- `-f`, `--force` - overwrite the experiment if it already exists.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's say we have created 3 experiments in our project using `dvc exp run`:

```cli
$ dvc exp list
master:
        major-mela
        conic-ease
        lucid-lair
```

To rename any of them, pass the original and new experiment names to
`dvc exp rename`:

```cli
$ dvc exp rename conic-ease renamed-exp

$ dvc exp list
master:
        major-mela
        renamed-exp
        lucid-lair
```

The experiment named "conic-ease" has now been renamed to "renamed-exp".

We can also rename an experiment from a remote Git repository:

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
