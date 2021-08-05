---
title: August '21 Community Gems
date: 2021-08-31
description: |
  A roundup of technical Q&A's from the DVC community.
  This month: DVC pipeline configs, working with remotes,
  file handling and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community.
  This month: DVC pipeline configs, working with remotes,
  file handling and more.
picture: 2021-08-31/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/august-21-community-gems/45342t5t4egrf4w
tags:
  - Community
  - Plots
  - Pipelines
  - CML
  - Git
---

### [Q: Are TOML files supported for storing model metrics and displaying them via `dvc metrics show`?](https://discord.com/channels/485586884165107732/485596304961962003/865974923079319563)

Thanks for the question @naeljaneLiblikas!

DVC does not support TOML files for metrics. TOML files are only used for
parameters.

### [Q: How can I use object storage as a data source for MLOps with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/866393535296176148)

You have a few options with DVC for this.

- Set up an external cache on your object storage
  bucket.[Check out this doc to learn more](https://dvc.org/doc/user-guide/managing-external-data#setting-up-an-external-cache)!
- Track a large dataset in an external location without downloading it locally.
  [This doc will tell you more](https://dvc.org/doc/command-reference/add#example-transfer-to-remote-storage).

Great question @Ravi Kumar!

### [Q: Is there a recommended way to specify multiple pipelines in DVC?](https://discord.com/channels/485586884165107732/485596304961962003/864230750325047316)

There are a few different ways to approach this.

- `dvc.yaml` files can be in any sub-directory or nested sub-directory in the
  project structure and DVC will find them.
- DVC will process them just the same as if they were one DVC file i.e.
  dependencies between stages in different `dvc.yaml` files are still respected.
- Each `dvc.yaml` file will have its own `dvc.lock` file in the same directory.
- Splitting a `dvc.yaml` file into multiple files is encouraged where there are
  clear logical groupings between stages. It avoids confusion, improves
  readability, and shortens commands by avoiding long paths preceding every
  filename.

If you want to see the rest of the explanation,
[check out this PR we have up](https://github.com/iterative/dvc.org/issues/2494).
Please feel free to add a comment or emoji on this PR so we know how to
prioritize this content for you!

Thanks @Tups!

### [Q: Is there way to allow different pipelines to have common dependencies and outputs in DVC pipelines?](https://discord.com/channels/485586884165107732/563406153334128681/867747202306146335)

Good question @vgodie!

It is possible to have overlapping dependencies, but not overlapping outputs.
Having overlapping outputs introduces uncertainty into DVC commands, like
`dvc checkout`.

### [Q: How does the CML runner restart workflows if it's been shut down by AWS (e.g. spot instances)?](https://discord.com/channels/485586884165107732/728693131557732403/862641924200857660)

You shouldn't have to do anything. Spot instances sends a `SIGINT` that we
handle to restart the workflow. We have been supporting graceful shutdown by
unregistering runners for a while now.

The main difference now is that we restart workflows with unfinished jobs.

We know for sure this isn't working in Azure. Azure does not do a graceful
shutdown -- even when stopping the instance within the Azure console.

Thanks for such a good question @andee96!

### [Q: Can I change the endpoint defined here <https://github.com/iterative/cml/blob/master/src/utils.js#L56>? Or does `cml-publish` always save the artifacts on this endpoint?](https://discord.com/channels/485586884165107732/728693131557732403/864444303169421322)

Good question @Nwp8nice!

If you use GitLab you can use the `--native` option to upload to GitLab instead.

It would be nice to be able to offer an alternative link so if you're
interested, a PR would be awesome! :blush:

### [Q: Is CML used for creating the MLOps workflows, like Apache Airflow?](https://discord.com/channels/485586884165107732/728693131557732403/866624571519664128)

This is a really good question @Ravi Kumar!

CML is intended to augment existing CI/CD engines like GitHub Actions or
GitLab CI/CD, not replace them. It's a lightweight wrapper and not a complete
replacement workflow ecosystem like Airflow. We don't like reinventing working
wheels.

### [Q: Does CML have the ability to cope with long-running instances, e.g. launching an AWS instance via GitHub Actions that lasts more than 72 hours?](https://discord.com/channels/485586884165107732/728693131557732403/866730530262351873)

Once the GitHub Actions limit of 72 hours is reached for self-hosted
runners, CML will handle restarting the Action and reconnecting to
the runner. Meanwhile, on GitLab there is no time limit to circumvent
for self-hosted runners.

Thanks @sergechuvakin!

---

https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif

At our September Office Hours Meetup we will be do something.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
