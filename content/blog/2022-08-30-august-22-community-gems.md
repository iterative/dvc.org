---
title: August '22 Community Gems
date: 2022-08-30
description: >
  A roundup of technical Q&A's from the DVC community. This month: deploying
  models MLEM, DVC data and remotes, DVC stages and plots, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: DVC data and
  remotes, DVC stages and plots, and more.
picture: 2022-08-30/august-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/july-22-community-gems/1261
tags:
  - DVC Remotes
  - Pipelines
  - CML
  - DVC Cache
  - Community
---

## [If I am tracking a directory with DVC, how can I read the file names without using `dvc checkout`?](https://discord.com/channels/485586884165107732/563406153334128681/1001787488173572147)

This is a wonderful question from @Mikita Karotchykau!

You can read those file names with our DVC Python API. Here's an example of how
that may work:

```python
import os
from dvc.repo import Repo

for item in Repo.ls(
  "<repo_path_or_url>",
  "/path/to/dir",
  dvc_only=True,
  rev="<rev>",
  recursive=True
):
  print(os.path.join("/path/to/dir", item["path"]))
```

## [How can I mock the execution of certain stages in `dvc repro`?](https://discord.com/channels/485586884165107732/563406153334128681/1004408394888777738)

Nice question from @JesusCerquides!

You should be able to run `dvc commit` in this case. It provides a way to
complete `dvc repro` when it has been used with the `--no-commit` or `--no-exec`
options. Those options cause the command to skip certain stages so you can move
to another stage without executing all of them.

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
