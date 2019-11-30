# Amazon S3

We can create an Amazon S3 remote with `dvc remote add`:

```dvc
$ dvc remote add s3remote s3://mybucket/path
```

The configuration file `.dvc/config` should have a content like this:

```ini
['remote "s3remote"']
url = s3://mybucket/path
```

> **Note!** Before adding a new remote be sure to login into AWS services and
> follow instructions at
> [Create a Bucket](https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html)
> to create your bucket

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
```

By default DVC expects your AWS CLI is already
[configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html).

### Override default AWS credentials

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
