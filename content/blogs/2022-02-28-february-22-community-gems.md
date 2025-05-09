---
title: February '22 Community Gems
date: 2022-02-28
description: >
  A roundup of technical Q&A's from the DVC and CML community. This month:
  comparing experiments, working with data, working with pipelines, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month:
  comparing experiments, working with data, working with pipelines, and more.
picture: 2022-02-28/feb-comm-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/february-22-community-gems/1078
tags:
  - Data Versioning
  - DVC Remotes
  - DVC API
  - DVC Stages
  - Community Gems
---

### [How can I delete DVC-tracked files from cloud storage?](https://discord.com/channels/485586884165107732/563406153334128681/927618225989111880)

Thanks for the question @fireballpoint1!

You can find the best way to delete files from your cloud storage in
[our docs](https://dvc.org/doc/command-reference/gc#removing-data-in-remote-storage).
Make sure you're super careful when deleting data from the cloud because it's an
irreversible action. Here's an example of a deletion command that will clear out
everything in your cloud storage _except_ what is referenced in your workspace.:

```dvc
$ dvc gc --workspace --cloud
```

This option only keeps the files and directories referenced in the workspace and
it removes everything else, including data in the cloud and cache. By default,
this command will use the default remote you have set. You can specify a
different remote storage with the `--remote` option like this:

```dvc
$ dvc gc --workspace --cloud --remote name_of_remote
```

### [I'm using DVC experiments, but the Git index gets corrupted with large (4GB) files. What is the best workaround?](https://discord.com/channels/485586884165107732/563406153334128681/928939232033140736)

Great question from @charles.melby-thompson!

Experiment files may be tracked by Git or DVC. For large files, we generally
recommend tracking them with DVC, in which case file size shouldn't be an issue.

By default, experiments will track all other files with Git. However, Git will
fail with too much data. If there are files you don't want to track at all (such
as large temporary/intermediate files), you can add them to your .gitignore
file.

Check out
[this open issue with experiments](https://github.com/iterative/dvc/issues/6181)
for more details and to provide feedback.

### [Is there an easy way to visualize DVC experiment results without using the command line?](https://discord.com/channels/485586884165107732/485596304961962003/930150143259459644)

Good question @LucZ[Mad]!

If you bring those experiments into your regular Git workflow, e.g. using
`dvc exp branch` to create a branch for any experiment you want to share, you
could use [DVC Studio](https://studio.datachain.ai/) to visualize them.

We're working on support for viewing any pushed experiments in Studio right now
so if there's anything you want to see, make sure to comment on and follow
[this issue](https://github.com/iterative/studio-support/issues/45).

### [Can CML self-hosted runners stop the instance after the idle timeout instead of terminating?](https://discord.com/channels/485586884165107732/728693131557732403/933674203796873226)

This is another fantastic question from @jotsif!

No, we deliberately terminate the instance to avoid unexpected costs. Stopped
but unterminated instances
[can still cost the same as running ones](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-billing-terminated/).
It's best to let the CML runner terminate and create new instances, running
`dvc pull` to restore your data each time.

However, if you're trying to preserve data (e.g. cache dependencies to speed up
experimentation time) on an AWS EC2 instance, you could
[connect persistent AWS S3 remote storage](https://aws.amazon.com/premiumsupport/knowledge-center/s3-transfer-data-bucket-instance/).

### [What's the difference between DVC Studio free and enterprise versions?](https://discord.com/channels/485586884165107732/841856466897469441/933324508570472497)

Thanks for asking @Abdi!

You can find more info about the different
[DVC Studio tiers here](https://studio.datachain.ai/#pricing).

The _Free_ tier has all the features most individual users need, like connecting
to ML repositories, creating views, submitting experiments, and generating
plots. The _Teams_ tier allows you to create large teams for better
collaboration and sharing of views and settings with everyone. The _Enterprise_
tier is more for needs around compliance, dedicated support, and on-premise
installation.

If you are trying to decide which plan to select, please email us at
`support@iterative.ai` and we'll help you figure it out based on your needs.

### [How can I use one `dvc.yaml` file with multiple pipeline folders with different `params.yaml` files?](https://discord.com/channels/485586884165107732/485596304961962003/939099847288578079)

@louisv, thanks for this question!

It seems like you're looking for the parametrization functionality. You can
learn more about how it works
[in this doc](https://dvc.org/doc/user-guide/project-structure/pipelines-files#templating),
but here's a an example of what that might look like in the `dvc.yaml`.

```yaml
stages:
  cleanups:
    foreach: # List of simple values
      - raw1
      - labels1
      - raw2
    do:
      cmd: clean.py "${item}"
      outs:
        - ${item}.cln
```

### [Is it possible to change the x-label in DVC Studio?](https://discord.com/channels/485586884165107732/841856466897469441/938857004187943003)

A great question about Studio from @PythonF!

You can set custom properties for your plot in your `dvc.yaml` like this:

```yaml
plots:
  - plots_no_cache.csv:
      cache: false
      x: r
```

You can also use `dvc plots modify` to change the x-label or y-label for your
plots using commands similar to the following.

```dvc
$ dvc plots modify plots_no_cache.csv -x r -y q
```

---

![Done Tyler The Creator GIF](https://media.giphy.com/media/h5Ct5uxV5RfwY/giphy.gif)

At our March Office Hours Meetup we will be about how you can create, run, and
benchmark DVC pipelines with [ZnTrack](https://github.com/zincware/ZnTrack)!
[RSVP for the Meetup here](https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
