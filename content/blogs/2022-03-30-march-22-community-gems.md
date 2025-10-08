---
title: March '22 Community Gems
date: 2022-03-30
description: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  updates, working with multiple datasets, using DVC stages, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  updates, working with multiple datasets, using DVC stages, and more.
picture: 2022-03-30/mar-comm-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/march-22-community-gems/1119
tags:
  - CML
  - DVC Stages
  - DVC Remotes
  - Community Gems
---

### [What is the difference between using `dvc exp run` and `dvc repro`?](https://discord.com/channels/485586884165107732/485596304961962003/939070512322195456)

This is a really good question from @v2.03.99!

When you use `dvc exp run`, DVC automatically tracks each experiment run. Using
`dvc repro` leaves it to the user to track each experiment.

You can learn how `dvc exp run` uses custom Git refs to track experiments in
this [blog post](https://dvc.org/blog/experiment-refs) and you can see a quick
technical overview in
[the docs here](https://dvc.org/doc/user-guide/experiment-management/experiments-overview).

### [What is a good way to debug DVC stages in VSCode?](https://discord.com/channels/485586884165107732/485596304961962003/939269709780643861)

A great question here from @quarkquark!

You can debug in VSCode by following the steps below:

- Install the `debugpy` package.
- Navigate to `"Run and Debug" > "Remote Attach" > localhost > someport`.
- In a terminal in VSCode,
  `python -m debugpy --listen someport --wait-for-client -m dvc mycommand`

This should help you debug the stages in your pipeline in the IDE and you can
find
[more details here](https://github.com/iterative/dvc/wiki/Debugging-DVC-interactively).

### [Is there a way to list what files (and ideally additional info like location, MD5, etc) are within a directory tracked by DVC?](https://discord.com/channels/485586884165107732/485596304961962003/940318136568258650)

Thanks for asking @CarsonM!

You should be able to use DVC to list the directory contents of your DVC remotes
without pulling the repo. Here's an example of the command you can run:

```dvc
$ dvc list https://github.com/iterative/dataset-registry/ fashion-mnist/raw
```

### [If we have multiple datasets, is it recommended to have 1 remote per dataset or to have 1 remote and let DVC handle the paths?](https://discord.com/channels/485586884165107732/485596304961962003/943213340195434546)

This is a really interesting question from @BrownZ!

It really depends on your use case. Separated remotes might be useful if you
want to have granular control over permissions for each dataset.

In general, we would suggest a single remote and setting up a
[data registry](https://dvc.org/doc/use-cases/data-registries) to handle the
different datasets through DVC.

### [Is there a mailing list for subscribing to CML releases?](https://discord.com/channels/485586884165107732/728693131557732403/939215540591927337)

It's awesome community members like @pria want to keep up with our releases!

You can follow all of our releases via GitHub notifications. You can browse
release notes at <https://github.com/iterative/cml/releases>. You can also
subscribe to release updates by clicking the `Watch` button in the top-right,
navigating to `Custom`, and checking the `Releases` option.

![the checkbox you need to check in GitHub to follow CML releases](../uploads/images/2022-03-30/cml-release-follow.png)

### [Does `cml-send-comment` work for azure devops repositories?](https://discord.com/channels/485586884165107732/728693131557732403/947986936994353293)

Thanks for the question @1cybersheep1!

Currently, the supported Source Code Management tools are GitHub, GitLab, and
Bitbucket. Other SCMs may be a part of the roadmap later on.

### [If my model is training on a self-hosted, local runner, and I already have a shared DVC cache set up on the same machine, is there a good way for my GitHub workflow to access that cache instead of having to redownload it all from cloud storage?](https://discord.com/channels/485586884165107732/728693131557732403/951240652035883008)

Excellent question from @luke_imm!

In GitHub, you can mount volumes to your container, but you have to declare them
within the
[workflow YAML](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#example-running-a-job-within-a-container)

---

![Season 3 Race GIF](https://media.giphy.com/media/3o6Mbnll2gudglC3HG/giphy.gif)

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
