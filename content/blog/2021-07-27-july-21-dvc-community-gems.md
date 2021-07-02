---
title: July '21 Community Gems
date: 2021-07-27
description: |
  A roundup of technical Q&A's from the DVC community.
  This month: DVC pipeline configs, working with remotes,
  file handling and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community.
  This month: DVC pipeline configs, working with remotes,
  file handling and more.
picture: 2021-07-27/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/july-21-community-gems/779
tags:
  - Community
  - Plots
  - Pipelines
  - CML
  - Git
  - Gems
---

### [Q: I'm trying to use the `--reuse` option of `cml-runner`. If I launch 2 CML experiments in parallel, will CML use the same runner or spin up another one if the existing one is in use?](https://discord.com/channels/485586884165107732/728693131557732403/850340190434492445)

If you don't reuse the runner and you have set up a deploy job, that deploy job
will launch two cloud runners. With `--reuse` it will check if the runner with
that tag exists and will not launch another one. Every runner will be listening
for incomming jobs until the max idle time.

Let's say that you set up one runner with `--reuse` and launch multiple jobs.
What will happen is that only one runner should be launched and will take all
the jobs.

The runner that deploys the workflow is not tied specifically to the train job
that it's going to be launched in the same workflow. You just add runners to the
pool and they will be waiting until the idle time is done.

We're working on something like `--reuse-idle` that would be easy to implement.
The idea would be to reuse only idle runners, so that if your job fails and the
fix is pretty fast, you don't need to spin up another runner. You can track our
progress on that through
[this GitHub issue](https://github.com/iterative/cml/issues/575).

A great question from @Corentin in the Discord community!

### [Q: How can I run self-hosted runners on an on-premise machine indefinitely?](https://discord.com/channels/485586884165107732/728693131557732403/851923384613994496)

You can achieve this by passing the `--idle-timeout=0` option to `cml-runner` in
order to disable the timeout.

Thanks @achbogga!

### [Q: How can I change the default VPC to a different one with `cml-cloudrunner` for AWS?](https://discord.com/channels/485586884165107732/728693131557732403/857940793616498738)

Great gem from @krish98409!

You could setting the security group via `cloud-aws-security-group`. It will
pick the VPC that manages that precise security group.

We still don't provide a way of specifying VPCs other than the default one, but
it's an issue that we're currently working on:
https://github.com/iterative/terraform-provider-iterative/issues/107
