---
title: September '21 Community Gems
date: 2021-09-30
description: |
  A roundup of technical Q&A's from the DVC and CML communities.
  This month: data registries, working with DVC remotes,
  queued experiments, and more.
descriptionLong: |
  A roundup of technical Q&A's from the DVC and CML community.
  This month: data registries, working with DVC remotes,
  queued experiments, and more.
picture: 2021-09-30/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/september-21-community-gems/871
tags:
  - Data Registry
  - DVC Remotes
  - Queued Experiments
  - Pipelines
  - Git
---

### [If I already have several projects and want to build a data registry out of those?](https://discord.com/channels/485586884165107732/563406153334128681/879651401318400021)

Great question from @m41n314c!

You can import into the registry from your other projects with `dvc import` and
`dvc add`. Keep in mind that imported data stays stored with the original source
repo, so people will need to have access to that repo and remote to access the
imported data in the registry.

Look at the
[Data Registry use case](https://dvc.org/doc/use-cases/data-registries) where
you can learn more about data registry management and how other projects can
interact with the registry.

### [Is there a way to share data across multiple on-premise machines so that users can train models individually?](https://discord.com/channels/485586884165107732/563406153334128681/879718738163826698)

This is a good scenario to try out
[sharing a DVC cache](https://dvc.org/doc/user-guide/how-to/share-a-dvc-cache).
You can have a single storage location mounted on each workstation to serve as a
central cache.

That way all of your machine learning engineers can work with the same data
without needing to duplicate it on each machine.

Thanks for the question @fchpriani!

### [If we change the remote we are using in our workspace, does that effect where DVC pulls and pushes data to for all historical commits?](https://discord.com/channels/485586884165107732/563406153334128681/882951655979622400)

Thanks for bringing this up @mattlbeck!

Right now DVC just uses whichever remote is configured in a respective commit
that you've checked out.

To clarify things a bit more, if you run `dvc push/pull` in a workspace with new
a remote, that new remote will be used for `-a`, `-T`, and `--all-commits`.

### [Is there a command to execute only a few specific stages in a DVC pipeline?](https://discord.com/channels/485586884165107732/485596304961962003/888054401640562698)

You can freeze the stages that you do not want to be executed.

`dvc freeze` and `dvc unfreeze` help you do this. Or you can use
`dvc repro --glob pattern*` together with `-s` to match the stages you want to
run.

Thanks for the question @LucZ!

### [When running queued experiments, is it expected for DVC to run `dvc checkout` for each experiment?](https://discord.com/channels/485586884165107732/485596304961962003/883144885417431081)

This brings up a good point, so thanks @dmh!

If you usually run experiments with `dvc repro`, you'll notice that it doesn't
checkout any files. That's because the experiment is running in the current
workspace.

When you use `dvc exp run --queue` or `dvc exp run --run-all`, it runs each
experiment in its own separate temp workspace, so files have to be checked out
into those workspaces. Check out the notes in
[this reference doc on queueing and parallel execution](https://dvc.org/doc/command-reference/exp/run#queueing-and-parallel-execution)
for more details.

### [When working with a data registry, is it possible to pull a specific project folder, modify it, then push Git changes and `dvc push` to the remote storage without pulling data from all the directories?](https://discord.com/channels/485586884165107732/485596304961962003/887427010044002345)

This is definitely possible. You can use a Git sub-repo and a DVC sub-repo to do
this. Use `git init` and `dvc init` in the project folders and then you can pull
them down, modify, commit and push commit back.

This is the most seure way to handle this use case, but you have another option.
You can `dvc pull` from the sub-directory, then make your changes in the
sub-directory, and `dvc add` the changes. Then you can do a `git commit` and
`dvc push` to manage those changes.

Really good question @ross.tsenov!

### [Is it possible to auto-generate reports with metrics and plots when the data is stored in an AWS bucket instead of GitHub?](https://discord.com/channels/485586884165107732/728693131557732403/877072469188575262)

Thanks for asking @Masmoudi!

If the metrics and plots are not being stored in S3, then you may be able to
generate your reports with GitHub Actions and use `cml-publish` and
`cml-send-comment` to post them to GitHub.

When you need to retrieve data, you can run `dvc pull` to get it from the S3
bucket. If you run into an error with this, try adding
`uses: iterative/setup-dvc@v1` to the `dvc pull` command.

### [What mechanism can I use to trigger a CI pipeline periodically so that models get re-trained and logged to DVC automatically?](https://discord.com/channels/485586884165107732/728693131557732403/887306645883990037)

You can use [pipeline
schedules][https://docs.gitlab.com/ee/ci/pipelines/schedules.html] to train your
model periodically and `dvc push` the results.

Good question @mihaj!

---

https://media.giphy.com/media/QMsS2IxP812wbn4WeE/giphy.gif

At our October Office Hours Meetup we will be doing a thing.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
