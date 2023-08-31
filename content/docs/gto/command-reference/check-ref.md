# check-ref

Find out the artifact version registered/assigned with ref.

## Synopsis

```usage
usage: gto check-ref [-r <text>] [--json] [--name] [--version]
                     [--event] [--stage] [-h]
                     ref

arguments:
  ref              Git reference to analyze
```

## Description

You can use `gto check-ref` to interpret a Git tag:

```cli
$ gto check-ref -r build/example-gto churn#prod#3
✅  Stage "prod" was assigned to version "v3.0.0" of artifact "churn"
```

For machine-consumable format, use `--json` flag or output specific pieces of
information with `--name`, `--version`, `--stage` or `--event`.

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--json` - Print output in json format
- `--name` - Show artifact name
- `--version` - Output artifact version
- `--event` - Show event
- `--stage` - Show artifact stage
- `-h`, `--help` - Show this message and exit.
