---
title: November '21 Community Gems
date: 2021-11-30
description: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  runners, working with data, DVC Studio, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  runners, working with data, and more.
picture: 2021-11-30/nov-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/november-21-community-gems/964
tags:
  - Data Versioning
  - DVC
  - CML
  - Community Gems
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
repo.experiments.run()
repo.experiments.show()
# etc...
```

### [How can you check if a DVC tracked directory has changes?](https://discord.com/channels/485586884165107732/563406153334128681/899693929560158218)

Good question from @edran!

You can check which directories have been changed by running:

```dvc
$ dvc status
```

This will give you an output similar to this in your terminal:

```yaml
train:
  changed deps:
    modified: src/train.py
  changed outs:
    deleted: model.pkl
evaluate:
  changed deps:
    deleted: model.pkl
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
 ────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**   metric:**val_acc**      metric:**loss**   metric:**val_loss**   param:**lr**      param:**momentum**
 ────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                    **3**   **0.91389**      **0.87**   **0.20506**    **0.66306**   **0.001**   **0.09**
  **data-change**                  **-**         **-**         **-**         **-**          **-**   **0.001**   **0.09**
  │ ╓ 9405575 [exp-54e8a]      3   0.91389      0.87   0.20506    0.66306   0.001   0.09
  │ ╟ 856d80f                  2   0.90215   0.87333   0.27204    0.61631   0.001   0.09
  │ ╟ 23dc98f                  1   0.87671      0.86   0.35964    0.61713   0.001   0.09
  ├─╨ 99a3c34                  0   0.71429      0.82   0.67674    0.62798   0.001   0.09
  │ ╓ 3b3a2a2 [exp-23593]      3   0.86885      0.46   0.31573     3.7067   0.001   0.09
  │ ╟ 93d015d                  2   0.83197   0.41333   0.36851     3.4259   0.001   0.09
  │ ╟ d474c42                  1   0.79918   0.43333   0.46612      3.286   0.001   0.09
  ├─╨ 1582b4b                  0   0.52869      0.39   0.94102     2.5967   0.001   0.09
 ────────────────────────────────────────────────────────────────────────────────────────────
```

### [What's the recommended way to remove data that has been imported using `dvc import`?](https://discord.com/channels/485586884165107732/485596304961962003/898462029650735134)

Great question @MadsO!

This works the exact same as when you've added data with `dvc add`. So to remove
data, you would run this command:

```dvc
$ dvc remove
```

### [When using a CML, are GitHub Actions, GitLab, and BitBucket the only options for CI?](https://discord.com/channels/485586884165107732/728693131557732403/909847110306914345)

Currently, `cml runner` does not support CircleCI or droneCI self–hosted runners
and you would have to deploy them manually.

You can still use `cml send-comment`, `cml pr`, and the other CML tools with any
CI platform.

Thanks for this awesome question @tpietruszka!

### [When I run the `dvc remove` command, does it only remove `.dvc` files?](https://discord.com/channels/485586884165107732/563406153334128681/905382438786715648)

A really good question from @flowy!

That is correct. Running `dvc remove` only removes DVC tracked files and
directories. It will also remove the entry from `.gitignore` and handles the
`dvc.yaml`.

For example, if you run something like `dvc remove folder_name/file.dvc`, only
the `.dvc` file will be removed. So your updated directory would likely still
have `folder_name/file` since that was the file being tracked.

If you wanted to remove the tracked file as well, you would need to run
`dvc remove --outs`. This command removes the outputs of any target.

If there is nothing else in the folder, you'll be left with an empty directory.
You can remove it and stop tracking in Git with a command like:

```dvc
$ git rm -r folder_name
```

### [Is there a way to extend default job execution time for a CML runner?](https://discord.com/channels/485586884165107732/728693131557732403/904660123161600021)

There is definitely a way to do this!

You can extend the max time in your CI by adding something like this:

```yaml
train:
  timeout-minutes: 5000
```

If you're using GitLab, the same update would look similar to this:

```yaml
train:
  timeout: 72 hours
```

Thanks for this question @evergreengt!

---

![Matt Fraser GIF by E!](https://media.giphy.com/media/VInc9GYelUbHf5QhNR/giphy.gif)

At our December Office Hours Meetup we will be doing a new feature demo you
won't want to miss!
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282064369/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
