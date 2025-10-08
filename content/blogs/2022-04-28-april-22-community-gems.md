---
title: April '22 Community Gems
date: 2022-04-28
description: >
  A roundup of technical Q&As from the DVC and CML community. This month: CML
  updates, working with multiple datasets, using DVC stages, and more.
descriptionLong: >
  A roundup of technical Q&As from the DVC and CML community. This month: CML
  updates, working with multiple datasets, using DVC stages, and more.
picture: 2022-04-28/apr-comm-gems.jpeg
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/april-22-community-gems/1175
tags:
  - CML
  - DVC Stages
  - DVC Remotes
  - Community Gems
---

### [When I run `dvc repro` on a stage, does it automatically push any outputs to my remote?](https://discord.com/channels/485586884165107732/563406153334128681/953616587523498025)

Great question from @tina_rey!

The `dvc repro` command doesn't automatically push any outputs or data to your
remote. The outputs are stored in the cache until you run `dvc push`, which then
pushes them from your cache to your remote.

### [Is `dvc dag` based on `deps` and `outs`, so that a stage that depends on the output of another stage will always be executed after the former has finished?](https://discord.com/channels/485586884165107732/563406153334128681/956113493155799070)

This is a good question from @johnysku!

That is correct! If the pipelines are independent or the stages are independent,
they may run in any order. Without explicit dependency linkage, stages could be
executed in an unexpected order.

### [If I want to use the `foreach` utility in `dvc repro`, is there a way I can use glob patterns to create the list DVC needs to iterate over?](https://discord.com/channels/485586884165107732/563406153334128681/956241424150577233)

Another interesting question from @copah!

If you have `mystage` which uses `foreach`, you can do `dvc repro` to `mystage`
to iterate over every `mystage` stage.

### [How does DVC handle files that have been deleted from remote storage?](https://discord.com/channels/485586884165107732/563406153334128681/956254582676258866)

Really good question from @Meme Philosopher!

DVC will fail when you try to pull files that have been deleted from the remote
and notify you that those files are missing in remote storage.

### [Can I separate CML running from GitHub actions VM to work with GCP or AWS so training and testing are in these cloud environments?](https://discord.com/channels/485586884165107732/728693131557732403/954316332457947169)

Thanks for the question @Atsu!

This is supported out-of-the-box! Here's how it works:

1. Within Github Actions, CML launches a
   [self-hosted runner](https://cml.dev/doc/self-hosted-runners) on GCP or AWS
   using `cml runner --labels=cml --cloud=gcp`/`--cloud=aws`
2. GitHub Actions runs the rest of the workflow on the self-hosted runner using
   `runs-on: [self-hosted, cml]` and the maximum allowable
   `timeout-minutes: 4320`
3. If GitHub Actions is about to timeout, CML will restart the workflow, so make
   sure your code regularly caches and restores data if it's expected to take >3
   days to run.

You can follow along with
[this doc](https://cml.dev/doc/self-hosted-runners?tab=GitHub#allocating-cloud-compute-resources-with-cml)
to get started.

The key is requesting GitHub's
[maximum `timeout-minutes: 4320`](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#usage-limits).
This signals to CML to
[restart the workflow](https://cml.dev/doc/ref/runner#faqs-and-known-issues)
just before the timeout. You'll also have to write your code to cache results so
that the restarted workflow will use previous results (e.g. use
https://dvc.org/doc/user-guide/experiment-management/checkpoints#caching-checkpoints
and https://github.com/iterative/dvc/issues/6823)

### [Is there a way to get DVC to import from a private repository?](https://discord.com/channels/485586884165107732/485596304961962003/964204106824695868)

Good question from @qubvel!

You can use SSH to handle this and run the following command:

```dvc
$ dvc import git@gitlab.com:<reposiotry location> <data_path>
```

### [If I use a local remote and a shared cache, will the data be symlinked from the remote to the cache?](https://discord.com/channels/485586884165107732/485596304961962003/963768504987815987)

Very interesting question from @cajoek!

The data will _not_ be symlinked from the remote to the cache.

Sometimes we can treat cache as something temporary so a lot of data that will
never be used can get there from failed experiments, etc. In this case having a
local remote to keep track of important data for important versions of your
project would be good.

That way, later when your cache is too big and the project takes up too much
space, you can remove `.dvc/cache` and download latest important version from
remote.

---

![iAM_Learning GIF](https://media.giphy.com/media/f8QPB1rgHbwhcD2Jd6/giphy.gif)

At our May Office Hours Meetup we will have Matt Squire of Fuzzy Labs join us
sharing his view on open source MLOps tools!
[RSVP for the Meetup here](https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/285550813)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
