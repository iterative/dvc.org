---
title: January '21 Community Gems
date: 2021-01-26
description: |
  A roundup of technical Q&A's from the DVC community. 
  This month: parallelize your data transfer, 
  compressed datasets, and DVC pipelines in CI/CD.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. 
  This month: parallelize your data transfer, 
  compressed datasets, and DVC pipelines in CI/CD.
picture: 2021-01-28/gems-cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/january-21-community-gems/645
tags:
  - Discord
  - Gems
  - CML
  - Plots
  - Pipelines
  - Docker
---

## DVC questions

### [Q: Is there an equivalent of `git restore <file>` for DVC?](https://discord.com/channels/485586884165107732/563406153334128681/799598181310267392)

Yes! You'll want `dvc checkout`. It restores the corresponding verion of your
DVC-tracked file or directory from
[the cache](https://dvc.org/doc/user-guide/dvc-internals#structure-of-the-cache-directory)
to your local workspace.
[Read up in our docs for more info!](https://dvc.org/doc/command-reference/checkout#checkout)

### [Q: My dataset is made of more than _a million_ small files. Can I use an archive format, like `tar.gz` with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/798983422965841920)

There are some downsides to using archive formats, and often we discourage it-
but let's review some factors to consider, so you can make the best choice for
your project.

- If your `tar.gz` file changes at all- perhaps because you changed a single
  file before zipping- you'll end up with an entirely new copy of the archive
  every time you commit! This is not very space efficient, but if space isn't an
  issue it might not be a dealbreaker.
- Because of the way we optimize data transfer, you'll end up transferring the
  whole archive anytime you modify a single file and `dvc push`/`dvc pull`.
- In general, archives don't play nice with the concept of diffs. Looking back
  at your git history, it can be challenging to log how files were deleted,
  modified, or added when you're versioning archives.

While we can't do much about the general issues that archives present for
version control systems, DVC does have some options that might help you achieve
better data transfer speeds. We recommend exploring DVC's built-in parallelism-
data transfer functions like `dvc push` and `dvc pull` have a flag (`-j`) for
increasing the number of jobs run simultaneously.
[Check out the docs for more details](https://dvc.org/doc/command-reference/push#options).

In summary, the advantage of using an archive format will depend on both how
often you modify your dataset and how often you need to push and pull data. You
might consider exploring both approaches (with and without compression) and run
some speed tests for your use case. We'd love to know what you find!

### [Q: My DVC remote is a server with a self-signed certificate. When I push data, DVC is giving me an SSL verification error- how can I get around this?](https://discord.com/channels/485586884165107732/563406153334128681/800707271502856222)

On S3 or S3-compatible storage, you can configure your AWS CLI to use a custom
certificate path.
[As suggested by their docs](https://docs.aws.amazon.com/credref/latest/refdocs/setting-global-ca_bundle.html),
you can also set the environment variable `AWS_CA_BUNDLE` to your `.pem` file.

Similarly, on HTTP and Webdav remotes, there's `REQUESTS_CA_BUNDLE` environment
variable that you can set your self-signed certificate file to.

Then, when DVC tries to access your storage, you should be able to get past SSL
verification!

### [Q: I want to be able to make my own plots in Python with data points from my `dvc plots`, including older versions of those plots. What do you recommend to get the raw historical data?](https://discord.com/channels/485586884165107732/563406153334128681/799617584336338954)

We suggest

```python
from git import Repo

revs = Repo().plots.collect(revs=revs)
```

Then you can plot the data contained in `revs` to your heart's content!

### [Q: Is it safe to share a DVC remote between two projects or registries?](https://discord.com/channels/485586884165107732/563406153334128681/799216349405904896)

You can share a remote with as many projects as you like. Because DVC uses
content-addressible storage, you'll still get benefits like file deduplication
over every project that uses the remote. This can be useful if you're likely to
have many shared files across projects.

One big thing to watch out for: you have to be very careful with clearing the
DVC cache. Make sure you don't remove files associated with another project when
running `dvc gc` by using the `--projects` flag.
[Read up in the docs!](https://dvc.org/doc/command-reference/gc#options)

### [Q: Can I throttle the number of simultaneous uploads to remote storage with DVC?](https://discord.com/channels/485586884165107732/563406153334128681/802099863076208662)

Yep! That'll be the `-j/--jobs` flag, for example:

```dvc
$ dvc push -j <number>
```

will control the number of simultaneous uploads DVC attempts when pushing files
to your remote storage
([see more in our docs](https://dvc.org/doc/command-reference/push#push)).

## CML questions

### [Q: I have a DVC pipeline that I want to run in CI/CD. Specifically, I only want to reproduce the stages that have changed since my last commit. What do I do?](https://discord.com/channels/485586884165107732/728693131557732403/796185815574511616)

DVC pipelines, like makefiles, will only reproduce stages that DVC detects have
changed since the last commit. So to do this in CI/CD systems like GitHub
Actions or GitLab CI, you'll want to make sure the workflow a) syncs the runner
with the latest version of your pipeline, including all inputs and dependencies,
and b) reruns your DVC pipeline.

In practice, your workflow needs to include these two commands:

```dvc
$ dvc pull
$ dvc repro
```

You pull the latest version of your pipeline, inputs and dependencies from cloud
storage with `dvc pull`, and then `dvc repro` intelligently reproduces the
pipeline (meaning, it should avoid rerunning stages that haven't changed since
the last commit).

Check out an
[example workflow here](https://github.com/iterative/cml_dvc_case/blob/master/.github/workflows/cml.yaml).

### [Q: I'm using DVC and CML to pull data from cloud storage, then train a model. I want to push the trained model into cloud storage when I'm done, what should I do?](https://discord.com/channels/485586884165107732/728693131557732403/801553810618187796)

One approach is to run

```dvc
$ dvc add <model>
$ dvc push <model>
```

to the end of your workflow. This will push the model file, but there's a
downside: it won't keep a strong link between the pipeline (meaning, the command
you used to generate the model and any code/data dependencies) and the model
file.

What we recommend is that you create a
[DVC pipeline](https://dvc.org/doc/start/data-pipelines#get-started-data-pipelines)
with one stage- training your model- and declaring your model file as an output.
Then, your workflow can look like this:

```dvc
# get data
$ dvc pull --run-cache

# run the pipeline
$ dvc repro

# push to remote storage
$ dvc push --run-cache
```

When you do this workflow with the `--run-cache` flags, you'll be able to save
all the results of the pipeline in the cloud
([read more here](https://dvc.org/doc/command-reference/push#options)). When the
run has completed, you can go to your local workspace and run:

```dvc
$ dvc pull --run-cache
$ dvc repro
```

This will put your model in your local workspace! And, you get an immutable link
between the code version, data version and model you end up with.

We recommend this approach so you don't lose track of how model files relate to
the data and code that produced them. It's a little more work to set up, but
Future You will thank you!

https://media.giphy.com/media/l0LEIXSRRuv9QQIRNI/giphy.gif
