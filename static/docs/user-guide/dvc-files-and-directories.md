# DVC Files and Directories

Once installed, DVC populates its installation folder per repository
(hereafter referred to as `.dvc`):

* `.dvc/config` - This is a configuration file.
  The config file can be edited by hand or with a special command: `dvc config`.

* `.dvc/cache` - the cache directory will contain your data files (the data
  directories of DVC repositories will only contain links to the data files
  in the cache).

  **Note:** DVC includes the cache directory to `.gitignore` file during the
  initialization. And no data files (with actual content) will ever be pushed to
  Git repository, only dvc-files that are needed to reproduce them.

* `.dvc/state` - this file is used for optimization. The file contains data
  files checksums with respective timestamps and inodes to avoid unnecessary
  checksum computations.
