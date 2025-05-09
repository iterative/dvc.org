---
title: March '21 Community Gems
date: 2021-03-31
description: >
  A roundup of technical Q&A's from the DVC community. This month: remote
  storage integration, hyperparameter tuning, best practices for managing
  experiments and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: remote
  storage integration, hyperparameter tuning, best practices for managing
  experiments and more.
picture: 2021-03-31/gems-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/march-2021-community-gems/708
tags:
  - Community Gems
  - Pipelines
  - Remote Storage
---

### [Q: Will DVC work with <my remote cloud storage of choice?>](https://discord.com/channels/485586884165107732/563406153334128681/821493606770409493)

We recently had questions about this, specifically regarding Huawei Cloud and
Backblaze B2 Storage. The answer is any cloud storage that has an S3 interface
will work with DVC and both of the aforementioned do! In addition DVC works with
Azure, Google Drive, GS, OSS, and SSH.
[Learn more about S3 combatibility integrations and all available remote storage capabilities here.](https://dvc.org/doc/command-reference/remote)

Thanks to @luke and @Samuel H from Discord for asking these questions that led
to this Gem! 💎

### [Q: I had understood previously that DVC was not suitable for hyperparameter tuning. Has that changed?](https://discord.com/channels/485586884165107732/485596304961962003/820722752709328967)

Yes indeed! With DVC 2.0, the capabilities have evolved quite a bit! We have
introduced experiments and metrics which enables you to track and compare the
different runs of your models with various hyperparameters. You can check out
the documents [here](https://dvc.org/doc/start/experiments) and
[here](https://dvc.org/doc/start/metrics-parameters-plots) to see all the
details.

Thanks to @saif3r for helping us highlight the new features in DVC!

### [Q: Is it possible to set up a DVC repo with pipelines which have all the data (cache, input, output) on another (local) location outside the repo?](https://discord.com/channels/485586884165107732/485596304961962003/819509440217874473)

Thanks for the question @EEisbrenner!

One solution to this would be to keep your DVC cache on your mount, and use the
`symlink` cache type so all of your data would remain on that mount, but for
DVC's purposes it would only deal with files that are "inside" your repo (via
symlinks). Note that your data on that mount would be stored in DVC's
content-addressable cache format, and not in `path/to/mount/foo.nc`. Check out
the docs on
[how to keep DVC cache on your mount here.](https://dvc.org/doc/use-cases/fast-data-caching-hub#example-shared-development-server)

To actually work with `foo.nc`, you'd end up with a symlink `foo.nc` inside your
git/DVC repo that points to some object in your DVC cache.  
[See these docs](https://dvc.org/doc/user-guide/large-dataset-optimization) for
info on how the cache link types work. For doing the initial `dvc add` step for
your data without needing to copy it into the DVC/repo first,
[check out these docs](https://dvc.org/doc/command-reference/add#example-transfer-to-the-cache).

### [Q: My peers and I share a repo where we have a folder that is versioned with DVC. I'm getting an error message when trying to pull data from the cloud. What could be causing it?](https://discord.com/channels/485586884165107732/563406153334128681/799617584336338954)

I see you are having the following error:

```dvc
$ dvc pull

Everything is up to date.
ERROR: failed to pull data from the cloud - 'data\rhinoceros.dvc' format error: extra keys not allowed @ data['outs'][0]['size']

$ dvc doctor

DVC version: 1.9.1 (exe)
---------------------------------
Platform: Python 3.7.9 on Windows-10-10.0.19041-SP0
Supports: All remotes
Cache types: hardlink
Cache directory: NTFS on C:\
Workspace directory: NTFS on C:\
Repo: dvc, git
```

You're colleague is likely running a newer version of DVC. Upgrade so that all
are on the same version and you will be good to go!

Thanks @ojon for this important gem! 💎

### [Q: How do I create multiple pipeline (`dvc.yaml`) files for different experiments?](https://discord.com/channels/485586884165107732/485596304961962003/824846339288334356)

You could create separate directories for each experiment and keep your
pipelines organized with separate `dvc.yaml` files. You can find more
information on
[organization patterns for experiments here.](https://dvc.org/doc/user-guide/experiment-management#organization-patterns)
Currently we are working on a way to compare metrics between different paths if
using this method of keeping experiments in different directories.
[You can follow that issue here!](https://github.com/iterative/dvc/issues/5074)

Thanks @tijoseymathew for your question in Discord!

### [Q: Is there a way to run "git checkout and "dvc checkout" in one command?](https://discord.com/channels/485586884165107732/563406153334128681/818488624303046677)

Yep! There's a way! We offer a Git hook for `post-checkout`, which automates DVC
checkout right after `git checkout`. You can use `dvc install` to install that
hook.  
[Check out these docs](https://dvc.org/doc/command-reference/install) for all
the info on installing Git hooks
[and here](https://dvc.org/doc/command-reference/install#example-checkout-both-git-and-dvc)
for a specific example!

Many thanks to @Thyrix for this question!

### [Q: How do I set a remote in Google Drive and share with someone else?](https://discord.com/channels/485586884165107732/563406153334128681/819432969260761131)

[These docs](https://dvc.org/doc/user-guide/setup-google-drive-remote) will show
you how to get a remote Google Drive set up! Be sure to setup the remote
folder's permissions! For more information on sharing permissions in Google
Drive
[see these docs.](https://support.google.com/drive/answer/7166529?co=GENIE.Platform%3DDesktop&hl=en)

Thanks @Carlos Lopez H for this important gem! 💎

![Shut It Down GIF by Matt Cutshall](https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif)

At our April Office Hours Meetup we will be demo-ing pipelines as well as CML.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/277245660/?isFirstPublish=true)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
