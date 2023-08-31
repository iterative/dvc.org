# remove

Remove the enrichment for given artifact.

## Synopsis

```usage
usage: gto remove [-r <text>] [--commit] [--push] [-h]
                  name

arguments:
  name             Artifact name
```

## Description

This command removes the artifact annotation from `artifacts.yaml`. Don't forget
to commit the change.

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--commit` - Automatically commit changes due to this command (experimental)
- `--push` - Push created commit automatically (experimental) - will set
  commit=True
- `-h`, `--help` - Show this message and exit.
