# Versioned storage

What if we could **combine data and ML model versioning features with large file
storage** solutions like traditional hard drives, NAS, or cloud services such as
Amazon S3 and Google Drive? DVC brings together the best of both worlds by
implementing easy synchronization between the data <abbr>cache</abbr> and
on-premises or cloud storage for sharing.

![](/img/model-versioning-diagram.png) _DVC's hybrid versioned storage_

> Note that [remote storage](/doc/command-reference/remote) is optional in DVC:
> no server setup or special services are needed, just the `dvc` command-line
> tool.
