# Getting Started with DVC

DVC is a **data version control**, pipeline management, and experiment
management tool that brings existing engineering toolset and practices to data
science and machine learning. In this guide we will introduce the basic features
and concepts of DVC step by step.

`dvc` is a command-line tool, so open up a terminal to follow this walkthrough.

> Please [install](/doc/install) DVC first.

## Fire up DVC!

Most of our commands are meant to be used inside a <abbr>DVC project</abbr>. To
create one, move into a new or existing <abbr>workspace</abbr> and use
`dvc init`. At initialization, the `.dvc/` directory is created for DVC's
internal
[files and directories](/doc/user-guide/dvc-files-and-directories#internal-directories-and-files):

```dvc
$ dvc init --no-scm
$ ls .dvc/
config  plots/  tmp/
```

## Tracking data

Different commands and features of DVC depend on the basics of data tracking.
Let's see how DVC does this:

<details>

### 👉 Expand to create a dummy data file

DVC is most useful for very large files and directories. Let's create a
relatively big file:

```dvc
$ truncate -s 50M fivemegs.dat
```

> On Windows, try
> [`fsutil file createnew`](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/fsutil-file).

</details>

```
$ dvc add fivemegs.dat
$ ls -l
-rw-r--r-- 1 usr grp 52428800  fivemegs.dat
-rw-r--r-- 1 usr grp       70  fivemegs.dat.dvc
```

`dvc add` is one of the commands that can help you track files or directories.
It creates a tiny `.dvc` file that can be used as a placeholder for the target
data. Let's take a look at `fivemegs.dat.dvc`:

```yaml
outs:
  - md5: 25e317773f308e446cc84c503a6d1f85
    path: fivemegs.dat
```

This YAML structure contains the target's `path`, and it's file hash value
(`md5`). We call the top level `outs` because this `.dvc` file can be used to
"output" `fivemegs.dat` again if deleted, or in copies of the
<abbr>project</abbr>. The concept of <abbr>outputs</abbr> will be the basis for
tracking data throughout DVC!

## The cache

But how is tracked data stored in DVC projects? ...

# WIP: remaining ideas/topics

---

idea: data can be tracked in different ways [versioning]

- version it (with Git)

---

dump large random data file

dvc add file

- mention dirs

explore .dvc file (and cache) - encourage user to edit it? edit it + dvc commit?

related: move, remove +import(-url)?

---

run?
