# External Data and DVC Remotes

External data are located outside the project directory, either on the local
filesystem or on a remote host. They are usually accessed with the help of DVC
remote directories, which are managed with the command `dvc remote` (for analogy
with the command `git remote`).

DVC remote directories can be useful in these cases:

- To track data that is located on an external directory.
- To read the dependencies of a stage from an external directory.
- To write the outputs of a stage to an external directory.
- To setup an external DVC cache, which is a cache directory that is located
  outside the project directory.
- To setup a DVC storage, which is like a backup/mirror of the DVC cache and can
  be used for data sharing and collaboration.

DVC remotes can also be used for defining other DVC remotes recursively.

Currently DVC supports these types of remote directories:

- [Local Filesystem](/doc/user-guide/external-data/local)
- [SSH](/doc/user-guide/external-data/ssh)
- [Amazon S3](/doc/user-guide/external-data/amazon)
- [S3 Compatible](/doc/user-guide/external-data/s3)
- [Azure](/doc/user-guide/external-data/azure)
- [Google Cloud Storage](/doc/user-guide/external-data/gs)
- [HDFS](/doc/user-guide/external-data/hdfs)
- [Aliyun OSS](/doc/user-guide/external-data/oss)
- [HTTP](/doc/user-guide/external-data/http)

Not all of them support all the cases mentioned above. Read the corresponding
pages for more details and examples about each type.

> If you installed DVC via `pip`, depending on the remote storage type you plan
> to use you might need to install optional dependencies: `[s3]`, `[ssh]`,
> `[gs]`, `[azure]`, and `[oss]`; or `[all]` to include them all. The command
> should look like this: `pip install "dvc[s3]"`. This installs `boto3` library
> along with DVC to support Amazon S3 storage.
