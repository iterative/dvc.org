# DVC Files and Directories

Once initialized in a project, DVC populates its installation directory
(`.dvc/`) with special DVC internal files and directories:

- `.dvc/config` - this is a configuration file. The config file can be edited by
  hand or with a special command: `dvc config`.

- `.dvc/config.local` - this is a local configuration file, that will overwrite
  options in `.dvc/config`. This is useful when you need to specify private
  options in your config, that you don't want to track and share through git.
  The local config file can be edited by hand or with a special command:
  `dvc config --local`.

- `.dvc/cache` - the [cache directory](#structure-of-cache-directory) will
  contain your data files. (The data directories of DVC repositories will only
  contain links to the data files in the cache, refer to
  [Large Dataset Optimization](/docs/user-guide/large-dataset-optimization).)

  > Note that DVC includes the cache directory in `.gitignore` during the
  > initialization. No data files (with actual content) will ever be pushed to
  > the Git repository, only DVC-files that are needed to reproduce them.

- `.dvc/state` - this file is used for optimization. It is a SQLite db, that
  contains checksums for files in a project with respective timestamps and
  inodes to avoid unnecessary checksum computations. It also contains a list of
  links (from cache to workspace) created by dvc and is used to cleanup your
  workspace when calling `dvc checkout`.

- `.dvc/state-journal` - temporary file for SQLite operations

- `.dvc/state-wal` - another SQLite temporary file

- `.dvc/updater` - this file is used store latest available version of dvc,
  which is used to remind user to upgrade.

- `.dvc/updater.lock` - a lock file for `.dvc/updater`.

- `.dvc/lock` - a lock file for the whole dvc project.

## Structure of cache directory

There are two ways in which the data is stored in cache. It depends on if the
actual data is stored in a file (eg. `data.csv`) or it is a directory of files.

We evaluate a checksum, usually MD5, for the data file which is a 32 characters
long string. The first two characters are assigned to name the directory inside
`.dvc/cache` and rest are given to name the cache file. For example, if a data
file, say `Posts.xml.zip`, is converted to a MD5 checksum, it will evaluate to
`ec1d2935f811b77cc49b031b999cbf17`. The cache file for this data file will be
stored as `.dvc/ec/1d2935f811b77cc49b031b999cbf17` on the local storage and if
it is pushed to a remote storage, its location will be
`<prefix>/ec/1d2935f811b77cc49b031b999cbf17` where prefix is the name of the
remote storage. `/tmp/dvc-storage` can be one example of a prefix.

For the second case, let us consider a directory of 2 images.

```dvc
$ tree
.
├── cat.jpeg
└── index.jpeg
```

On running `dvc add` on this directory of images, a `.dvc` file is created, by
default, with information about the checksum of directory which is cached as a
file in `.dvc/cache`.

```yaml
- md5: 196a322c107c2572335158503c64bfba.dir
  path: data/images
  ...
```

The directory in cache is stored like this:

```dvc
$ tree
.dvc/cache/
├── 19
│   └── 6a322c107c2572335158503c64bfba.dir
├── 29
│   └── a6c8271c0c8fbf75d3b97aecee589f
└── df
    └── f70c0392d7d386c39a23c64fcc0376
```

Like the previous case, the first two digits of the checksum are used to name
the directory and rest 30 characters are used in naming the cache file. The
cache file with `.dir` extension stores the mapping of files in the data
directory and their checksum as an array. The other two cache file names are
checksums of the files stored inside data directory. A typical `.dir` cache file
looks like this:

```dvc
$ cat .dvc/cache/19/6a322c107c2572335158503c64bfba.dir
[
  {"md5": "dff70c0392d7d386c39a23c64fcc0376", "relpath": "cat.jpeg"},
  {"md5": "29a6c8271c0c8fbf75d3b97aecee589f", "relpath": "index.jpeg"}
]
```
