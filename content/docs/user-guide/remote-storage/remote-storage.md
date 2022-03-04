# Remote Storage

## Introduction

_why have remote storage and what is it? what is the benefit to you, the ML
practioner? (storing versions of large files not locally; sharing ML pipelines,
data and experiments) why would it be expensive to store versions locally?_

Remote storage is used by DVC as a repository for versions of files that are
being tracked. There are two main use cases:
- You don't want to store old versions of ML data files on your local workstation. DVC
  tracks large files in the same way that git tracks small files.
  If you are making many changes to these files,
  there may be many versions of these large files. 
  Better to get these files off
  your local filesystem!
- You want a backup of your project. Remote storage on the cloud can be a useful
  backup, and you can store as many old versions as you need).
- You want to share your project with others on your team efficiently,
  minimising data transfer and cloud storage charges.

A huge benefit of DVC remote storage is space optimisation.
DVC ensures that duplicate files stored on remotes (e.g. images used across multiple
datasets and dataset versions) are stored once and once only,
even if they occur in multiple folders or datasets. 
Thus, DVC's remote functionality can be useful even if you are not using it for versioning.

## Connecting to Remote Storage

_remote add command; need to set up a remote folder yourself with your cloud
provider; what the first push command does; remote modify; `dvc remote` ;📖 ⚠️
💡_

Multiple cloud storage providers can be used as a remote storage for DVC,
or you can use a folder on your local workstation (useful if, for example, the
local folder was really on a network share).
The `dvc remote add` docs cover how to use a cloud provider or a local folder as
remote storage. Additionally, we've also provided an example covering using 
using [Google Drive as a DVC remote](/doc/user-guide/setup-google-drive-remote).

## Content Addressable Storage Format

_explain the content addressible storage: hashes, indirection, multiple
versions; why obfuscation_

## Managing Local Cache and Remote Storage

_how local cache and remote storage stay in sync, effect of garbage collection
and remote pull_
