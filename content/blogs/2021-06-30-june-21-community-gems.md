---
title: June '21 Community Gems
date: 2021-06-30
description: >
  A roundup of technical Q&A's from the DVC community. This month: DVC pipeline
  configs, working with remotes, file handling and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: DVC pipeline
  configs, working with remotes, file handling and more.
picture: 2021-06-30/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/june-21-community-gems/779
tags:
  - Community Gems
  - Plots
  - Pipelines
  - CML
  - Git
---

### [Q: Is it possible to plot multiple experiments together?](https://discord.com/channels/485586884165107732/563406153334128681/834387923482181653)

You can use experiment names in the `dvc plots` commands. You need to use the
`diff` command to compare multiple plots. Try
`dvc plots diff exp-6ef18 exp-b17b4 exp-26e88`.

Thanks to @PythonF from Discord for asking this question that led to this Gem!
💎

### [Q: Where is the list of experiment being pushed in Git when I run `dvc exp push`?](https://discord.com/channels/485586884165107732/563406153334128681/837773937390649364)

It uses custom Git refs internally, similar to the way GitHub handles PRs. It’s
a custom DVC Git ref pointing to a Git commit. Here's an example.

```dvc
$ git show-ref exp-26220
c42f48168830148b946f6a75d1bdbb25cda46f35 refs/exps/f1/37703af59ba1b80e77505a762335805d05d212/exp-26220
```

If you want to see your local experiments (that have not been pushed), you can
run `dvc exp list --all`.

You can read more about how we handle our custom Git refs in
[this blog post](https://dvc.org/blog/experiment-refs).

Thanks to @Chandana for asking this question about experiments!

### [Q: Is there a way to list all the experiments I have on my DVC remote that have not been committed to Git?](https://discord.com/channels/485586884165107732/563406153334128681/836705209039978538)

Yes! You can quickly look at all of the experiments in any repo with:

```dvc
$ dvc exp list --all <git repo URL>
```

or

```dvc
$ dvc exp list --all <git remote>
```

Thanks again @Chandana for this gem!

### [Q: Is CML compatible with Azure DevOps?](https://discord.com/channels/485586884165107732/728693131557732403/841664412221177926)

Another great question from @Chandana!

Right now, we support GitHub and GitLab.

Azure DevOps and GCP (Google Cloud Platform) support are on the roadmap. Stay
tuned for more updates!

You can stay up to date with our Azure DevOps progress on
[this issue on GitHub](https://github.com/iterative/cml/issues/142). You can
also follow along with GCP updates with
[this issue](https://github.com/iterative/terraform-provider-iterative/issues/64).

### [Q: I pushed a lot of files using `dvc push` to my DVC remote, but there are a few that couldn't be pushed at the time. If I run `dvc push` again, will it just upload the missing files?](https://discord.com/channels/485586884165107732/563406153334128681/842662337159757854)

Thanks for the question @petek!

Yes! You can just re-run `dvc push` and it will only upload the missing files.

It might be a little slower than you would expect because DVC has to do some
checks to make sure that the other files were uploaded successfully before, but
as far as the actual data transfer goes, only the missing files will be
uploaded.

### [Q: Let's say I have a DVC pipeline with two stages, can I only pull the second one and keep the first one for other uses? Can I pull some specific output from the pipeline?](https://discord.com/channels/485586884165107732/485596304961962003/841688323663855616)

You can pull specific outputs from a pipeline with
`dvc pull path/to/specific/output`. This is similar to how you can use `dvc add`
to work with specific files and directories.

Thanks for such a great question @LucZ!

### [Q: How does DVC handle incremental changes in the data and how does it work with non-DVC based pipeline features?](https://discord.com/channels/485586884165107732/485596304961962003/846364469524430848)

These are good questions for common problems in MLOps from @Phoenix!

To answer the first part, say you are getting new data every week. When you use
DVC, you don't have to worry about getting duplicate data.

DVC supports file-level deduplication right now, so if your data is in a shape
of directory with files, then all unique files will only be stored once.
Chunk-level deduplication is on our todo list. You can see how it's going in
[this issue we have on GitHub](https://github.com/iterative/dvc/issues/829).

For the second part of the question, you can use data management with DVC and
have your own pipelines. Just treat it as Git for data then be sure to
`dvc add`, `dvc push`, `dvc pull` and you should be set. Hooks, like
`pre-commit` or `post-pipeline-run`, are a good way to go about it.

### [Q: Is there a way to tell DVC to use a different profile instead of the default profile when interacting with S3?](https://discord.com/channels/485586884165107732/563406153334128681/846857498094469120)

When you have a remote that is not on your default AWS profile and when you
access it via the `awscli` using something like
`aws s3 --profile=second_profile ls`, you'll need to update your remote config
in DVC.

You can run a command like:

```dvc
$ dvc remote modify myremote profile myprofile
```

Check out the docs on `dvc remote modify` for all the remote config options.

Great question @Avi!

---

![Shut It Down GIF by Matt Cutshall](https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif)

At our July Office Hours Meetup we will be demo-ing pipelines as well as CML.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
