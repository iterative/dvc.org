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

- `.dvc/cache` - the cache directory will contain your data files. (The data
  directories of DVC repositories will only contain links to the data files in
  the cache, refer to
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

### Structure of directory

The data file is converted to a MD5 checksum which is a 32 characters long
string. The first two characters are assigned to name the directory inside
`.dvc/cache` and rest are given to name the cache file. For example, if a data
file, say `Posts.xml.zip`, is converted to a MD5 checksum, it will evaluate to
`ec1d2935f811b77cc49b031b999cbf17`. The cache file for this data file will be
stored as `.dvc/ec/1d2935f811b77cc49b031b999cbf17` on the local storage and if
it is pushed to a remote storage, its location will be
`<prefix>/ec/1d2935f811b77cc49b031b999cbf17` where prefix is the name of the
remote storage. `/tmp/dvc-storage` can be one example of a prefix.
