# diff

Show differences between two versions of the <abbr>DVC project</abbr>. It can be
narrowed down to specific target files and directories under DVC control.

> This command requires that the <abbr>project</abbr> is a
> [Git](https://git-scm.com/) repository.

## Synopsis

```usage
usage: dvc diff [-h] [-q | -v] [-t TARGET] a_ref [b_ref]

positional arguments:
  a_ref      Git reference from which diff calculates
  b_ref      Git reference until which diff calculates, if omitted diff
             shows the difference between current HEAD and a_ref
```

## Description

Given two commit SHA hashes, branch or tag names, etc.
([references](https://git-scm.com/docs/revisions)) `a_ref` and `b_ref`, this
command shows a comparative summary of basic statistics: how many files were
deleted/changed, and the file size differences.

> Note that `dvc diff` does not show the line-to-line comparison among the
> target files in each revision, like `git diff` or
> [GNU `diff`](https://www.gnu.org/software/diffutils/) can. This is because the
> data data tracked by DVC can come in many possible formats e.g. structured
> text, or binary blobs, etc.

> For an example on how to create line-to-line text file comparison, refer to
> [issue #770](https://github.com/iterative/dvc/issues/770#issuecomment-512693256)
> in our GitHub repository.

`dvc diff` does not have an effect when the repository is not tracked by Git,
for example when `dvc init` was used with the `--no-scm` option.

## Options

- `-t TARGET`, `--target TARGET` - path to a data file or directory to limit
  diff for.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

For these examples we can use the chapters in our
[Get Started](/doc/get-started) section, up to
[Add Files](/doc/get-started/add-files).

<details>

### Click and expand to setup example

Start by cloning our example repo if you don't already have it. Then move into
the repo and checkout the
[3-add-file](https://github.com/iterative/example-get-started/releases/tag/3-add-file)
tag, corresponding to the [Add Files](/doc/get-started/add-files) _Get Started_
chapter:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 3-add-file
```

Download the precomputed data using:

```dvc
$ dvc pull
Preparing to download data from 'https://remote.dvc.org/get-started'
...
```

</details>

## Example: Previous version of the same branch

The minimal `dvc diff` command only includes the "from" reference (`a_ref`) from
which to calculate the difference. The "until" reference (`b_ref`) defaults to
`HEAD` (current [Git revision](https://git-scm.com/docs/revisions)).

To see the difference with the very previous revision of the project, we can use
`HEAD^` as `a_ref`:

```dvc
$ dvc diff HEAD^
dvc diff from df613bc to ed10968

diff for 'data/data.xml'
+data/data.xml with md5 a304afb96060aad90176268345e10355

added file with size 37.9 MB
```

## Example: Specific targets across Git revisions

We can base this example in the [Metrics](/doc/get-started/metrics) and
[Compare Experiments](/doc/get-started/compare-experiments) chapters of our _Get
Started_ section, that describe different experiments to produce the `model.pkl`
file. Our example repository has the `bigrams-experiment` and
`baseline-experiment`
[tags](https://github.com/iterative/example-get-started/tags) respectively to
reference these experiments.

<details>

### Click and expand to setup example

Having followed the previous example's setup, move into the
`example-get-started/` directory. Then make sure that you have the latest code
and data with the following commands.

```dvc
$ git checkout master
$ dvc fetch -T
```

The `-T` flag passed to `dvc fetch` makes sure we have all the data files
related to all existing tags in the repo. You take a look at the
[available tags](https://github.com/iterative/example-get-started/tags) of our
example repo.

</details>

To see the difference in `model.pkl` among these references, we can run the
following command.

```dvc
$ dvc diff -t model.pkl baseline-experiment bigrams-experiment
dvc diff from bc1722d to 8c1169d

diff for 'model.pkl'
-model.pkl with md5 a664896
+model.pkl with md5 3863d0e
    ...
```

The output from this command confirms that there's a difference in the
`model.pkl` file between the 2 Git references (tags `baseline-experiment` and
`bigrams-experiment`) we indicated.

### What about directories?

Unlike Git, DVC features controlling entire directories without having to add
each individual file. See `dvc add` without `--recursive` for example. `dvc run`
can also put whole directories under DVC control (when these are specified as
command dependencies or <abbr>outputs</abbr>).

We can use `dvc diff` to check for changes in a directory by specifying the
directory as the target (with option `-t`). Note that we skip the `b_ref`
argument this time, that defaults to `HEAD`.

```dvc
$ dvc diff -t data/features baseline-experiment
dvc diff from bc1722d to 8c1169d

diff for 'data/features'
-data/features with md5 3338d2c.dir
+data/features with md5 42c7025.dir

0 files not changed, 0 files modified, 0 files added,
0 files deleted, size was increased by 2.9 MB
```

## Example: Confirming that a target has not changed

Let's use our example repo once again, that has several
[available tags](https://github.com/iterative/example-get-started/tags) for
conveniency. The `5-preparation` tag corresponds to the
[Connect Code and Data](/doc/get-started/connect-code-and-data) chapter of our
_Get Started_ section, where the `dvc run` command is used to create a
`prepare.dvc` stage file. This DVC-file tracks the `data/prepared` directory
<abbr>output</abbr>.

```dvc
$ dvc diff -t data/prepared 5-preparation
dvc diff from 3deeec1 to 8c1169d

diff for 'data/prepared'
-data/prepared with md5 6836f79.dir
+data/prepared with md5 6836f79.dir

2 files not changed, 0 files modified, 0 files added,
0 files deleted, size was not changed
```

The command above checks whether there have been any changes to the
`data/prepared` directory after the `5-preparation` tag (since the `b_ref` is
`HEAD` by default). The output tells us that there have been no changes to that
directory (or to any other file).
