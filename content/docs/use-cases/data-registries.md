# Data Registries

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning).
DVC also enables cross-project [reusability](/doc/start/data-access) of these
<abbr>data artifacts</abbr>. This means that your projects can depend on data
from other DVC repositories — like a **package management system for data
science**.

![](/img/data-registry.png) _Data management middleware_

We can build a <abbr>DVC project</abbr> dedicated to versioning _datasets_ (or
data features, ML models, etc.). The repository would have all the metadata and
change history for the data it tracks. We could see who changed what and when,
and use pull requests to update data like we do with code. This is what we call
a **data registry** — data management _middleware_ between ML projects and cloud
storage.

Advantages of data registries:

- **Reusability**: reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  systems like `pip`).
- **Persistence**: [remote storage](/doc/command-reference/remote) (e.g. an S3
  bucket) controlled by the DVC registry improves data security. There are less
  chances someone can delete or rewrite an ML model, for example.
- **Storage optimization**: centralize data
  [shared](/doc/use-cases/sharing-data-and-model-files) by multiple projects in
  a single location (distributed copies are possible too). This simplifies data
  management and optimizes space requirements.
- **Data as code**: leverage Git workflows such as commits, branching, pull
  requests, reviews, and even CI/CD for your data and models lifecycle. Think
  "Git for cloud storage", but without ad-hoc conventions.
- **Security**: registries can be setup with read-only remote storage (e.g. an
  HTTP server).

## Building registries

Adding datasets to a registry can be as simple as placing the data file or
directory in question inside the <abbr>workspace</abbr>, and track it with
`dvc add`. A regular Git workflow can be followed with the `.dvc` files that
substitute the actual data (e.g. `music/songs.dvc` below). This enables team
collaboration on data at the same level as with source code:

> This sample dataset actually
> [exists](http://millionsongdataset.com/pages/getting-dataset/#subset).

```dvc
$ mkdir -p music/songs
$ cp ~/Downloads/millionsongsubset_full music/songs

$ dvc add music/songs/

$ git add music/songs.dvc music/.gitignore
$ git commit -m "Track 1.8 GB 10,000 song dataset in music/"
```

The actual data is stored in the project's <abbr>cache</abbr>, and can be
[pushed](/doc/command-reference/push) to one or more
[remote storage](/doc/command-reference/remote) locations so the registry can be
accessed from other locations and by other people:

```dvc
$ dvc remote add -d myremote s3://my-bucket/dvc-storage
$ dvc push
```

> 💡 A good way to organize <abbr>DVC repositories</abbr> into data registries
> is to use directories to group similar data, e.g. `images/`,
> `natural-language/`, etc. For example, our
> [dataset registry](https://github.com/iterative/dataset-registry) has
> directories like `get-started/` and `use-cases/`, matching parts of this
> website.

## Using registries

The main methods to consume <abbr>artifacts</abbr> from a **data registry** are
the `dvc import` and `dvc get` commands, as well as the Python API `dvc.api`.
But first, we may want to explore its contents.

### Listing data

To explore the contents of a data DVC repo in search for the right data, use the
`dvc list` command (similar to `ls` and 3rd-party tools like `aws s3 ls`):

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

Both Git-tracked files and DVC-tracked data (or models, etc.) are listed.

### Data downloads

`dvc get` is analogous to using direct download tools like `wget` (HTTP),
`aws s3 cp` (S3), etc. To get a dataset from a DVC repo, we can run something
like this:

```dvc
$ dvc get https://github.com/example/registry music/songs
```

This downloads `music/songs` from the <abbr>project</abbr>'s
[default remote](/doc/command-reference/remote/default) and places it in the
current working directory.

### Data import workflow

`dvc import` uses the same syntax as `dvc get`:

```dvc
$ dvc import https://github.com/example/registry images/faces
```

Besides downloading the data, importing saves the information about the
dependency from the local project to the data source (registry repo). This is
achieved by generating a special import `.dvc` file, which contains this
metadata.

Whenever the dataset changes in the registry, we can bring data up to date in
with `dvc update`:

```dvc
$ dvc update faces.dvc
```

This downloads new and changed files, and removes deleted ones, based on the
latest commit in the source repo; And it updates the `.dvc` file accordingly.

> Note that `dvc get`, `dvc import`, and `dvc update` have a `--rev` option to
> download data from a specific [commit](https://git-scm.com/docs/revisions) of
> the source <abbr>repository</abbr>.

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

This opens `model.pkl` as a file descriptor. This example illustrates a simple
ML model **deployment** method, but it could be extended to more advances
scenarios such as a _model zoo_.

See also the `dvc.api.read()` and `dvc.api.get_url()` functions.

## Updating registries

Datasets evolve, and DVC is prepared to handle it. Just change the data in the
registry, and apply the updates by running `dvc add` again:

```dvc
$ cp 1000/more/images/* music/songs/
$ dvc add music/songs/
```

DVC modifies the corresponding `.dvc` file to reflect the changes, and this is
picked up by Git:

```dvc
$ git status
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

```dvc
$ dvc push
```
