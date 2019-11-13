# Interactive Tutorials

Interactive lessons and tutorials on [Katacoda](https://katacoda.com/dvc) that
explain the basic concepts of DVC and show how to use it in simple ML scenarios.

## Basic Concepts

Learn basic concepts and features of DVC with interactive lessons:

1. [Data Management](https://katacoda.com/dvc/courses/basics/data) <br/> The
   core function of DVC is data tracking and management. Let's see how to do it.

2. [Getting the Best Performance](https://katacoda.com/dvc/courses/basics/performance)
   <br/> It is important to optimize the DVC setup for having the best
   performance with handling big data files.

3. [Tracking Data Versions](https://katacoda.com/dvc/courses/basics/versioning)
   <br/> DVC takes advantage of GIT's versioning features to keep track of the
   data versions.

4. [Sharing Data](https://katacoda.com/dvc/courses/basics/sharing) <br/> DVC
   facilitates sharing of data between different people that work on the same
   project.

5. [Stages And Pipelines](https://katacoda.com/dvc/courses/basics/pipelines)
   <br/> DVC has a built-in way to connect ML steps into a DAG and run the full
   pipeline end-to-end.

6. [Importing Data](https://katacoda.com/dvc/courses/basics/importing) <br/>
   Download and track data from the
   [remote storage](/doc/command-reference/remote) of any DVC project that is
   hosted on a Git repository.

## Simple ML Scenarios

Learn how DVC can be used in simple ML scenarios:

- [Data Versioning](https://katacoda.com/dvc/courses/tutorials/versioning) <br/>
  Using DVC commands to work with multiple versions of datasets and ML models.

- [Stages and Pipelines](https://katacoda.com/dvc/courses/tutorials/pipelines)
  <br/> Using DVC commands to build a simple ML pipeline.

- [Scripting DVC](https://katacoda.com/dvc/courses/tutorials/scripting) <br/>
  Using bash scripting to build stages and pipelines.

- [MNIST](https://katacoda.com/dvc/courses/tutorials/mnist) <br/> Creating a
  model to classify images of hand-written digits using MNIST as the data-set.

## Examples

Interactive examples about using DVC commands and other features of DVC.

- [dvcignore](https://katacoda.com/dvc/courses/examples/dvcignore) <br/>
  Sometimes you might want DVC to ignore some files while working with the
  project. To address this, DVC supports optional `.dvcignore` files, which have
  the same syntax and work similarly to `.gitignore` in Git.

- [dvc fetch](https://katacoda.com/dvc/courses/examples/fetch) <br/> We will use
  an example project with some data, code, ML models, pipeline stages, as well
  as a few Git tags. Then we will see what happens with dvc fetch as we switch
  from tag to tag.

- [SSH Remote DVC Storage](https://katacoda.com/dvc/courses/examples/ssh-storage)
  <br/> In this example we assume a central DVC storage server that can be
  accessed through SSH. For the sake of example the central Git repository is
  located in the same server too, but in general it can be anywhere.

- [Shared Server](https://katacoda.com/dvc/courses/examples/shared-server) <br/>
  Some teams may prefer using one single shared machine to run their
  experiments. In this example we will see how two different users on the same
  host can share data with the help of a local data storage.

- [Mounted DVC Storage](https://katacoda.com/dvc/courses/examples/mounted-storage)
  <br/> In this example we will see how to share data with the help of a storage
  directory that is network-mounted through SSHFS. Once you understand how it
  works, it should be easy to implement it for other types of mounted storages
  (like NFS, Samba, etc.).

- [Synchronized DVC Storage](https://katacoda.com/dvc/courses/examples/synced-storage)
  <br/> In this example we will see how to share DVC data with the help of a SSH
  server and `rsync`. Actually there are better ways to use a SSH server for
  data sharing, but we are using it just as an example. Once you understand how
  it works, it should be easy to implement it with other storage types and
  synchronization tools.
