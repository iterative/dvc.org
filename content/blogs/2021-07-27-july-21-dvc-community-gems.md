---
title: July '21 Community Gems
date: 2021-07-27
description: >
  A roundup of technical Q&A's from the DVC community. This month: self-hosted
  runners, DVC commits, troubleshooting remotes, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: self-hosted
  runners, DVC commits, troubleshooting remotes, and more.
picture: 2021-07-27/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/july-21-community-gems/823
tags:
  - Community Gems
  - Self-hosted runners
  - Remotes
  - CML
  - DVC
---

### [Q: I'm trying to use the `--reuse` option of `cml runner`. If I launch 2 CML experiments in parallel, will CML use the same runner or spin up another one if the existing one is in use?](https://discord.com/channels/485586884165107732/728693131557732403/850340190434492445)

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

You can achieve this by passing the `--idle-timeout=0` option to `cml runner` in
order to disable the timeout.

Thanks @achbogga!

### [Q: How can I change the default VPC to a different one with `cml-runner` for AWS?](https://discord.com/channels/485586884165107732/728693131557732403/857940793616498738)

Great gem from @krish98409!

You could setting the security group via `cloud-aws-security-group`. It will
pick the VPC that manages that precise security group.

We still don't provide a way of specifying VPCs other than the default one, but
it's an issue that we're currently working on:
https://github.com/iterative/terraform-provider-iterative/issues/107

### [Q: Is it possible to rename and modify a file inside a directory tracked by DVC in one commit/change?](https://discord.com/channels/485586884165107732/485596304961962003/849589484517588992)

If you modify the name and modify the file, you just need to run `dvc commit`
and then commit the change into Git.

This was a good question for everyone. Thanks @snowpong!

### [Q: How can I list the experiments I've queued?](https://discord.com/channels/485586884165107732/485596304961962003/856882434138570753)

This is a great question to help us all understand something so thanks
@adwivedi.

To look at your queued experiments, run `dvc exp show`. All of the queued
experiments will be marked with an asterisk `*`.

_Queued experiments are not shown with the `dvc exp list` command at the
moment._

### [Q: I have two machines and a central remote. With my second machine, I want to pull the dataset from the first machine. How can I pull the data with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/859034882297823233)

Make sure that you have configured a DVC remote and run `dvc push` from your
first machine. You should be able to find the files on the remote storage where
you pushed them to after running that command. Then you can run `dvc pull` on
your second machine and this should give you the dataset you pushed from the
first machine.

You will run into some issues if your remote isn't configured properly on the
second machine. Check your `.dvc/config` file for the second machine to make
sure there aren't any errors. It could be something as simple as a connection
string without the necessary quotation marks!

Thanks so much for this question @raharth!

### [Q: `dvc push` says, "Everything is up to date." However, I modified my dataset and this is confirmed with `dvc status`, where it lists a "modified" entry on the changed outs. How can I force a push of my changes?](https://discord.com/channels/485586884165107732/485596304961962003/857931383476977695)

You need to run `dvc commit` to commit your changes to the cache.

Good question @BSVogler.

### [Q: I'm trying to use the DVC API in a Jupyter notebook. Can I simulate a `dvc push` command via the API?](https://discord.com/channels/485586884165107732/485596304961962003/856979475068878898)

Nice job working with the Python API @harry134!

You can use the `Repo` API like this.

```python
from dvc.repo import Repo

repo = Repo()
repo.push()
```

The API isn't production ready, so documentation is lacking at the moment.
Although, we do use it internally all the time, so you can use it with caution
too.

---

![Done GIF by Quizizz](https://media.giphy.com/media/l0Iyl55kTeh71nTXy/giphy.gif)

At our August Office Hours Meetup, we'll be learning about DVC and Streamlit
integration.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279723437/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get answers for your
DVC and CML questions!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
