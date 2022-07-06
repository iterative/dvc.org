---
title: July '22 Community Gems
date: 2022-07-26
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with the DVC cache, DVC data and remotes, using DVC programmatically,
  and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML communities. This month:
  working with the DVC cache, DVC data and remotes, using DVC programmatically,
  and more.
picture: 2022-07-26/july-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/july-22-community-gems/1226
tags:
  - DVC Remotes
  - Pipelines
  - CML
  - DVC Cache
  - Community
---

## [How can I track a new file added to my `data` folder if the `data` folder is already tracked by DVC, yet ignored by Git?](https://discord.com/channels/485586884165107732/485596304961962003/983278896587894804)

Great question on how DVC handles data tracking from @NgHoangDat!

Because you had already tracked folder data via dvc add data, when you add a new
file into it what you need is to update it. In this case, you can use either dvc
add data or dvc commit to update it.

You will only need to recalculate those changed files. If you only add/modify
some small files in that folder. The calculation will not take too much time.

## [Is it be possible to limit the maximum number of webdav connection?]()

## []()

## []()

## []()

## []()

## []()

## []()

---

https://media.giphy.com/media/pdSncNyYgaH0wqaCqp/giphy.gif

Keep an eye out for our next Office Hours Meetup! Make sure you stay up to date
with us to find out what it is!
[Join our group](https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/)
to stay up to date with specifics as we get closer to the event!

Check out [our docs](/doc) to get all your DVC, CML, and MLEM questions
answered!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to chat with the
community!
