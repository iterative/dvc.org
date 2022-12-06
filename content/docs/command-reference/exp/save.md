# exp save

Save the current project status as a [DVC experiment].

[dvc experiment]: /doc/user-guide/experiment-management/experiments-overview

## Synopsis

```usage
usage: dvc exp save [-h] [-q | -v] [-f]
                   [--json] [-n <name>]
                   [-I path]
```

## Description

Provides a way to save the current status of your <abbr>project</abbr> as an
<abbr>experiment</abbr> without polluting it with unnecessary commits, branches,
directories, etc.

Only files tracked by either Git or DVC are saved to the experiment. Use the
`--include-untracked` (`-I`) option to explicitly include any untracked files in
the experiment.

`dvc exp save` creates <abbr>experiments</abbr> just like
[`dvc exp run`](/doc/command-reference/exp/run), but does not require
reproduction or setup of [pipeline stages](/doc/start/data-pipelines), making it
possible to quickly start tracking, [comparing] and [persisting] experiments.

[comparing]: /doc/user-guide/experiment-management/comparing-experiments
[persisting]: /doc/user-guide/experiment-management/persisting-experiments

## Options

- `-n <name>`, `--name <name>` - specify a [unique name] for this experiment. A
  default one will be generated otherwise, such as `exp-f80g4` (based on the
  experiment's hash).

- `-I <path>`, `--include-untracked <path>` - specify untracked file(s) to be
  included in the saved experiment. Multiple files can be specified.

- `-f`, `--force` - overwrite the experiment if an experiment with the same name
  already exists.

- `-h`, `--help` - prints the usage/help message, and exits.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if all
  stages are up to date or if all stages are successfully executed, otherwise
  exit with 1. The command defined in the stage is free to write output
  regardless of this flag.

- `-v`, `--verbose` - displays detailed tracing information.

[unique name]:
  https://dvc.org/doc/user-guide/experiment-management/experiments-overview#how-does-dvc-track-experiments

## Examples

```cli
dvc exp save -n saved-exp -I data/untracked_file -I src/untracked_code.py
```

<admon type="info">

See [our Get Started] guide, for more examples on how to use experiments.

[our get started](/doc/start/experiment-management/experiments)

</admon>
