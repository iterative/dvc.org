# Comparison to Existing Technologies

Due to the the novelty of this approach, DVC can be better understood in
comparison to existing technologies and ideas.

DVC combines a number of existing technologies and ideas into a single product
with the goal of bringing the best engineering practices into the data science
process.

1. **Git**. The difference is:

    - DVC extends Git by introducing the concept of *data files* - large files
    that should NOT be stored in a Git repository but still need to be tracked
    and versioned.

2. **Workflow management tools** (pipelines and DAGs): Apache Airflow, Luigi and
etc. The differences are:

   - DVC is focused on data science and modeling. As a result, DVC pipelines are
   lightweight, easy to create and modify. However, DVC lacks pipeline execution
   features like execution monitoring, execution error handling, and recovering.

   - DVC is purely a command line tool that does not have a user interface and
   does not run any servers. Nevertheless, DVC can generate images with pipeline
   and experiment workflow visualization.

3. **Experiment management** software today is mostly designed for enterprise
usage. An open-sourced experimentation tool example: http://studio.ml/. The
differences are:

   - DVC uses Git as the underlying platform for experiment tracking instead of
   a web application.

   - DVC does not need to run any services. No user interface as a result, but
   we expect some UI services will be created on top of DVC.

   - DVC has transparent design: DVC-files, meta files, state file, cache dirs
   have a simple format and can be easily reused by external tools.

4. **Git workflows** and Git usage methodologies such as Gitflow. The
differences are:

   - DVC supports a new experimentation methodology that integrates easily with
   a Git workflow. A separate branch should be created for each experiment, with
   a subsequent merge of this branch if it was successful.

   - DVC innovates by allowing experimenters the ability to easily navigate
   through past experiments without recomputing them.


5. **Makefile** (and it's analogues). The differences are:

   - DVC utilizes a DAG:

     - The DAG is defined by dvc-files with filenames `Dvcfile` or
     `<filename>.dvc`.

     - One dvc-file defines one node in the DAG. All dvc-files in a repository
     make up a single pipeline (think a single Makefile). All dvc-files (and
     corresponding pipeline commands) are implicitly combined through their
     inputs and outputs, to simplify conflict resolving during merges.

     - DVC provides a simple command `dvc run CMD` to generate a dvc-file
     automatically based on the provided command, dependencies, and outputs.

   - File tracking:

     - DVC tracks files based on checksum (md5) instead of file timestamps. This
     helps avoid running into heavy processes like model re-training when you
     checkout a previous, trained version of a modeling code (Makefile will
     retrain the model).

     - DVC uses the files timestamps and inodes for optimization. This allows
     DVC to avoid recomputing all dependency files checksum, which would be
     highly problematic when working with large files (10Gb+).


6. **Git-annex**. The differences are:

   - DVC uses the idea of storing the content of large files (that you don't
   want to see in your Git repository) in a local key-value store and use file
   symlinks instead of the actual files.

   - DVC uses hardlinks instead of symlinks to make user experience better.

   - DVC optimizes checksum calculation.

   - Git-annex is data file centric-system where DVC is an ML workflow-centric.
   When a project is cloned by `git clone` data files won't be cloned (for both DVC
   and Git-annex) because files content is stored in a separate data remotes .
   However, DVC metafiles will be cloned correctly from any Git server and ML workflow
   can be easily reproduced with another data files.

   Git-annex is data file centric-system and it requires to use special data
   remote to transfer data in addition to Git remotes to transfer code. As a result,
   `git clone` is not enough to reuse a repository. In contrast, DVC was designed
   to support ML workflow where data file versioning is just a piece of it.
   In DVC, a project (ML workflow) can be easily cloned `git clone` and reused
   with a different data files without pulling the original data files. To reuse
   a repository (ML workflow) with original data files data remote is also required.
   

7. **Git-LFS** (Large File Storage). The differences are:

   - DVC is fully compatible with Git. It does not require special Git servers
   like Git-LFS demands.

   - DVC does not add any hooks to Git by default. To checkout data files, the
   *dvc checkout* command has to be run after each `git checkout` and `git
   clone` command.

   - DVC creates hardlinks (or even reflinks if they are supported) instead. The
    `dvc checkout` command does not actually copy data files from cache to the
    working tree, as copying files is a heavy operation for large files (30Gb+).
