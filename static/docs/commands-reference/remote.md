# remote

Manage set of tracked repositories.

```usage
    usage: dvc remote [-h] [-q] [-v] {add,remove,modify,list} ... 

    positional arguments:
        add                   Add remote
        remove                Remove remote
        modify                Modify remote
        list                  List remotes

    optional arguments:
        -h, --help            show this help message and exit
        -q, --quiet           Be quiet.
        -v, --verbose         Be verbose.
```

## Options

### URL
Remote location.

#### Example
```dvc
dvc remote modify myremote url gs://bucket/path 
```

### LOCAL
Local remote.

#### Example
```dvc
dvc remote add myremote /path/to/dir
```

#### Cache Type
Link type that dvc should use to link data files from cache to your repository.
Possbile values: `reflink`, `symlink`, `hardlink`, `copy` or a combination of
those separated by the comma: `reflink,copy`.

##### Example
```dvc
dvc remote modify myremote type reflink,copy
```

### S3
AWS S3 remote.

#### Example
```dvc
dvc remote add myremote s3://bucket/path
```

#### Region
AWS S3 region.

##### Example
```dvc
dvc remote modify myremote region us-east-2
```

#### Profile
Profile to use to access AWS S3.

##### Example
```dvc
dvc remote modify myremote profile myprofile
```

#### Credential Path
Path to credentials to use to access AWS S3.

##### Example
```dvc
dvc remote modify myremote credentialpath /path/to/my/creds
```

#### Endpoint URL
Endpoint URL to use to access AWS S3.

##### Example
```dvc
dvc remote modify myremote endpointurl myendpoint.com
```

### GS
Google Cloud Storage remote.

#### Example
```dvc
dvc remote add myremote gs://bucket/path
```

#### Project Name
Project name to use.

##### Example
```dvc
dvc remote modify myremote projectname myproject
```

### SSH
SSH remote.

#### Example
```dvc
dvc remote add myremote ssh://user@example.com:/path/to/dir
```

#### User
Username to use to access a remote.

##### Example
```dvc
dvc remote modify myremote user myuser
```

### HDFS
HDFS remote.

#### Example
```dvc
dvc remote add myremote hdfs://user@example.com/path/to/dir
```

#### User
Username to use to access a remote.

##### Example
```dvc
dvc remote modify myremote user myuser
```

## Examples

```dvc
    $ dvc remote add myremote s3://mybucket/myproject
    $ dvc remote list
      myremote
    $ dvc remote modify myremote region us-east-2
    $ dvc remote remove myremote
```

