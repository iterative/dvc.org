---
title: 'Get Started: Tracking Changes'
description:
  'Track changes to your data and navigate historical changes using Git.'
---

# Get Started: Tracking Changes

## Making local changes

Let's say we obtained more data from some external source. We will simulate this
by doubling the dataset contents:

<toggle>
<tab title="Mac/Linux">

```cli
$ cp data/data.xml /tmp/data.xml
$ cat /tmp/data.xml >> data/data.xml
```

</tab>
<tab title="Windows (Cmd)">

```cli
$ copy data\data.xml %TEMP%\data.xml
$ type %TEMP%\data.xml >> data\data.xml
```

</tab>
</toggle>

After modifying the data, run `dvc add` again to track the latest version:

```cli
$ dvc add data/data.xml
```

Now we can run `dvc push` to upload the changes to the remote storage, followed
by a `git commit` to track them:

```cli
$ dvc push
$ git commit data/data.xml.dvc -m "Dataset updates"
```

## Switching between versions

A common workflow is using `git checkout` to switch to a branch or checkout a
specific `.dvc` file revision, followed by a `dvc checkout` to sync data into
your <abbr>workspace</abbr>:

```cli
$ git checkout <...>
$ dvc checkout
```

## Returning to a specific version

Let's go back to the original version of our data file, by simple use of Git:

```cli
$ git checkout HEAD~1 data/data.xml.dvc
$ dvc checkout
```

Let's commit it (no need to do `dvc push` this time since this original version
of the dataset was already saved):

```cli
$ git commit data/data.xml.dvc -m "Revert dataset updates"
```

<admon type="info">

As you can see, DVC is technically not a version control system by itself! It
manipulates `.dvc` files, whose contents define the data file versions. Git is
already used to version your code, and now it can also version your data
alongside it.

</admon>
