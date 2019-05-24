# diff

Show changes between versions of the DVC repository. It can be narrowed down to
specific target files and directories under DVC control.

> This command requires the repository to be versioned with
> [Git](https://git-scm.com/).

## Synopsis

```usage
usage: dvc diff [-h] [-q | -v] [-t TARGET] a_ref [b_ref]

positional arguments:
  a_ref                 Git reference from which diff calculates
  b_ref                 Git reference until which diff calculates,
                        if omitted diff shows the difference
                        between current HEAD and a_ref
```

## Description

Given two Git commit references (commit hash, branch or tag name, etc) `a_ref`
and `b_ref`, this command shows a a summary of basic statistics: how many files
were deleted/changed, and the file size differences.

Note that `dvc diff` does not show the line-to-line comparison among the target
files in each revision, like `git diff` does.

If the `-t` option is used, the diff is limited to the `TARGET` file or
directory specified.

`dvc diff` doesn't have an effect when the repository is not tracked by the Git
SCM, for example when `dvc init` was used with the `--no-scm` option

## Options

- `-t TARGET`, `--target TARGET` - Source path to a data file or directory. If
  not specified, compares all files and directories that are under DVC control
  in the current workspace.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples: Previous version of the same branch

For the setup of our examples we can use the steps in our
[Get Started](/doc/get-started) guide up to the
[Add Files](/doc/get-started/add-files) section.

<details>

### Click and expand to setup example

Start by cloning our sample repo if you don't already have it. Then move into
the repo and checkout the
[version](https://github.com/iterative/example-get-started/releases/tag/3-add-file)
corresponding to the add-files section mentioned above

```dvc
$ git clone https://github.com/iterative/example-get-started
Cloning into 'example-get-started'...

$ cd example-get-started
$ git checkout 3-add-file
Note: checking out '3-add-file'...

$ dvc pull
Preparing to download data from 'https://remote.dvc.org/get-started'
...
```

Now let's create a virtual environment with `virtualenv` and install the
requirements.

```dvc
$ virtualenv -p python3 .env
$ source .env/bin/activate
$ pip install -r requirements.txt
```

</details>

The minimal `dvc diff` command only includes the A reference (`a_ref`) from
which the difference is to be calculated. The B reference (`b_ref`) defaults to
Git `HEAD` (the currently checked out version). To find the general differences
with the very previous committed version of the project, we can use the `HEAD^`
Git reference.

```dvc
$ dvc diff HEAD^
dvc diff from df613bc to ed10968

diff for 'data/data.xml'
+data/data.xml with md5 a304afb96060aad90176268345e10355

added file with size 37.9 MB
```

## Examples: Specific targets across Git references

We can base this example in the [Experiment Metrics](/doc/get-started/metrics)
and [Compare Experiments](/doc/get-started/compare-experiments) sections of our
Get Started guide, which describe different experiments to produce the
`model.pkl` file. Our sample repository has the `bigrams-experiment` and
`baseline-experiment`
[tags](https://github.com/iterative/example-get-started/tags) respectively to
reference these experiments.

<details>

### Click and expand to setup example

Having followed the previous example's setup, move into the
**example-get-started** directory. Then make sure that you have the latest code
and data with the following commands.

```dvc
$ git checkout master
$ dvc fetch -T
```

The `-T` flag passed to `dvc fetch` makes sure we have all the data files
related to all existing tags in the repo. You take a look at the
[available tags](https://github.com/iterative/example-get-started/tags) of our
sample repo.

</details>

To see the difference in `model.pkl` among these versions, we can run the
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
`model.pkl` file between the 2 Git references we indicated.

### What about directories?

Unlike Git, DVC features controlling entire directories without having to add
each individual file. See `dvc add` without `--recursive` for example. `dvc run`
can also put whole directories under DVC control (when these are specified as
command dependencies or outputs).

We can use `dvc diff` to check for changes in a directory by specifying the
directory as the target (with option `-t`). Note that we skip the `b_ref`
argument this time, which defaults to `HEAD`.

```dvc
$ dvc diff -t data/features baseline-experiment
dvc diff from bc1722d to 8c1169d

diff for 'data/features'
-data/features with md5 3338d2c.dir
+data/features with md5 42c7025.dir

0 files not changed, 0 files modified, 0 files added,
0 files deleted, size was increased by 2.9 MB
```

## Examples: Confirming that a target has not changed

Let's use our sample repo once again, which has several
[available tags](https://github.com/iterative/example-get-started/tags) for
conveniency. The `5-preparation` tag corresponds to the
[Connect Code and Data](https://dvc.org/doc/get-started/connect-code-and-data)
section of our Get Started guide, in which the `dvc run` command is used to
create the `prepare.dvc` stage. The output of this stage is the `data/prepared`
directory.

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
`data/prepared` directory after the `5-preparation` version (since the `b_ref`
is the current version, `HEAD` by default). The output tells us that there have
been no changes to that directory (or to any other file).
