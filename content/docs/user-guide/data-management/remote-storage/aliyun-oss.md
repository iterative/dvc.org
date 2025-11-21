# Aliyun OSS

First you need to set up OSS storage on Aliyun Cloud. Then, use an S3 style URL
for OSS storage, and configure the
[endpoint](https://www.alibabacloud.com/help/en/oss/user-guide/regions-and-endpoints):

```cli
$ dvc remote add -d myremote oss://mybucket/path
$ dvc remote modify myremote oss_endpoint endpoint
```

To set key id, key secret and endpoint (or any other OSS parameter), use
`dvc remote modify` as shown below. Use the `--local` option to avoid committing
your secrets to Git:

```cli
$ dvc remote modify --local myremote oss_key_id 'mykey'
$ dvc remote modify --local myremote oss_key_secret 'mysecret'
```

## Testing your OSS storage using docker

Start a container running an OSS emulator, and set up the environment variables,
for example:

```cli
$ git clone https://github.com/nanaya-tachibana/oss-emulator.git
$ docker image build -t oss:1.0 oss-emulator
$ docker run --detach -p 8880:8880 --name oss-emulator oss:1.0
$ export OSS_BUCKET='mybucket'
$ export OSS_ENDPOINT='endpoint'
$ export OSS_ACCESS_KEY_ID='mykey'
$ export OSS_ACCESS_KEY_SECRET='mysecret'
```

> Uses default key id and key secret when they are not given, which gives read
> access to public read bucket and public bucket.

## Configuration Parameters

<admon type="warn">

If any values given to the parameters below contain sensitive user info, add
them with the `--local` option, so they're written to a Git-ignored config file.

</admon>

- `url` - remote location, in the `oss://<bucket>/<object>` format:

  ```cli
  $ dvc remote modify myremote url oss://mybucket/path
  ```

- `oss_endpoint` -
  [OSS endpoint](https://www.alibabacloud.com/help/en/oss/user-guide/regions-and-endpoints)
  values for accessing the remote container.

  ```cli
  $ dvc remote modify myremote oss_endpoint endpoint
  ```

- `oss_key_id` - OSS key ID to access the remote.

  ```cli
  $ dvc remote modify --local myremote oss_key_id 'mykey'
  ```

- `oss_key_secret` - OSS secret key for authorizing access into the remote.

  ```cli
  $ dvc remote modify --local myremote oss_key_secret 'mysecret'
  ```

## Environment variables

OSS remotes can also be configured via environment variables. These are tried if
none of the params above are set. The available ones are shown below:

```cli
$ export OSS_ACCESS_KEY_ID='mykey'
$ export OSS_ACCESS_KEY_SECRET='mysecret'
$ export OSS_ENDPOINT='endpoint'
```
