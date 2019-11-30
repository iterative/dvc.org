# External Data

External data are located outside the project directory, either on the local
filesystem, or on a remote host, or on a cloud data storage. They may be used in
order to:

- Track data that is located on an external directory.
- Read the dependencies of a stage from an external directory.
- Write the outputs of a stage to an external directory.
- Setup an external DVC cache directory.

Not all types of external locations support all the cases mentioned above. Read
the corresponding pages for more details and examples about each type:

- [Local Filesystem](/doc/user-guide/external-data/local)
- [SSH](/doc/user-guide/external-data/ssh)
- [Amazon S3](/doc/user-guide/external-data/amazon)
- [S3 Compatible](/doc/user-guide/external-data/s3)
- [Azure](/doc/user-guide/external-data/azure)
- [Google Cloud Storage](/doc/user-guide/external-data/gs)
- [HDFS](/doc/user-guide/external-data/hdfs)
- [Aliyun OSS](/doc/user-guide/external-data/oss)
- [HTTP](/doc/user-guide/external-data/http)
