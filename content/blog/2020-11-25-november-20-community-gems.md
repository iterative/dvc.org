---
title: November '20 Community Gems
date: 2020-11-25
description: |
  A roundup of technical Q&A's from the DVC community. This month, learn how
  to clean your cache and use Git hooks with DVC. And here's an early holiday 
  gift- new Bitbucket support for CML!
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, learn how
  to clean your cache and use Git hooks with DVC. And here's an early holiday 
  gift- new Bitbucket support for CML!
picture: 2020-11-25/cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/november-20-community-gems/566
tags:
  - Discord
  - Gems
  - CML
  - Cache
  - Bitbucket
---

## DVC questions

### [Q: If I checkout a different Git branch, how do I synchronize with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/773498570795778058)

Here's what we recommend: when you checkout a different Git branch in your
project:

```dvc
$ git checkout -b <my_great_new_branch>
```

you'll want to next run

```dvc
$ dvc checkout
```

to synchronize your `.dvc` files on that branch. But _did you know_ you can
automate this with a `post-checkout` Git hook? We've got a hook that executes
`dvc checkout` whenever you run `git checkout`, so you'll always have the
correct data file versions. Head to our docs to
[read up on installing Git hooks into your DVC repository](https://dvc.org/doc/command-reference/install#install)
so you never forget to `dvc checkout`!

### [Q: I have a big, 100 GB directory. I want to know where the contents are located so I can open them with Spark- is there a way to get the location of my files without caching them locally?](https://discord.com/channels/485586884165107732/485596304961962003/771386223403073587)

For this, we'd recommend the
[DVC Python API](https://dvc.org/doc/api-reference/get_url#dvcapiget_url)'s
`get_url` function. For example, in a Python script you'd write:

```python
import dvc.api

resource_url = dvc.api.get_url(
  "<top-level-directory>",
  repo="https://github.com/<your-repo>")
)
```

This code means the API will return the URL for a file that ends in `.dir`. The
`.dir` file contains a JSON-formatted table of the hashes and relative paths for
all the files inside `<top-level-directory>`. You could then parse that file to
get the relative paths to the files in your remote storage.

The JSON object will look something like this, for a file `foo/bar` in your
project:

```json
{ "md5": "abcd123", "relpath": "foo/bar" }
```

Then you can convert the relative path to `foo/bar` to an absolute path as
follows:

```dvc
https://<path-to-your-remote-storage>/ab/cd123
```

To better understand how DVC uses
[content-addressable storage](https://en.wikipedia.org/wiki/Content-addressable_storage)
in your remote,
[read up in our docs](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).

### [Q: Can I have more than one `dvc.yaml` file in my project?](https://discord.com/channels/485586884165107732/563406153334128681/777946398250893333)

By default, DVC pipelines records all your stages (and their inputs and outputs)
in a single file, `dvc.yaml`. Per directory, you can have one `dvc.yaml` file.
If you want to run pipelines in a different folder than your project root, you
could create another `dvc.yaml` in a subdirectory.

However, `dvc.yaml` is intended to be the only file you need to record and
reproduce pipelines per directory. Pipelines are designed to have all stages
stored in the same place, and there's currently no method to rename `dvc.yaml`.

### [Q: How can I untrack a file that's being tracked by DVC? I want to remove it from remote storage and my local cache, too.](https://discord.com/channels/485586884165107732/563406153334128681/773277514717462548)

If you want to untrack a file, perhaps something you added to DVC in error, you
can use `dvc remove` to get rid of the `.dvc` file corresponding to your file,
and then clear your DVC cache with `dvc gc -w --cloud`.
[Check out our docs](https://dvc.org/doc/user-guide/how-to/stop-tracking-data)
to learn more about `dvc gc` and what its flags mean (you'll want to be sure you
know what you're doing, since cache cleaning deletes files permanently!).

Alternatively, you can manually find and delete your files:

1. Find the file using its hash from the corresponding `.dvc` file (or, if it's
   part of a pipeline, the `dvc.lock` file).
2. Look in your remote storage and remove the file matching the hash.
3. Look in `.dvc/cache` and remove the file as well. If you'd like to better
   understand how your cache is organized,
   [we have docs for that](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-the-cache-directory).

Your DVC remote storage and cache are simply storage locations, so once your
file is gone from there it's gone for good.

### [Q: My DVC cache is getting a bit big. Can I clean it?](https://discord.com/channels/485586884165107732/563406153334128681/771275051382341674)

Definitely. Have you seen the command `dvc gc`? It helps you clean your local
cache- [read up here](https://dvc.org/doc/command-reference/gc). This function
lets you get granular about what you're keeping; for example, you can instruct
`dvc gc` to preserve cache files that are currently used your local worksapce,
tips of Git branches, tagged Git commits or all Git commits. Everything else
will be removed.

One word of caution: make sure that when you collect garbage from your cache,
you don't delete any files that you haven't yet pushed to a remote. If this
happens, you'll delete them permanently. To be safe, it never hurts to
`dvc push` your files of interest before cleaning.

## CML questions

### [Q: Does CML support Bitbucket?](https://github.com/iterative/cml/issues/140)

We've just unrolled Bitbucket Cloud support! There are brand new docs in the CML
project repo,
[so check them out](https://github.com/iterative/cml/wiki/CML-with-Bitbucket-Cloud)
to get started. A few quick notes to keep in mind:

1. Like GitLab, Bitbucket Cloud requires you to create a token for authorizing
   CML to write comments. Make sure you don't forget this step (it's in the
   docs!) or you'll surely hit a permissions error.

2. Bitbucket Cloud uses Bitbucket Pipelines for continuous integration
   workflows, which
   [currently doesn't support self-hosted runners](https://jira.atlassian.com/browse/BCLOUD-16995).
   That means
   [bringing your own GPUs is not supported](https://community.atlassian.com/t5/Bitbucket-questions/Does-bitbucket-pipe-support-GPUs-yet/qaq-p/1042659).
   Sorry! But you can still have all the other CML benefits of plots, tables and
   text in your Pull Request.

3. Bitbucket Server support (with Jenkins and Bamboo) is under active
   development. Stay tuned!

![](/uploads/images/2020-11-25/bitbucket_cloud_pr.png)_Now your Bitbucket PRs
can be as pretty as you._

### [Q: Can I use CML with Windows runners?](https://discord.com/channels/485586884165107732/728693131557732403/772519007894765600)

While all our CML tutorials and docs use Ubuntu runners of various flavors,
there's no problem with using Windows runners. Both
[GitHub Actions](https://docs.github.com/en/free-pro-team@latest/actions/reference/specifications-for-github-hosted-runners)
and
[GitLab CI](https://about.gitlab.com/blog/2020/01/21/windows-shared-runner-beta/)
have Windows runners up for grabs. And of course, you can set up your own
Windows machine as a self-hosted runner (see the self-hosted runner docs for
your CI system to learn more).

What if you have a GPU? If you want to use
[`nvidia-docker` to put GPU drivers in your container](https://dvc.org/blog/cml-self-hosted-runners-on-demand-with-gpus),
you'll want to use `nvidia-docker` with the Windows Subsytem for Linux (WSL).
That means you'll first install an Ubuntu subsystem on your Windows machine,
then all your Nvidia drivers, then Docker and `nvidia-docker`. Check out some
[more docs about CUDA with WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
to lear more.

### [Q: I'm using CML to deploy a self-hosted runner with GitLab. I noticed that in your docs, the runner is always set to timeout after 1800 seconds, and then it gets unregistered from GitLab. What if I want to keep my runner registered after the job ends?](https://discord.com/channels/485586884165107732/728693131557732403/779317571354099722)

With CML, we introduced an approach using Docker Machine to provision instances
in the cloud, and then use `dvc run` to register them as self-hosted runners to
completed your workflow. As this question points out, we like to set runners to
timeout after 1800 seconds- that's why you'll see this code in our
[sample "Cloud GPU" workflow](https://github.com/iterative/cml_cloud_case/blob/master/.github/workflows/cml.yaml):

```dvc
$ sudo docker run --name myrunner -d --gpus all \
  -e RUNNER_IDLE_TIMEOUT=1800 \
  -e RUNNER_LABELS=cml,gpu \
  -e RUNNER_REPO=$CI_SERVER_UR \
  -e repo_token=$REGISTRATION_TOKEN \
  -e RUNNER_DRIVER=gitlab \
  dvcorg/cml-py3
```

We did this so you'll avoid running up GPU hours and a big bill. If you're not
worried about that, though, you can set the environmental variable
`RUNNER_IDLE_TIMEOUT` in the `dvcorg/cml` container to 0. Then, your self-hosted
runner will stay on forever, or at least until you manually turn it off.

By the way... stay tuned for a big update here. We're currently replacing the
Docker Machine approach with a method based on TerraForm, and we can't wait to
unveil it. It should make deploying cloud instances on AWS, GCP and Azure work
with less code than ever.

### Q: What did DeeVee do for Thanksgiving?

She stayed home and made mashed potatoes.

![](/uploads/images/2020-11-25/deevee_n_taters.png)

That's all for now, everyone! As always, keep in touch with all your questions
big and small.
