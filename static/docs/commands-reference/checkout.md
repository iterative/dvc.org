# checkout

Update data files and directories in workspace based on current DVC files.

## Synopsis

```usage
    usage: dvc checkout [-h] [-q | -v]
                        [-d] [-f]
                        [targets [targets ...]]

    positional arguments:
        targets          DVC files.
```

## Description

DVC files (`.dvc`) in workspace identify in the `outs` fields which instance of
each data file or directory, using the checksum, is to be used. The
`dvc checkout` command updates the workspace data to match up with the cache
files corresponding to the checksums in the DVC files.

Using an SCM like Git, the DVC files are kept under version control. At a given
branch or tag of the SCM workspace, the DVC files will contain checksums for the
corresponding data files kept in the DVC cache. After an SCM command like `git
checkout` is run, the DVC files will change to the state at the specified branch
or commit or tag. Afterward the `dvc checkout` command is required in order to
synchronize the data files with the currently checked out DVC files.

During execution the `dvc checkout` command does:

* Scan the `outs` entries in DVC files to compare with the currently checked out
  data files. The scanned DVC files is limited by the listed targets (if any) on
  the command line. And if the `--with-deps` option is specified, it scans
  backward in the pipeline from the named targets.
* For any data files where the checksum does not match with the DVC file entry,
  the data file is restored from the cache. The link type (`reflink`,
  `hardlink`, `symlink`, or `copy`) appropriate to the operating system is used.

This command must be executed after `git checkout` since Git does not handle
files that are under DVC control. For convenience a Git hook is available,
simply by running `dvc install`, that will automate running `dvc checkout` after
`git checkout`. See `dvc install` for more information.

Note, this command does NOT copy any files (exception: `cache.type == copy`).
Instead, DVC uses links to perform data file restoration. This is crucial for
large files where checking out a 50Gb file might take a few minutes. With DVC
links, restoring a 50Gb data file will take less than a second.

The output of `dvc checkout` does not list which data files were restored. It
does report removed files and files that DVC was unable to restore due to it
missing from the cache.

This command will fail to checkout files that are missing from the cache. In
such a case, `dvc checkout` prints a warning message. Any files that can be
checked out without error will be restored.

There are two methods to restore a file missing from the cache, depending on the
situation. In some cases the pipeline must be rerun using the `dvc repro`
command. In other cases the cache can be pulled from a remote cache using the
`dvc pull` command.  It may be necessary to use `--all-tags` or `--all-branches`
with the `dvc pull` command.

## Options

* `-d`, `--with-deps` - determines the files to download by searching backwards
  in the pipeline from the named stage(s). The only files which will be
  updated are associated with the named stage, and the stages which execute
  earlier in the pipeline.

* `-f`, `--force` - does not prompt when removing workspace files. Changing the
  current set of DVC files with SCM commands like `git checkout` can result in
  the need for DVC to remove files which should not exist in the current state
  and are missing in the local cache (they are not committed in DVC terms). This
  option controls whether the user will be asked to confirm these files removal.

* `-R`, `--recursive` - performs recursive checkout for target directory.

* `-h`, `--help` - shows the help message and exit.

* `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

* `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

To explore `dvc checkout` let's consider a simple workspace with several stages,
and a few Git tags. Then with `git checkout` and `dvc checkout` we can see what
happens as we shift from tag to tag.

<details>

### Click and expand to setup the project

This step is optional, and you can run it only if you want to run this examples
in your environment. First, you need to download the project:

```dvc
    $ git clone https://github.com/iterative/example-get-started
```

Second, let's install the requirements. But before we do that, we **strongly**
recommend creating a virtual environment with `virtualenv` or a similar tool:

```dvc
    $ cd example-get-started
    $ virtualenv -p python3 .env
    $ source .env/bin/activate
```

Now, we can install requirements for the project:

```dvc
    $ pip install -r requirements.txt
```

</details>

The existing pipeline looks almost like in this
[example](/doc/get-started/example-pipeline):

```dvc
    .
    ├── data
    │   └── data.xml.dvc
    ├── evaluate.dvc
    ├── featurize.dvc
    ├── prepare.dvc
    ├── train.dvc
    └── src
        └── <code files here>
```

We have these tags in the repository that represent different iterations of
solving the problem:

```dvc
    $ git tag

    baseline     <- first simple version of the model
    bigram       <- use bigrams to improve the model
```

This project comes with a predefined HTTP [remote
storage](https://man.dvc.org/remote). We can now just run `dvc pull` that will
fetch and checkout the most recent `model.pkl`, `data.xml`, and other files that
are under DVC control. The model file checksum
`3863d0e317dee0a55c4e59d2ec0eef33` is specified in the `train.dvc` file:

```dvc
    $ dvc pull
    ...
    (1/6): [#######################] 100% model.pkl
    Checking out model.pkl with cache '3863d0e317dee0a55c4e59d2ec0eef33'
    ...

    $ md5 model.pkl
    MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

What if we want to rewind history, so to speak? The `git checkout` command lets
us checkout at any point in the commit history, or even check out other tags. It
automatically adjusts the files, by replacing file content and adding or
deleting files as necessary.

```dvc
    $ git checkout baseline
    Note: checking out 'baseline'.
    ...
    HEAD is now at 40cc182...
```

Let's check the `model.pkl` and `train.dvc` files again:

```yaml
    outs:
        md5: a66489653d1b6a8ba989799367b32c43
        path: model.pkl
```

but if you check the `model.pkl` the file is still the same:

```dvc
    $ md5 model.pkl
    MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

What's happened is that `git checkout` changed `featurize.dvc`, `train.dvc`, and
other DVC files. But it did nothing with the `model.pkl` and `matrix.pkl` files.
Git does not manage those files. Instead DVC manages those files, and we must
therefore do this:

```
    $ dvc fetch
    $ dvc checkout
    $ md5 model.pkl
    MD5 (model.pkl) = a66489653d1b6a8ba989799367b32c43
```

What's happened is that DVC went through the sole existing DVC stage file and
adjusted the current set of files to match the `outs` of that stage. `dvc fetch`
command runs once to download missing data from the remote storage to the local
cache. Alternatively, we could have just run `dvc pull` in this case to
automatically do `dvc fetch` + `dvc checkout`.

## Automating `dvc checkout`

We have the data files (managed by DVC) lined up with the other files (managed
by Git). This required us to remember to run `dvc checkout`, and of course we
won't always remember to do so. Wouldn't it be nice to automate this?

Let's run this command:

```
    $ dvc install
```

This installs Git hooks to automate running `dvc checkout` (or `dvc status`)
when needed. Then we can checkout the master branch again:

```
    $ git checkout bigrams
    Previous HEAD position was d171a12 add evaluation stage
    HEAD is now at d092b42 try using bigrams
    Checking out model.pkl with cache '3863d0e317dee0a55c4e59d2ec0eef33'.

    $ md5 model.pkl
    MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

Previously this took two steps, `git checkout` followed by `dvc checkout`, but
we have skipped having to remember to run that second step. Instead it is
automatically executed for us, and the workspace is automatically synchronized.
