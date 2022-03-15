---
title: March '22 Community Gems
date: 2022-03-31
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
  - Community
---

### [What is the difference between using `dvc exp` run and `dvc repro`?](https://discord.com/channels/485586884165107732/485596304961962003/939070512322195456)

This is a really good question from @v2.03.99!

When you use `dvc exp run`, DVC automatically tracks each experiment run. Using
`dvc repro` leaves it to the user to track each experiment.

### [What is a good way to debug DVC stages in VSCode?](https://discord.com/channels/485586884165107732/485596304961962003/939269709780643861)

A great question here from @quarkquark!

You can debug in VSCode by following the steps below:

- Install the `debugpy` package.
- Navigate to `"Run and Debug" > "Remote Attach" > localhost > someport`.
- In a terminal in VSCode,
  `python -m debugpy --listen someport --wait-for-client -m dvc mycommand`

This should help you debug the stages in your pipeline in the IDE.

### [Is there a way to list what files (and ideally additional info like location, MD5, etc) are within a directory tracked by DVC?](https://discord.com/channels/485586884165107732/485596304961962003/940318136568258650)

Thanks for asking @CarsonM!

You should be able to use DVC to list the directory contents of your DVC remotes
without pulling the repo. Here's an example of the command you can run:

```dvc
$ dvc list https://github.com/iterative/dataset-registry/ fashion-mnist/raw
```

### [if we have multiple datasets, is it recommended to have 1 remote per dataset or to have 1 remote and let DVC handle the paths?](https://discord.com/channels/485586884165107732/485596304961962003/943213340195434546)

This is a really interesting question from @BrownZ!

It really depends on your use case. Separated remotes might be useful if you
want to have granular control over permissions for each dataset.

In general, we would suggest a single remote and setting up a
[data registry](https://dvc.org/doc/use-cases/data-registries) to handle the
different datasets through DVC.

### []()

### []()

### []()

### []()

---

https://media.giphy.com/media/h5Ct5uxV5RfwY/giphy.gif

At our March Office Hours Meetup we will be about how you can create, run, and
benchmark DVC pipelines with [ZnTrack](https://github.com/zincware/ZnTrack)!
[RSVP for the Meetup here](https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
