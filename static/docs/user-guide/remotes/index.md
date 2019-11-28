# DVC Remotes

DVC remotes help to access data, cache and DVC storages that are located outside
the project directory (usually on a remote location on the internet). They are
managed with the command `dvc remote` (for analogy with the command
`git remote`).

> If you installed DVC via `pip`, depending on the remote type you plan to use,
> you might need to install optional dependencies: `[s3]`, `[ssh]`, `[gs]`,
> `[azure]`, and `[oss]`; or `[all]` to include them all.

<details>

### Example: Create and Manage an Amazon S3 remote

- Create a DVC remote with `dvc remote add`:

  ```dvc
  $ dvc remote add s3remote s3://mybucket/path

  $ dvc remote list
  s3remote	s3://mybucket/path

  $ cat .dvc/config
  ['remote "s3remote"']
  url = s3://mybucket/path
  ```

- Modify it with `dvc remote modify`:

  ```dvc
  $ dvc remote modify s3remote region us-east-2

  $ cat .dvc/config
  ['remote "s3remote"']
  url = s3://mybucket/path
  region = us-east-2
  ```

- Remove it with `dvc remote remove`:

  ```dvc
  $ dvc remote remove s3remote
  $ dvc remote list
  ```

- Create a **DVC storage** using the option `-d, --default`:

  ```dvc
  $ dvc remote add -d s3storage s3://mybucket/dvc-storage
  Setting 's3storage' as a default remote.

  $ cat .dvc/config
  ['remote "s3storage"']
  url = s3://mybucket/dvc-storage
  [core]
  remote = s3storage
  ```

- Set credentials to the **local** configuration:

  ```dvc
  $ dvc remote modify --local \
        s3storage credentialpath /path/to/my/creds

  $ cat .dvc/config
  ['remote "s3storage"']
  url = s3://mybucket/dvc-storage
  [core]
  remote = s3storage

  $ cat .dvc/config.local
  ['remote "s3storage"']
  credentialpath = /path/to/my/creds
  ```

</details>

<details>

### Example: Use a remote to define another remote

- Creates remotes `dev`, `prod` and `myremote`:

  ```dvc
  $ dvc remote add dev s3://mybucket/dev
  $ dvc remote add prod s3://mybucket/prod
  $ dvc remote add myremote remote://dev

  $ dvc remote list
  myremote	remote://dev
  prod	s3://mybucket/prod
  dev	s3://mybucket/dev

  $ cat .dvc/config
  ['remote "dev"']
  url = s3://mybucket/dev
  ['remote "prod"']
  url = s3://mybucket/prod
  ['remote "myremote"']
  url = remote://dev
  ```

- Add data using `myremote`:

  ```dvc
  $ dvc add remote://myremote/data
  $ ls *.dvc
  data.dvc
  ```

- Switch `myremote` to `prod`:

  ```dvc
  $ dvc remote modify myremote url remote://prod

  $ dvc remote list
  myremote	remote://prod
  prod	s3://mybucket/prod
  dev	s3://mybucket/dev

  $ cat .dvc/config
  ['remote "dev"']
  url = s3://mybucket/dev
  ['remote "prod"']
  url = s3://mybucket/prod
  ['remote "myremote"']
  url = remote://prod
  ```

- Update data:

  ```dvc
  $ dvc status data.dvc
  $ dvc checkout data.dvc
  ```

</details>

Currently DVC supports these types of remote directories:

- [Local](/doc/user-guide/remotes/local)
- [SSH](/doc/user-guide/remotes/ssh)
- [Amazon S3](/doc/user-guide/remotes/amazon)
- [S3 Compatible](/doc/user-guide/remotes/s3)
- [Azure](/doc/user-guide/remotes/azure)
- [Google Cloud Storage](/doc/user-guide/remotes/gs)
- [HDFS](/doc/user-guide/remotes/hdfs)
- [Aliyun OSS](/doc/user-guide/remotes/oss)
- [HTTP](/doc/user-guide/remotes/http)
