# import-url

Download a file or directory from a supported URL (for example `s3://`,
`ssh://`, and other protocols) into the <abbr>workspace</abbr>, and track
changes in the remote data source. Creates a `.dvc` file.

> See `dvc import` to download and tack data/model files or directories from
> other <abbr>DVC repositories</abbr> (e.g. hosted on GitHub).

## Synopsis

```usage
usage: dvc import-url [-h] [-q | -v] [--file <filename>] [--no-exec]
                      [--desc <text>]
                      url [out]

positional arguments:
  url                   (See supported URLs in the description.)
  out                   Destination path to put files in.
```

## Description

In some cases it's convenient to add a data file or directory from a remote
location into the workspace, such that it can be updated later, if/when the
external data source changes. Example scenarios:

- A remote system may produce occasional data files that are used in other
  projects.
- A batch process running regularly updates a data file to import.
- A shared dataset on a remote storage that is managed and updated outside DVC.

> Note that `dvc get-url` corresponds to the first step this command performs
> (just download the file or directory).

The `dvc import-url` command helps the user create such an external data
dependency without having to manually copying files from the supported remote
locations (listed below), which may require installing a different tool for each
type.

The `url` argument specifies the external location of the data to be imported,
while `out` can be used to specify the directory and/or file name desired for
the downloaded data. If an existing directory is specified, the file or
directory will be placed inside.

`.dvc` files support references to data in an external location, see
[External Dependencies](/doc/user-guide/external-dependencies). In such an
import `.dvc` file, the `deps` field stores the remote URL, and the `outs` field
contains the corresponding local path in the <abbr>workspace</abbr>. It records
enough metadata about the imported data to enable DVC efficiently determining
whether the local copy is out of date.

Note that `dvc repro` doesn't check or update import `.dvc` files, use
`dvc update` on them to bring the import up to date from the external data
source.

DVC supports several types of (local or) remote locations (protocols):

| Type      | Description                  | `url` format example                          |
| --------- | ---------------------------- | --------------------------------------------- |
| `s3`      | Amazon S3                    | `s3://bucket/data`                            |
| `azure`   | Microsoft Azure Blob Storage | `azure://container/data`                      |
| `gdrive`  | Google Drive                 | `gdrive://<folder-id>/data`                   |
| `gs`      | Google Cloud Storage         | `gs://bucket/data`                            |
| `ssh`     | SSH server                   | `ssh://user@example.com/path/to/data`         |
| `hdfs`    | HDFS to file\*               | `hdfs://user@example.com/path/to/data.csv`    |
| `http`    | HTTP to file with _ETag_\*   | `https://example.com/path/to/data.csv`        |
| `webdav`  | WebDav to file\*             | `webdavs://example.com/endpoint/path`         |
| `webhdfs` | HDFS REST API\*              | `webhdfs://user@example.com/path/to/data.csv` |
| `local`   | Local path                   | `/path/to/local/data`                         |
| `remote`  | Remote path\*                | `remote://remote-name/data`                   |

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to
> include them all. The command should look like this: `pip install "dvc[s3]"`.
> (This example installs `boto3` library along with DVC to support S3 storage.)

\* Notes on remote locations:

- HDFS, HTTP, WebDav, and WebHDFS **do not** support downloading entire
  directories, only single files.

- In case of HTTP,
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) is
  necessary to track if the specified remote file (URL) changed to download it
  again.

- `remote://myremote/path/to/file` notation just means that a DVC
  [remote](/doc/command-reference/remote) `myremote` is defined and when DVC is
  running. DVC automatically expands this URL into a regular S3, SSH, GS, etc
  URL by appending `/path/to/file` to the `myremote`'s configured base path.

Another way to understand the `dvc import-url` command is as a shortcut for
generating a pipeline stage with and external dependency. This is discussed in
the [External Dependencies](/doc/user-guide/external-dependencies)
documentation, where an alternative is demonstrated for each of these schemes.

Instead of:

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml data.xml
```

It is possible to use `dvc run`, for example (HTTP URL):

```dvc
$ dvc run -n download_data \
          -d https://data.dvc.org/get-started/data.xml \
          -o data.xml \
          wget https://data.dvc.org/get-started/data.xml -O data.xml
```

`dvc import-url` generates an _import stage_ `.dvc` file and `dvc run` a regular
stage (in `dvc.yaml`).

⚠️ DVC won't push or pull imported data to/from
[remote storage](/doc/command-reference/remote), it will rely on it's original
source.

## Options

- `--file <filename>` - specify a path and/or file name for the `.dvc` file
  created by this command (e.g. `--file stages/stage.dvc`). This overrides the
  default file name: `<file>.dvc`, where `<file>` is the desired file name of
  the imported data (`out`).

- `--no-exec` - create `.dvc` file without actually downloading `url`. E.g. if
  the file or directory already exists, this can be used to skip the download.
  The data hash is not calculated when this option is used, only the import
  metadata is saved to the `.dvc` file. `dvc commit <out>.dvc` can be used if
  the data hashes are needed in the `.dvc` file, and to save existing data to
  the cache.

- `--desc <text>` - user description of the data (optional). This doesn't  
  affect any DVC operations.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To illustrate these examples we will be using the <abbr>project</abbr> explained
in the [Get Started](/doc/tutorials/get-started).

<details>

### Click and expand to setup example

Start by cloning our example repo if you don't already have it. Then move into
the repo and checkout the
[3-config-remote](https://github.com/iterative/example-get-started/releases/tag/3-config-remote)
tag, section of the _Get Started_:

```dvc
$ git clone https://github.com/iterative/example-get-started
$ cd example-get-started
$ git checkout 3-config-remote
```

</details>

## Example: Tracking a remote file

An advanced alternate to the intro of the
[Versioning Basics](/doc/tutorials/get-started/data-versioning) part of the _Get
Started_ is to use `dvc import-url`:

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml \
                 data/data.xml
Importing 'https://data.dvc.org/get-started/data.xml' -> 'data/data.xml'
...
To track the changes with git, run:

	git add data.xml.dvc data/.gitignore
```

