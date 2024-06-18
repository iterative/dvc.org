# Internal Directories and Files

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the internal directories and files needed for DVC
operation.

<admon type="warn">

Not to be confused with `.dvc` files.

</admon>

- `.dvc/config`: This is the default [DVC configuration] file. It can be edited by
  hand or with the `dvc config` command.

- `.dvc/config.local`: This is an optional Git-ignored configuration file, that
  will overwrite options in `.dvc/config`. This is useful when you need to
  specify sensitive values (secrets) which should not reach the Git repo
  (credentials, private locations, etc). This config file can also be edited by
  hand or with `dvc config --local`.

  <admon type="tip">

  See more
  [config file locations](/doc/user-guide/project-structure/configuration#config-file-locations).

  </admon>

- `.dvc/cache`: Default location of the <abbr>cache</abbr> directory. The cache
  stores the project data in a special
  [structure](#structure-of-the-cache-directory). The data files and directories
  in the <abbr>workspace</abbr> will only contain links to the data files in the
  cache (refer to
  [Large Dataset Optimization](/doc/user-guide/data-management/large-dataset-optimization).
  See `dvc config cache` for related configuration options, including changing
  its location.

  <admon type="info">

  Note that DVC includes the cache directory in `.gitignore` during
  initialization. No data tracked by DVC should ever be pushed to the Git
  repository, only the <abbr>DVC files</abbr> that are needed to download or
  reproduce that data.

  </admon>

- `.dvc/cache/runs`: Default location of the [run cache](#run-cache).

- `.dvc/plots`: Directory for
  [plot templates](/doc/user-guide/experiment-management/visualizing-plots#plot-templates-data-series-only)

- `.dvc/tmp`: Directory for miscellaneous temporary files

- `.dvc/tmp/updater`: This file is used to store the latest available version of
  DVC. It's used to remind the user to upgrade when the installed version is
  behind.

- `.dvc/tmp/updater.lock`: Lock file for `.dvc/tmp/updater`

- `.dvc/tmp/lock`: Lock file for the entire DVC project

- `.dvc/tmp/rwlock`: JSON file that contains read and write locks for specific
  dependencies and outputs, to allow safely running multiple DVC commands in
  parallel

- `.dvc/tmp/exps`: This directory will contain workspace copies used for
  temporary or [queued experiments].

[dvc configuration]: /doc/user-guide/project-structure/configuration
[queued experiments]:
  /doc/user-guide/experiment-management/running-experiments#the-experiments-queue

## Structure of the cache directory

The DVC cache is a [content-addressable storage] (by default in `.dvc/cache`), which
adds a layer of indirection between code and data.

There are two ways in which the data is <abbr>cached</abbr>, depending on
whether it's a single file, or a directory (which may contain multiple files).

Note files are renamed, reorganized, and directory trees are flattened in the
cache, which always has exactly one depth level with 2-character directories
(based on hashes of the data contents, as explained next).

[content-addressable storage]:
  https://en.wikipedia.org/wiki/Content-addressable_storage

### Files

DVC calculates the file hash, a 32 characters long string (usually MD5). The
first two characters are used to name the directory inside the cache, and the
rest become the file name of the cached file. For example, if a data file has a
hash value of `ec1d2935f811b77cc49b031b999cbf17`, its path in the cache will be
`.dvc/cache/files/md5/ec/1d2935f811b77cc49b031b999cbf17`.

> Note that file hashes are calculated from file contents only. 2 or more files
> with different names but the same contents can exist in the workspace and be
> tracked by DVC, but only one copy is stored in the cache. This helps avoid
> data duplication.

### Directories

Let's imagine [adding](/doc/command-reference/add) a directory with 2 images:

```cli
$ tree data/images/
data/images/
├── cat.jpeg
└── index.jpeg

$ dvc add data/images
```

The resulting cache dir looks like this:

```cli
.dvc/cache/
└── files
    └── md5
        ├── 40
        │   └── 2e97968614f583ece3b35555971f64
        ├── 6f
        │   └── db5336fce0dbfd669f83065f107551.dir
        └── de
            └── 7371b0119f4f75f9de703c7c3bac16
```

The files in the directory are cached normally. The directory itself gets a
similar entry, with the `.dir` extension. It contains the mapping of files
inside (as a JSON array), identified by their hash values:

```cli
$ cat .dvc/cache/files/md5/6f/db5336fce0dbfd669f83065f107551.dir
[{"md5": "de7371b0119f4f75f9de703c7c3bac16", "relpath": "cat.jpeg"},
{"md5": "402e97968614f583ece3b35555971f64", "relpath": "index.jpeg"}]
```

That's how DVC knows that the other two cached files belong in the directory.

## Run cache

`dvc exp run` and `dvc repro` by default populate and reutilize a log of stages
that have been run in the project. It is found in the `runs/` directory inside
the cache (or [remote storage]).

[Runs] are identified as combinations of exact <abbr>dependency</abbr> contents
(or [parameter] values), and the literal command(s) to execute. These
combinations are represented by special hashes that translate to the file paths
inside the run cache dir:

[remote storage]: /doc/user-guide/data-management/remote-storage
[runs]: /doc/user-guide/pipelines/run-cache
[parameter]: /doc/command-reference/params

```cli
$ tree .dvc/cache/runs
.dvc/cache/runs
└── 86
    └── 8632e1555283d6e23ec808c9ee1fadc30630c888d5c08695333609ef341508bf
        └── e98a34c44fa6b564ef211e76fb3b265bc67f19e5de2e255217d3900d8f...
```

The files themselves are backups of the `dvc.lock` file that resulted from that
run.

<admon type="info">

The run's <abbr>outputs</abbr> are stored and retrieved from the regular cache.

</admon>

<admon type="tip">

`dvc push` and `dvc pull` (and `dvc fetch`) can download and upload the run
cache to remote storage using the `--run-cache` flag, for sharing and/or as a
back up.

</admon>

<admon type="warn">

The run cache assumes that stage commands are deterministic (see [Avoiding
unexpected behavior]).

</admon>

[avoiding unexpected behavior]:
  /doc/user-guide/project-structure/dvcyaml-files#avoiding-unexpected-behavior

## Site cache dir

Directory used for storing temporary files.

Default location:

| macOS                 | Linux (typical\*) | Windows                        |
| --------------------- | ----------------- | ------------------------------ |
| `/Library/Caches/dvc` | `/var/tmp/dvc`    | `C:\ProgramData\iterative\dvc` |

<admon type="info">

This location may be overridden with `dvc config core.site_cache_dir`.

</admon>

<admon type="warn">

Not to be confused with DVC <abbr>cache</abbr>.

</admon>

- `index`: Directory for remote index files that are used for optimizing
  `dvc push`, `dvc pull`, `dvc fetch` and `dvc status -c` operations.

- `hashes`: This directory is used for optimization. It contains a SQLite state
  database that stores hash values for files tracked in a DVC project. It also
  saves the corresponding timestamps and inodes to avoid unnecessary file hash
  computations.

- `links`: This directory is used to clean up your workspace when calling
  `dvc checkout`. It contains a SQLite state database that stores a list of file
  links created by DVC (from cache to <abbr>workspace</abbr>).
