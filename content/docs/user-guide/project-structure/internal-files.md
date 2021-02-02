# Internal Directories and Files

Once initialized in a <abbr>project</abbr>, DVC populates its installation
directory (`.dvc/`) with the internal directories and files needed for DVC
operation.

⚠️ Not to be confused with `.dvc` files.

- `.dvc/config`: This is a configuration file. The config file can be edited by
  hand or with the `dvc config` command.

- `.dvc/config.local`: This is a local configuration file, that will overwrite
  options in `.dvc/config`. This is useful when you need to specify private
  options in your config that you don't want to track and share through Git
  (credentials, private locations, etc). The local config file can be edited by
  hand or with the command `dvc config --local`.

- `.dvc/cache`: Default location of the <abbr>cache</abbr> directory. The cache
  stores the project data in a special
  [structure](#structure-of-the-cache-directory). The data files and directories
  in the <abbr>workspace</abbr> will only contain links to the data files in the
  cache (refer to
  [Large Dataset Optimization](/doc/user-guide/large-dataset-optimization). See
  `dvc config cache` for related configuration options, including changing the
  its location.

  > Note that DVC includes the cache directory in `.gitignore` during
  > initialization. No data tracked by DVC should ever be pushed to the Git
  > repository, only the <abbr>DVC files</abbr> that are needed to download or
  > reproduce that data.

- `.dvc/cache/runs`: Default location of the [run-cache](#run-cache).

- `.dvc/plots`: Directory for
  [plot templates](/doc/command-reference/plots#plot-templates)

- `.dvc/tmp`: Directory for miscellaneous temporary files

- `.dvc/tmp/index`: Directory for remote index files that are used for
  optimizing `dvc push`, `dvc pull`, `dvc fetch` and `dvc status -c` operations

- `.dvc/tmp/state`: This file is used for optimization. It is a SQLite database,
  that contains hash values for files tracked in a DVC project, with respective
  timestamps and inodes to avoid unnecessary file hash computations. It also
  contains a list of links (from cache to <abbr>workspace</abbr>) created by DVC
  and is used to cleanup your workspace when calling `dvc checkout`.

- `.dvc/tmp/state-journal`: Temporary file for SQLite operations

- `.dvc/tmp/state-wal`: Another SQLite temporary file

- `.dvc/tmp/updater`: This file is used store the latest available version of
  DVC. It's used to remind the user to upgrade when the installed version is
  behind.

- `.dvc/tmp/updater.lock`: Lock file for `.dvc/tmp/updater`

- `.dvc/tmp/lock`: Lock file for the entire DVC project

- `.dvc/tmp/rwlock`: JSON file that contains read and write locks for specific
  dependencies and outputs, to allow safely running multiple DVC commands in
  parallel

## Structure of the cache directory

The DVC cache is a
[content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
(by default in `.dvc/cache`), which adds a layer of indirection between code and
data.

There are two ways in which the data is <abbr>cached</abbr>, depending on
whether it's a single file, or a directory (which may contain multiple files).

Note files are renamed, reorganized, and directory trees are flattened in the
cache, which always has exactly one depth level with 2-character directories
(based on hashes of the data contents, as explained next).

### Files

DVC calculates the file hash, a 32 characters long string (usually MD5). The
first two characters are used to name the directory inside the cache, and the
rest become the file name of the cached file. For example, if a data file has a
hash value of `ec1d2935f811b77cc49b031b999cbf17`, its path in the cache will be
`.dvc/cache/ec/1d2935f811b77cc49b031b999cbf17`.

> Note that file hashes are calculated from file contents only. 2 or more files
> with different names but the same contents can exist in the workspace and be
> tracked by DVC, but only one copy is stored in the cache. This helps avoid
> data duplication.

### Directories

Let's imagine [adding](/doc/command-reference/add) a directory with 2 images:

```dvc
$ tree data/images/
data/images/
├── cat.jpeg
└── index.jpeg

$ dvc add data/images
```

The resulting cache dir looks like this:

```dvc
.dvc/cache/
├── 19
│   └── 6a322c107c2572335158503c64bfba.dir
├── d4
│   └── 1d8cd98f00b204e9800998ecf8427e
└── 20
    └── 0b40427ee0998e9802335d98f08cd98f
```

The files in the directory are cached normally. The directory itself gets a
similar entry, which with the `.dir` extension. It contains the mapping of files
inside (as a JSON array), identified by their hash values:

```dvc
$ cat .dvc/cache/19/6a322c107c2572335158503c64bfba.dir
[{"md5": "dff70c0392d7d386c39a23c64fcc0376", "relpath": "cat.jpeg"},
{"md5": "29a6c8271c0c8fbf75d3b97aecee589f", "relpath": "index.jpeg"}]
```

That's how DVC knows that the other two cached files belong in the directory.

### Run-cache

`dvc repro` and `dvc run` by default populate and reutilize a log of stages that
have been run in the project. It is found in the `runs/` directory inside the
cache (or [remote storage](/doc/command-reference/remote)).

Runs are identified as combinations of <abbr>dependencies</abbr>, commands, and
<abbr>outputs</abbr> that correspond to each other. These combinations are
hashed into special values that make up the file paths inside the run-cache dir.

```dvc
$ tree .dvc/cache/runs
.dvc/cache/runs
└── 86
    └── 8632e1555283d6e23ec808c9ee1fadc30630c888d5c08695333609ef341508bf
        └── e98a34c44fa6b564ef211e76fb3b265bc67f19e5de2e255217d3900d8f...
```

The files themselves are backups of the `dvc.lock` file that resulted from that
run.

> Note that the run's <abbr>outputs</abbr> are stored and retrieved from the
> regular cache.

💡 `dvc push` and `dvc pull` (and `dvc fetch`) can download and upload the
run-cache to remote storage for sharing and/or as a back up.
