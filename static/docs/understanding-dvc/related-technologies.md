# Comparison to Existing Technologies

Due to the the novelty of this approach, DVC can be better understood in
comparison to existing technologies and ideas.

DVC combines a number of existing technologies and ideas into a single product
with the goal of bringing the best engineering practices into the data science
process.

1. **Git**. The difference is:

   - DVC extends Git by introducing the concept of _data files_ - large files
     that should NOT be stored in a Git repository but still need to be tracked
     and versioned.

2. **Workflow management tools** (pipelines and DAGs): Airflow, Luigi, etc. The
   differences are:

   - DVC is focused on data science and modeling. As a result, DVC pipelines are
     lightweight, easy to create and modify. However, DVC lacks pipeline
     execution features like execution monitoring, execution error handling, and
     recovering.

   - DVC is purely a command line tool that does not have a graphical user
     interface and does not run any servers. Nevertheless, DVC can generate
     images with pipeline and experiment workflow visualization.

3. **Experiment management** software today is mostly designed for enterprise
   usage. An open-sourced experimentation tool example: http://studio.ml/. The
   differences are:

   - DVC uses Git as the underlying platform for experiment tracking instead of
     a web application.

   - DVC does not need to run any services. No graphical user interface as a
     result, but we expect some GUI services will be created on top of DVC.

   - DVC has transparent design: metadata files (DVC file), configuration files,
     cache directories have a simple format and can be easily reused by external
     tools.

4. **Git workflows** and Git usage methodologies such as Gitflow. The
   differences are:

   - DVC supports a new experimentation methodology that integrates easily with
     a Git workflow. A separate branch should be created for each experiment,
     with a subsequent merge of this branch if it was successful.

   - DVC innovates by giving experimenters the ability to easily navigate
     through past experiments without recomputing them.

5) **Makefile** (and it's analogues). The differences are:

   - DVC utilizes a DAG:

     - The DAG is defined by DVC files with filenames `Dvcfile` or
       `<filename>.dvc`.

     - One DVC file defines one node in the DAG. All DVC files in a repository
       make up a single pipeline (think a single Makefile). All DVC files (and
       corresponding pipeline commands) are implicitly combined through their
       inputs and outputs, to simplify conflict resolving during merges.

     - DVC provides a simple command `dvc run CMD` to generate a DVC file
       automatically based on the provided command, dependencies, and outputs.

   - File tracking:

     - DVC tracks files based on checksum (md5) instead of file timestamps. This
       helps avoid running into heavy processes like model re-training when you
       checkout a previous, trained version of a modeling code (Makefile will
       retrain the model).

     - DVC uses file timestamps and inodes for optimization. This allows DVC to
       avoid recomputing all dependency files checksum, which would be highly
       problematic when working with large files (10 GB+).

6. **Git-annex**. The differences are:

   - DVC uses the idea of storing the content of large files (that you don't
     want to see in your Git repository) in a local key-value store and use file
     symlinks instead of the actual files.

   - DVC can use reflinks\* or hardlinks (depending on the system) instead of
     symlinks to improve performance and make the user experience better.

   - DVC optimizes checksum calculation.

   - Git-annex is a datafile-centric system whereas DVC is focused on providing
     a workflow for machine learning and reproducible experiments. When a DVC or
     Git-annex repository is cloned via git clone, data files won't be copied to
     the local machine as file content is stored in separate data remotes.
     However, DVC metafiles (which provide the reproducible workflow) are always
     included in the cloned Git repository and hence can be recreated locally
     with minimal effort.

   - DVC is not fundamentally bound to Git, having the option of changing the
     repository format.

7) **Git-LFS** (Large File Storage). The differences are:

   - It does not require special Git servers like Git-LFS demands. Any cloud
     storage like S3, GCS, or on-premises SSH server can be used as a backend
     for datasets and models, no additional databases, servers or infrastructure
     are required.

   - DVC is not fundamentally bound to Git, having the option of changing the
     repository format.

   - DVC does not add any hooks to Git by default. To checkout data files, the
     `dvc checkout` command has to be run after each `git checkout` and
     `git clone` command. It gives more granularity on managing data and code
     separately. Hooks could be configured to make workflow simpler.

   - DVC attempts to use reflinks\* and has other
     [file linking options](/docs/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache).
     The `dvc checkout` command does not actually copy data files from cache to
     the workspace, as copying files is a heavy operation for large files (30
     GB+).

   - `git-lfs` was not made with data science scenarios in mind, thus it does
     not support certain features, e.g. pipelines and metrics, and thus Github
     has a limit of 2 GB per repository.

---

> \***copy-on-write links or "reflinks"** are a relatively new way to link files
> in UNIX-style file systems. Unlike hardlinks or symlinks, they support
> transparent [copy on write](https://en.wikipedia.org/wiki/Copy-on-write). This
> means that editing a reflinked file is always safe as all the other links to
> the file will reflect the changes.
