# stages

Print list of stages used in the registry.

## Synopsis

```usage
usage: gto stages [-r <text>] [--allowed] [--used] [--json]
                  [-h]
```

## Description

This command is used to get a list of stages used in the registry - whether
directly from [the config file](/doc/gto/user-guide#configuring-gto), or from
all GTO Git tags that exist.

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `--allowed` - Show allowed stages from config
- `--used` - Show stages that were ever used (from all git tags)
- `--json` - Print output in json format
- `-h`, `--help` - Show this message and exit.
