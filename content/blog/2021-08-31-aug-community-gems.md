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

### [Q: ]()

### [Q: ]()

### [Q: ]()

### [Q: ]()

### [Q: ]()

### [Q: ]()

---

https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif

At our September Office Hours Meetup we will be do something.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
