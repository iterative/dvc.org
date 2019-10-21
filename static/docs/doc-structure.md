# The Structure of the Docs

The focus is on discussing the structure of the User Guide, because the
structure for the rest of the top items is more or less clear.

- Get Started

  [. . . . .]

- Installation

  [. . . . .]

  https://github.com/iterative/dvc.org/issues/65

- Tutorials

  [. . . . .]

- User Guide

  - Introduction

    - Why DVC

      - Problems in DS/ML

        https://dvc.org/doc/understanding-dvc/collaboration-issues

      - Existing Tools

        https://dvc.org/doc/understanding-dvc/existing-tools

        https://dvc.org/doc/understanding-dvc/related-technologies

    - What is DVC

      https://dvc.org/doc/understanding-dvc/what-is-dvc

      - DVC Concepts

        https://dvc.org/doc/understanding-dvc/what-is-dvc

        https://github.com/iterative/dvc.org/issues/53#issuecomment-485588486

      - DVC Features

        https://dvc.org/doc/understanding-dvc/core-features

        https://dvc.org/doc/understanding-dvc/how-it-works

    - Other Resources

      https://dvc.org/doc/understanding-dvc/resources

      Maybe some of the resources can be referenced from the other sections in
      the Introduction, and this section be removed.

  - Basic Concepts

    Explains in more details the basic concepts of DVC.

    - Data Management

      The core function of DVC is data tracking and management.

      https://katacoda.com/dvc/courses/basics/data

    - Tracking Data Versions

      DVC takes advantage of Git's versioning features to keep track of the data
      versions.

      https://katacoda.com/dvc/courses/basics/versioning

      https://dvc.org/doc/use-cases/data-and-model-files-versioning

    - Sharing Data

      DVC facilitates sharing of data between different people that work on the
      same project.

      https://katacoda.com/dvc/courses/basics/sharing

      https://dvc.org/doc/use-cases/share-data-and-model-files

    - Stages and Pipelines

      DVC has a built-in way to connect ML steps into a DAG and run the full
      pipeline end-to-end.

      https://katacoda.com/dvc/courses/basics/pipelines

    - Importing Data

      Download and track data from another DVC project that is hosted in a Git
      repository.

      https://katacoda.com/dvc/courses/basics/importing

    - Dvcignore

      https://dvc.org/doc/user-guide/dvcignore

  - DVC Internals

    - DVC Files and Directories

      https://dvc.org/doc/user-guide/dvc-files-and-directories

      https://github.com/iterative/dvc.org/issues/175

    - Structure of Cache Directory

      https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory

    - DVC-file Format

      https://dvc.org/doc/user-guide/dvc-file-format

      https://github.com/iterative/dvc.org/issues/68

    - How DVC Understands Data Changes

      https://github.com/iterative/dvc.org/issues/576

    - Updating DVC-files

    - Anonymized Usage Analytics

      https://dvc.org/doc/user-guide/analytics

  - Large Dataset Optimization

    It is important to optimize the DVC setup for having the best performance
    with handling big data files.

    https://katacoda.com/dvc/courses/basics/performance

    https://dvc.org/doc/user-guide/large-dataset-optimization

    https://dvc.org/doc/user-guide/update-tracked-files

    - Using Deduplicating Filesystems

    - Using Symlinks

  - Managing External Data

    https://dvc.org/doc/user-guide/external-dependencies

    https://dvc.org/doc/user-guide/managing-external-data

    https://github.com/iterative/dvc.org/issues/520

    https://github.com/iterative/dvc.org/issues/499

    https://github.com/iterative/dvc.org/issues/143

    https://github.com/iterative/dvc.org/issues/566

    - Local Files and Directories

    - SSH

    - Amazon S3

    - Google Cloud Storage

    - HDFS

    - HTTP

  - Managing External Cache

    - Local Directory

    - SSH Directory

    - Amazon S3 Directory

    - Google Cloud Storage

    - HDFS

  - Advanced Data Sharing

    - Shared Development Server

      https://dvc.org/doc/use-cases/shared-development-server

    - Mounted Cache Dir

      https://github.com/iterative/dvc.org/issues/103

    - Mounted Remote Storage

    - Synchronized Remote Storage

      https://github.com/iterative/dvc.org/issues/648#issuecomment-535885723

  - Managing Experiments

    https://github.com/iterative/dvc.org/issues/159#issuecomment-525575597

    - By Tags

    - By Branches

    - By Folders

    - Hybrid

  - Tips & Tricks / HowTo-s

    https://dvc.org/doc/user-guide/running-dvc-on-windows

    https://github.com/iterative/dvc.org/issues/72

    https://github.com/iterative/dvc.org/issues/625

    - Manually Editing DVC-files

    - How to Use DVC with DB

    - Use a Bash Script to Create Pipelines

    - Move a Pipeline to Different Datasets

    - Update Your Pipeline by Editing DVC-files

      https://github.com/iterative/dvc.org/issues/230

    - How to Add Output Without Reruning Stage

      https://github.com/iterative/dvc.org/issues/460

    - Managing Metrics

      https://github.com/iterative/dvc.org/issues/59

    - How to Avoid/Resolve Conflicts in DVC-Files on Merge

      https://github.com/iterative/dvc.org/issues/192

    - How to Store Data on Your Own Server

      https://github.com/iterative/dvc.org/issues/54

    - Using External Data and Cache

      https://github.com/iterative/dvc.org/issues/563

      https://github.com/iterative/dvc.org/pull/565

    - Build a Dataset Registry

      https://github.com/iterative/dvc.org/issues/674

      https://github.com/iterative/dvc.org/pull/679

    - Advanced Remote Scenarios

      Using one remote for development and one for production, and switching
      between them.

      https://github.com/iterative/dvc.org/issues/237

      https://github.com/iterative/dvc.org/issues/108

    - How to Use Jupyter Notebook

      https://github.com/iterative/dvc.org/issues/96

    - Etc.

  - Contributing

    - Contributing Code

      https://dvc.org/doc/user-guide/contributing

    - Contributing Docs

      https://dvc.org/doc/user-guide/contributing-docs

- Command Reference

  [. . . . .]

- DVC API

  [. . . . .]

- FAQ

  https://dvc.org/doc/user-guide/running-dvc-on-windows

  Some questions from the chat, whose answer is not obvious from the rest of the
  docs. Maybe they can be categorized.

- Changelog

  [. . . . .]
