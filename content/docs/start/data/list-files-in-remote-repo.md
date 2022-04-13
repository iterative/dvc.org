## Find a file or directory

You can use `dvc list` to explore a <abbr>DVC repository</abbr> hosted on any
Git server. For example, let's see what's in the `get-started/` directory of our
[dataset-registry](https://github.com/iterative/dataset-registry) repo:

```dvc
$ dvc list https://github.com/iterative/dataset-registry get-started
.gitignore
data.xml
data.xml.dvc
```

The benefit of this command over browsing a Git hosting website is that the list
includes files and directories tracked by both Git and DVC (`data.xml` is not
visible if you
[check GitHub](https://github.com/iterative/dataset-registry/tree/master/get-started)).
