# diff

Show changes between files or directories that are under DVC control.

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
and `b_ref`, this command shows a a summary of basic statistics: how many files were
deleted/changed. Note, this does not work like `git diff` works.

If the `-t` option is used, the diff is limited to the `TARGET` file or
directory specified.

`dvc diff` doesn't have an effect when the repository is not tracked by the Git
SCM, for example when `dvc init` was used with the `--no-scm` option

## Options

* `-t TARGET`, `--target TARGET` - Source path to a data file or directory.
  Default None. If not specified, compares all files and directories that are
  under DVC control in the current working space.

* `-h`, `--help` - prints the usage/help message, and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information.

## Examples: Previous version of the same branch

For the setup of our examples we can use the steps in our [Get
Started](/doc/get-started) guide up to the [Add
Files](/doc/get-started/add-files) section.

<details>

### Click and expand to setup example

Start by cloning our sample repo if you don't already have it. Then move into
the repo and checkout the
[version](https://github.com/iterative/example-get-started/commit/ed10968bcb0dab72563d05712f24ddfff698c87b)
corresponding to the add-files section mentioned above

```dvc
    $ git clone https://github.com/iterative/example-get-started
    Cloning into 'example-get-started'...

    $ cd example-get-started
    $ git checkout ed10968
    Note: checking out 'ed10968'...

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
    dvc diff from df613bce6dc0738f71c62d1748e1edfb3b7e4893 to ed10968bcb0dab72563d05712f24ddfff698c87b

    diff for 'data/data.xml'
    +data/data.xml with md5 a304afb96060aad90176268345e10355

    added file with size 37.9 MB
```

## Examples: Specific target accross Git references

We can base this example in the [Experiment Metrics](/doc/get-started/metrics)
and [Compare Experiments](/doc/get-started/compare-experiments) sections of our
Get Started guide, which describe different experiments to produce the
`model.pkl` file.
> Our sample repository has the `bigrams-experiment` and `baseline-experiment`
[tags](https://github.com/jorgeorpinel/example-get-started/tags) respectively to
refernce these experiments.

### Click and expand to setup example

Having followed the previous example's setup, move into the
**example-get-started** directory. Then make sure that you have the latest code
and data with the following commands.

```dvc
    $ git checkout master
    $ dvc fetch -aT
```

The `-aT` flag passed to `dvc fetch` makes sure we have all the data files
related to all existing tags in the repo. You take a look at the available tags
of our sample repo in https://github.com/jorgeorpinel/example-get-started/tags.

</details>

```dvc
    $ dvc diff -t model.pkl baseline-experiment bigrams-experiment
    dvc diff from bc1722d7eeb4cba9a5c8e401199e995739c474a9 to 8c1169d1819c5cf0a4e2aa7e7d8c43854563b251

    diff for 'model.pkl'
    -model.pkl with md5 a66489653d1b6a8ba989799367b32c43
    +model.pkl with md5 3863d0e317dee0a55c4e59d2ec0eef33

    added file with size -202464 Bytes
````

The output from this command confirms that there's a difference in the
`model.pkl` file between the 2 Git references we indicated.
