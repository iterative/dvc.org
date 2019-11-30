# External Data on Aliyun OSS

First you need to setup OSS storage on Aliyun Cloud and then use an S3 style URL
for OSS storage and make the endpoint value configurable.

Then you can create an OSS remote like this:

```dvc
$ dvc remote add myremote oss://my-bucket/path
```

You can set the `oss_endpoint` with the command `dvc remote modify`:

```dvc
$ dvc remote modify \
      myremote oss_endpoint endpoint
```

Set also the `oss_key_id` and `oss_key_secret`:

```dvc
$ dvc remote modify --local \
      myremote oss_key_id my-key-id

$ dvc remote modify --local \
      myremote oss_key_secret my-key-secret
```

> Make sure to use the `--local` option to avoid committing your secrets into
> Git.

Configuration files `.dvc/config` and `.dvc/config.local` should look like this:

```ini
# .dvc/config
['remote "myremote"']
url = oss://my-bucket/path
oss_endpoint = endpoint
```

```ini
# .dvc/config.local
['remote "myremote"']
oss_key_id = my-key-id
oss_key_secret = my-key-secret
```

<details>

### Details: Aliyun OSS available options

- `oss_key_id` - OSS key id to use to access a remote.

  ```dvc
  $ dvc remote modify --local \
        myremote oss_key_id my-key-id
  ```

- `oss_key_secret` - OSS secret key for authorizing access into a remote.

  ```dvc
  $ dvc remote modify --local \
        myremote oss_key_secret my-key-secret
  ```

- `oss_endpoint` - OSS endpoint values for accessing remote container.

  ```dvc
  $ dvc remote modify \
        myremote oss_endpoint endpoint
  ```

</details>

You can also use the environment variables to set the options:

```dvc
$ export OSS_ACCESS_KEY_ID="my-key-id"
$ export OSS_ACCESS_KEY_SECRET="my-key-secret"
$ export OSS_ENDPOINT="endpoint"
```

> Usually these commands are appended to `~/.bashrc`.

<details>

### Test your OSS storage using docker

Start a container running an OSS emulator.

```dvc
$ git clone https://github.com/nanaya-tachibana/oss-emulator.git
$ docker image build -t oss:1.0 oss-emulator
$ docker run --detach -p 8880:8880 --name oss-emulator oss:1.0
```

Setup environment variables.

```dvc
$ export OSS_BUCKET='my-bucket'
$ export OSS_ENDPOINT='localhost:8880'
$ export OSS_ACCESS_KEY_ID='AccessKeyID'
$ export OSS_ACCESS_KEY_SECRET='AccessKeySecret'
```

> Uses default key id and key secret when they are not given, which gives read
> access to public read bucket and public bucket.

</details>
