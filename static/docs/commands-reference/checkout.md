# checkout

Update data files in workspace from the cache based on current DVC files.

## Synopsis

```usage
    usage: dvc checkout [-h] [-q | -v] [-d] [-f] [targets [targets ...]]

    positional arguments:
        targets          DVC files.
```

## Description

The current DVC files identify in the `deps` and `outs` fields which instance of
each data file, using the checksum, is to be used.  The `dvc checkout` command
updates the workspace data files to match up with the cache files corresponding
to the checksums in the DVC files.

Using an SCM like Git, the DVC files are kept under version control.  At a given
branch or tag of the SCM workspace, the DVC files will contain checksums for the
corresponding data files kept in the DVC cache.  After an SCM command like
`git checkout` is run, the DVC files will change to the state at the specified
branch or commit or tag.  Afterward the `dvc checkout` command is required in
order to synchronize the data files with the currently checked out DVC files.

During execution the `dvc checkout` command does:

* Scan the `deps` and `outs` entries in DVC files to compare with the currently
  checked out data files.  The scanned DVC files is limited by the listed
  targets (if any) on the command line.  And if the `--with-deps` option is
  specified, it scans backward in the pipeline from the named targets.
* For any data files where the checksum does not match with the DVC file entry,
  the data file is restored from the cache.  The link type (`reflink`,
  `hardlink`, `symlink`, or `copy`) appropriate to the operating system is used.
* Any data files not listed in the DVC files are removed.

This command must be executed after `git checkout` since Git does not handle
files that are under DVC control.  For convenience a Git hook is available,
simply by running `dvc install`, that will automate running `dvc checkout`
after `git checkout`.  See `dvc install` for more information.

Note, this command does NOT copy any files (exception: `cache.type == copy`).
Instead, DVC uses links to perform data file restoration. This is crucial for
large files where checking out a 50Gb file might take a few minutes. With DVC
links, restoring a 50Gb data file will take less than a second.

The output of `dvc checkout` does not list which data files were restored. It
does report removed files and files that DVC was unable to restore due to it
missing from the cache.

There are two methods to restore a file missing from the cache, depending on the
situation.  In some cases the pipeline must be rerun using the `dvc repro`
command.  In other cases the cache can be pulled from a remote cache using the
`dvc pull` command.

## Options

* `-d`, `--with-deps` - determines the files to download by searching backwards
  in the pipeline from the named stage(s). The only files which will be
  updated are associated with the named stage, and the stages which execute
  earlier in the pipeline.

* `-f`, `--force` - does not prompt when removing working directory files, which
  occurs during the process of updating the workspace.  Changing the current
  set of DVC files with SCM commands like `git checkout` can result in the need
  for DVC to remove files which should not exist in the current state.  This
  option controls whether the user will be asked to confirm directory removal.

* `-h`, `--help` - shows the help message and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

To explore `dvc checkout` let's set up a simple workspace with several stages,
and we'll add a few Git tags along the way.  Then with `git checkout` and
`dvc checkout` we can what happens as we shift from tag to tag.

For a dataset we'll use the New York winning lottery numbers starting in 2002,
as made available here: https://catalog.data.gov/dataset/lottery-mega-millions-winning-numbers-beginning-2002

Don't worry if the example looks a bit silly.  First, it's an example, but more
importantly it this sort of pipeline could be useful as an adjunct to a larger
data processing system.  This type of pipeline could run automatically every day
or hour, or in this case every week (following the weekly lottery numbers pick),
to be assured of always having up-to-date data in a shared DVC cache.

<details>

### Expand to see how to set up the pipeline

To assist downloading the dataset CSV file we'll use this shell script:

```
$ cat download.sh
curl -f 'https://data.ny.gov/api/views/5xaw-6ayf/rows.csv?accessType=DOWNLOAD' \
        | sed -n 2,\$p >data/nylottery.csv
```

To initialize the workspace run the following commands:

```
    git init
    dvc init
    mkdir data
    dvc run -f download.dvc -o data/nylottery.csv sh -x download.sh
    git add .
    git commit -m 'download data'
    git tag downloadata
    dvc run -d data/nylottery.csv -o data/nylottery-bywin.csv \
        -f nylottery-bywin.dvc \
        sort --key=2 --field-separator=, -o data/nylottery-bywin.csv data/nylottery.csv
    git add .
    git commit -m nylottery-bywin
    git tag nylottery-bywin
    dvc run -d data/nylottery.csv -o data/nylottery-bymega.csv \
        -f nylottery-bymega.dvc \
        sort --key=3 --field-separator=, -o data/nylottery-bymega.csv data/nylottery.csv
    git add .
    git commit -m nylottery-bymega
    git tag nylottery-bymega
```

