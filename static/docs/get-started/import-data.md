# Import Data

We've seen how to [push](/doc/get-started/store-data) and
[pull](/doc/get-started/retrieve-data) data for a <abbr>DVC project</abbr>'s
[remote](/doc/commands-reference/remote). But what if we wanted to integrate a
dataset or ML model produced in one project into another project (as an
[external dependency](/doc/user-guide/external-dependencies))?

One way is to download the data (with `wget` or `dvc get`, for example) and use
`dvc add` to track it, but the connection between projects would be lost. We
wouldn't be able to tell where the data came from or whether there are new
versions available.

A better alternative is the `dvc import` command. It downloads data from any DVC
project in a Git repository, and creates a
[DVC-file](/doc/user-guide/dvc-file-format) to track changes in the imported
data. This is better than using `dvc add` to track downloaded data, because with
_imports_ we can run `dvc update` to check for changes in the external data
source before [reproducing](/doc/get-started/reproduce) the
<abbr>pipeline</abbr> that depends on this data.

<details>

### Expand for an example

In the [Add Files](/doc/get-started/add-files) chapter we download raw data
using the `dvc get` command, and then track it with `dvc add`. Let's see how
this would be improved by, instead, just running:

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

This would download `data/data.xml` from the `dataset-registry` project, add it
to `.gitignore`, and create the `data.xml.dvc` DVC-file.

> **Note!** The
> [iterative/dataset-registry](https://github.com/iterative/dataset-registry)
> repository doesn't actually contain a `get-started/data.xml` file. Instead,
> DVC inspects
> [get-started/data.xml.dvc](https://github.com/iterative/dataset-registry/blob/master/get-started/data.xml.dvc)
> and tries to retrieve the file using the project's default remote (configured
> [here](https://github.com/iterative/dataset-registry/blob/master/.dvc/config)).

DVC-files created by `dvc import` are called _import stages_. They use the
`repo` field in the dependencies section (`deps`) in order to track source data
changes, enabling the reusability of data artifacts. For example:

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

The `url` subfield points to the source project, while `rev_lock` lets DVC know
which Git version did the data come from. Note that `dvc update` updates the
`rev_lock` value.

</details>
