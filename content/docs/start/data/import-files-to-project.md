## Import file or directory

`dvc import` also downloads any file or directory, while also creating a `.dvc`
file (which can be saved in the project):

```dvc
$ dvc import https://github.com/iterative/dataset-registry \
             get-started/data.xml -o data/data.xml
```

This is similar to `dvc get` + `dvc add`, but the resulting `.dvc` files
includes metadata to track changes in the source repository. This allows you to
bring in changes from the data source later using `dvc update`.

<details>

#### 💡 Expand to see what happens under the hood.

> Note that the
> [dataset registry](https://github.com/iterative/dataset-registry) repository
> doesn't actually contain a `get-started/data.xml` file. Like `dvc get`,
> `dvc import` downloads from [remote storage](/doc/command-reference/remote).

`.dvc` files created by `dvc import` have special fields, such as the data
source `repo` and `path` (under `deps`):

```git
+deps:
+- path: get-started/data.xml
+  repo:
+    url: https://github.com/iterative/dataset-registry
+    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
 outs:
 - md5: a304afb96060aad90176268345e10355
   path: data.xml
```

The `url` and `rev_lock` subfields under `repo` are used to save the origin and
[version](https://git-scm.com/docs/revisions) of the dependency, respectively.

</details>
