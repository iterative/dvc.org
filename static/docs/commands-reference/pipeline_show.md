# show

Show stages in a pipeline that lead to the specified stage. By default it lists
stage files (usually `.dvc` files). There are `-c` or `-o` options to list or
visualize a pipeline commands or data files flow instead.

## Synopsis

```usage
usage: dvc pipeline show [-h] [-q | -v] [-c | -o]
                         [--dot DOT] [--ascii]
                         [--tree] [-l]
                         [targets [targets ...]]

positional arguments:
  targets         DVC files.
```

## Options

- `-c`, `--commands` - show pipeline as a list (graph, if `--ascii` or `--dot`
  option is specified) of commands instead of paths to DVC files.

- `-o`, `--outs` - show pipeline as a list (graph, if `--ascii` or `--dot`
  option is specified) of stage output files instead of paths to DVC files.

- `--ascii` - visualize pipeline. It will print a graph (ASCII) instead of a
  list of path to DVC files.

- `--dot` - show contents of `.dot` files with a DVC pipeline graph. It can be
  passed to third party visualization utilities.

- `--tree` - list dependencies tree like recursive directory listing.

- `-l`, `--locked` - print locked DVC stages only.

## Examples

- Default mode, show stages `output.dvc` recursively depends on:

```dvc
$ dvc pipeline show output.dvc

raw.dvc
data.dvc
output.dvc
```

- The same as previous, but show commands instead of DVC files:

```dvc
$ dvc pipeline show output.dvc --commands

download.py s3://mybucket/myrawdata raw
cleanup.py raw data
process.py data output
```

- Visualize DVC pipeline:

```dvc
$ dvc pipeline show eval.txt.dvc --ascii
          .------------------------.
          | data/Posts.xml.zip.dvc |
          `------------------------'
                       *
                       *
                       *
               .---------------.
               | Posts.xml.dvc |
               `---------------'
                       *
                       *
                       *
               .---------------.
               | Posts.tsv.dvc |
               `---------------'
                       *
                       *
                       *
            .---------------------.
            | Posts-train.tsv.dvc |
            `---------------------'
                       *
                       *
                       *
            .--------------------.
            | matrix-train.p.dvc |
            `--------------------'
              ***             ***
            **                   ***
          **                        **
.-------------.                       **
| model.p.dvc |                     **
`-------------'                  ***
              ***             ***
                 **         **
                   **     **
               .--------------.
               | eval.txt.dvc |
               `--------------'
```

- List dependencies recursively if graph have tree structure

```dvc
dvc pipeline show e.file.dvc --tree
e.file.dvc
├── c.file.dvc
│   └── b.file.dvc
│       └── a.file.dvc
└── d.file.dvc
```
