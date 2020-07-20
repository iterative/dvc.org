# Basic Concepts of DVC

DVC streamlines large data files and binary models into a single Git
environment. This approach will not require storing binary files in your Git
repository.

![](/img/flow-large.png) _DVC data management_

- **Local Cache**: Directory with all data files on a local hard drive or in
  cloud storage, but not in the Git repository. See `dvc cache dir`.
