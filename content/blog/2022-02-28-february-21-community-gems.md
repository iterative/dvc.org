---
title: February '22 Community Gems
date: 2022-02-28
description: >
  A roundup of technical Q&A's from the DVC and CML community. This month:
  comparing experiments, working with data, working with pipelines, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month:
  comparing experiments, working with data, working with pipelines, and more.
picture: 2021-12-21/dec-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/february-21-community-gems/1001
tags:
  - Data Versioning
  - DVC Remotes
  - DVC API
  - DVC Stages
  - Community
---

### [Is there a proper way of deleting DVC tracked files from the cloud storage?](https://discord.com/channels/485586884165107732/563406153334128681/927618225989111880)

Thanks for the question @fireballpoint1!

You can find the best way to delete files from your cloud storage in
[our docs](https://dvc.org/doc/command-reference/gc#removing-data-in-remote-storage).
Make sure you're super careful when deleting data from the cloud because it's an
irreversible action. Here's an example of a deletion command that will clear out
your workspace and the cloud storage.

```dvc
$ dvc gc --workspace --cloud
```

This option only keeps the files and directories referenced in the workspace and
it removes everything else, including data in the cloud. By default, this
command will use the default remote you have set. You can specify a different
remote storage with the `--remote` option like this.

```dvc
$ dvc gc --workspace --cloud --remote name_of_remote
```

### [I'm using DVC experiments for deep learning projects, but I'm running into a problem where the Git index gets corrupted when cache files are above 4 GB. What is the best workaround for this?](https://discord.com/channels/485586884165107732/563406153334128681/928939232033140736)

Great question from @charles.melby-thompson!

This is a known
[issue with experiments](https://github.com/iterative/dvc/issues/6181) and we
highly encourage you to comment on and follow this ticket to let us know what
you need. The reason this happens is because DVC will automatically track `-O`
outputs with Git internally since it assumes that any outputs that are not
explicitly part of your `.gitignore` file is part of the experiment state that
needs to be tracked.

You should be able to explicitly add the `-O` output file(s) to your
`.gitignore` as a workaround in the meantime.

### [Is there an easy way to visualize DVC experiment results without using the command line?](https://discord.com/channels/485586884165107732/485596304961962003/930150143259459644)

Good question @LucZ[Mad]!

If you bring those experiments into your regular Git workflow like, using
`dvc exp branch` to create a branch for any experiment you want to share, you
could use https://studio.iterative.ai/ to visualize them.

We're working on support for viewing any pushed experiments in Studio right now
so if there's anything you want to see, make sure to comment on and follow
[this issue](https://github.com/iterative/studio-support/issues/45).

### []()

### []()

### []()

### []()

### []()

---

https://media.giphy.com/media/h5Ct5uxV5RfwY/giphy.gif

At our March Office Hours Meetup we will be ...! [RSVP for the Meetup here]() to
stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
