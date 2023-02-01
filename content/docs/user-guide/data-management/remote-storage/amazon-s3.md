# Amazon S3

Use `dvc remote add` with a (new) remote name and a valid [S3] URL:

```cli
$ dvc remote add -d myremote s3://<bucket>/<key>
```

- `bucket` - name of an [existing S3 bucket]
- `key` - optional path to a [folder key] in your bucket

<admon type="tip">

The `-d` flag (optional) makes this the `--default` remote for the
<abbr>project</abbr>.

</admon>

[s3]: https://aws.amazon.com/s3/
[existing s3 bucket]:
  https://docs.aws.amazon.com/AmazonS3/latest/gsg/CreatingABucket.html
[folder key]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-folders.html

## Authentication

<admon type="info">

The AWS user needs the following permissions: `s3:ListBucket`, `s3:GetObject`,
`s3:PutObject`, `s3:DeleteObject`.

</admon>

DVC will try to authenticate using your [AWS CLI config] by default. This reads
the default AWS credentials file (if available). To use customize
authentication, you can set the following config params with
`dvc remote modify --local`.

[aws cli config]:
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html

<admon type="warn">

The `--local` flag is needed to write sensitive user info to a Git-ignored
config file (`.dvc/config.local`) so that no secrets are leaked through Git. See
`dvc config` for more info.

</admon>

- `configpath` - custom [AWS CLI config file][aws-cli-config] path

  ```cli
  $ dvc remote modify --local myremote \
                      configpath 'path/to/config'
  ```

- `credentialpath` - custom [AWS CLI credentials file][aws-cli-config] path

  ```cli
  $ dvc remote modify --local myremote \
                      credentialpath 'path/to/credentials'
  ```

- `profile` - credentials [profile] name

  ```cli
  $ dvc remote modify --local myremote profile 'myprofile'
  ```

- `access_key_id` - AWS access key ID. May be used (along with
  `secret_access_key`) instead of `credentialpath`.

  ```cli
  $ dvc remote modify --local myremote \
                      access_key_id 'mysecret'
  ```

- `secret_access_key` - AWS secret access key. May be used (along with
  `access_key_id`) instead of `credentialpath`.

  ```cli
  $ dvc remote modify --local myremote \
                      secret_access_key 'mysecret'
  ```

- `session_token` - AWS [MFA] session token (when required). May be used (along
  with `access_key_id` and `secret_access_key`) instead of `credentialpath`.

  ```cli
  $ dvc remote modify --local myremote \
                      session_token 'mysecret'
  ```

[aws-cli-config]:
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html
[profile]:
  https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html
[mfa]: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html

## Cloud versioning

Learn about DVC [cloud versioning] support.

<admon type="info">

Requires [S3 Versioning] enabled on the bucket.

</admon>

[cloud versioning]: /docs/user-guide/data-management/cloud-versioning
[s3 versioning]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html

```cli
$ dvc remote modify myremote version_aware true
# or
$ dvc remote modify myremote worktree true
```

- `version_aware` (`true` or `false`) - use [version-aware] cloud versioning
  features for this remote.

- `worktree` (`true` or `false`) - use [worktree] cloud versioning features for
  this remote (implies `version_aware`).

[version-aware]:
  /docs/user-guide/data-management/cloud-versioning#version-aware-remotes
[worktree]: /docs/user-guide/data-management/cloud-versioning#worktree-remotes

## More configuration options

- `region` - specific AWS region

  ```cli
  $ dvc remote modify myremote region 'us-east-2'
  ```

- `endpointurl` - custom endpoint to use non-Amazon
  [S3-compatible storage](/doc/command-reference/remote/modify#s3-compatible-storage)

- `read_timeout` - time in seconds until a timeout exception is thrown when
  attempting to read from a connection (60 by default)

- `connect_timeout` - time in seconds until a timeout exception is thrown when
  attempting to make a connection (60 by default)

- `listobjects` (`true` or `false`) - whether to use the `list_objects()` S3 API
  method instead of the default `list_objects_v2()`. Useful for Ceph and other
  S3 emulators

- `use_ssl` (`true` or `false`) - whether to use SSL. Used by default.

- `ssl_verify` - whether to verify SSL certificates (`true` or `false`), or a
  path to a custom CA certificates bundle to do so (implies `true`). Any certs
  found in the [AWS CLI config file][aws-cli-config] (`ca_bundle`) are used by
  default.

  ```cli
  $ dvc remote modify myremote ssl_verify false
  # or
  $ dvc remote modify myremote \
                      ssl_verify 'path/to/ca_bundle.pem'
  ```

- `sse` (`AES256` or `aws:kms`) - [server-side encryption] algorithm to use.
  None by default

  ```cli
  $ dvc remote modify myremote sse 'AES256'
  ```

- `sse_kms_key_id` - encryption key ID (or alias) when using [SSE-KMS] (see
  `sse`)

- `sse_customer_key` - key to encrypt data uploaded when using customer-provided
  keys ([SSE-C]) instead of `sse`. The value should be a base64-encoded 256 bit
  key.

- `sse_customer_algorithm` - algorithm to use with `sse_customer_key`. `AES256`
  by default

- `acl` - object-level access control list ([ACL]) such as `private`,
  `public-read`, etc. None by default. Cannot be used with the `grant_` params
  below.

  ```cli
  $ dvc remote modify myremote \
                      acl 'bucket-owner-full-control'
  ```

- `grant_read` - grant `READ` [permissions] at object-level ACL to specific
  [grantees]. Cannot be used with `acl`.

  ```cli
  $ dvc remote modify myremote grant_read \
        'id=myuser,id=anotheruser'
  ```

- `grant_read_acp` - grant `READ_ACP` permissions at object-level ACL to
  specific grantees. Cannot be used with `acl`.

- `grant_write_acp` - grant `WRITE_ACP` permissions at object-level ACL to
  specific grantees. Cannot be used with `acl`.

- `grant_full_control` - grant `FULL_CONTROL` permissions at object-level ACL to
  specific grantees. Cannot be used with `acl`.

[server-side encryption]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/serv-side-encryption.html
[sse-kms]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html
[sse-c]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html
[acl]: https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
[grantees]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#specifying-grantee
[permissions]:
  https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#permissions

## Environment variables

Authentication and other configuration can also be set via [`boto3` env vars].
These are tried if no config params are set in the <abbr>project</abbr>.
Example:

```cli
$ dvc remote add -d myremote s3://mybucket
$ export AWS_ACCESS_KEY_ID='mysecret'
$ export AWS_SECRET_ACCESS_KEY='mysecret'
$ dvc push
```

[`boto3` env vars]:
  https://boto3.amazonaws.com/v1/documentation/api/latest/guide/configuration.html#using-environment-variables
