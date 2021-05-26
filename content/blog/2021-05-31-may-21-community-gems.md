---
title: May '21 Community Gems
date: 2021-05-31
description: |
  A roundup of technical Q&A's from the DVC community. 
  This month: remote storage integration, hyperparameter tuning,
  best practices for managing experiments and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. 
  This month: remote storage integration, hyperparameter tuning,
  best practices for managing experiments and more.
picture: 2021-05-31/gems-cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/may-2021-community-gems/708
tags:
  - Community
  - Pipelines
  - Remote Storage
---

### [Q: Is it possible to plot metrics from multiple experiments together?>](https://discord.com/channels/485586884165107732/563406153334128681/834387923482181653)

You should be able to use experiment names in the `dvc plots` commands. You need
to use the `diff` flag to compare multiple plots. Try
`dvc plots diff exp-6ef18 exp-b17b4 exp-26e88`.

Thanks to @PythonF from Discord for asking this question that led to this Gem!
💎

### [Q: Where are the configs for an experiment being push in Git when I run `dvc exp push`?](https://discord.com/channels/485586884165107732/563406153334128681/837773937390649364)

It uses custom Git refs internally, similar to the way GitHub handles PRs. You
can read more about how we handle our custom Git refs in
[this blog post](https://dvc.org/blog/experiment-refs).

Thanks to @Chandana for asking this question about experiments!

### [Q: Is there a way to list all the experiments I have on my DVC remote that have not been committed to Git?](https://discord.com/channels/485586884165107732/563406153334128681/836705209039978538)

Yes! The command `dvc exp list gitremote --all` lists all of the experiments for
the default remote in the Git repo.

Thanks again @Chandana for this gem!

### [Q: Is CML compatible with Azure DevOps?](https://discord.com/channels/485586884165107732/728693131557732403/841664412221177926)

Another great question from @Chandana!

Right now, we support GitHub and GitLab. Azure DevOps and GCP (Google Cloud
Platform) support are in the pipeline. Stay tuned for more updates!

### [Q: I pushed a lot of files using `dvc push` to my DVC remote, but there are a few that couldn't be pushed at the time. If I run `dvc push` again, will it just upload the missing files?]()

Thanks for the question @petek!

Yes! You can just re-run `dvc push` and it will only upload the missing files.

It might be a little slow than you would expect because DVC has to do some
checks to make sure that the other files were uploaded successfully before, but
as far as the actual data transfer goes, only the missing files will be
uploaded.

### [Q: After running `dvc repro`, I want to use `dvc add` on specific outputs of the pipeline, but I get this error: `output 'train' is already specified in stage: '../dvc.yaml`. Is there a way to manually add and pull data using the file versioning?](https://discord.com/channels/485586884165107732/485596304961962003/841688323663855616)

Since the _dvc.lock_ file already has the data versioned, you could do a
`dvc push`.

If you want to keep the flexibility of adding and pulling data manually, there
are a few things you can do. `dvc add` is specifically for tracking raw data. If
you have a pipeline output, it will already be tracked with the combination of
the _dvc.yaml_ and _dvc.lock_ files. This lets you push and pull your pipeline
outputs without needed to run the `dvc add` command.

If you don't want DVC to track some of the specific outputs, you can mark them
as `cache: fasle` in your _dvc.yaml_.

You can also pull specific output from a pipeline with
`dvc pull path/to/specific/output`. This is similar to how you can use `dvc add`
to work with specific files and directories.

Thanks for such a great question @LucZ!

### [Q: How does DVC handle incremental changes in the data and how does it work with non-DvC based pipeline features?](https://discord.com/channels/485586884165107732/485596304961962003/846364469524430848)

These are good questions for common problems in MLOps from @Phoenix!

To answer the first part, say you are getting new data every week. When you use
DVC, you don't have to worry about getting duplicate data.

DVC supports file-level deduplication right now, so if your data is in a shape
of directory with files, then all unique files will only be stored once.
Chunk-level deduplication is on our todo list.

For the second part of the question, you can use data management with DVC and
have your own pipelines. Just treat it as Git for data then be sure to
`dvc add/push/pull` and you should be set. Hooks, like `pre-commit` or
`post-pipeline-run`, are a good way to go about it.

### [Q: ?]()

https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif

At our June Office Hours Meetup we will be demo-ing pipelines as well as CML.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/277245660/?isFirstPublish=true)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
