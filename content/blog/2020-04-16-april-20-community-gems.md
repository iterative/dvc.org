---
title: April '20 Community Gems
date: 2020-04-16
description: |
  Great discussions and technical Q&A's from our users.
descriptionLong: |
  Look here every month for great discussions and technical Q&A's from our users 
  and core development team.
picture: ../../static/uploads/images/2020-04-16/DVC_Gems_April_20.png
author: ../authors/elle_obrien.md
commentsUrl: https://discuss.dvc.org/t/march-20-community-gems/336
tags:
  - Discord
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

### Q: [I'm setting up an S3 remote and I'd like to forbid `dvc gc --cloud` so users can't accidently delete files in the remote. Will it be sufficient to restrict deletion in S3 settings?](https://discordapp.com/channels/485586884165107732/563406153334128681/698116671298076672)

You're right to be careful, because `dvc gc --cloud` can be dangerous in the
wrong hands- it'll remove any unused files in your S3 remote (for more info,
[see our docs](https://dvc.org/doc/command-reference/gc#gc)). To prevent users
from having this power, setting your S3 bucket policy to block object deletions
should do the trick (check out this
[relevant Stack Overflow question](https://stackoverflow.com/questions/49693706/disable-delete-option-for-s3-objects-in-aws)).

### Q: [My team is interested in DVC, and we have all of our data in S3 remote storage. Do we need to install a centralised enterprise version of DVC on a dedicated server? And do we have to also have a GitHub repository?](https://discordapp.com/channels/485586884165107732/563406153334128681/692524884701478992)

There's no need for a DVC server. Our remote storage works on top of S3 by
default, with no additional infrastructure required. As for GitHub (or
BitBucket, or GitLab, etc.), this is only needed if you're interested in sharing
your project with others over that channel. We _like_ sharing projects on
GitHub, but you don't have to. Any Git repository, even a local one, will do.

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

You can also use `dvc pull` at the level of individual files. For example, if
you wanted to pull `model.pkl`, a trained model in remote DVC storage with a
corresponding `model.pkl.dvc` file in your local workspace, you would simply run

```dvc
$ dvc pull model.pkl.dvc
```

### Q: [How can I remove a `.dvc` file, but keep the associated files in my workspace?](https://discordapp.com/channels/485586884165107732/485596304961962003/689827778358673469)

Sometimes, you realize you don't want to put a file under DVC tracking after
all. That's okay, easy to fix. Simply remove the `.dvc` file like any other-
`rm <file>.dvc`. DVC will then stop tracking the file, and the associated target
file will still be in your local workspace.
