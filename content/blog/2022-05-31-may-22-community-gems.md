---
title: May '22 Community Gems
date: 2022-05-31
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month: DVC
  Studio data, DVC for non-ML projects, getting started with CML, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML communities. This month: DVC
  Studio data, DVC for non-ML projects, getting started with CML, and more.
picture: 2022-05-31/may-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/january-22-community-gems/1020
tags:
  - DVC Studio
  - CML
  - DVC Remotes
  - Pipelines
  - Community
---

### [Is it possible to export a plot generated using `dvc plots diff HEAD main` with multiple files to vega-lite?](https://discord.com/channels/485586884165107732/563406153334128681/965911829538832435)

Thanks for the awesome question @dominic!

If you are working with multiple files like `prediction.json` and
`main.prediction.json`, you can still use the `dvc plots diff` command to get
both of the plots to show on a single graph. You'll need to run the following
command:

```dvc
$ dvc plots diff HEAD main --targets {your file name} --show-vega
```

We are working on expanding `dvc plots` to allow you to compare data from two
files. You can also include this plot in a comment with CML so that it appears
on your pull requests in GitHub.

### [What is the difference between `dvc pull` and `dvc checkout`?](https://discord.com/channels/485586884165107732/563406153334128681/966739538888241192)

Great question @Derek!

Here are some explanations around how `dvc pull` and `dvc checkout` work.

- `dvc pull` fetches data from your remote cache and adding it to your local
  cache
- `dvc checkout` syncs data from your local cache to your workspace

### []()

### []()

### []()

### []()

### []()

### []()

### [Can I use ECR and ECS services of AWS with CML?](https://discord.com/channels/485586884165107732/563406153334128681/964542121908527115)

---

https://media.giphy.com/media/bg1MQ6IUVoVOM/giphy.gif

At our June Office Hours Meetup we will ...! [RSVP for the Meetup here]() to
stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
