# checkout

Update data files and directories in the <abbr>workspace</abbr> based on current
DVC-files.

## Synopsis

```usage
usage: dvc checkout [-h] [-q | -v] [-d] [-R] [-f] [--relink]
                    [targets [targets ...]]

positional arguments:
  targets          DVC-files to checkout. Optional. (Finds all
                   DVC-files in the workspace by default.)
```

## Description

[DVC-files](/doc/user-guide/dvc-file-format) are essentially placeholders that
point to the actual data files or a directories under DVC control. This command
synchronizes the workspace data with the versions specified in the current
DVC-files. DVC knows which data files (<abbr>outputs</abbr>) to use because
their checksums are saved in the `outs` fields inside the DVC-files.

`dvc checkout` is useful when using Git in the <abbr>project</abbr>, after
`git clone`, `git checkout`, or any other repository operations that change the
currently present DVC-files.

💡 For convenience, a Git hook is available to automate running `dvc checkout`
after `git checkout`. Use `dvc install` to install it.

The execution of `dvc checkout` does the following:

- Scans the DVC-files to compare vs. the data files or directories currently in
  the <abbr>workspace</abbr>. Scanning is limited to the given `targets` (if
  any). See also options `--with-deps` and `--recursive` below.

- Missing data files or directories, or those that don't match with any
  DVC-file, are restored from the <abbr>cache</abbr>. See options `--force` and
  `--relink`.

By default, this command tries not to copy files between the cache and the
workspace, using reflinks instead, when supported by the file system. (Refer to
[File link types](/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache).)
The next linking strategy default value is `copy` though, so unless other file
link types are manually configured in `cache.type` (using `dvc config`), files
will be copied. Keep in mind that having file copies doesn't present much of a
negative impact unless the project uses very large data (several GBs or more).
But leveraging file links is crucial with large files, for example when checking
out a 50Gb file by copying might take a few minutes whereas, with links,
restoring any file size will be almost instantaneous.

> When linking files takes longer than expected (10 seconds for any one file)
> and `cache.type` is not set, a warning will be displayed reminding users about
> the faster link types available. These warnings can be turned off setting the
> `cache.slow_link_warning` config option to `false` with `dvc config cache`.

This command will fail to checkout files that are missing from the cache. In
such a case, `dvc checkout` prints a warning message. It also lists removed
files. Any files that can be checked out without error will be restored without
being reported individually.

There are two methods to restore a file missing from the cache, depending on the
situation. In some cases a pipeline must be reproduced (using `dvc repro`) to
regenerate its outputs. (See also `dvc pipeline`.) In other cases the cache can
be pulled from remote storage using `dvc pull`.

## Options

- `-d`, `--with-deps` - determine files to update by tracking dependencies to
  the target DVC-files (stages). This option only has effect when one or more
  `targets` are specified. By traversing all stage dependencies, DVC searches
  backward from the target stages in the corresponding pipelines. This means DVC
  will not checkout files referenced in later stages than the `targets`.

- `-R`, `--recursive` - `targets` is expected to contain at least one directory
  path for this option to have effect. Determines the files to checkout by
  searching each target directory and its subdirectories for DVC-files to
  inspect.

- `-f`, `--force` - does not prompt when removing workspace files. Changing the
  current set of DVC-files with `git checkout` can result in the need for DVC to
  remove files that don't match those DVC-file references or are missing from
  cache. (They are not "committed", in DVC terms.)

- `--relink` - ensures the file linking strategy (`reflink`, `hardlink`,
  `symlink`, or `copy`) for all data files in the workspace is consistent with
  the project's [`cache.type`](/doc/command-reference/config#cache). This is
  achieved by restoring **all data files or a directories** referenced in
  current DVC-files (regardless of whether they match a current DVC-file). This
  means overwriting the file links or copies from cache to workspace.

- `-h`, `--help` - shows the help message and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information from executing the
  `dvc pull` command.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, as well as a few Git tags, such as our
[get started example repo](https://github.com/iterative/example-get-started).
Then we can see what happens with `git checkout` and `dvc checkout` as we switch
from tag to tag.

<details>

### Click and expand to setup the project

Start by cloning our example repo if you don't already have it:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
```

</details>

The workspace looks almost like in this
[pipeline setup](/doc/tutorials/pipelines):

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
baseline-experiment     <- first simple version of the model
bigrams-experiment      <- use bigrams to improve the model
```

This project comes with a predefined HTTP
[remote storage](/doc/command-reference/remote). We can now just run `dvc pull`
that will fetch and checkout the most recent `model.pkl`, `data.xml`, and other
files that are under DVC control. The model file checksum
`3863d0e317dee0a55c4e59d2ec0eef33` will be used in the `train.dvc`
[stage file](/doc/command-reference/run):

```dvc
$ dvc pull
...
Checking out model.pkl with cache '3863d0e317dee0a55c4e59d2ec0eef33'
...

$ md5 model.pkl
MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

What if we want to rewind history, so to speak? The `git checkout` command lets
us checkout at any point in the commit history, or even checkout other tags. It
automatically adjusts the files, by replacing file content and adding or
deleting files as necessary.

```dvc
$ git checkout baseline
Note: checking out 'baseline'.
...
HEAD is now at 40cc182...
```

Let's check the `model.pkl` entry in `train.dvc` now:

```yaml
outs:
  md5: a66489653d1b6a8ba989799367b32c43
  path: model.pkl
```

But if you check `model.pkl`, the file hash is still the same:

```dvc
$ md5 model.pkl
MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

This is because `git checkout` changed `featurize.dvc`, `train.dvc`, and other
DVC-files. But it did nothing with the `model.pkl` and `matrix.pkl` files. Git
doesn't track those files, DVC does, so we must do this:

```dvc
$ dvc fetch
$ dvc checkout
$ md5 model.pkl
MD5 (model.pkl) = a66489653d1b6a8ba989799367b32c43
```

What happened is that DVC went through the sole existing DVC-file and adjusted
the current set of files to match the `outs` of that stage. `dvc fetch` is run
once to download missing data from the remote storage to the <abbr>cache</abbr>.
Alternatively, we could have just run `dvc pull` in this case to automatically
do `dvc fetch` + `dvc checkout`.

## Automating `dvc checkout`

We have the data files (managed by DVC) lined up with the other files (managed
by Git). This required us to remember to run `dvc checkout`, and of course we
won't always remember to do so. Wouldn't it be nice to automate this?

Let's run this command:

```dvc
$ dvc install
```

This installs Git hooks to automate running `dvc checkout` (or `dvc status`)
when needed. Then we can checkout the master branch again:

```dvc
$ git checkout bigrams
Previous HEAD position was d171a12 add evaluation stage
HEAD is now at d092b42 try using bigrams
Checking out model.pkl with cache '3863d0e317dee0a55c4e59d2ec0eef33'.

$ md5 model.pkl
MD5 (model.pkl) = 3863d0e317dee0a55c4e59d2ec0eef33
```

Previously this took two steps, `git checkout` followed by `dvc checkout`. We
can now skip the second one, which is automatically executed for us. The
workspace is automatically synchronized accordingly.
