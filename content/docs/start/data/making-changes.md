## Making changes

When you make a change to a file or directory, run `dvc add` again to track the
latest version:

<details>

### ⚙️ Expand to make some changes.

Let's say we obtained more data from some external source. We can pretend this
is the case by doubling the dataset:

<toggle>
<tab title="Mac/Linux">

```dvc
$ cp data/data.xml /tmp/data.xml
$ cat /tmp/data.xml >> data/data.xml
```

</tab>
<tab title="Windows (Cmd)">

```dvc
$ copy data\data.xml %TEMP%\data.xml
$ type %TEMP%\data.xml >> data\data.xml
```

</tab>
</toggle>

</details>

```dvc
$ dvc add data/data.xml
```

Usually you would also run `git commit` and `dvc push` to save the changes:

```dvc
$ git commit data/data.xml.dvc -m "Dataset updates"
$ dvc push
```
