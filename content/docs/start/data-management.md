---
title: Data Management Trail
---

As its name implies, DVC is used to control versions of data. It enables to keep
track of multiple versions of your datasets.

## Initialize a DVC project

Suppose we are working on a deep learning project to develop the next ground
breaking supervised learning model. We plan to test the classifier in MNIST
dataset, but we also plan to use a similar one, Fashion MNIST. We want to keep
track of these two datasets and replace with each other easily, without changes
in the code.

We need a way to track these two datasets as if they are versions of the same
text file. DVC is used for this kind of binary file tracking for large amounts
of data.

## Adding data to DVC projects

- Initialize a DVC repository and use `dvc add` to add files.

- We'll assume MNIST data exist in a folder and will add it.

## Versioning data in DVC projects

- Overwrite Fashion-MNIST data on top of MNIST and update the dataset.

- Go back and forth in Git history to get different datasets in the same folder.

## Creating remotes

- Add a Google Drive folder as a remote.

- Make it default

## Pushing to/pulling from remotes

- Push the cache to the remote we created
- Clone the repository to somewhere (e.g. ssh or local folder)
- Pull the cache

## Accessing public datasets and registries

- Get the Fashion MNIST data from dataset-registry

## Removing data from DVC projects

- Remove certain folders from workspace
- Delete the corresponding cache files
