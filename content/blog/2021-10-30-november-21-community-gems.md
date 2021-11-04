---
title: November '21 Community Gems
date: 2021-11-30
description: |
  A roundup of technical Q&A's from the DVC community. This month: DVC
  stages, working with outputs, DVC API, and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month: DVC
  stages, working with outputs, DVC API, and more.
picture: 2021-11-30/nov-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/october-21-community-gems/931
tags:
  - Data Versioning
  - DVC API
  - Pipelines
  - Community
---

### [What would be the cleanest, most Pythonic way to run DVC commands from inside a Python script if we want to avoid calling the subprocess library?](https://discord.com/channels/485586884165107732/563406153334128681/895570704605528094)

That's a really good question @mihaj!

If you want to run DVC commands in a Python script, you have a couple of
options.

You can work with the `main` module from the `dvc` library. This is the more
CLI-like option. An example of running an experiment would look something like
this.

```python
from dvc.main import main

main(["exp", "run"])
```

The other option you have is to use the `Repo API`. This API is largely
undocumented at the moment, but it closely mirrors the CLI commands. One
exception is that they will return internal data structures instead of exit
codes.

Here's an example of running an experiment with the Repo API.

```python
from dvc.repo import Repo

repo = Repo()
repo.add()
repo.experiments.show()
etc...
```

### []()

### []()

### []()

### []()

### []()

### []()

### []()

---

https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif

At our December Office Hours Meetup we will be going over something interesting.
[RSVP for the Meetup here]() to stay up to date with specifics as we get closer
to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
