# diff

Show added, modified, or deleted DVC-tracked files and directories between two
commits in the <abbr>DVC repository</abbr>, or between a commit and the
workspace.

## Synopsis

```usage
usage: dvc diff [-h] [-q | -v]
                [--show-json] [--show-hash] [--show-md]
                [a_rev] [b_rev]

positional arguments:
  a_rev      Old Git commit to compare (defaults to HEAD)
  b_rev      New Git commit to compare (defaults to the current workspace)
```

## Description

Prints a list of files and directories added, modified, deleted in a Git commit
`b_rev` as compared to another Git commit `a_rev`. Both `a_rev` and `b_rev`
accept any [Git revision](https://git-scm.com/docs/gitrevisions) - branch or tag
name, Git commit hash, etc.

It defaults to comparing the current workspace and the last commit (`HEAD`), if
arguments `a_rev` and `b_rev` are not specified.

Options `--show-json` and `--show-hash` can be used to modify format of the
output of this command. See the [Options](#options) and [Examples](#examples)
sections below for more details.

`dvc diff` does not have an effect when the repository is not tracked by Git,
for example when `dvc init` was used with the `--no-scm` option.

> Note that current `dvc diff` implementation does not show the line-to-line
> comparison among the files in each revision, like `git diff` or
> [GNU `diff`](https://www.gnu.org/software/diffutils/) can. This is because the
> data data tracked by DVC can come in many possible formats e.g. structured
> text, or binary blobs, etc. For an example on how to create line-to-line text
> file comparison, refer to this
> [comment](https://github.com/iterative/dvc/issues/770#issuecomment-512693256).

## Options

- `--show-json` - prints the command's output in easily parsable JSON format,
  instead of a human-readable table.

- `--show-md` - prints the command's output in Markdown table format.

- `--show-hash` - print file and directory hash values along with their path.
  Useful for debug purposes.

- `--hide-missing` - do not list data missing from both workspace and cache
  (`not in cache`). Only list files and directories which have been expliclity
  added, modified, or deleted. This option does nothing when comparing two Git
  commits.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For these examples we can use the [Get Started](/doc/start) project.

<details>

### Click and expand to setup the project to run examples

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

Download data using:

```dvc
$ dvc fetch -T
Preparing to download data from 'https://remote.dvc.org/get-started'
...
```

With the `-T` option, `dvc fetch` makes sure that we have all the data files
related to all existing Git tags in the repo. You may see the available tags of
our example repo [here](https://github.com/iterative/example-get-started/tags).

</details>

## Example: Checking workspace changes

The minimal `dvc diff`, run without arguments, defaults to comparing DVC-tracked
files between `HEAD` (last Git commit) and the current <abbr>workspace</abbr>
(uncommitted changes, if any):

```dvc
$ dvc diff
```

## Example: Comparing workspace with arbitrary commits

<details>

### Click and expand to setup the example

Let's checkout the
[2-track-data](https://github.com/iterative/example-get-started/releases/tag/2-track-data)
tag, corresponding to the [Data Versioning](/doc/start/data-versioning) _Get
Started_ chapter, right after we added `data.xml` file with DVC:

```dvc
$ git checkout 2-track-data
$ dvc checkout
```

</details>

To see the difference between the very previous commit of the project and the
workspace, we can use `HEAD^` as `a_rev`:

```dvc
$ dvc diff HEAD^
Added:
    data/data.xml

files summary: 1 added, 0 deleted, 0 modified
```

## Example: Comparing tags or branches

<details>

### Click and expand to setup the example

Our example repository has the `baseline-experiment` and `bigrams-experiment`
[tags](https://github.com/iterative/example-get-started/tags) tags, that
reference two different modeling experiments.

Having followed the example's setup, move into the `example-get-started/`
directory. Then make sure that you have the latest code and data with the
following commands:

```dvc
$ git checkout master
$ dvc checkout
```

</details>

```dvc
$ dvc diff baseline-experiment bigrams-experiment
Modified:
    data/features/
    data/features/test.pkl
    data/features/train.pkl
    model.pkl
    prc.json
    scores.json

files summary: 0 added, 0 deleted, 5 modified
```

The output from this command confirms that there's a difference in 5 files
between the tags `baseline-experiment` and `bigrams-experiment`.

## Example: Using different output formats

Let's use the same command as above, but with JSON output and including hash
values:

```dvc
$ dvc diff --show-json --show-hash \
           baseline-experiment bigrams-experiment
```

It outputs:

```json
{
  "added": [],
  "deleted": [],
  "modified": [
    {
      "path": "data/features/",
      "hash": {
        "old": "3338d2c21bdb521cda0ba4add89e1cb0.dir",
        "new": "42c7025fc0edeb174069280d17add2d4.dir"
      }
    },
    ...
    {
      "path": "model.pkl",
      "hash": {
        "old": "43630cce66a2432dcecddc9dd006d0a7",
        "new": "662eb7f64216d9c2c1088d0a5e2c6951"
      }
    }
    ...
  ]
}
```
