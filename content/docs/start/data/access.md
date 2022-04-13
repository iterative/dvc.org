# Accessing files in other projects

We've learned how to _track_ data and models with DVC, and how to commit their
versions to Git. The next questions are: How can we _use_ these artifacts
outside of the project? How do we download a model to deploy it? How to download
a specific version of a model? Or reuse datasets across different projects?

> These questions tend to come up when you browse the files that DVC saves to
> remote storage (e.g.
> `s3://dvc-public/remote/get-started/fb/89904ef053f04d64eafcc3d70db673` 😱
> instead of the original file name such as `model.pkl` or `data.xml`).

Read on or watch our video to see how to find and access models and datasets
with DVC.

https://youtu.be/EE7Gk84OZY8

Remember those `.dvc` files `dvc add` generates? Those files (and `dvc.lock`,
which we'll cover later) have their history in Git. DVC's remote storage config
is also saved in Git, and contains all the information needed to access and
download any version of datasets, files, and models. It means that a Git
repository with <abbr>DVC files</abbr> becomes an entry point, and can be used
instead of accessing files directly.
