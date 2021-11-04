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

### [How can you check if a DVC tracked directory has changes?](https://discord.com/channels/485586884165107732/563406153334128681/899693929560158218)

Good question from @edran!

You can check which directories have been changed by running:

```dvc
$ dvc status
```

We're working on adding granularity support for this command and should have a
release for this in the next few months.

### [Is there a way to look at all of the experiments I've run and see the metrics and parameters associated with them?](https://discord.com/channels/485586884165107732/563406153334128681/900451895666155520)

Thanks for asking @GuyAR! This is a common question that comes up.

You can see all of your experiments and the associated metrics and parameters in
a table in the terminal by running the following command:

```dvc
$ dvc exp show
```

This will give you a table that looks similar to this with all of this
information.

```dvctable
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━┳━━━━━━━━━━┓
┃ neutral:**Experiment**              ┃ metric:**step** ┃     metric:**acc** ┃ metric:**val_acc** ┃    metric:**loss** ┃ metric:**val_loss** ┃ param:**lr**    ┃ param:**momentum** ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━╇━━━━━━━━━━┩
│ **workspace**               │    **3** │ **0.91389** │    **0.87** │ **0.20506** │  **0.66306** │ **0.001** │ **0.09**     │
│ **data-change**             │    **-** │       **-** │       **-** │       **-** │        **-** │ **0.001** │ **0.09**     │
│ │ ╓ 9405575 [exp-54e8a] │    3 │ 0.91389 │    0.87 │ 0.20506 │  0.66306 │ 0.001 │ 0.09     │
│ │ ╟ 856d80f             │    2 │ 0.90215 │ 0.87333 │ 0.27204 │  0.61631 │ 0.001 │ 0.09     │
│ │ ╟ 23dc98f             │    1 │ 0.87671 │    0.86 │ 0.35964 │  0.61713 │ 0.001 │ 0.09     │
│ ├─╨ 99a3c34             │    0 │ 0.71429 │    0.82 │ 0.67674 │  0.62798 │ 0.001 │ 0.09     │
│ │ ╓ 3b3a2a2 [exp-23593] │    3 │ 0.86885 │    0.46 │ 0.31573 │   3.7067 │ 0.001 │ 0.09     │
│ │ ╟ 93d015d             │    2 │ 0.83197 │ 0.41333 │ 0.36851 │   3.4259 │ 0.001 │ 0.09     │
│ │ ╟ d474c42             │    1 │ 0.79918 │ 0.43333 │ 0.46612 │    3.286 │ 0.001 │ 0.09     │
│ ├─╨ 1582b4b             │    0 │ 0.52869 │    0.39 │ 0.94102 │   2.5967 │ 0.001 │ 0.09     │
└─────────────────────────┴──────┴─────────┴─────────┴─────────┴──────────┴───────┴──────────┘
```

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
