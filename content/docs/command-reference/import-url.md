# import-url

Track a file or directory found in an external location (`s3://`, `/local/path`,
etc.), and download it to the local project, or make a copy in
[remote storage](/doc/command-reference/remote).

> See `dvc import` to download and track data/model files or directories from
> other <abbr>DVC repositories</abbr> (e.g. hosted on GitHub).

## Synopsis

```usage
usage: dvc import-url [-h] [-q | -v] [-j <number>] [--file <filename>]
                      [--no-exec] [--to-remote] [-r <name>]
                      [--desc <text>]
                      url [out]

positional arguments:
  url                   (See supported URLs in the description.)
  out                   Destination path to put files in.
```

## Description

In some cases it's convenient to add a data file or directory from an external
location into the workspace (or to
[remote storage](/doc/command-reference/remote)), such that it can be updated
later, if/when the external data source changes. Example scenarios:

- A remote system may produce occasional data files that are used in other
  projects.
- A batch process running regularly updates a data file to import.
- A shared dataset on cloud storage that is managed and updated outside DVC.

> Note that `dvc get-url` corresponds to the first step this command performs
> (just download the file or directory).

`dvc import-url` helps you create such an external data dependency, without
having to manually copy files from the supported locations (listed below), which
may require installing a different tool for each type.

