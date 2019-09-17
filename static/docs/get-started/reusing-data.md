# Reusing Data

We've explained how to [upload](/doc/get-started/share-data) and
[download](/doc/get-started/retrieve-data) <abbr>data artifacts</abbr> (with
`dvc pull` and `dvc push`) as a way to share them on remote storage. This is
great for several people to work on the same <abbr>DVC project</abbr> (on
different machines). But what if we wanted to reuse a dataset from a project in
a different one?

That's why we created `dvc import`! This commands can download data from any DVC
project hosted on a Git repository. It also records the connection between this
and the external project by creating an import stage
([DVC-file](/doc/user-guide/dvc-file-format)). To track the imported data, one
can then add and commit the DVC-file with Git.

If you remember the [Add Files](/doc/get-started/add-files) chapter where we
download the raw data for this example project, the `dvc get` command is used –
which unlike `dvc import` does not require a local DVC project nor creates an
import stage. Let's say we wanted to download the data while keeping the
connection between DVC projects:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
           get-started/data.xml -o data/data.xml
...
Saving information to 'data.xml.dvc'.

To track the changes with git, run:

	git add data.xml.dvc
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with this guide, as `data.xml` is already in the
> `data/` directory and has already been processed at this point.

This would download `data.xml`, add it to `.gitignore`, and creates the
`data.xml.dvc` [import stage](/doc/commands-reference/import) in the root
directory.

<details>

### Expand to learn more details about importing

Note that the
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)
project doesn't actually store a `get-started/data.xml` file. Instead, DVC
inspects
[get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
and tries to retrieve the file using the external project's default remote
(configured
[here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

In order to record the connection between the local project and the source
project, the DVC-file (import stage) created by `dvc import` includes the `repo`
field in its dependencies (`deps`) section. For example:

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

The `url` subfield records the source project, while `rev_lock` lets us know
which Git version did this data come from. Note that the import can be brought
to date with `dvc update`, which also updates the `rev_lock` value.

</details>

This is similar to manually downloading the data and using `dvc add` to track it
with DVC. With an import stage however, we can run `dvc update` to check for
updates in the external data source before
[reproducing](/doc/get-started/reproduce) the <abbr>pipeline</abbr> that depends
on the import.
