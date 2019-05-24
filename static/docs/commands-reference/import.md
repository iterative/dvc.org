# import

Import file from any supported URL (it could be `http://`, as well as `s3://`,
`ssh://`, and other supported external storage URLs) or local directory to local
workspace and track changes in remote file or directory.

## Synopsis

```usage
usage: dvc import [-h] [-q] [-v] [-f] [--resume] url out

positional arguments:
  url            URL (see supported URLs in the description)
  out            Output
```

## Description

In some cases it is convenient to add a data file or a directory to a workspace
such that it will be automatically updated when the data source is updated. One
project might produce occasional data files that are used in other projects, for
example. ETL pipeline running regularly updates some data file. A shared dataset
on a remote storage that is managed and updated outside DVC.

DVC supports `.dvc` files which refer to an external data location, see
[External Dependencies](/doc/user-guide/external-dependencies). In such a DVC
file, the `deps` section lists a remote URL specification, and the `outs`
section lists the corresponding local path name in the workspace. It records
enough data from the remote file or directory to enable DVC to efficiently check
it to determine if the local copy is out of date. DVC uses this remote URL to
then download the data to the workspace, and to re-download it upon changes.

The `dvc import` command helps the user create such an external data dependency.

DVC supports several types of remote locations:

| Type     | Discussion                                              | URL format                                 |
| -------- | ------------------------------------------------------- | ------------------------------------------ |
| `local`  | Local path                                              | `/path/to/local/file`                      |
| `s3`     | Amazon S3                                               | `s3://mybucket/data.csv`                   |
| `gs`     | Google Storage                                          | `gs://mybucket/data.csv`                   |
| `ssh`    | SSH server                                              | `ssh://user@example.com:/path/to/data.csv` |
| `hdfs`   | HDFS                                                    | `hdfs://user@example.com/path/to/data.csv` |
| `http`   | HTTP to file with _strong ETag_ (see explanation below) | `https://example.com/path/to/data.csv`     |
| `remote` | Remote path (see explanation below)                     | `remote://myremote/path/to/file`           |

> In case of HTTP,
> [strong ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation)
> is necessary to track if the specified remote file (URL) changed to download
> it again.

> `remote://myremote/path/to/file` notation just means that there is a DVC
> [remote](/doc/commands-reference/remote) `myremote` is defined and when DVC is
> running it internally expands this URL into a regular S3, SSH, GS, etc URL by
> appending `/path/to/file` to the `myremote`'s configured base path.

Another way to understand the `dvc import` command is as a short-cut for more
verbose `dvc run` commands. This is discussed in the
[External Dependencies](/doc/user-guide/external-dependencies) documentation,
where an alternative is demonstrated for each of these schemes.

Instead of `dvc import`:

```dvc
$ dvc import https://example.com/path/to/data.csv data.csv
```

It is possible to instead use `dvc run`:

```dvc
$ dvc run -d https://example.com/path/to/data.csv \
          -o data.csv \
          wget https://example.com/path/to/data.csv -O data.csv
```

Both methods generate a DVC file with an external dependency, and they perform a
roughly equivalent result. The `dvc import` command saves the user from using
the command to copy files from each of the remote storage schemes, and from
having to install CLI tools for each service.

When DVC inspects a DVC file, one step is inspecting the dependencies to see if
any have changed. A changed dependency will appear in the `dvc status` report,
indicating the need to re-run the corresponding part of the pipeline. When DVC
inspects an external dependency, it uses a method appropriate to that dependency
to test its current status.

## Options

- `--resume` - resume previously started download. This is useful if the
  connection to the remote resource is unstable.

- `-f`, `--file` - specify name of the DVC file it generates. It should be
  either `Dvcfile` or have a `.dvc` file extension (e.g. `data.dvc`) in order
  for `dvc` to be able to find it later.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - does not write anything to standard output. Exit with 0 if
  no problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To illustrate the examples we will be using the project used in _Get Started_.
It is very easy to setup a playground for the examples below. It's completely
optional though.

<details>

### Click and expand to setup the project

This step is optional, and you can run it only if you want to run this examples
in your environment. First, you need to download the project:

```dvc
    $ git clone https://github.com/iterative/example-get-started
```

Second, let's install the requirements. But before we do that, we **strongly**
recommend creating a virtual environment with `virtualenv` or a similar tool:

```dvc
$ cd example-get-started
$ virtualenv -p python3 .env
$ source .env/bin/activate
```

Now, we can install requirements for the project:

```dvc
$ pip install -r requirements.txt
```

</details>

## Example: Tracking a remote file

The [DVC getting started tutorial](/doc/get-started) demonstrates a simple DVC
pipeline. In the [Add Files step](/doc/get-started/add-files) we are told to
download a file, then use `dvc add` to integrate it with the workspace.

An advanced alternate way to initialize the _Getting Started_ workspace, is
using `dvc import`:

<details>

### Click and expand to prepare the workspace

This is needed to actually run the command below in case you are reproducing
this example:

```dvc
$ git checkout 2-remote
$ mkdir data
```

After executing these commands you should have an almost empty workspace.

</details>

```dvc
$ dvc import https://dvc.org/s3/get-started/data.xml data/data.xml

Importing 'https://dvc.org/s3/get-started/data.xml' -> 'data/data.xml'
[##############################] 100% data.xml
Adding 'data/data.xml' to 'data/.gitignore'.
Saving 'data/data.xml' to cache '.dvc/cache'.
Saving information to 'data.xml.dvc'.

To track the changes with git run:

    git add data/.gitignore data.xml.dvc
```

