## Switching between versions

The regular workflow is to use `git checkout` first (to switch a branch or
checkout a `.dvc` file version) and then run `dvc checkout` to sync data:

```dvc
$ git checkout <...>
$ dvc checkout
```

<details>

### ⚙️ Expand to get the previous version of the dataset.

Let's go back to the original version of the data:

```dvc
$ git checkout HEAD~1 data/data.xml.dvc
$ dvc checkout
```

Let's commit it (no need to do `dvc push` this time since this original version
of the dataset was already saved):

```dvc
$ git commit data/data.xml.dvc -m "Revert dataset updates"
```

</details>

Yes, DVC is technically not even a version control system! `.dvc` file contents
define data file versions. Git itself provides the version control. DVC in turn
creates these `.dvc` files, updates them, and synchronizes DVC-tracked data in
the <abbr>workspace</abbr> efficiently to match them.
