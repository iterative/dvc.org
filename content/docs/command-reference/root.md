# root

Return the relative path to the root of the <abbr>DVC project</abbr>.

## Synopsis

```usage
usage: dvc root [-h] [-q | -v]
```

## Description

Returns the path to the root directory of the <abbr>DVC project</abbr>, relative
to the current working directory. Useful when working in a subdirectory of the
project, and you need to refer to a file in another directory. Use it in files
and commands to build a path to a dependency, script, or <abbr>data
artifact</abbr>.

## Options

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Example: Basic output

```dvc
$ dvc root

.

$ cd subdir
$ dvc root

..
```

## Example: Referencing files

Simplify file references when working in a subdirectory of a <abbr>DVC
project</abbr>.

```dvc
$ dvc root

../../../

$ dvc run -d $(dvc root)/data/file.cvs ... \
    python $(dvc root)/scripts/something.py
```

## Example: Output references

Simplify output file or directory references.

```dvc
$ dvc root

../../../

$ dvc get -o $(dvc root)/root-model.pkl \
    https://github.com/iterative/example-get-started model.pkl
```

## Example: Other commands

Simplify other commands when working in a <abbr>DVC project</abbr>.

```dvc
$ dvc root

../..

$ tree $(dvc root)/data/
../../data/
├── data.xml
├── data.xml.dvc
...
└── prepared
    ├── test.tsv
    └── train.tsv
```

## Example: Build reusable paths

Build reusable paths to dependencies, scripts, or <abbr>data artifacts</abbr>
from separate stages and subdirectories.

```dvc
$ cd more_stages/
$ dvc run -n process_data \
          -d data.in \
          -d $(dvc root)/process_data.py \
          -o result.out \
          python process_data.py data.in result.out
$ tree ..
.
├── dvc.yaml
├── dvc.lock
├── process_data.py
├── ...
└── more_stages/
    ├── data.in
    ├── dvc.lock
    ├── dvc.yaml
    └── result.out
```
