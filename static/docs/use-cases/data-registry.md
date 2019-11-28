# Data Registry

One of the main uses of <abbr>DVC repositories</abbr> is the
[versioning of data and model files](/doc/use-cases/data-and-model-files-versioning),
with commands such as `dvc add`. With the aim to enable reusability of these
<abbr>data artifacts</abbr> between different projects, DVC also provides the
`dvc get`, `dvc import`, and `dvc update` commands. This means that a project
can depend on data from an external <abbr>DVC project</abbr>, **similar to
package management systems, but for data**.

<!-- TODO: Insert diagram image here. -->

Keeping this in mind, we could build a <abbr>DVC project</abbr> dedicated to
tracking and versioning _datasets_ (or any large data). This way we would have a
repository with all the metadata and history of changes of different datasets.
We could see who updated what, and when, and use pull requests to update data
(the same way we do with code). This is what we call a **data registry**, which
can work as data management _middleware_ between ML projects and cloud storage.

Advantages of using a DVC **data registry** project:

- Data as code: Improve _lifecycle management_ with versioning of simple
  directory structures (like Git on cloud storage), without ad-hoc conventions.
  Leverage Git and Git hosting features such as commits, branching, pull
  requests, reviews, and even continuous deployment of ML models.
- Reusability: Reproduce and organize _feature stores_ with a simple CLI
  (`dvc get` and `dvc import` commands, similar to software package management
  systems like `pip`).
- Persistence: The DVC registry-controlled
  [remote storage](/doc/command-reference/remote) (e.g. an S3 bucket) improves
  data security. There are less chances someone can delete or rewrite a model,
  for example.
- Storage Optimization: Track data
  [shared](/doc/use-cases/share-data-and-model-files) by multiple projects
  centralized in a single location (with the ability to create distributed
  copies on other remotes). This simplifies data management and optimizes space
  requirements.
- Security: Registries can be setup to have read-only remote storage (e.g. an
  HTTP location). Git versioning of [DVC-files](/doc/user-guide/dvc-file-format)
  allows us to track and audit data changes.

## Building data registries

Data registries can be created locally like any other <abbr>DVC
repositories</abbr> with `git init` and `dvc init`, and pushed to a Git server
for sharing with others. A good way to organize them is with different
directories, to group the data into separate uses, such as `images/`,
`natural-language/`, etc. For example, our
[dataset-registry](https://github.com/iterative/dataset-registry) uses a
directory for each of our website documentation sections, like `get-started/`,
`use-cases/`, etc.

> We use **dataset-registry** for all of our docs, where needed, for example in
> the [Versioning tutorial](/doc/tutorials/versioning),
> [in Get Started](/doc/get-started/add-files), and some Command Reference
> examples.

Adding datasets to a registry can be as simple as placing the data file or
directory in question inside the <abbr>workspace</abbr>, and telling DVC to
track it, with `dvc add`. For example:

```dvc
$ mkdir -p music/Beatles
$ cp ~/Downloads/millionsongsubset_full music/songs
$ dvc add music/songs
100% Add                                       1/1 [00:03<00:00,  3.58s/file]
...
$ git add music/songs.dvc music/.gitignore
$ git commit -m "Track 1.8 GB 10,000 song dataset."
```

> This example dataset actually exists. See
> [MillionSongSubset](http://millionsongdataset.com/pages/getting-dataset/#subset).

As shown above, a regular Git workflow can be followed with the tiny
[DVC-files](/doc/user-guide/dvc-file-format) that substitute the actual data
(`music/songs.dvc` in the example). This enables team collaboration on data at
the same level as with source code (commit history, branching, pull requests,
reviews, etc.)

Datasets evolve, and DVC is prepared to handle it. Just add/remove or change the
contents of the data registry, and apply updates by running `dvc add` again.
This can be iterated as many times as necessary. Example:

```dvc
$ cp /path/to/1000/image/dir music/songs
$ dvc add music/songs
...
$ git status
Changes not staged for commit:
...
	modified:   music/songs.dvc
$ git commit -am "Add 1000 more songs."
```

Repeating this process for several datasets will give shape to a robust
registry, which are basically repositories that mainly version a bunch of
DVC-files, as you can see in the hypotetical example below.

> The actual data will be [pushed](/doc/command-reference/push) to one or more
> [remote storage](/doc/command-reference/remote) locations that need to be
> configured separately in the <abbr>project</abbr>.

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

## Using a data registry

...
