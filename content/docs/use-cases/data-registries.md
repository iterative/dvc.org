# Data Registries

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning),
with commands such as `dvc add`. With the aim to enable reusability of these
<abbr>data artifacts</abbr> between different projects, DVC also provides
commands like `dvc import` and `dvc get`. This means that your projects can
depend on data from other DVC repositories, **similar to a package management
systems for data science**.

![](/img/data-registry.png) _Data and models as code_

This means we can build a <abbr>DVC project</abbr> dedicated to tracking and
versioning _datasets_ (or any large files, directories, ML models, etc.). The
repository would have all the metadata and history of changes in the different
datasets. We could see who updated what and when, and use pull requests to
update data, the same way we do with code.

This is what we call a **data registry** — a kind of data management
_middleware_ between ML projects and cloud storage. Here are its advantages:

- Reusability: reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  systems like `pip`).
- Persistence: the DVC registry-controlled
  [remote storage](/doc/command-reference/remote) (e.g. an S3 bucket) improves
  data security. There are less chances someone can delete or rewrite a model,
  for example.
- Storage optimization: track data
  [shared](/doc/use-cases/sharing-data-and-model-files) by multiple projects
  centralized in a single location (with the ability to create distributed
  copies on other remotes). This simplifies data management and optimizes space
  requirements.
- Data as code: leverage Git workflow such as commits, branching, pull requests,
  reviews, and even CI/CD for your data and models lifecycle. Think "Git for
  cloud storage", but without ad-hoc conventions.
- Security: registries can be setup to have read-only remote storage (e.g. an
  HTTP location). Git versioning of
  [DVC metafiles](/doc/user-guide/dvc-files-and-directories) allows us to track
  and audit data changes.

## Building registries

Data registries start like any other <abbr>DVC repository</abbr>, with
`git init` and `dvc init`. A good way to organize their contents is by using
different directories to group similar data, e.g. `images/`,
`natural-language/`, etc. For example, our
[dataset registry](https://github.com/iterative/dataset-registry) uses a
directory for each part in our docs like `get-started/` and `use-cases/`.

Adding datasets to a registry can be as simple as placing the data file or
directory in question inside the <abbr>workspace</abbr>, and telling DVC to
track it, with `dvc add`. For example:

```dvc
$ mkdir -p music/songs
$ cp ~/Downloads/millionsongsubset_full music/songs
$ dvc add music/songs/
```

> This sample dataset actually exists. See
> [MillionSongSubset](http://millionsongdataset.com/pages/getting-dataset/#subset).

A regular Git workflow can be followed with the tiny `.dvc` file that substitute
the actual data (`music/songs.dvc` in this example). This enables team
collaboration on data at the same level as with source code (commit history,
branching, pull requests, reviews, etc.):

```dvc
$ git add music/songs.dvc music/.gitignore
$ git commit -m "Track 1.8 GB 10,000 song dataset in music/"
```

The actual data is stored in the project's <abbr>cache</abbr> and can be
[pushed](/doc/command-reference/push) to one or more
[remote storage](/doc/command-reference/remote) locations, so the registry can
be accessed from other locations or by other people:

```dvc
$ dvc remote add -d myremote s3://bucket/path
$ dvc push
```

## Using registries

The main methods to consume <abbr>artifacts</abbr> from a **data registry** are
the `dvc import` and `dvc get` commands, as well as the Python API, `dvc.api`.
But first, you may want to explore its contents.

### Listing data

To explore the contents of a data DVC repo in search for the right data, use the
`dvc list` command (analogous to `ls`, or 3rd party tools like `aws s3 ls`):

```dvc
$ dvc list -R https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started/.gitignore
get-started/data.xml
get-started/data.xml.dvc
images/.gitignore
images/dvc-logo-outlines.png
...
```

Both Git-tracked files and DVC-tracked data and models are listed.

### Simple downloads

`dvc get` is analogous to using direct download tools like `wget` (HTTP),
`aws s3 cp` (S3), etc. To get a dataset from a DVC repo, we can run something
like this:

```dvc
$ dvc get https://github.com/example/registry \
          music/songs
```

This downloads the `music/songs` directory from the <abbr>project</abbr>'s
[default remote](/doc/command-reference/remote/default) and places it in the
current working directory (this can be used anywhere in the file system).

> Note that this command (as well as `dvc import`) has a `--rev` option to
> download the data from a specific [commit](https://git-scm.com/docs/revisions)
> of the source <abbr>repository</abbr>.

### Import workflow

`dvc import` uses the same syntax as `dvc get`:

```dvc
$ dvc import https://github.com/example/registry \
             images/faces
```

> Note that unlike `dvc get`, which can be used from any directory, `dvc import`
> needs to run within an existing DVC project.

Besides downloading the data, importing saves the dependency from the local
project to the data source (registry repo). This is achieved by generating a
special _import `.dvc` file_, which contains this metadata, and can be committed
with Git.

As an addition to the import workflow, we can easily bring it up to date in our
consumer project(s) with `dvc update` whenever the the dataset changes in the
source repo (data registry):

```dvc
$ dvc update dataset.dvc
```

This downloads new and changed files, or removes deleted ones, from the
`images/faces` directory, based on the latest commit in the source repo. It also
updates the project dependency metadata in the import `.dvc` file.

### Using DVC data from Python code

Our [Python API](/doc/api-reference), included with the `dvc` package installed
with DVC, includes the `open` function to load/stream data directly from
external <abbr>DVC projects</abbr>:

```python
import dvc.api.open

model_path = 'model.pkl'
repo_url = 'https://github.com/example/registry'

with dvc.api.open(model_path, repo_url) as fd:
    model = pickle.load(fd)
    # ... Use the model!
```

This opens `model.pkl` as a file descriptor. The example above illustrates a
simple ML model **deployment** method.

See also the `dvc.api.read()` and `dvc.api.get_url()` functions.

## Updating registries

Datasets evolve, and DVC is prepared to handle it. Just change the data in the
registry, and apply the updates by running `dvc add` again:

```dvc
$ cp 1000/more/images/* music/songs/
$ dvc add music/songs/
```

DVC then modifies the corresponding `.dvc` file to reflect the changes in the
data, and this will be picked up by Git:

```dvc
$ git status
Changes not staged for commit:
...
	modified:   music/songs.dvc
$ git commit -am "Add 1,000 more songs to music/ dataset."
```

Iterating on this process for several datasets can give shape to a robust
registry. The result is basically a repo that versions a set of
[metafiles](/doc/user-guide/dvc-files-and-directories). Let's see an example:

```dvc
$ tree --filelimit=10
.
├── images
│   ├── .gitignore
│   ├── cats-dogs [2800 entries]  # Listed in .gitignore
│   ├── faces [10000 entries]     # Listed in .gitignore
│   ├── cats-dogs.dvc
│   └── faces.dvc
├── music
│   ├── .gitignore
│   ├── songs [11000 entries]     # Listed in .gitignore
│   └── songs.dvc
├── text
...
```

And let's not forget to `dvc push` data changes to the
[remote storage](/doc/command-reference/remote), so others can obtain them!

```
$ dvc push
```
