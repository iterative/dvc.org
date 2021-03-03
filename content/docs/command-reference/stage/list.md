# stage list

List <abbr>stages</abbr> in the project.

## Synopsis

```usage
usage: dvc stage list [-h] [-q | -v]
                      [-R] [--all] [--fail] [--names-only]
                      [targets ...]

positional arguments:
  targets          Show stages from a dvc.yaml file or a directory (with -R).
                   'dvc.yaml' by default.
```

## Description

`dvc stage list` is useful for quick listing of stages present in the project
without having to open `dvc.yaml` files.

It provides a list of stages, with a stage name and the description of the
stage. The description of the stage is read from
[`desc` field in the `dvc.yaml` file](doc/user-guide/project-structure/pipelines-files#stage-entries),
or if it does not exist, DVC generates the short description from the other
metadata it has about the stage.

Without any targets, by default, it only lists the stages from the `dvc.yaml`
present in the current working directory.

DVC also uses this command to provide autocompletion in `bash` and `zsh`.

## Options

- `targets` (optional command argument) - stages to list from (`./dvc.yaml` by
  default). Different things can be provided as targets depending on the flags
  used (more details in each option). Examples:

  - `dvc stage list linear/dvc.yaml`: Specific `dvc.yaml` file to list from
  - `dvc stage list -R pipelines/`: Directory path to explore recursively for
    `dvc.yaml` files
  - `dvc stage list train-model`: Specific stage name or a
    [foreach group](doc/user-guide/project-structure/pipelines-files#foreach-stages)
    in `./dvc.yaml`
  - `dvc stage list modeling/dvc.yaml:prepare`: Stage or a
    [foreach group](doc/user-guide/project-structure/pipelines-files#foreach-stages)
    in a specific `dvc.yaml` file

- `-R`, `--recursive` - looks for `dvc.yaml` files to list from in any
  directories given as `targets`, and in their subdirectories. If there are no
  directories among the targets, this option has no effect.

- `--all` - lists all of the stages present in the repo, regardless of the
  targets.

- `--fail` - fails immediately if any `dvc.yaml` files have syntax errors. By
  default, those errors are skipped. This option is only in effect if `--all` or
  `-R` is used.

- `--names-only` - only lists the name of the stages. It can be useful for
  scripting purposes. DVC uses it for providing autocompletion on `bash`.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: List stages

Listing stages from the default `./dvc.yaml` file from the repo.

```dvc
$ dvc stage list
prepare    Outputs data/prepared
featurize  Outputs data/features
train      Outputs model.pkl
evaluate   Reports scores.json, prc.json, roc.json
```
