# Reusing Data Artifacts

Once <abbr>data artifacts</abbr> have been
[uploaded](/doc/get-started/share-data) to remote storage in a <abbr>DVC
project</abbr>, special commands provide a way to retrieve that data without
having to [download](/doc/get-started/retrieve-data) that entire project first.
`dvc get` is one of such commands for example, as shown in the
[Add Files](/doc/get-started/add-files) chapter.

`dvc import` not only downloads data artifacts, but tracks the import as well by
creating an import stage [DVC-file](/doc/user-guide/dvc-file-format). This is
equivalent to using `dvc get` + `dvc add`. With import stages however, we can
run `dvc update` to checks for updates in the external data source before
[reproducing](/doc/get-started/reproduce) the <abbr>pipeline</abbr> that depends
on the import.

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
           get-started/data.xml
```

Note that the
[iterative/dataset-registry](https://github.com/iterative/dataset-registry) repo
doesn't actually store a `get-started/data.xml` file. Instead, DVC inspects
[get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
and tries to retrieve the file using the external project's default remote
(configured
[here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

As mentioned earlier, `dvc update` allows us to check weather the imported data
source has changed, and update it locally if so, without having to reproduce the
pipeline.