When you don't want to store the target data in your local system, you can still
create an import `.dvc` file while transferring a file or directory directly to
remote storage, by using the `--to-remote` option. See the
[Transfer to remote storage](#example-transfer-to-remote-storage) example for
more details.

The `url` argument specifies the external location of the data to be imported.
The imported data is <abbr>cached</abbr>, and linked (or copied) to the current
working directory with its original file name e.g. `data.txt` (or to a location
provided with `out`).

An _import `.dvc` file_ is created in the same location e.g. `data.txt.dvc` –
similar to using `dvc add` after downloading the data. This makes it possible to
update the import later, if the data source has changed (see `dvc update`).

> Note that data imported from external locaitons can be
> [pushed](/doc/command-reference/push) and
> [pulled](/doc/command-reference/pull) to/from
> [remote storage](/doc/command-reference/remote) normally (unlike for
> `dvc import`).

`.dvc` files support references to data in an external location, see
[External Dependencies](/doc/user-guide/external-dependencies). In such an
import `.dvc` file, the `deps` field stores the external URL, and the `outs`
field contains the corresponding local path in the <abbr>workspace</abbr>. It
records enough metadata about the imported data to enable DVC efficiently
determining whether the local copy is out of date.

Note that `dvc repro` doesn't check or update import `.dvc` files, use
`dvc update` to bring the import up to date from the data source.

DVC supports several types of external locations (protocols):

| Type      | Description                  | `url` format example                          |
| --------- | ---------------------------- | --------------------------------------------- |
| `s3`      | Amazon S3                    | `s3://bucket/data`                            |
| `azure`   | Microsoft Azure Blob Storage | `azure://container/data`                      |
| `gs`      | Google Cloud Storage         | `gs://bucket/data`                            |
| `ssh`     | SSH server                   | `ssh://user@example.com/path/to/data`         |
| `hdfs`    | HDFS to file\*               | `hdfs://user@example.com/path/to/data.csv`    |
| `http`    | HTTP to file with _ETag_\*   | `https://example.com/path/to/data.csv`        |
| `webdav`  | WebDav to file\*             | `webdavs://example.com/endpoint/path`         |
| `webhdfs` | HDFS REST API\*              | `webhdfs://user@example.com/path/to/data.csv` |
| `local`   | Local path                   | `/path/to/local/data`                         |

> If you installed DVC via `pip` and plan to use cloud services as remote
> storage, you might need to install these optional dependencies: `[s3]`,
> `[azure]`, `[gs]`, `[oss]`, `[ssh]`. Alternatively, use `[all]` to include
> them all. The command should look like this: `pip install "dvc[s3]"`. (This
> example installs `boto3` library along with DVC to support S3 storage.)

\* Notes on remote locations:

- HDFS, HTTP, WebDav, and WebHDFS **do not** support downloading entire
  directories, only single files.

- In case of HTTP,
  [ETag](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation) is
  necessary to track if the specified URL changed.

Another way to understand the `dvc import-url` command is as a shortcut for
generating a pipeline [stage](/doc/command-reference/run) with an external
dependency.

> This is discussed in the
> [External Dependencies](/doc/user-guide/external-dependencies) documentation,
> where an alternative is demonstrated for each of these schemes.

Instead of:

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml data.xml
```

It is possible to use `dvc stage add`, for example (HTTP URL):

```dvc
$ dvc stage add -n download_data \
                -d https://data.dvc.org/get-started/data.xml \
                -o data.xml \
                wget https://data.dvc.org/get-started/data.xml -O data.xml

$ dvc repro
```

`dvc import-url` generates an _import `.dvc` file_ while `dvc stage add`
produces a regular stage in `dvc.yaml`.

## Options

- `--file <filename>` - specify a path and/or file name for the `.dvc` file
  created by this command (e.g. `--file stages/stage.dvc`). This overrides the
  default file name: `<file>.dvc`, where `<file>` is the desired file name of
  the imported data (`out`).

- `--no-exec` - create the import `.dvc` file but don't download `url` (assumes
  that the data source is valid). This is useful if you need to define the
  project imports quickly, and download everything later (use `dvc update` to
  finish the operation(s)); or if the target data already exist locally and you
  want to "DVCfy" this state of the project (see also `dvc commit`).

- `--to-remote` - import a target, but neither move it into the workspace, nor
  cache it. [Transfer it](#example-transfer-to-remote-storage) directly to
  remote storage (the default one unless one is specified with `-r`) instead.
  Use `dvc pull` to get the data locally.

- `-r <name>`, `--remote <name>` - name of the
  [remote storage](/doc/command-reference/remote) (can only be used with
  `--to-remote`).

- `-j <number>`, `--jobs <number>` - parallelism level for DVC to download data
  from the source. The default value is `4 * cpu_count()`. For SSH remotes, the
  default is `4`. Using more jobs may speed up the operation.

- `--desc <text>` - user description of the data (optional). This doesn't  
  affect any DVC operations.

- `-h`, `--help` - prints the usage/help message, and exit.

- `-q`, `--quiet` - do not write anything to standard output. Exit with 0 if no
  problems arise, otherwise 1.

- `-v`, `--verbose` - displays detailed tracing information.

## Examples

To illustrate these examples we will be using the <abbr>project</abbr> explained
in the [Get Started](/doc/start).

<details>

### Click and expand to set up example

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

## Example: Tracking a file from the web

An advanced alternate to the intro of the
[Versioning Basics](/doc/start/data-and-model-versioning) part of the _Get
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

```git
+md5: c4d6740ee09950bb532d418b8ae0b52e
+frozen: true
+deps:
+- etag: '"f432e270cd634c51296ecd2bc2f5e752-5"'
+  path: https://data.dvc.org/get-started/data.xml
 outs:
 - md5: a304afb96060aad90176268345e10355
   path: data.xml
   cache: true
```

The `etag` field in the `.dvc` file contains the
[ETag](https://en.wikipedia.org/wiki/HTTP_ETag) recorded from the HTTP request.
If the imported file changes online, its ETag will be different. This metadata
allows DVC to determine whether it's necessary to download it again.

> See `.dvc` files for more details on the format above.

You may want to get out of and remove the `example-get-started/` directory after
trying this example (especially if trying out the following one).

## Example: Detecting external file changes

What if an imported file is updated regularly at it's source? The project goals
might include regenerating some results based on the updated data source.
[Pipeline](/doc/command-reference/dag) reproduction can be triggered based on a
changed external dependency.

Let's use the [Get Started](/doc/start) project again, simulating an updated
external data source. (Remember to prepare the <abbr>workspace</abbr>, as
explained in [Examples](#examples))

To illustrate this scenario, let's use a local file system directory external to
the workspace (in real life, the data file could be on a remote server instead).
Run these commands:

```dvc
$ mkdir /tmp/dvc-import-url-example
$ cd /tmp/dvc-import-url-example/
$ wget https://data.dvc.org/get-started/data.xml
$ cd - # go back to the project
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
[data processing part](/doc/start/data-pipelines) of the _Get Started_. Download
the example source code archive and unzip it:

```dvc
$ wget https://code.dvc.org/get-started/code.zip
$ unzip code.zip
$ rm -f code.zip
```

<details>

### Click and expand to set up the environment

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
$ dvc stage add -n prepare \
                -d src/prepare.py -d data/data.xml \
                -o data/prepared \
                python src/prepare.py data/data.xml

$ dvc repro
Running command:
	python src/prepare.py data/data.xml
...
```

```dvc
$ tree
.
├── README.md
├── data
│   ├── data.xml
│   ├── data.xml.dvc
│   └── prepared
│       ├── test.tsv
│       └── train.tsv
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
different dependency file hash (`md5`) in the import `.dvc` file. Once we do so,
we can run `dvc update` to make sure the import is up to date:

```dvc
$ dvc update data.xml.dvc
Importing '.../tmp/dvc-import-url-example/data.xml' -> 'data/data.xml'
```

DVC notices the external data source has changed, and updates the `.dvc` file
(reproduces it). In this case it's also necessary to run `dvc repro` so that the
remaining pipeline results are also regenerated:

```dvc
$ dvc repro
Running stage 'prepare' with command:
	python src/prepare.py data/data.xml
```

## Example: Transfer to remote storage

Sometimes there's not enough space in the local environment to import a large
dataset, but you still want to track it in the <abbr>project</abbr> so it can be
[pulled](/doc/command-reference/plots) later.

As long as you have setup [remote storage] that can handle the data, this can be
achieved with the `--to-remote` flag. It creates an import `.dvc` file without
downloading anything, transferring a target directly to a DVC remote instead.

Let's import a `data.xml` file via HTTP straight to remote:

```dvc
$ dvc import-url https://data.dvc.org/get-started/data.xml data.xml \
                 --to-remote
...
$ ls
data.xml.dvc
```

Since a `.dvc` file is created in the <abbr>workspace</abbr>, whenever anyone
wants to actually download the data they can use `dvc pull`:

```dvc
$ dvc pull data.xml.dvc
A       data.xml
1 file added
```

Use `dvc update --to-remote` to bring the import up to date in remote storage,
without downloading anything.

[remote storage]: /doc/command-reference/remote
