---
title: June '20 Community Gems
date: 2020-06-29
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  migrating to DVC 1.0, the new pipeline format, and our Python API.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  migrating to DVC 1.0, the new pipeline format, and our Python API.
picture: 2020-06-29/Gems_June_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/june-20-community-gems/426
tags:
  - Discord
  - Gems
  - MinIO
  - Pipeline
  - Python API
  - Optimization
---

## Highlights from Discord

Here are some Q&A's from our Discord channel that we think are worth sharing.

### Q: I just upgraded to DVC 1.0. I've got some pipeline stages currently saved as `.dvc` files. [Is there an easy way to convert the old `.dvc` format to the new `dvc.yaml` standard?](https://discord.com/channels/485586884165107732/563406153334128681/725019219930120232)

Yes! You can easily transfer the stages by hand: `dvc.yaml` is designed for
manual edits in any text editor, so you can type your old stages in and then
delete the old `.dvc` files. We also have a
[migration script](https://gist.github.com/skshetry/07a3e26e6b06783e1ad7a4b6db6479da)
available, although we can't provide long-term support for it.

Learn more about the `dvc.yaml` format in our
[brand new docs](https://dvc.org/doc/user-guide/dvc-files-and-directories#dvcyaml-file)!

https://media.giphy.com/media/JYpTAnhT0EI2Q/giphy.gif

_Just like this but with technical documentation._

### Q: After I pushed my local data to remote storage, I noticed the file names are different in my storage repository- they're hash values. [Can I make them more meaningful names?](https://discord.com/channels/485586884165107732/563406153334128681/717737163122540585)

No, but for a good reason! What you're seeing are cached files, and they're
stored with a special naming convention that makes DVC versioning and addressing
possible- these file names are how DVC deduplicates data (to avoid keeping
multiple copies of the same file version) and ensures that each unique version
of a file is immutable. If you manually overwrote those filenames you would risk
breaking Git version control. You can
[read more about how DVC uses this file format in our docs](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).

It sounds like you're looking for ways to interact with DVC-tracked objects at a
high level of abstraction, meaning that you want to interface with the original
filenames and not the machine-generated hashes used by DVC. There are a few
secure and recommended ways to do this:

- If you want to see a human-readable list of files that are currently tracked
  by DVC, try the `dvc list`
  command-[read up on it here](https://dvc.org/doc/command-reference/list).
- Check out our
  [data registry tutorial](https://dvc.org/doc/use-cases/data-registries#data-registries)
  to see how the commands `dvc get` and `dvc import` are used to download and
  share DVC-tracked artifacts. The syntax is built for an experience like using
  a package manager.
- The [DVC Python API](https://dvc.org/doc/api-reference) gives you programmatic
  access to DVC-tracked artifacts, using human-readable filenames.

### Q: [Is it better practice to `dvc add` data files individually, or to add a directory containing multiple data files?](https://discord.com/channels/485586884165107732/563406153334128681/722141190312689675)

If the directory you're adding is logically one unit (for example, it is the
whole dataset in your project), we recommend using `dvc add` at the directory
level. Otherwise, add files one-by-one. You can
[read more about how DVC versions directories in our docs](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).

### Q: [Do you have any examples of using DVC with MinIO?](https://discord.com/channels/485586884165107732/563406153334128681/722780202844815362)

We don't have any tutorials for this use case exactly, but it's a very
straightforward modification from
[our basic use cases](https://dvc.org/doc/use-cases). The key difference when
using MinIO or a similar S3-compatible storage (like DigitalOcean Spaces or IBM
Cloud Object Storage) is that in addition to setting remote data storage, you
must set the `endpointurl` too. For example:

```dvc
$ dvc remote add -d myremote s3://mybucket/path/to/dir
$ dvc remote modify myremote endpointurl https://object-storage.example.com
```

Read up on configuring supported storage
[in our docs](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).

### Q: [If I have a folder containing many data files, is there any advantage to zipping the folder and DVC tracking the `.zip`?](https://discord.com/channels/485586884165107732/563406153334128681/714922184455225445)

There are a few things to consider:

- **CPU time.** Even though it can be faster to pull a single file than a
  directory (though not in all cases, since we can parallelize directory
  downloads), the tradeoff is the time needed to unzip your data. Depending on
  your constraints, this can be expensive and undesirable.

- **Deduplication.** DVC deduplicates on the file level. So if you add one
  single file to a directory, DVC will save only that file, not the whole
  dataset again. If you use a zipped directory you won't get this benefit. In
  the long run, this could be more expensive in terms of storage space for your
  DVC cache and remote if the contents of your dataset change frequently.

Generally, we would recommend first trying a plain unzipped directory. DVC is
designed to work with large numbers of files (on the order of millions) and has
the latest release (DVC 1.0) has
[optimizations built for this purpose exactly](https://dvc.org/blog/dvc-1-0-release#data-transfer-optimizations).

### [Q: Can I execute a `dvc push` with the DVC Python API inside a Python script?](https://discord.com/channels/485586884165107732/485596304961962003/718419219288686664)

Currently, our [Python API](https://dvc.org/doc/api-reference#python-api)
doesn't support commands like `dvc push`,`dvc pull`, or `dvc status`. It is
designed for interfacing with objects tracked by DVC. That said, CLI commands
are basically calling `dvc.repo.Repo` object methods. So if you want to use
commands from within Python code, you could try creating a `Repo` object with
`r = Repo({root_dir})` and then `r.push()`. Please note that we don't officially
support this use case yet.

Of course, you can also run DVC commands from a Python script using `sys` or a
similar library for issuing system commands.

### [Q: Does the `dvc pipeline` command for visualizing pipelines still work in DVC 1.0?](https://discord.com/channels/485586884165107732/485596304961962003/717682556203565127)

Most of the `dvc pipeline` functionality- like `dvc pipeline show --ascii` to
print out an ASCII diagram of your pipeline- has been migrated to a new command,
`dvc dag`. This function is written for our new pipeline format. Check out
[our new docs](https://dvc.org/doc/command-reference/dag#dag) for an example.

### [Q: Is there a way to create a DVC pipeline stage without running the commands in that stage?](https://discord.com/channels/485586884165107732/485596304961962003/715271980978405447)

Yes. Say you have a Python script, `train.py`, that takes in a dataset `data`
and outputs a model `model.pkl`. To create a DVC pipeline stage corresponding to
this process, you could do so like this:

```dvc
$ dvc run -n train
        -d train.py -d data
        -o model.pkl
        python train.py
```

However, this would automatically rerun the command `python train.py`, which is
not necessarily desirable if you have recently run it, the process is time
consuming, and the dependencies and outputs haven't changed. You can use the
`--no-exec` flag to get around this:

```dvc
$ dvc run --no-exec
        -n train
        -d train.py -d data
        -o model.pkl
        python train.py
```

This flag can also be useful when you want to define the pipeline on your local
machine but plan to run it later on a different machine (perhaps an instance in
the cloud).
[Read more about the `--no-exec` flag in our docs.](https://dvc.org/doc/command-reference/run)

One other approach worth mentioning is that you can manually edit your
`dvc.yaml` file to add a stage. If you add a stage this way, pipeline commands
won't be executed until you run `dvc repro`.
