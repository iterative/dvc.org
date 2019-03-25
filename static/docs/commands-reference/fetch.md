# fetch

Get files that are under DVC control from remote storage into the local cache.
Fetching means downloading from the
[remote](https://dvc.org/doc/commands-reference/remote#description) unless the
files in question already exist in the local cache, in which case nothing is
done.

## Synopsis

```usage
    usage: dvc fetch [-h] [-q | -v] [-j JOBS]
                     [--show-checksums] [-r REMOTE]
                     [-a] [-T] [-d] [-R]
                     [targets [targets ...]]
    
    Fetch data files from the cloud.
    
    positional arguments:
      targets               DVC files (stages).
```

## Description

When checking out an existing project repository, files under DVC control should
exist in a remote, but won't be in your local machine. (Refer to `dvc remote`
for more information on DVC remotes.) These necessary data or model files
are be listed as dependencies or outputs in a DVC file (target stage) however.
(See [DVC File Format](https://dvc.org/doc/user-guide/dvc-file-format) for  more
information on dependencies and outputs.)

`dvc fetch` ensures that the files needed for a DVC file to be
[reproduced](/doc/get-started/reproduce) exist in the local cache. If no
`targets` are specified, the set of data files to fetch is determined by
analyzing all `.dvc` files in the current branch, unless `--all-branches` or
`--all-tags` is specified.

Note, `dvc push`, `dvc fetch`, and `dvc pull` are related in that these 3
commands perform data synchronization among local and remote storage. The
specific way in which the set of files to push/fetch/pull is determined
begins with calculating the checksums of the files in question, when these
are [added](https://dvc.org/doc/get-started/add-files) to DVC. File checksums
are then stored in the corresponding DVC files (usually saved in a Git
branch). Only the checksums specified in DVC files currently in the workspace
are considered by `dvc fetch` (unless the `-a` or `-T` options are used).

The default remote is used unless `--remote` is specified. See `dvc remote add`
for more information on how to configure different remote storage providers.

Fetching brings files in from a remote to the local cache, making them 
available for linking (or copying) into the workspace. (Refer to
[dvc config cache.type](https://dvc.org/doc/commands-reference/config#cache).)

Note, `dvc fetch` is performed automatically by `dvc pull` when the target stage
files are not already in the local cache. Specifically,
`dvc pull` = `dvc fetch` + `dev checkout`:

```
Controlled files             Commands
---------------- ---------------------------------

 remote storage
       +
       |         +------------+ 
       | - - - - | dvc fetch  | ++
       v         +------------+   +   +----------+
  local cache                      ++ | dvc pull |
       +         +------------+   +   +----------+
       | - - - - |dvc checkout| ++
       |         +------------+
       v
   workspace
```

## Options

- `-r REMOTE`, `--remote REMOTE` - name of the
  [remote storage](https://dvc.org/doc/commands-reference/remote#description)
  to fetch from (see `dvc remote list`). If not specified, the default 
  remote is used (see `dvc config core.remote`). The argument `REMOTE` is a
  remote name defined using the `dvc remote` command.

- `-d`, `--with-deps` - fetch cache by tracking dependencies to the named
  target stages. This option only has effect when one or more `targets` are
  specified. By traversing the dependencies, DVC searches backward through the
  pipeline from the named target(s). This means DVC will not fetch files needed
  later in the pipeline than the named target(s).

- `-R`, `--recursive` - this option tells DVC that `targets` are
  directories (not DVC files), and to traverse them recursively. All DVC 
  files found will be read in order to determine the set of data files to fetch.

- `-j JOBS`, `--jobs JOBS` - number of threads to run simultaneously to 
  handle the downloading of files from the remote. Using more jobs may 
  improve the total download speed if a combination of small and large files 
  are being fetched.
  The default value is `4 * cpu_count()`. For SSH remotes default is 4.
  > Note, this applies only to local remotes and for SSH remotes. (See `dvc 
  remote` for more information about  remotes.)

- `-a`, `--all-branches` - fetch cache for all branches, not just the active
  one. This means that you'll the files needed to reproduce different
  versions of a DVC file ([experiments](/doc/get-started/experiments)), not
  just the current one.

- `-T`, `--all-tags` - fetch cache for all tags. Similar to `-a` above

- `--show-checksums` - show checksums instead of file names when printing the
  download progress.

- `-v`, `--verbose` - displays detailed tracing information.

- `-q`, `--quiet` - do not write anything to standard output.

- `-h`, `--help` - prints the usage/help message, and exit.

## Examples

Let's add a couple remotes to the project first, so DVC can control our files
in them. (See `dvc remote add` for more details.) `myremote` will be the 
default, a LOCAL remote; `backup` will be an SSH remote:

```dvc
    $ dvc remote add -d myremote ../dir
    $ dvc remote add backup ssh://user@example.com/path/to/dir
```

Let's now [add](/doc/get-started/add-files) and
[push](/doc/get-started/share-data) data files to the remotes, so they can be
fetch `targets` later. For example, if a `data.xml` file is placed in the 
workspace:

```dvc
    $ dvc add data.xml
    Saving 'data.xml' to cache '.dvc/cache'.
    Saving information to 'data.xml.dvc'.
    ...

    $ dvc push data.xml.dvc
    [#################################] 100% data.xml

    $ dvc push -r backup data.xml.dvc
    [#################################] 100% data.xml
```

DVC file `data.xml.dvc` now describes `data.xml` as its output file, and both
the default remote and the SSH remote `backup` hold a copy of the data file.
Let's say the project also contains an `images` directory we want DVC to 
control:

```dvc
    $ dvc add images
    Saving 'images' to cache '.dvc/cache'.
    Linking directory 'images'.
    Saving information to 'images.dvc'.
    ...

    $ dvc push images.dvc
    ...
    [#################################] 100% images
```

The `images` directory and its files are now held in the default remote only.
The following examples assume the same project is checked out clean in 
another location or machine altogether.

Let's see what happens when someone checks out the project in a fresh location 
(or if you clear the local cache), and then use the command in different 
scenarios:

## Examples: Default behavior

Used with no arguments, `dvc fetch` will download all assets needed by all DVC 
files in the current branch, including for directories:

```dvc
    $ dvc status -c
    Preparing to collect status from ../dir
    [##########################] 100% Collecting information
    	deleted:            data.xml images/0001.jpg
    	                             images/0002.jpg
    	                             images/0003.jpg

    $ dvc fetch
    (1/4): [##########################] 100% data.xml
    (2/4): [##########################] 100% images/0001.jpg
    (3/4): [##########################] 100% images/0002.jpg
    (4/4): [##########################] 100% images/0003.jpg

    $ dvc status -c
    Preparing to collect status from ../dir
    [########################] 100% Collecting information
    Pipeline is up to date. Nothing to reproduce.
```

> `dvc status -c` compares the contents of our local cache against those in the 
default remote (for the current branch).

## Examples: Specific stages

Fetch only outputs of a specific stage bt specifying its DVC file (target
stage):

```dvc
    $ ls -la .dvc/cache 
    total 0
    drwxr-xr-x  2 usr  staff   64 Mar 16 13:28 .
    drwxr-xr-x  8 usr  staff  256 Mar 16 13:15 ..

    $ dvc fetch data.xml.dvc
    Preparing to download data from '../dir'
    ...
    [##############################] 100% Analysing status.
    [##############################] 100% data.xml

    $ ls -la .dvc/cache     
    total 0
    drwxr-xr-x  3 usr  staff   96 Mar 16 13:29 .
    drwxr-xr-x  8 usr  staff  256 Mar 16 13:29 ..
    drwxr-xr-x  3 usr  staff   96 Mar 16 13:29 d4
```

> As you can see by listing the `.dvc/cache` directory with `ls`, the
`d4` directory containing this branch version of `data.xml` was downloaded
from the default remote into the local cache.
See
[DVC Files and Directories](https://dvc.org/doc/user-guide/dvc-files-and-directories)
for more information on the local cache directory.

## Examples: Specific remotes

Fetch all targets stored in a specific remote

```dvc
    $ dvc fetch -r backup
    [#################################] 100% data.xml
```

> Specifying only a remote will get all the files needed for the current
branch pipeline which are held in that remote. Notice that it does not
necessarily include everything since we're able to distribute the asset
storage in different remotes.
