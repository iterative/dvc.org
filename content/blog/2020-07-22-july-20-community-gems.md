---
title: July '20 Community Gems
date: 2020-07-31
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  getting started with CML, configuring your DVC cache, and how to request a 
  tutorial video.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  getting started with CML, configuring your DVC cache, and how to request a 
  tutorial video.
picture: 2020-07-31/Gems_July_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/july-20-community-gems/460
tags:
  - Discord
  - Gems
  - CML
  - GCP
  - DVC 1.0
---

Here are some of our top Q&A's from around the community. With the launch of
[CML](https://cml.dev) earlier in the month, we've got some new ground to cover!

## DVC questions

### [Q: Recently, I set up a global DVC remote. Where can I find the config file?](https://discordapp.com/channels/485586884165107732/563406153334128681/717673618217238598)

When you
[create a global DVC remote](https://dvc.org/doc/command-reference/remote/list#options),
a config file will be created in `~/.config/dvc/config` instead of your project
directory (i.e., `.dvc/config`).

Note that on a Windows system, the config file will be created at
`C:\Users\<username>\AppData\Local\iterative\dvc\config`.

### [Q: I'm working on a collaborative project, and I use `dvc pull` to sync my local workspace with the project repository. Then, I try running `dvc repro`, but get an error: `dvc.yaml does not exist`. No one else on my team is having this issue. Any ideas?](https://discordapp.com/channels/485586884165107732/485596304961962003/731188065078345799)

This error suggests there is no `dvc.yaml` file in your project. Most likely,
this means your teammates are using DVC version 0.94 or earlier, before the
`dvc.yaml` standard was introduced. Meanwhile, it sounds like you're using
version 1.0 or later. You can check by running

```dvc
$ dvc version
```

The best solution is for your whole team to upgrade to the latest version- and
there's an easy
[migration script to help you make the move](https://towardsdatascience.com/automatically-migrate-your-project-from-dvc-0-94-to-dvc-1-x-416a5b9e837b).
If for some reason this won't work for your team, you can either downgrade to a
previous version, or use a workaround:

```dvc
$ dvc repro <.dvc stage file>
```

substituting the appropriate `.dvc` file for your pipeline. DVC 1.0 is backwards
compatible, so pipelines created with previous versions will still run.

### [Q: Does the DVC installer for Windows also include the dependencies for using cloud storage, like S3 and GCP?](https://discordapp.com/channels/485586884165107732/485596304961962003/715717911574216735)

If you're installing DVC from binary-such as the `dvc.exe`
[downloadable on the DVC homepage](https://dvc.org/)- all the standard
dependencies are included. You shouldn't need to use `pip` to install extra
packages (like `boto` for S3 storage).

### [Q: Is there a way to setup my DVC remote so I can manually download files from it without going through DVC?](https://discordapp.com/channels/485586884165107732/563406153334128681/717458695709130764)

When DVC adds a file to a remote repository (such as an S3 bucket, or an SSH
file server), there's only one change happening: DVC calculates an md5 for the
file and renames it with that md5. In technical terms, it's storing files in a
"content-addressable way". That means if you know the hash of a file, you can
locate it in your DVC remote and manually download it.

To find the hash for a given file, say `data.csv`, you can look in the
corresponding DVC file:

```dvc
$ cat data.csv.dvc
```

Another approach is using a built-in DVC function:

```dvc
$ dvc get --show-url . data.csv
```

You can read more about `dvc get --show-url` in
[our docs](https://dvc.org/doc/command-reference/get#options). Note that this
functinality is also part of our Python API, so you can locate the path to a
file in your remote within a Python environment.
[Check out our API docs!](https://dvc.org/doc/api-reference/get_url)

### [Q: By default, each DVC project has its own cache in the project repository. To save space, I'm thinking about locally creating a single cache folder and letting multiple project repositories point there. Will this work?](https://discordapp.com/channels/485586884165107732/563406153334128681/736164141701791815)

Yes, we hear from many users who have created a
[shared cache](https://dvc.org/doc/use-cases/shared-development-server#configure-the-external-shared-cache).
Because of the way DVC uses content-addressable filenames, you won't encounter
issues like accidentally overwriting files from one project with another.

A possible issue is that a shared cache will grant all teammates working on a
given project access to the data from all other projects using that cache. If
you have sensitive data, you can create different caches for projects involving
private and public data.

To learn more about setting your cache directory location,
[see our docs](https://dvc.org/doc/command-reference/cache/dir).

## CML questions

### Q: I use Bitbucket. Will CML work for me?

The first release of CML is compatible with GitHub and GitLab. We've seen
[many requests for Bitbucket support](https://github.com/iterative/cml/issues/140),
and we're actively investigating how to add this. Stay tuned.

### [Q: I have on-premise GPUs. Can CML use them to execute pipelines?](https://discordapp.com/channels/485586884165107732/728693131557732403/730070747388706867)

Yep! You can use on-premise compute resources by configuring them as self-hosted
runners. See
[GitHub](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners)
and [GitLab](https://docs.gitlab.com/runner/)'s official docs for more details
and setup instructions.

### [Q: I'm building a workflow that deploys a GCP Compute Engine instance, but I can only find examples with AWS EC2 in the CML docs. What do I do?](https://discordapp.com/channels/485586884165107732/728693131557732403/730688592787275806)

There is a slight difference in the way CML handles credentials for AWS and GCP,
and that means you'll have to modify your workflow file slightly. We've added an
example workflow for GCP to our
[project README](https://github.com/iterative/cml#allocating-cloud-resources-with-cml).

We've updated our
[cloud compute use case repository docs](https://github.com/iterative/cml_cloud_case#using-a-different-cloud-service)
to cover a GCP example.

Note that for Azure, the workflow will be the same as for AWS. You'll only have
to change the arguments to `docker-machine`.

### [Q: I don't see any installation instructions in the CML docs. Am I missing something?](https://discordapp.com/channels/485586884165107732/728693131557732403/733659483758133269)

Nope, there's no installation unless you wish to install CML in your own Docker
image. As long as you are using GitHub Actions or GitLab CI with the CML Docker
images, no other steps are needed.

If you're creating your own Docker image to be used in a GitHub Action or GitLab
CI pipeline, you can add CML to your image via npm:

```bash
$ npm i -g @dvcorg/cml
```

### [Q: Can I use CML with MLFlow?](https://www.youtube.com/watch?v=9BgIDqAzfuA&lc=Ugw-VxQqAaqi9hmqB3t4AaABAg)

CML is designed to integrate with lots of tools that ML teams are already
familiar with. For example, we set up a wrapper to use CML with Tensorboard, so
you get a link to your Tensorboard in a PR whenever your model is training
([check out the use case](https://github.com/iterative/cml_tensorboard_case/pull/3)).

While we haven't yet tried to create a use case with MLFlow in particular, we
think a similar approach could work. We could imagine using MLFlow for
hyperparameter searching, for example, and then checking in your best model with
Git to a CI system for evaluation in a production-like environment. CML could
help you orchestrate compute resources for model evaluation in your custom
environment, pulling the model and any validation data from cloud storage, and
reporting the results in a PR.

If this is something you're interested in, make an issue on our project
repository to tell us more about your project and needs- that lets us know it's
a priority in the community.

### Q: Are there more tutorial videos coming?

Yes! We recently launched
[our first CML tutorial video](https://dvc.org/blog/first-mlops-tutorial), and a
lot of folks let us know they want more. We're aiming to release a new video
every week or so in the coming months. Topics will include:

- Using DVC to push and pull data from cloud storage to your CI system
- Using CML with your on-premise hardware
- Building a data dashboard in GitHub & GitLab for monitoring changes in dynamic
  datasets
- Provisioning cloud compute from your CI system
- Creating a custom Docker container for testing models in a production-like
  environment

We really want to know what use cases, questions, and issues are most important
to you. This will help us make videos that are most relevant to the community!
If you have a suggestion or idea, no matter how small, we want to know. Leave a
[comment on our videos](https://youtu.be/9BgIDqAzfuA),
[reach out on Twitter](https://twitter.com/dvcorg), or
[ping us in Discord](https://discord.gg/bzA6uY7).
