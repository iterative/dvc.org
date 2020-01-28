# diff

Compare two different versions of your DVC project (tracked by Git) and shows a
_list of outputs_ grouped in the following categories: _added, modified, or
deleted_.

> This feature is only supported when using DVC among
> [Git](https://git-scm.com/).

Note that `dvc diff` does not show the line-to-line comparison of the outputs.

> For an example on how to create line-to-line text file comparison, refer to
> [issue #770](https://github.com/iterative/dvc/issues/770#issuecomment-512693256)
> in our GitHub repository.

## Synopsis

```usage
usage: dvc diff [-h] [-q | -v] [--show-json] [--checksums] [a_ref] [b_ref]

positional arguments:
  a_ref          Git reference from which diff calculates (defaults to HEAD)
  b_ref          Git reference until which diff calculates, if omitted diff
                 shows the difference between the working tree and a_ref

optional arguments:
  --show-json    Format the output into a JSON
  --checksums    Display checksums for each entry
```

## Description

By default, it compares the working tree with the last commit tree (`HEAD`).

You can pass two different Git [revisions](https://git-scm.com/docs/revisions)
(e.g. commit hash, branch name, tag, etc.) as arguments to specify which
versions to compare.

```
Added:
    d3b07384  file

Deleted:
    dc635f02  dir/
    85f55f75  dir/1
    703a80e0  dir/2

Modified:
    7fbff877..9cd599a3  data.csv
```

You can use the following options to modify the output: `--checksums` and
`--json`.

The former will include checksums in the output, and the latter one generates a
JSON like the following:

```json
{
  "added": [
    { "filename": "file", "checksum": "d3b07384d113edec49eaa6238ad5ff00" }
  ],
  "deleted": [
    { "filename": "dir/", "checksum": "dc635f02c2886e2cd79736f4a56b631f.dir" },
    { "filename": "dir/1", "checksum": "85f55f7530699d7470d4455e92981155" },
    { "filename": "dir/2", "checksum": "703a80e05b4573db5100959403e4da08" }
  ],
  "modified": [
    {
      "filename": "data.csv",
      "checksum": {
        "old": "7fbff8771b9db1b495d2e404dec4334c",
        "new": "9cd599a3523898e6a12e13ec787da50a"
      }
    }
  ]
}
```

## Example

```dvc
$ git init
$ dvc init
$ git commit -m "initial commit with Git and DVC"

$ echo "first version" > file
$ dvc add file
$ dvc diff

Added:
    file

$ git add -A
$ git commit -m "file: first version"
$ dvc diff HEAD~1

Added:
    file

$ echo "second version" > file
$ dvc add file
$ dvc diff

Modified:
    file

$ dvc diff --checksums

Modified:
    9f089b63..27f60b34  file

$ dvc diff --checksums --show-json

{
    "added": [],
    "deleted": [],
    "modified": [
        {
            "filename": "file",
            "checksum": {
                "old": "9f089b639127e2f5a79c4eda189678d6",
                "new": "27f60b341727cb8ed1de139b0da7c173"
            }
        }
    ]
}

$ git add -A
$ git commit -m "file: second version"

$ mkdir data
$ echo "some text" > data/1
$ dvc add data
$ dvc diff

Added:
    data/
    data/1
```
