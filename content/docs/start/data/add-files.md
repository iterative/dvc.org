## Add files to DVC

To start tracking a file or directory, use `dvc add`. For example:

```dvc
$ dvc add data/data.xml
```

DVC stores information about the added file in a special `.dvc` file named
`data/data.xml.dvc` -- a small text file with a human-readable [format]. This
metadata file is a placeholder for the original data, and can be easily
versioned like source code with Git:

```dvc
$ git add data/data.xml.dvc data/.gitignore
$ git commit -m "Add raw data"
```

The data, meanwhile, is listed in `.gitignore`.

<details id="add-expand-to-see-what-happens-under-the-hood">

### 💡 Expand to see what happens under the hood.

`dvc add` moved the data to the project's <abbr>cache</abbr>, and
<abbr>linked</abbr> it back to the <abbr>workspace</abbr>. The `.dvc/cache`
should look like this:

```
.dvc/cache
└── a3
    └── 04afb96060aad90176268345e10355
```

The hash value of the `data.xml` file we just added (`a304afb...`) determines
the cache path shown above. And if you check `data/data.xml.dvc`, you will find
it there too:

```yaml
outs:
  - md5: a304afb96060aad90176268345e10355
    path: data.xml
```

</details>

[format]: /doc/user-guide/project-structure/dvc-files
