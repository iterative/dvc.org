# pull

Download tracked files or directories from
[remote storage](/doc/command-reference/remote) based on the current `dvc.yaml`
and `.dvc` files, and make them visible in the <abbr>workspace</abbr>.

## Synopsis

```usage
usage: dvc pull [-h] [-q | -v] [-j <number>] [-r <name>] [-a] [-T]
                [-d] [-f] [-R] [--all-commits] [--run-cache]
                [targets [targets ...]]

positional arguments:
  targets       Limit command scope to these tracked files/directories,
                .dvc files, or stage names.
```

## Description

The `dvc push` and `dvc pull` commands are the means for uploading and
downloading data to and from remote storage (S3, SSH, GCS, etc.). These commands
are similar to `git push` and `git pull`, respectively.
[Data sharing](/doc/use-cases/sharing-data-and-model-files) across environments
and preserving data versions (input datasets, intermediate results, models,
[metrics](/doc/command-reference/metrics), etc.) remotely are the most common
use cases for these commands.

`dvc pull` downloads tracked data from
[remote storage](/doc/command-reference/remote) to the <abbr>cache</abbr>, and
links (or copies) the files or directories to the <abbr>workspace</abbr> (refer
to `dvc config cache.type`).

> Note that pulling data does not affect code, `dvc.yaml`, or `.dvc` files.
> Those should be downloaded with `git pull`.

It has the same effect as running `dvc fetch` and `dvc checkout`:

```
Tracked files                Commands
---------------- ---------------------------------

remote storage
     +
     |         +------------+
     | - - - - | dvc fetch  | ++
     v         +------------+   +   +----------+
project's cache                  ++ | dvc pull |
     +         +------------+   +   +----------+
     | - - - - |dvc checkout| ++
     |         +------------+
     v
 workspace
```

The default remote is used (see `dvc remote default`) unless the `--remote`
option is used. See `dvc remote` for more information on how to configure a
remote.

Without arguments, it downloads all files and directories missing from the
project, found as <abbr>outputs</abbr> of the
[stages](/doc/command-reference/run) or `.dvc` files present in the workspace.
The `--all-branches`, `--all-tags`, and `--all-commits` options enable pulling
multiple Git commits.

The `targets` given to this command (if any) limit what to pull. It accepts
paths to tracked files or directories (including paths inside tracked
directories), `.dvc` files, and stage names (found in `dvc.yaml`).

After the data is in the <abbr>cache</abbr>, `dvc pull` uses OS-specific
mechanisms like reflinks or hardlinks to put it in the workspace, trying to
avoid copying. See `dvc checkout` for more details.

Note that the command `dvc status -c` can list files referenced in current
stages (in `dvc.yaml`) or `.dvc` files, but missing from the cache. It can be
used to see what files `dvc pull` would download.

## Options

- `-a`, `--all-branches` - determines the files to download by examining
  `dvc.yaml` and `.dvc` files in all Git branches instead of just those present
  in the current workspace. It's useful if branches are used to track
  experiments or project checkpoints. Note that this can be combined with `-T`
  below, for example using the `-aT` flag.

- `-T`, `--all-tags` - same as `-a` above, but applies to Git tags as well as
  the workspace. Useful if tags are used to track "checkpoints" of an experiment
  or project. Note that both options can be combined, for example using the
  `-aT` flag.

- `--all-commits` - same as `-a` or `-T` above, but applies to _all_ Git commits
  as well as the workspace. This downloads tracked data for the entire commit
  history of the project.

- `-d`, `--with-deps` - determines files to download by tracking dependencies to
  the `targets`. If none are provided, this option is ignored. By traversing all
  stage dependencies, DVC searches backward from the target stages in the
  corresponding pipelines. This means DVC will not pull files referenced in
  later stages than the `targets`.

- `-R`, `--recursive` - determines the files to pull by searching each target
  directory and its subdirectories for `dvc.yaml` and `.dvc` files to inspect.
  If there are no directories among the `targets`, this option is ignored.

- `-f`, `--force` - does not prompt when removing workspace files, which occurs
  when these files no longer match the current stages or `.dvc` files. This
  option surfaces behavior from the `dvc fetch` and `dvc checkout` commands
  because `dvc pull` in effect performs those 2 functions in a single command.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) to pull from (see
  `dvc remote list`).

- `--run-cache` - downloads all available history of stage runs from the remote
  repository (to the cache only, like `dvc fetch --run-cache`). Note that
  `dvc repro <stage_name>` is necessary to checkout these files (into the
  workspace) and update `dvc.lock`.

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from remote storage. The default value is `4 * cpu_count()`. For SSH remotes,
  the default is `4`. Note that the default value can be set using the `jobs`
  config option with `dvc remote modify`. Using more jobs may improve the
  overall transfer speed.

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

```dvc
.
├── data
│   └── data.xml.dvc
├── dvc.lock
├── dvc.yaml
...
└── src
    └── <code files here>
```

We can now just run `dvc pull` to download the most recent `data/data.xml`,
`model.pkl`, and other DVC-tracked files into the <abbr>workspace</abbr>:

```dvc
$ dvc pull

$ tree
.
├── data
│   ├── data.xml
│   ├── data.xml.dvc
...
└── model.pkl
```

We can download specific <abbr>outputs</abbr> of a single stage:

```dvc
$ dvc pull train
```

## Example: With dependencies

> Please delete the `.dvc/cache` directory first (with `rm -Rf .dvc/cache`) to
> follow this example if you tried the previous ones.

Our [pipeline](/doc/command-reference/dag) has been setup with these
[stages](/doc/command-reference/run): `prepare`, `featurize`, `train`,
`evaluate`.

Imagine the [remote storage](/doc/command-reference/remote) has been modified
such that the data in some of these stages should be updated in the
<abbr>workspace</abbr>.

```dvc
$ dvc status -c
...
	deleted:            data/features/test.pkl
	deleted:            data/features/train.pkl
	deleted:            model.pkl
	...
```

One could do a simple `dvc pull` to get all the data, but what if you only want
to retrieve part of the data?

```dvc
$ dvc pull --with-deps featurize

... Use the partial update, then pull the remaining data:

$ dvc pull
Everything is up to date.
```

With the first `dvc pull` we specified a stage in the middle of this pipeline
(`featurize`) while using `--with-deps`. DVC started with that stage and
searched backwards through the pipeline for data files to download. Later we ran
`dvc pull` to download all the remaining data files.

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
