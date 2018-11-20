# DVC Files and Directories

Once installed, DVC populates its installation folder per repository
(hereafter referred to as `.dvc`):

* `.dvc/config` - this is a configuration file.
  The config file can be edited by hand or with a special command: `dvc config`.

* `.dvc/config.local` - this is a local configuration file, that will overwrite
  options in `.dvc/config`. This is useful when you need to specify private
  options in your config, that you don't want to track and share through git.
  The local config file can be edited by hand or with a special command:
  `dvc config --local`.

* `.dvc/cache` - the cache directory will contain your data files (the data
  directories of DVC repositories will only contain links to the data files
  in the cache).

  **Note:** DVC includes the cache directory to `.gitignore` file during the
  initialization. And no data files (with actual content) will ever be pushed to
  Git repository, only dvc-files that are needed to reproduce them.

* `.dvc/state` - this file is used for optimization. It is a SQLite db, that
  contains checksums for files in a project with respective timestamps
  and inodes to avoid unnecessary checksum computations. It also contains a
  list of links(from cache to workspace) created by dvc and is used to cleanup
  your workspace when calling `dvc checkout`.
  
* `.dvc/state-journal` - temporary file for SQLite operations

* `.dvc/state-wal` - another SQLite temporary file
   
* `.dvc/updater` - this file is used store latest available version of dvc, which
  is used to remind user to upgrade.
   
* `.dvc/updater.lock` - a lock file for `.dvc/updater`.

* `.dvc/lock` - a lock file for the whole dvc project.
