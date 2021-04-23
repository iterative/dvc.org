---
title: April '21 Community Gems
date: 2021-04-30
description: |
  A roundup of technical Q&A's from the DVC community. 
  This month: remote storage integration, removing old experiments,
  ideas for running cml pipeline reports and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. 
  This month: remote storage integration, removing old experiments,
  ideas for running cml pipeline reports  and more.
picture: 2021-04-30/gems-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/april-21-community-gems/
tags:
  - Discord
  - Gems
  - DVC
  - CML
  - Remote Storage
---

Each month we go through our Discord messages to pull out some of the best
questions from our community. AKA: Community Gems. 💎 This month we'd like to
thank asraniel, Julian, mattlbeck, Ahti, **\_** for inspiring this month's gems!

As always, [join us in Discord](https://discord.com/invite/dvwXA2N) to get all
your DVC and CML questions answered!

## DVC

### [Does the directory system have to already be set up before pushing to OwnCloud with a WebDav remote?](https://discord.com/channels/485586884165107732/485596304961962003/831472645508694046)

A `dvc push` should set that up from your local drive. If you are receiving
'failed to upload' and 'Remote resource not found' errors with your OwnCloud
links and a `dvc doctor` report something like this,

```dvc

$ dvc doctor
DVC version: 2.0.17 (pip)
---------------------------------
Platform: Python 3.8.5 on Linux-5.4.0-70-generic-x86_64-with-glibc2.29
Supports: http, https, s3, webdav, webdavs
Cache types: hardlink, symlink
Cache directory: ext4 on /dev/sda8
Caches: local
Remotes: webdav
Workspace directory: ext4 on /dev/sda8
Repo: dvc, git
```

in this case you can use webdavs for the url and the ask_password parameter for
the config.

### [What procedures would I use if I needed to remove unwanted or outdated experiments and corresponding data in the cache?](https://discord.com/channels/485586884165107732/485596304961962003/831127462544146482)

You can use `dvc exp gc` with corresponding flags to delete the experiments
themselves. You can
[find info on the "garbage collect" function here.](https://dvc.org/doc/command-reference/exp/gc#exp-gc)

Alternatively, you can remove branches that are no longer required using
`dvc remove`, then run `dvc gc --all-branches --all-tags`. DVC will then go
through each branch and tag revisions; will keep them, and will purge the rest.

There a number of other flags that can be used with `dvc gc` depending on your
needs.
[You can find the docs on those flags here.](<[https://dvc.org/doc/command-reference/exp/gc#options](https://dvc.org/doc/command-reference/exp/gc#options)>)

Do note that `--all commits` is the safest flag to use, though it will not
remove much of the cache. Finally, when you delete what's in cache, it does not
delete the directory completely. It leaves the directory empty in your repo. To
find info and comment on this known issue, head to
[Issue #3375 here.](<[https://github.com/iterative/dvc/issues/3375](https://github.com/iterative/dvc/issues/3375)>)
Your input is ALWAYS valuable to us! 🙏🏼

## CML

[I have an ML model that retrains every 24 hours with updated data, but I do not want to create a merge request every time. I just need a nice way to look at the results. Is there a solution on how to report the results of a pipeline in Gitlab?](<[https://discord.com/channels/485586884165107732/728693131557732403/827099289372983336](https://discord.com/channels/485586884165107732/728693131557732403/827099289372983336)>)

Great question! CML doesn't currently have a feature that takes care of this,
but here are a couple of solutions:

1. Keep a separate branch with unrelated history for committing the reports, or
2. Keep a single report file on the repository and update it with each commit.

[I've run into an error trying to get CML to orchestrate runs in my AWS account. It doesn't seem to be a permissions issue as the AWSEc2FullAccess policy seems to have worked, but I can't see the security group. What could be going wrong?](<[https://discord.com/channels/485586884165107732/728693131557732403/818450988084101160](https://discord.com/channels/485586884165107732/728693131557732403/818450988084101160)>)

Check to make sure you are deploying to the correct region. Use the argument
`--cloud-region <region>` (`us-west` for example) to mark the region where the
instance is deployed.

[Head to these docs]([https://discord.com/channels/485586884165107732/728693131557732403/818450988084101160)
for more information on the optional arguments that the CML runner accepts.

Until next month...

https://media.giphy.com/media/XcAa52ejGuNqdb5SFQ/giphy.gif

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered and contribute to the MLOps community! 🚀
