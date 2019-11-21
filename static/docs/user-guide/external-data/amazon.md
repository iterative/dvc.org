# External Data on Amazon S3

Amazon S3 or Amazon Simple Storage Service is a service offered by Amazon Web
Services (AWS) that provides object storage through a web service interface.

## Amazon S3 Remotes

We can create an Amazon S3 remote like this:

```dvc
$ dvc remote add s3remote s3://mybucket/path

$ dvc remote list
s3remote	s3://mybucket/path

$ cat .dvc/config
['remote "s3remote"']
url = s3://mybucket/path
```

> **Note!** Before adding a new remote be sure to login into AWS services and
> follow instructions at
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
> to create your bucket.

<details>

### Details: AWS permissions

DVC uses the `boto3` library to communicate with AWS. The following API methods
are performed:

- `list_objects_v2`, `list_objects`
- `head_object`
- `download_file`
- `upload_file`
- `delete_object`
- `copy`

So, make sure you have the following permissions enabled:

- `s3:ListBucket`
- `s3:GetObject`
- `s3:PutObject`
- `s3:DeleteObject`

</details>

We can modify the remote settings with `dvc remote modify`, for example:

```dvc
$ dvc remote modify s3remote url s3://mybucket/new-path

$ dvc remote list
s3remote	s3://mybucket/new-path

$ cat .dvc/config
['remote "s3remote"']
url = s3://mybucket/new-path
```

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

<details>

### Details: Override default AWS credentials

DVC will be using default AWS credentials file to access S3. To override some of
these settings, you could use the following options:

- `region` - change S3 remote region:

  ```dvc
  $ dvc remote modify s3remote region us-east-2
  ```

- `profile` - credentials profile name to use to access S3:

  ```dvc
  $ dvc remote modify s3remote profile myprofile
  ```

- `credentialpath` - credentials path to use to access S3:

  ```dvc
  $ dvc remote modify s3remote credentialpath /path/to/my/creds
  ```

- `endpointurl` - endpoint URL to use to access S3:

  ```dvc
  $ dvc remote modify s3remote endpointurl https://myendpoint.com
  ```

- `url` - remote location URL

  ```dvc
  $ dvc remote modify s3remote url s3://mybucket/remote
  ```

- `use_ssl` - whether or not to use SSL. By default, SSL is used

  ```dvc
  $ dvc remote modify s3remote use_ssl false
  ```

- `listobjects` - whether or not to use `list_objects`. By default,
  `list_objects_v2` is used. Useful for ceph and other s3 emulators.

  ```dvc
  $ dvc remote modify s3remote listobjects true
  ```

- `sse` - server-side encryption algorithm to use (e.g., AES256, aws:kms). By
  default, no encryption is used.

  ```dvc
  $ dvc remote modify s3remote sse AES256
  ```

- `acl` - set object level access control list (ACL) such as `private`,
  `public-read`, etc. By default, no ACL is specified.

  ```dvc
  $ dvc remote modify s3remote acl bucket-owner-full-control
  ```

</details>

## DVC Storage

To use an Amazon S3 as a DVC storage we should declare it as a default remote:

```dvc
$ dvc remote add --default s3storage s3://mybucket/path
Setting 's3storage' as a default remote.

$ dvc remote list
s3storage	s3://mybucket/path

$ cat .dvc/config
['remote "s3storage"']
url = s3://mybucket/path
[core]
remote = s3storage
```

## External Dependencies

Let's take as an example a stage that simply downloads a file from an Amazon S3
bucket:

```dvc
$ dvc run \
      -d s3://mybucket/file.csv \
      -o file.csv \
      'aws s3 cp s3://mybucket/file.csv file.csv'
```

## External Data and Outputs

Let's take as example a stage that simply copies a local file to an Amazon S3
bucket.

For cached external outputs (specified using `-o`) we need to setup an external
cache location that will be used by DVC to store versions of the external file.
Non-cached external outputs (specified using `-O`) do not require an external
cache to be setup.

> When you setup an external cache for your external outputs, avoid using the
> same location that you are using for the DVC storage (which is accessed by
> `dvc push`, `dvc pull`, `dvc fetch`), because it may cause possible checksum
> overlaps. Checksum for some data file on an external storage can potentially
> collide with checksum generated locally for a different file, with a different
> content.

```dvc
# Add a DVC storage
$ dvc remote add --default \
      s3storage s3://mybucket/dvc-storage

# Add S3 remote to be used as cache location for S3 files
$ dvc remote add \
      s3cache s3://mybucket/cache

# Tell dvc to use the 's3cache' remote as S3 cache location
$ dvc config cache.s3 s3cache

# Add data that is located on Amazon S3
$ dvc add s3://mybucket/data/file.csv

# Create a stage with external output
$ dvc run \
      -d model.pkl \
      -o s3://mybucket/data/model.pkl \
      'aws s3 cp model.pkl s3://mybucket/data/model.pkl'
```
