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

Since you already track the `data`, when you add a new file into it all you need
to do is update it. You can use either `dvc add data` or `dvc commit` to start
tracking the new file.

DVC will also only recalculate the changed files. If you only add or modify a
small number of files in that folder, the update will not take very long.

## [What would be the best method to get the remote URL of a given dataset inside a Python environment?](https://discord.com/channels/485586884165107732/485596304961962003/984870485668008007)

Wonderful question from @come_arvis!

You can use the `get_url` method of the
[DVC Python API](https://dvc.org/doc/api-reference) to do this. Here's an
example of a script you might run to get the remote URL.

```python
import dvc.api

resource_url = dvc.api.get_url(
    'get-started/data.xml',
    repo='https://github.com/iterative/dataset-registry'
    )

print(resource_url)

# https://remote.dvc.org/dataset-registry/a3/04afb96060aad90176268345e10355
```

This URL is built with the project configuration file, `.dvc/config`, and the
`md5` file hashed stored in the `.dvc` file corresponding to the data file or
directory you want the storage location of.

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
