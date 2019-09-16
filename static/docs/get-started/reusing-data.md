# Reusing Data

We've explained how to [upload](/doc/get-started/share-data) and
[download](/doc/get-started/retrieve-data) <abbr>data artifacts</abbr> (with
`dvc pull` and `dvc push`) as a way to share them on remote storage. This is
great for several people to work on the same <abbr>DVC project</abbr> (on
different machines). But what if we wanted to reuse a dataset from a project in
a different one?

That's why we created `dvc import`! This commands can download data from any DVC
project hosted on a Git repository. It also tracks the imported data by creating
an import stage ([DVC-file](/doc/user-guide/dvc-file-format)).

If you remember the [Add Files](/doc/get-started/add-files) chapter where we
download the raw data for this example project, the `dvc get` command is used
(which unlike `dvc import` does not track the downloaded artifact). Let's say we
wanted to download and track the data with a single command:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
           get-started/data.xml -o data/data.xml
```

> This command is only shown for informational purposes. No need to actually run
> it in order to continue with this guide, as `data.xml` is already in the
> `data/` directory and has already been processed at this point.

This would download `data.xml`, add it to `.gitignore`, and creates the
`data.xml.dvc` [import stage](/doc/commands-reference/import) in the root
directory.

<details>

### Expand to learn about how importing works

Note that the
[iterative/dataset-registry](https://github.com/iterative/dataset-registry)
project doesn't actually store a `get-started/data.xml` file. Instead, DVC
inspects
[get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
and tries to retrieve the file using the external project's default remote
(configured
[here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

</details>

This is similar to manually downloading the data and using `dvc add` to track it
with DVC. With an import stage however, we can run `dvc update` to check for
updates in the external data source before
[reproducing](/doc/get-started/reproduce) the <abbr>pipeline</abbr> that depends
on the import.

> `dvc get` can also download a file from an external DVC project, as shown in
> the [Add Files](/doc/get-started/add-files) chapter. But it does not track the
> downloaded data. In fact this command can be used outside of a DVC project.
