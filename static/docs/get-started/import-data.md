# Import Data

We've seen how to [retrieve](/doc/get-started/retrieve-data) data
[stored](/doc/get-started/store-data) for a single <abbr>DVC project</abbr>.
`dvc import` also lets us download <abbr>data artifacts</abbr>, but from a
different project that is hosted on a Git repository, and creates an import
stage (DVC-file) to track changes in this
[external dependency](/doc/user-guide/external-dependencies).

For example, in the [Add Files](/doc/get-started/add-files) chapter we download
raw data using the `dvc get` command – which unlike `dvc import` does not create
an import stage. Let's say we wanted to download the same dataset, while keeping
the connection to its source project:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with this guide.

<details>

### Expand to learn more details about importing

If successful, the command above would download `data/data.xml`, add it to
`.gitignore`, and create the `data.xml.dvc` import stage.

Note that the
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)
project doesn't actually store a `get-started/data.xml` file. Instead, DVC
inspects
[get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
and tries to retrieve the file using the external project's default remote
(configured
[here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

In order to track changes of the dataset in its source project, the DVC-file
(import stage) created by `dvc import` uses the `repo` field in the dependencies
(`deps`) section. For example:

```yaml
md5: 31b266a32dc67a0f3af693b3b87d4194
locked: true
deps:
  - path: get-started/data.xml
    repo:
      url: https://github.com/iterative/dataset-registry
      rev_lock: 7476a858f6200864b5755863c729bff41d0fb045
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data/data.xml
    cache: true
    metric: false
    persist: false
```

The `url` subfield points to the source project, while `rev_lock` lets us know
which Git version did this data come from. Note that the import can be brought
to date with `dvc update`, which also updates the `rev_lock` value.

</details>

This is better than manually downloading the data and using `dvc add` to track
it with DVC, because having an import stage we can run `dvc update` to check for
changes in the external data source before
[reproducing](/doc/get-started/reproduce) the <abbr>pipeline</abbr> that depends
on this import.
