# Merge Conflicts

Sometimes multiple members of a team might want to edit the same file/directory
that is tracked by DVC. And when the time comes to merge their changes together
one will run into a merge conflict.

## dvc.yaml

This one is no different from your regular merge conflicts in code.

```yaml
stages:
  prepare:
    cmd: python src/prepare.py data/data.xml
    deps:
<<<<<<< HEAD
    - data/big.xml
=======
    - data/small.xml
>>>>>>> branch
    - src/prepare.py
    params:
    - prepare.seed
    - prepare.split
    outs:
    - data/prepared
```

See https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging for
more details.

## dvc.lock

You can safely delete this file and then just run `dvc repro` after the merge is
done.

## \*.dvc

There are three three types of such files that differ by the command that has
created them.

### dvc add

In this case you'll get something that looks like

```yaml
outs:
<<<<<<< HEAD
- md5: a304afb96060aad90176268345e10355
=======
- md5: 35dd1fda9cfb4b645ae431f4621fa324
>>>>>>> branch
  path: data.xml
```

If you decide to just pick one of the versions, you could just leave the md5 for
the desired version and delete the second one:

```yaml
outs:
  - md5: 35dd1fda9cfb4b645ae431f4621fa324
    path: data.xml
```

or you could use `-x theirs` or `-x ours` option for `git merge`.

But if you want to something more complex like merging the two files/directories
together, then you'll need to run `dvc checkout data.xml` on both `HEAD` and
`branch`, copy the data into separate locations (e.g. `data.xml.head` and
`data.xml.branch`), then merge them by-hand and run `dvc add data.xml` for the
resulting merged file/directory.

#### Append-only directories

If you have an "append-only" dataset, where people only add new
files/directories to, DVC provides a so-called
[merge-driver](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt-mergeltdrivergtname)
that can automatically resolve merge conflicts for you. To set it up, first add
it to your git config with:

```dvc
git config merge.dvc.name "DVC merge driver"
git config merge.dvc.driver "dvc git-hook merge-driver --ancestor %O --our %A --their %B"
```

and then add this line to your `.gitattributes` (in the root of your git repo):

```
mydataset.dvc merge=dvc
```

now, when a merge conflict occures, dvc will simply combine data from both
branches.

### dvc import

Simply remove the hashes

```yaml
<<<<<<< HEAD
md5: 263395583f35403c8e0b1b94b30bea32
=======
md5: 520d2602f440d13372435d91d3bfa176
>>>>>>> branch
frozen: true
deps:
- path: get-started/data.xml
  repo:
    url: https://github.com/iterative/dataset-registry
<<<<<<< HEAD
    rev_lock: f31f5c4cdae787b4bdeb97a717687d44667d9e62
=======
    rev_lock: 06be1104741f8a7c65449322a1fcc8c5f1070a1e
>>>>>>> branch
outs:
<<<<<<< HEAD
- md5: a304afb96060aad90176268345e10355
=======
- md5: 35dd1fda9cfb4b645ae431f4621fa324
>>>>>>>
  path: data.xml
```

so you get

```yaml
frozen: true
deps:
  - path: get-started/data.xml
    repo:
      url: https://github.com/iterative/dataset-registry
outs:
  - path: data.xml
```

and then run `dvc repro`.

### dvc import-url

Simply remove the hashes

```yaml
<<<<<<< HEAD
md5: 263395583f35403c8e0b1b94b30bea32
=======
md5: 520d2602f440d13372435d91d3bfa176
>>>>>>> branch
deps:
<<<<<<< HEAD
- etag: 696df35ad1161afbeb6ea667e5dd5dab-2861
=======
- etag: 266336746d8a06be1124153ff2156236-132
>>>>>>> branch
  path: s3://bucket/data.xml
outs:
<<<<<<< HEAD
- md5: a304afb96060aad90176268345e10355
=======
- md5: 35dd1fda9cfb4b645ae431f4621fa324
>>>>>>>
  path: data.xml
```

so you get

```yaml
deps:
  - path: s3://bucket/data.xml
outs:
  - path: data.xml
```

and then run `dvc repro`.
