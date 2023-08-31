# describe

Display enrichments for an artifact.

## Synopsis

```usage
usage: gto describe [-r <text>] [--rev <text>] [--type] [--path]
                    [--description] [-h]
                    name

arguments:
  name             Artifact name
```

## Description

To get details about an artifact (from `artifacts.yaml`) use `gto describe`:

```cli
$ gto describe churn -r https://github.com/iterative/example-gto
{
    "type": "model",
    "path": "models/churn.pkl",
    "virtual": false
}
```

The output is in JSON format for ease of parsing programmatically.

Note, that for local repos the `artifacts.yaml` is read from the workspace
without Git, so if you have uncommitted changes, they will be reflected in the
output. If you want to read from specific commit, you need to specify `--rev`
option.

You can also get annotation for specific versions (these are the same shortcuts
as in `gto show`):

```cli
$ gto describe churn@latest  # highest version by SemVer
$ gto describe churn#dev     # version in stage `dev`
$ gto describe churn@v3.0.0  # version `v3.0.0`
```

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--rev <text>` - Repo revision to use
- `--type` - Show type
- `--path` - Show path
- `--description` - Show description
- `-h`, `--help` - Show this message and exit.
