---
title: 'Tutorial: Data Registry Basics'
description:
  'Get hands-on experience with building, using, and maintaining data registries
  with DVC.'
---

# Tutorial: Data Registry Basics

## Building registries

Adding datasets to a registry can be as simple as placing the data file or
directory in question inside the <abbr>workspace</abbr>, and track it with
`dvc add`. A standard Git workflow can be followed with the `.dvc` files that
substitute the actual data (e.g. `music/songs.dvc` below). This enables team
collaboration on data at the same level as with source code:

> This sample dataset actually
> [exists](http://millionsongdataset.com/pages/getting-dataset/#subset).

```cli
$ mkdir -p music/songs
$ cp ~/Downloads/millionsongsubset_full music/songs

$ dvc add music/songs/

$ git add music/songs.dvc music/.gitignore
$ git commit -m "Track 1.8 GB 10,000 song dataset in music/"
```

The actual data is stored in the project's <abbr>cache</abbr>, and can be
[pushed](/doc/command-reference/push) to one or more [remote storage] locations
so the registry can be accessed from other locations and by other people:

```cli
$ dvc remote add -d myremote s3://mybucket/dvcstore
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

To explore the contents of a DVC repository in search for the right data, use
the `dvc list` command (similar to `ls` and 3rd-party tools like `aws s3 ls`):

```cli
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

```cli
$ dvc get https://github.com/example/registry music/songs
```

This downloads `music/songs` from the <abbr>project</abbr>'s
[default remote](/doc/command-reference/remote/default) and places it in the
current working directory.

### Data import workflow

`dvc import` uses the same syntax as `dvc get`:

```cli
$ dvc import https://github.com/example/registry images/faces
```

Besides downloading the data, importing saves the information about the
dependency that the local project has on the data source (registry repo). This
is achieved by generating a special import `.dvc` file, which contains this
metadata.

Whenever the dataset changes in the registry, we can bring data up to date in
with `dvc update`:

```cli
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

with dvc.api.open(model_path, repo_url) as f:
    model = pickle.load(f)
    # ... Use the model!
```

This opens `model.pkl` as a file-like object. This example illustrates a simple
ML model **deployment** method, but it could be extended to more advanced
scenarios such as a _model zoo_.

See also the `dvc.api.read()` and `dvc.api.get_url()` functions.

## Updating registries

Datasets evolve, and DVC is prepared to handle it. Just change the data in the
registry, and apply the updates by running `dvc add` again:

```cli
$ cp 1000/more/songs/* music/songs/
$ dvc add music/songs/
```

DVC modifies the corresponding `.dvc` file to reflect the changes, and this is
picked up by Git:

```cli
$ git status
...
	modified:   music/songs.dvc
$ git commit -am "Add 1,000 more songs to music/ dataset."
```

Iterating on this process for several datasets can give shape to a robust
registry. The result is basically a repo that versions a set of
[metafiles](/doc/user-guide/project-structure). Let's see an example:

```cli
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

And let's not forget to `dvc push` data changes to the [remote storage], so
others can obtain them!

```cli
$ dvc push
```
