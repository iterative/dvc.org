## Large datasets versioning

In cases where you process very large datasets, you need an efficient mechanism
(in terms of space and performance) to share a lot of data, including different
versions. Do you use network attached storage (NAS)? Or a large external volume?
You can learn more about advanced workflows using these links:

- A [shared cache](/doc/user-guide/how-to/share-a-dvc-cache) can be set up to
  store, version and access a lot of data on a large shared volume efficiently.
- A quite advanced scenario is to track and version data directly on the remote
  storage (e.g. S3). See
  [Managing External Data](https://dvc.org/doc/user-guide/managing-external-data)
  to learn more.
