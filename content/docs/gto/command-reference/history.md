# history

Show a journal of registry operations.

## Synopsis

```usage
usage: gto history [-r <text>] [-a] [-A] [--json] [--plain]
                   [--asc] [-h]
                   [name]

arguments:
  [name]           Artifact name to show. If empty, show all.
```

## Description

This command prints a journal of the events that happened to an artifact. This
allows you to audit the changes.

```cli
$ gto history churn -r https://github.com/iterative/example-gto
╒═════════════════════╤════════════╤══════════════╤═══════════╤═════════╤══════════╤═════════════════╕
│ timestamp           │ artifact   │ event        │ version   │ stage   │ commit   │ ref             │
╞═════════════════════╪════════════╪══════════════╪═══════════╪═════════╪══════════╪═════════════════╡
│ 2022-11-09 13:40:33 │ churn      │ assignment   │ v3.1.1    │ dev     │ 2f2a8de  │ churn#dev#5     │
│ 2022-11-09 13:40:33 │ churn      │ registration │ v3.1.1    │ -       │ 2f2a8de  │ churn@v3.1.1    │
│ 2022-11-08 09:53:53 │ churn      │ commit       │ v3.1.1    │ -       │ 2f2a8de  │ 2f2a8de         │
│ 2022-11-07 06:07:13 │ churn      │ assignment   │ v3.1.0    │ dev     │ 064f173  │ churn#dev#4     │
│ 2022-11-06 02:20:33 │ churn      │ assignment   │ v3.0.0    │ prod    │ ddae695  │ churn#prod#3    │
│ 2022-11-04 22:33:53 │ churn      │ assignment   │ v3.1.0    │ staging │ 064f173  │ churn#staging#2 │
│ 2022-11-03 18:47:13 │ churn      │ assignment   │ v3.0.0    │ dev     │ ddae695  │ churn#dev#1     │
│ 2022-11-02 15:00:33 │ churn      │ registration │ v3.1.0    │ -       │ 064f173  │ churn@v3.1.0    │
│ 2022-11-01 11:13:53 │ churn      │ commit       │ v3.1.0    │ -       │ 064f173  │ 064f173         │
│ 2022-10-28 23:53:53 │ churn      │ registration │ v3.0.0    │ -       │ ddae695  │ churn@v3.0.0    │
│ 2022-10-27 20:07:13 │ churn      │ commit       │ v3.0.0    │ -       │ ddae695  │ ddae695         │
╘═════════════════════╧════════════╧══════════════╧═══════════╧═════════╧══════════╧═════════════════╛
```

Use `--all-branches` and `--all-commits` to read more than just HEAD.

## Options

- `-r <text>`, `--repo <text>` - Local or remote repository [default: .]
- `-a`, `--all-branches` - Read heads from all branches
- `-A`, `--all-commits` - Read all commits
- `--json` - Print output in json format
- `--plain` - Print table in grep-able format
- `--ascending`, `--asc` - Show new first
- `-h`, `--help` - Show this message and exit.
