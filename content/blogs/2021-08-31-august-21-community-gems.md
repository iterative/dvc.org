---
title: August '21 Community Gems
date: 2021-08-31
description: >
  A roundup of technical Q&A's from the DVC community. This month: separate DVC
  pipelines, working with CML, handling metrics, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: separate DVC
  pipelines, working with CML, handling metrics, and more.
picture: 2021-08-31/Community-Gems-0830-August.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/august-21-community-gems/838
tags:
  - Community Gems
  - Plots
  - Pipelines
  - CML
  - Git
---

### [Q: Are TOML files supported for storing model metrics and displaying them via `dvc metrics show`?](https://discord.com/channels/485586884165107732/485596304961962003/865974923079319563)

Thanks for the question @naeljaneLiblikas!

DVC does not support TOML files for metrics. TOML files are supported for
parameters only at the moment.

We do have an [open issue](https://github.com/iterative/dvc/issues/6402) for
this. Please feel free to add any comments or emojis to this issue so we know
how to prioritize it!

### [Q: Is there a way to store the results of the experiments table in a CSV file?](https://discord.com/channels/485586884165107732/485596304961962003/872554861340803092)

Take a look at the `--show-json` option of `dvc exp show`. This will print the
table in JSON format and you can write a script to save it to another file.

We have an [open feature request](https://github.com/iterative/dvc/issues/5446)
to add CSV support. Give us some feedback so we know how to prioritize this on
our roadmap!

There's another workaround you could test out using our Python API, just keep in
mind that it isn't public and it's not as user-friendly as it could be.
Although, you can try something like this:

```python
import itertools
import dvc.api

exps = itertools.chain.from_iterable(dvc.api.Repo().experiments.ls().values())

def get_exp_info(exp):
  exp_dict = {"exp": exp}
  with dvc.api.open("params.yaml", rev=exp) as p:
    params = yaml.load(p, Loader=yaml.Loader)
    exp_dict.update(params)
  with dvc.api.open("scores.json", rev=exp) as s:
    metrics = json.load(s)
    exp_dict.update(metrics)
  return exp_dict

exps_list = [get_exp_info(exp) for exp in exps]

df = pd.DataFrame.from_records(exps_list)
```

Great question @Jess\_!

### [Q: Is there a recommended way to specify multiple pipelines in DVC?](https://discord.com/channels/485586884165107732/485596304961962003/864230750325047316)

You'll want to keep each pipeline in a separate `dvc.yaml` if you want to work
with multiple pipelines. This is a recommendation and is not required to specify
different pipelines. Here's a bit of explanation:

- Splitting a `dvc.yaml` file into multiple files is encouraged where there are
  clear logical groupings between stages. It avoids confusion, improves
  readability, and shortens commands by avoiding long paths preceding every
  filename.
- `dvc.yaml` files can be in any sub-directory or nested sub-directory in the
  project structure and DVC will find them.
- DVC will process them just the same as if they were one DVC file i.e.
  dependencies between stages in different `dvc.yaml` files are still respected.
- Each `dvc.yaml` file will have its own `dvc.lock` file in the same directory.

If you want to see the rest of the explanation,
[check out this user guide PR we have up](https://github.com/iterative/dvc.org/issues/2494).
Please feel free to add a comment or emoji on this PR so we know how to
prioritize this content for you!

Thanks @Tups!

### [Q: Is there way to allow different pipelines to have common dependencies and outputs in DVC pipelines?](https://discord.com/channels/485586884165107732/563406153334128681/867747202306146335)

Good question @vgodie!

It is possible to have overlapping dependencies, but not overlapping outputs.
Having overlapping outputs introduces uncertainty into DVC commands, like
`dvc checkout`.

Sometimes people want to have overlapping directory outputs (different stages
that wrote many different files in the same directory). They might have a series
of stages that append to the same file. In this case, we suggest creating new
files and combining them in a final stage so they are consistently written in
the same order.

### [Q: How does the CML runner restart workflows if it's been shut down by AWS (e.g. spot instances)?](https://discord.com/channels/485586884165107732/728693131557732403/862641924200857660)

You shouldn't have to do anything. Spot instances sends a `SIGINT` that we
handle to restart the workflow. We have been supporting graceful shutdown by
unregistering runners for a while now.

The main difference now is that we restart workflows with unfinished jobs.

Thanks for such a good question @andee96!

### [Q: Can I change an endpoint that is being? Or does `cml publish` always save the artifacts on this endpoint?](https://discord.com/channels/485586884165107732/728693131557732403/864444303169421322)

Good question @Nwp8nice!

If you use GitLab you can use the `--native` option to upload to GitLab instead.

It would be nice to be able to offer an alternative link so if you're
interested, a PR for [this issue](https://github.com/iterative/cml/issues/291)
would be awesome! 😊

### [Q: Is CML used for creating the MLOps workflows, like Apache Airflow?](https://discord.com/channels/485586884165107732/728693131557732403/866624571519664128)

This is a really good question @Ravi Kumar!

CML is intended to augment existing CI/CD engines like GitHub Actions or GitLab
CI/CD, not replace them. It's a lightweight wrapper and not a complete
replacement workflow ecosystem like Airflow. We don't like reinventing working
wheels.

### [Q: Does CML have the ability to cope with long-running instances, e.g. launching an AWS instance via GitHub Actions that lasts more than 72 hours?](https://discord.com/channels/485586884165107732/728693131557732403/866730530262351873)

Once the GitHub Actions limit of 72 hours is reached for self-hosted runners,
CML will handle restarting the Action and reconnecting to the runner. Meanwhile,
on GitLab there is no time limit to circumvent for self-hosted runners.

Thanks @sergechuvakin!

---

![Shut It Down GIF by Matt Cutshall](https://media.giphy.com/media/l0IycQmt79g9XzOWQ/giphy.gif)

At our September Office Hours Meetup we will be doing a live demo of running
experiments to fine-tune an existing model to work on a different dataset.
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