Let's take a look at the changes to the `data.xml.dvc`:

```diff
+md5: c4d6740ee09950bb532d418b8ae0b52e
+frozen: true
+deps:
+- etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
+  path: https://data.dvc.org/get-started/data.xml
 outs:
 - md5: a304afb96060aad90176268345e10355
   path: data.xml
```

The `etag` field in the `.dvc` file contains the
[ETag](https://en.wikipedia.org/wiki/HTTP_ETag) recorded from the HTTP request.
If the remote file changes, its ETag will be different. This metadata allows DVC
to determine whether it's necessary to download it again.

> See `.dvc` files for more details on the format above.

You may want to get out of and remove the `example-get-started/` directory after
trying this example (especially if trying out the following one).

## Example: Detecting remote file changes

What if that remote file is updated regularly? The project goals might include
regenerating some results based on the updated data source.
[Pipeline](/doc/command-reference/dag) reproduction can be triggered based on a
changed external dependency.

Let's use the [Get Started](/doc/tutorials/get-started) project again,
simulating an updated external data source. (Remember to prepare the
<abbr>workspace</abbr>, as explained in [Examples](#examples))

To illustrate this scenario, let's use a local file system directory (external
to the workspace) to simulate a remote data source location. (In real life, the
data file will probably be on a remote server.) Run these commands:

```dvc
$ mkdir /tmp/dvc-import-url-example
$ cd /tmp/dvc-import-url-example/
$ wget https://data.dvc.org/get-started/data.xml
$ cd -  # to go back to the project
```

In a production system, you might have a process to update data files. That's
not what we have here, so in this case we'll set up a "data store" where we can
edit the data file.

```dvc
$ dvc import-url /tmp/dvc-import-url-example/data.xml data/data.xml
Importing '../../../tmp/dvc-import-url-example/data.xml' -> 'data/data.xml'
```

Check `data.xml.dvc`:

```yaml
md5: fceb2bc076fabe99b483729c3ea2a897
frozen: true
deps:
  - md5: a304afb96060aad90176268345e10355
    path: /tmp/dvc-import-url-example/data.xml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
```

The `.dvc` file is nearly the same as in the previous example. The difference is
that the dependency (`deps`) now references the local file in the data store
directory we created previously. (Its `path` has the URL for the data store.)
And instead of an `etag` we have an `md5` hash value. We did this so its easy to
edit the data file.

Let's now manually reproduce the
[data processing part](/doc/tutorials/get-started/data-pipelines) of the _Get
Started_ project. Download the example source code archive and unzip it:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

<details>

### Click and expand to setup the environment

Let's install the requirements. But before we do that, we **strongly** recommend
creating a
[virtual environment](https://python.readthedocs.io/en/stable/library/venv.html):

```dvc
$ python3 -m venv .env
$ source .env/bin/activate
$ pip install -r src/requirements.txt
```

</details>

```dvc
$ dvc run -n prepare \
          -d src/prepare.py -d data/data.xml \
          -o data/prepared \
          python src/prepare.py data/data.xml
Running command:
	python src/prepare.py data/data.xml
...
```

```dvc
$ tree
.
├── README.md
├── data
│   ├── data.xml
│   ├── data.xml.dvc
│   └── prepared
│       ├── test.tsv
│       └── train.tsv
├── dvc.lock
├── dvc.yaml
├── params.yaml
└── src
    ├── evaluate.py
    ├── featurization.py
    ├── prepare.py
    ├── requirements.txt
    └── train.py
```

At this point, DVC considers everything being up to date:

```dvc
$ dvc status
Data and pipelines are up to date.
```

In the data store directory, edit `data.xml`. It doesn't matter what you change,
as long as it remains a valid XML file, because any change will result in a
different dependency file hash (`md5`) in the import stage `.dvc` file. Once we
do so, we can run `dvc update` to make sure the import is up to date:

```dvc
$ dvc update data.xml.dvc
Importing '.../tmp/dvc-import-url-example/data.xml' -> 'data/data.xml'
```

DVC notices the "external" data source has changed, and updates the import stage
(reproduces it). In this case it's also necessary to run `dvc repro` so that the
remaining pipeline results are also regenerated:

```dvc
$ dvc repro
Running stage 'prepare' with command:
	python src/prepare.py data/data.xml
```
