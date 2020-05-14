---
title: April '20 Community Gems
date: 2020-04-16
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  the DVC cache, pipelines, cloud storage options and concurrency.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  the DVC cache, cloud storage options and concurrency.
picture: 2020-04-16/DVC_Gems_April_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/april-20-community-gems/356
tags:
  - Discord
  - Gems
  - Pipelines
---

## Discord gems

Here are some Q&A's from our Discord channel that we think are worth sharing.

### Q: [How can I view and download files that are being tracked by DVC in a repository?](https://discordapp.com/channels/485586884165107732/485596304961962003/698815826870009868)

To list the files that are currently being tracked in a project repository by
DVC and Git, you can use `dvc list`. This will display the contents of that
repository, including `.dvc` files. To download the contents corresponding to a
particular `.dvc` file, use `dvc get`:

Let's consider an example using both functions. Assume we're working with DVC's
data registry example repository. To list the files present, run:

```dvc
$ dvc list -R https://github.com/iterative/dataset-registry
.gitignore
README.md
get-started/.gitignore
get-started/data.xml
get-started/data.xml.dvc
...
```

Note that the `-R` flag, which enables `dvc list` to display the contents of
directories inside the repository. Now assume you want to download `data.xml`,
which we can see is being tracked by DVC. To download the dataset to your local
workspace, you would then run

```dvc
$ dvc get https://github.com/iterative/dataset-registry get-started/data.xml
```

For more examples and information,
[see the documents](https://dvc.org/doc/command-reference/list#list) for
`dvc list` and for [`dvc get`](https://dvc.org/doc/command-reference/get).

### Q: [I'm setting up cloud remote storage for DVC and I'd like to forbid `dvc gc --cloud` so users can't accidently delete files in the remote. Will it be sufficient to restrict deletion in the remote's settings?](https://discordapp.com/channels/485586884165107732/563406153334128681/698116671298076672)

You're right to be careful, because `dvc gc --cloud` can be dangerous in the
wrong hands- it'll remove any unused files in your remote (for more info,
[see our docs](https://dvc.org/doc/command-reference/gc#gc)). To prevent users
from having this power, setting your bucket policy to block object deletions
should do the trick. How to do this will depend on your cloud storage provider-
we found some relevant docs for
[GCP](https://cloud.google.com/iam/docs/understanding-roles#cloud_storage_roles),
[S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/using-with-s3-actions.html),
and
[Azure](https://docs.microsoft.com/en-us/azure/storage/common/storage-auth-aad).
For the full list of supported remote storage types,
[see here](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).

### Q: [My team is interested in DVC, and we have all of our data in remote storage. Do we need to install a centralised enterprise version of DVC on a dedicated server? And do we have to also have a GitHub repository?](https://discordapp.com/channels/485586884165107732/563406153334128681/692524884701478992)

There's no need for a DVC server. Our remote storage works on top of
[most kinds of cloud storage by default](https://dvc.org/doc/command-reference/remote/add#supported-storage-types),
including S3, GCP, Azure, Google Drive, and Aliyun, with no additional
infrastructure required. As for GitHub (or BitBucket, or GitLab, etc.), this is
only needed if you're interested in sharing your project with others over that
channel. We _like_ sharing projects on GitHub, but you don't have to. Any Git
repository, even a local one, will do.

So a "minimal" DVC project for you might consist of a local workspace with Git
enabled (which you _do_ need), a local Git repository, and your S3 remote
storage. Check out our
[use cases](https://dvc.org/doc/use-cases/versioning-data-and-model-files) to
see some examples of infrastructure and workflow for teams.

### Q: [Could there be any issues with concurrent `dvc push`-es to the same remote?](https://discordapp.com/channels/485586884165107732/563406153334128681/680053750320332800)

There are a few ways for concurrency to occur: multiple jobs running in parallel
on the same machine, or different users on different machines. But in any case,
the answer is the same: there's nothing to worry about! When pushing a file to a
DVC remote, all operations are non-destructive and atomic.

### Q: [How do I only download part of my remote repository? For example, I only need the final output of my pipeline, not the raw data or intermediate steps.](https://discordapp.com/channels/485586884165107732/485596304961962003/696751934777852004)

We support granular operations on DVC project repositories! Say your project's
DVC remote contains several `.dvc` files corresponding to different stages of
your pipeline: `0_process_data.dvc`, `1_split_test_train.dvc`, and
`2_train_model.dvc`. If you're only interested in the files output by the final
stage of the pipeline (`2_train_model.dvc`), you can run:

```dvc
$ dvc pull process_data_stage.dvc
```

You can also use `dvc pull` at the level of individual files. This might be
needed if your DVC pipeline file creates 10 outputs, for example, and you only
want to pull one (say, `model.pkl`, your trained model) from remote DVC storage.
You'd simply run

```dvc
$ dvc pull model.pkl
```

### Q: [How can I remove a `.dvc` file, but keep the associated files in my workspace?](https://discordapp.com/channels/485586884165107732/485596304961962003/689827778358673469)

Sometimes, you realize you don't want to put a file under DVC tracking after
all. That's okay, easy to fix. Simply remove the `.dvc` file like any other-
`rm <file>.dvc`. DVC will then stop tracking the file, and the associated target
file will still be in your local workspace. Note that the file will still be in
your
[DVC cache](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
unless you clear it with `dvc gc`.

### Q: [I'm trying to move a stage file with `dvc move`, but I'm getting an error. What's going on?](https://discordapp.com/channels/485586884165107732/563406153334128681/685125650901630996)

The `dvc move` command is used to rename a file or directory and simultaneously
modify its corresponding DVC file. It's handy so you don't rename a file in your
local workspace that's under DVC tracking without updating DVC to the change
(see an [example here](https://dvc.org/doc/command-reference/move#description)).
The function doesn't work on
[stage files](https://dvc.org/doc/tutorials/pipelines#define-stages) from DVC
pipelines. There's not currently an easy way to safely move stage files, and
it's an
[open issue we're working on](https://github.com/iterative/dvc/issues/1489).
Until then, you can manually update the stage file, or make a new one in the
desired location.

### Q: [I just starting using DVC and noticed that when I `dvc push` files to remote cloud storage, the directory in my remote looks like my DVC cache, not my local workspace directory. Is this right?](https://discordapp.com/channels/485586884165107732/485596304961962003/693740598498426930)

Yep, that's exactly how it should be! In order to provide deduplication and some
other optimizations, your DVC remote's directory structure will mirror the DVC
cache (which is by default in your local workspace under `.dvc/cache`).
Effectively, DVC uses your Git repository to store DVC files, which are keys for
cache files on your remote. So looking inside your remote won't be particularly
enlightening if you're looking for human-readable filenames- the file names will
look like hashes (because, well, they are). Luckily, DVC handles all the
conversions between the filenames in your local workspace and these hashes.

To get some more intuition about this, check out some of our
[docs](https://dvc.org/doc/user-guide/dvc-files-and-directories) about how DVC
organizes files.
