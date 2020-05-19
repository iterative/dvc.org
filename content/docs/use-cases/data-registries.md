# Data Registries

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning),
with commands such as `dvc add`. With the aim to enable reusability of these
<abbr>data artifacts</abbr> between different projects, DVC also provides the
`dvc import` and `dvc get` commands, among others. This means that a project can
depend on data from an external DVC repository, **similar to package management
systems, but for data science projects**.

![](/img/data-registry.png) _Data and models as code_

Keeping this in mind, we could build a <abbr>DVC project</abbr> dedicated to
tracking and versioning _datasets_ (or any large data, even ML models). This way
we would have a repository with all the metadata and history of changes of
different datasets. We could see who updated what, and when, and use pull
requests to update data (the same way we do with code). This is what we call a
**data registry**, which can work as data management _middleware_ between ML
projects and cloud storage.

> Note that a single dedicated repository is just one possible pattern to create
> data registries with DVC.

Advantages of using a DVC **data registry**:

- Reusability: Reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  systems like `pip`).
- Persistence: The DVC registry-controlled
  [remote storage](/doc/command-reference/remote) (e.g. an S3 bucket) improves
  data security. There are less chances someone can delete or rewrite a model,
  for example.
- Storage Optimization: Track data
  [shared](/doc/use-cases/sharing-data-and-model-files) by multiple projects
  centralized in a single location (with the ability to create distributed
  copies on other remotes). This simplifies data management and optimizes space
  requirements.
- Security: Registries can be setup to have read-only remote storage (e.g. an
  HTTP location). Git versioning of [DVC-files](/doc/user-guide/dvc-file-format)
  allows us to track and audit data changes.
- Data as code: Leverage Git workflow such as commits, branching, pull requests,
  reviews, and even CI/CD for your data and models lifecycle. Think Git for
  cloud storage, but without ad-hoc conventions.

## Building registries

Data registries can be created like any other <abbr>DVC repository</abbr> with
`git init` and `dvc init`. A good way to organize them is with different
directories, to group the data into separate uses, such as `images/`,
`natural-language/`, etc. For example, our
[dataset-registry](https://github.com/iterative/dataset-registry) uses a
directory for each part in our docs, like `get-started/`, `use-cases/`, etc.

Adding datasets to a registry can be as simple as placing the data file or
directory in question inside the <abbr>workspace</abbr>, and telling DVC to
track it, with `dvc add`. For example:

```dvc
$ mkdir -p music/songs
$ cp ~/Downloads/millionsongsubset_full music/songs
$ dvc add music/songs
```

> This example dataset actually exists. See
> [MillionSongSubset](http://millionsongdataset.com/pages/getting-dataset/#subset).

A regular Git workflow can be followed with the tiny
[DVC-files](/doc/user-guide/dvc-file-format) that substitute the actual data
(`music/songs.dvc` in this example). This enables team collaboration on data at
the same level as with source code (commit history, branching, pull requests,
reviews, etc.):

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

The main methods to consume <abbr>data artifacts</abbr> from a **data registry**
are the `dvc import` and `dvc get` commands, as well as the `dvc.api` Python
API.

But first, you may want to explore the contents of a data DVC repo.

### Listing data (list)

You may want to explore the contents of a data DVC repo before trying to reuse
its artifacts. The `dvc list` command is analogous to `ls`, or 3rd party tools
like `aws s3 ls`:

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

> Note that both Git-tracked files and DVC-tracked data/models are listed.

### Simple download (get)

This is analogous to using direct download tools like
[`wget`](https://www.gnu.org/software/wget/) (HTTP),
[`aws s3 cp`](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html) (S3),
etc. To get a dataset for example, we can run something like:

```dvc
$ dvc get https://github.com/example/registry \
          music/songs/
```

This downloads `music/songs/` from the <abbr>project</abbr>'s
[default remote](/doc/command-reference/remote/default) and places it in the
current working directory (anywhere in the file system with user write access).

> Note that this command (as well as `dvc import`) has a `--rev` option to
> download the data from a specific [commit](https://git-scm.com/docs/revisions)
> of the source <abbr>repository</abbr>.

### Import workflow

`dvc import` uses the same syntax as `dvc get`:

```dvc
$ dvc import https://github.com/example/registry \
             images/faces/
```

> Note that unlike `dvc get`, which can be used from any directory, `dvc import`
> needs to run within an [initialized](/doc/command-reference/init) DVC project.

Besides downloading, importing saves the dependency from the local project to
the data source (registry repo). This is achieved by creating a particular kind
of [DVC-file](/doc/user-guide/dvc-file-format) (a.k.a. _import stage_). This
file can be used staged and committed with Git.

As an addition to the import workflow, and enabled the saved dependency, we can
easily bring it up to date in our consumer project(s) with `dvc update` whenever
the the dataset changes in the source repo (data registry):

```dvc
$ dvc update dataset.dvc
```

`dvc update` downloads new and changed files, or removes deleted ones, from
`images/faces/`, based on the latest commit in the source repo. It also updates
the project dependency metadata in the import stage (DVC-file).

### Programmatic reusability of DVC data

Our Python API (`dvc.api`), included with the `dvc` package installed with DVC,
includes the `open` function to load/stream data directly from external
<abbr>DVC projects</abbr>:

```python
import dvc.api.open

model_path = 'model.pkl'
repo_url = 'https://github.com/example/registry'

with dvc.api.open(model_path, repo_url) as fd:
    model = pickle.load(fd)
    # ... Use the model!
```

This opens `model.pkl` as a file descriptor. The example above tries to
illustrate a hardcoded ML model **deployment** method.

> Notice that the `dvc.api.get_url()` and `dvc.api.read()` functions are also
> available.

## Updating registries

Datasets evolve, and DVC is prepared to handle it. Just change the data in the
registry, and apply the updates by running `dvc add` again:

```dvc
$ cp /path/to/1000/image/dir music/songs
$ dvc add music/songs
```

DVC then modifies the corresponding DVC-file to reflect the changes in the data,
and this will be picked up by Git:

```dvc
$ git status
Changes not staged for commit:
...
	modified:   music/songs.dvc
$ git commit -am "Add 1,000 more songs to music/ dataset."
```

Iterating on this process for several datasets can give shape to a robust
registry. The result is basically a repo that versions a set of DVC-files. Let's
see an example:

```dvc
$ tree --filelimit=100
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
