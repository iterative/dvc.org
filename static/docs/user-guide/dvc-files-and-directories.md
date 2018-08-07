# DVC Files and Directories

Once installed, DVC populates its installation folder per repository
(hereafter referred to as `.dvc`):

* `.dvc/config` - This is a configuration file.
  The config file can be edited by hand or with a special command: `dvc config`.

* `.dvc/config.local` - This is a local configuration file, that will overwrite
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

* `.dvc/state` - this file is used for optimization. The file contains data
  files checksums with respective timestamps and inodes to avoid unnecessary
  checksum computations.

* `.dvc/state.lock` - a lock file for `.dvc/state`.

* `.dvc/link.state` - this file is used for optimization. The file contains
   a list of links(from cache to workspace) created by dvc and is used to
   cleanup your workspace when calling `dvc checkout`.
   
* `.dvc/link.state.lock` - a lock file for `.dvc/link.state`.

* `.dvc/updater` - this file is used to remember the last time dvc has checked
   for available updates.
