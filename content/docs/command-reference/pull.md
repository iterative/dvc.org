# pull

Download tracked files or directories from
[remote storage](/doc/command-reference/remote) to the <abbr>cache</abbr> and
<abbr>workspace</abbr>, based on the current
[DVC-files](/doc/user-guide/dvc-file-format).

## Synopsis

```usage
usage: dvc pull [-h] [-q | -v] [-j <number>]
                [-r <name>] [-a] [-T] [-d] [-f] [-R] [--all-commits]
                [targets [targets ...]]

positional arguments:
  targets        Limit command scope to these DVC-files. Using -R,
                 directories to search DVC-files in can also be given.
```

## Description

The `dvc pull` and `dvc push` commands are the means for uploading and
downloading data to and from remote storage. These commands are analogous to
`git pull` and `git push`, respectively.
[Data sharing](/doc/use-cases/sharing-data-and-model-files) across environments
and preserving data versions (input datasets, intermediate results, models,
[metrics](/doc/command-reference/metrics), etc) remotely (S3, SSH, GCS, etc.)
are the most common use cases for these commands.

The `dvc pull` command allows one to retrieve data from remote storage.
`dvc pull` has the same effect as running `dvc fetch` and `dvc checkout`
immediately after that.

The default remote is used (see `dvc config core.remote`) unless the `--remote`
option is used. See `dvc remote` for more information on how to configure a
remote.

With no arguments, just `dvc pull` or `dvc pull --remote <name>`, it downloads
only the files (or directories) missing from the workspace by searching all
[DVC-files](/doc/user-guide/dvc-file-format) currently in the
<abbr>project</abbr>. It will not download files associated with earlier commits
in the <abbr>repository</abbr> (if using Git), nor will it download files that
have not changed.

The command `dvc status -c` can list files referenced in current DVC-files, but
missing in the <abbr>cache</abbr>. It can be used to see what files `dvc pull`
would download.

If one or more `targets` are specified, DVC only considers the files associated
with those DVC-files. Using the `--with-deps` option, DVC tracks dependencies
backward from the target [stage files](/doc/command-reference/run), through the
corresponding [pipelines](/doc/command-reference/pipeline), to find data files
to pull.

After a data file is in cache, `dvc pull` can use OS-specific mechanisms like
reflinks or hardlinks to put it in the workspace without copying. See
`dvc checkout` for more details.

## Options

- `-a`, `--all-branches` - determines the files to download by examining
  DVC-files in all Git branches instead of just those present in the current
  workspace. It's useful if branches are used to track experiments or project
  checkpoints. Note that this can be combined with `-T` below, for example using
  the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Useful if tags are used to track "checkpoints" of an experiment
  or project. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. Useful for downloading all the data used in the
  entire existing commit history of the project.

- `-d`, `--with-deps` - determines files to download by tracking dependencies to
  the target DVC-files (stages). If no `targets` are provided, this option is
  ignored. By traversing all stage dependencies, DVC searches backward from the
  target stages in the corresponding pipelines. This means DVC will not pull
  files referenced in later stages than the `targets`.

- `-R`, `--recursive` - determines the files to pull by searching each target
  directory and its subdirectories for DVC-files to inspect. If there are no
  directories among the `targets`, this option is ignored.

- `-f`, `--force` - does not prompt when removing workspace files, which occurs
  when these file no longer match the current DVC-file references. This option
  surfaces behavior from the `dvc fetch` and `dvc checkout` commands because
  `dvc pull` in effect performs those 2 functions in a single command.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to pull from (see
  `dvc remote list`).

- `-j <number>`, `--jobs <number>` - number of threads to run simultaneously to
  handle the downloading of files from the remote. The default value is
  `4 * cpu_count()`. For SSH remotes, the default is just `4`. Using more jobs
  may improve the total download speed if a combination of small and large files
  are being fetched.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

Let's employ a simple <abbr>workspace</abbr> with some data, code, ML models,
pipeline stages, such as the <abbr>DVC project</abbr> created for the
[Get Started](/doc/tutorials/get-started). Then we can see what happens with
`dvc pull`.

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
...
└── train.dvc
```

We can now just run `dvc pull` to download the most recent `data/data.xml`,
`model.pkl`, and other DVC-tracked files into the <abbr>workspace</abbr> and
<abbr>cache</abbr>:

```dvc
$ dvc pull

$ tree example-get-started/
example-get-started/
├── data
│   ├── data.xml
│   ├── data.xml.dvc
│   └── ...
...
├── model.pkl
└── train.dvc

```

We can download specific <abbr>outputs</abbr> of a single DVC-file:

```dvc
$ dvc pull train.dvc
```

## Example: With dependencies

> If you followed previous example then delete the .dvc/cache directory with
> `rm -Rf .dvc/cache`. Else `dvc status -c` would output
> `Data and pipelines are up to date.`

Our [pipeline](/doc/command-reference/pipeline) has been setup with these
[stages](/doc/command-reference/run):

```dvc
$ dvc pipeline show evaluate.dvc
data/data.xml.dvc
prepare.dvc
featurize.dvc
train.dvc
evaluate.dvc
```

Imagine the [remote storage](/doc/command-reference/remote) has been modified
such that the data in some of these stages should be updated in the
<abbr>workspace</abbr>.

```dvc
$ dvc status -c
    deleted:            data/features/test.pkl
    deleted:            data/features/train.pkl
    deleted:            model.pkl
    ...
```

One could do a simple `dvc pull` to get all the data, but what if you only want
to retrieve part of the data?

```dvc
$ dvc pull --with-deps featurize.dvc

... Use the partial update, then pull the remaining data:

$ dvc pull
Everything is up to date.
```

With the first `dvc pull` we specified a stage in the middle of this pipeline
(`featurize.dvc`) while using `--with-deps`. DVC started with that DVC-file and
searched backwards through the pipeline for data files to download.

Then we ran `dvc pull` to download all the remaining data files.

## Example: Download from specific remote storage

For using the `dvc pull` command, a remote storage must be defined. (See
`dvc remote add`.) For an existing <abbr>project</abbr>, remotes are usually
already set up and you can use `dvc remote list` to check them. To remember how
it's done, and set a context for the example, let's define a default SSH remote:

```dvc
$ dvc remote add -d r1 ssh://_username_@_host_/path/to/dvc/remote/storage
$ dvc remote list
r1	ssh://_username_@_host_/path/to/dvc/remote/storage
```

> DVC supports several
> [remote types](/doc/command-reference/remote/add#supported-storage-types).

To download DVC-tracked data from a specific DVC remote, use the `--remote`
(`-r`) option of `dvc pull`:

```dvc
$ dvc pull --remote r1
```
