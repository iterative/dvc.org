# describe

Display GTO version and check the registry for problems.

## Synopsis

```usage
usage: gto doctor [-r <text>] [-A] [-h]
```

## Description

This will check the registry and print all the issues if found:

```cli
$ gto doctor
🪴  GTO Version: 0.2.5
---------------------------------
INDEX='artifacts.yaml'
TYPES=None
STAGES=None
LOG_LEVEL='INFO'
DEBUG=False
ENRICHMENTS=[]
AUTOLOAD_ENRICHMENTS=True
CONFIG_FILE_NAME='.gto'
EMOJIS=True
---------------------------------
✅  No issues found
```

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `-A`, `--all-commits` - Read all commits
- `-h`, `--help` - Show this message and exit.