We're not going to detect any interesting statistical patterns in winning lottery
numbers with this pipeline.  But it will let us explore the relationship between
`git checkout` and `dvc checkout`.

</details>

The pipeline generated by the setup consists of these stages:

```
    $ dvc pipeline list

    nylottery-bywin.dvc
    download.dvc
    nylottery-bymega.dvc
    ================================================================================
    1 pipeline(s) total
```

And we have these tags in the Git repository

```
    $ git tag --list

    downloadata
    nylottery-bymega
    nylottery-bywin
```

Once the workspace is set up, it contains the following files

```
    $ tree .

    .
    ├── data
    │   ├── nylottery-bymega.csv
    │   ├── nylottery-bywin.csv
    │   └── nylottery.csv
    ├── download.dvc
    ├── download.sh
    ├── nylottery-bymega.dvc
    └── nylottery-bywin.dvc

    1 directory, 7 files
```

At this point we have some data that's been cleaned up a little, and it has
been sorted in two ways.  The source dataset has CVS column names as the first
row which is a nicety but does not play well with the Unix `sort` command,
because it cannot be told to ignore sorting the first row.  Instead we stripped
off the first row when downloading the file.

What if we want to rewind history, so to speak?  The `git checkout` command
lets us checkout at any point in the commit history, or even check out other
branches.  It automatically adjusts the files, by replacing file content and
adding or deleting files as necessary.

```
    $ git checkout downloadata
    Note: checking out 'downloadata'.
    ...
    HEAD is now at 40cc182... download data
    $ tree .
    .
    ├── data
    │   ├── nylottery-bymega.csv
    │   ├── nylottery-bywin.csv
    │   └── nylottery.csv
    ├── download.dvc
    └── download.sh

    1 directory, 5 files
```

What's happened is that `git checkout` removed `nylottery-bymega.dvc` and
`nylottery-bywin.dvc` because neither was present when the `downloadata` tag was
created.  But it did nothing with the `nylottery-bymega.csv` and
`nylottery-bywin.csv` files.  Those files are also not appropriate at the moment
of the `downloadata` tag, but Git does not manage those files.  Instead DVC
manages those files, and we must therefore do this:

```
    $ dvc checkout
    $ tree .
    .
    ├── data
    │   └── nylottery.csv
    ├── download.dvc
    └── download.sh

    1 directory, 3 files
```

What's happened is that DVC went through the sole existing DVC stage file and
adjusted the current set of files to match the `deps` and `outs` of that stage.
By _adjusted_ we mean `nylottery-bymega.csv` and `nylottery-bywin.csv` were
removed from the directory, but of course they're still in the DVC cache.

When the `downloadata` tag was created the `download.dvc` stage had just
finished.  The `nylottery.csv` file was downloaded and nothing else had been
run, and therefore the workspace now reflects that state in time.

### Automating `dvc checkout` after `git checkout`

We have the data files (managed by DVC) lined up with the other files (managed
by Git).  This required us to remember to run `dvc checkout`, and of course we
won't always remember to do so.  Wouldn't it be nice to automate this?

Let's run this command:

```
    $ dvc install
```

This installs Git hooks to automate running `dvc checkout` (or `dvc status`)
when needed.  Then we can checkout the master branch again:

```
    $ git checkout master
    Previous HEAD position was 40cc182... download data
    Switched to branch 'master'
    Checking out '{u'path': u'/home/david/dvc/lottery/data/nylottery-bywin.csv', u'scheme': u'local'}' with cache '9c2979ea6aba4c32063c6ded6257483e'.
    Data '{u'path': u'/home/david/dvc/lottery/data/nylottery.csv', u'scheme': u'local'}' didn't change.
    Checking out '{u'path': u'/home/david/dvc/lottery/data/nylottery-bymega.csv', u'scheme': u'local'}' with cache '3459452f176167926f101875996dba38'.

    $ tree .
    .
    ├── data
    │   ├── nylottery-bymega.csv
    │   ├── nylottery-bywin.csv
    │   └── nylottery.csv
    ├── download.dvc
    ├── download.sh
    ├── nylottery-bymega.dvc
    └── nylottery-bywin.dvc

    1 directory, 7 files
```

Previously this took two steps, `git checkout` followed by `dvc checkout`, but
we have skipped having to remember to run that second step.  Instead it is
automatically executed for us, and the workspace is automatically synchronized.