If you wish, it's possible to set up the other stages from the _Getting Started_
example. Since we do not need those stages for this example, we'll skip that.
Instead we can look at the resulting DVC file `data.xml.dvc`:

```yaml
deps:
  - etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
    path: https://dvc.org/s3/get-started/data.xml
md5: 61e80c38c1ce04ed2e11e331258e6d0d
outs:
  - cache: true
    md5: a304afb96060aad90176268345e10355
    metric: false
    path: data/data.xml
    persist: false
wdir: .
```

The `etag` field in the DVC file contains the ETag recorded from the HTTP
request. If the remote file changes, the ETag changes, letting DVC know when the
file has changed.

## Example: Detecting remote file changes

What if that remote file is one which will be updated regularly? The project
goal might include regenerating some artifact based on the updated data. With a
DVC external dependency, the pipeline can be triggered to re-execute based on a
changed external dependency.

Let us again use the [Getting Started](/doc/get-started) example, in a way which
will mimic an updated external data source.

To make it easy to experiment with this, let us use a local directory as our
remote data location. In real life the data file will probably be on a remote
server, of course. Run these commands:

```dvc
$ mkdir /path/to/data-store
$ cd /path/to/data-store
$ wget https://dvc.org/s3/get-started/data.xml
```

In a production system you might have a process to update data files you need.
That's not what we have here, so in this case we'll set up a data store where we
can edit the data file.

On your machine initialize the workspace again:

<details>

### Click and expand to prepare the workspace

This is needed to actually run the command below in case you are reproducing
this example:

```dvc
$ git checkout 2-remote
$ mkdir data
```

After executing these commands you should have an almost empty workspace.

</details>

```dvc
$ dvc import /path/to/data-store/data.xml data/data.xml

Importing '/path/to/data-store/data.xml' -> 'data/data.xml'
[##############################] 100% data.xml
Adding 'data/data.xml' to 'data/.gitignore'.
Saving 'data/data.xml' to cache '.dvc/cache'.
Saving information to 'data.xml.dvc'.

To track the changes with git run:

    git add data/.gitignore data.xml.dvc
```

At this point we have the workspace set up in a similar fashion. The difference
is that DVC file references now references the editable data file in the data
store directory we just set up. We did this to make it easy to edit the data
file:

```yaml
deps:
  - md5: a86ca87250ed8e54a9e2e8d6d34c252e
    path: /path/to/data-store/data.xml
md5: 361728a3b037c9a4bcb897cdf856edfc
outs:
  - cache: true
    md5: a304afb96060aad90176268345e10355
    metric: false
    path: data/data.xml
    persist: false
wdir: .
```

The DVC file is nearly the same as before. The `path` has the URL for the data
store, and instead of an `etag` we have an `md5` checksum.

Let's also set up one of the processing stages from the _Getting Started_
example:

<details>

### Click and expand to prepate the code to run

Download `https://dvc.org/s3/get-started/code.zip` and unzip the code if you
wish to execute the data preparation step below. On Windows use browser, on all
other systems run:

```dvc
$ wget https://dvc.org/s3/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

</details>

```dvc
$ dvc run -f prepare.dvc \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
```

Having this stage means that later when we run `dvc repro` a pipeline will be
executed.

The workspace says it is fine:

```dvc
$ tree
.
├── data
│   ├── data.xml
│   └── prepared
│       ├── test.tsv
│       └── train.tsv
├── data.xml.dvc
├── prepare.dvc
├── requirements.txt
└── src
    ├── evaluate.py
    ├── featurization.py
    ├── prepare.py
    └── train.py

3 directories, 10 files

$ dvc status
Pipeline is up to date. Nothing to reproduce.
```

Then in the data store directory, edit `data.xml`. It doesn't matter what you
change, other than it still being a valid XML file, just that a change is made
because any change will change the checksum. Once we do so, we'll see this:

```dvc
$ dvc status
data.xml.dvc:
    changed deps:
        modified:     /path/to/data-store/data.xml
```

DVC has noticed the external dependency has changed. It is telling us that it is
necessary to now run `dvc repro`.

```dvc
$ dvc repro prepare.dvc

WARNING: Dependency '/path/to/data-store/data.xml' of 'data.xml.dvc' changed because it is 'modified'.
WARNING: Stage 'data.xml.dvc' changed.
Reproducing 'data.xml.dvc'
Importing '/path/to/data-store/data.xml' -> 'data/data.xml'
[##############################] 100% data.xml
Saving 'data/data.xml' to cache '.dvc/cache'.
Saving information to 'data.xml.dvc'.

WARNING: Dependency 'data/data.xml' of 'prepare.dvc' changed because it is 'modified'.
WARNING: Stage 'prepare.dvc' changed.
Reproducing 'prepare.dvc'
Running command:
    python src/prepare.py data/data.xml
Saving 'data/prepared' to cache '.dvc/cache'.
Linking directory 'data/prepared'.
Saving information to 'prepare.dvc'.

To track the changes with git run:

    git add data.xml.dvc prepare.dvc

$ git add .
$ git commit -a -m "updated data"

[master a8d4ce8] updated data
 2 files changed, 6 insertions(+), 6 deletions(-)

$ dvc status
Pipeline is up to date. Nothing to reproduce.
```

Because the external source for the data file changed, the change was noticed by
the `dvc status` command. Running `dvc repro` then ran both stages of the
pipeline, and if we had set up the other stages they also would have been run.
It first downloaded the updated data file. And then noticing that
`data/data.xml` had changed, that triggered the `prepare.dvc` stage to execute.
