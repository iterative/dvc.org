---
title: August '20 Community Gems
date: 2020-08-27
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  using CI/CD to validate models, advanced DVC pipeline scenarios, and how CML
  adds pictures to your GitHub and GitLab comments.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  using CI/CD to validate models, advanced DVC pipeline scenarios, and how CML
  adds pictures to your GitHub and GitLab comments.
picture: 2020-08-27/Gems_Aug_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/august-20-community-gems/477
tags:
  - Discord
  - Gems
  - CML
  - Hyperparameters
  - Git LFS
  - Pipeline
---

Here are some of our top Q&A's from around the community. With the launch of
[CML](https://cml.dev) earlier in the month, we've got some new ground to cover!

## DVC questions

### [Q: What's the relationship between the DVC remote and cache? If I have an external cache, do I really need a DVC remote?](https://discordapp.com/channels/485586884165107732/563406153334128681/747588572479094866)

You can think of your DVC remote similar to your Git remote, but for data and
model artifacts- it's a place to backup and share artifacts. It also gives you
methods to push and pull those artifacts to and from your team.

Your DVC cache (by default, it's located in `.dvc/cache`) serves a similar
purpose to your Git objects database (which is by default located in
`.git/objects`). They're both _local_ caches that store files (including various
versions of them) in a content-addressable format, which helps you quickly
checkout different versions to your local workspace. The difference is that
`.dvc/cache` is for data/model artifacts, and `.git/objects` is for code.

Usually, your DVC remote is a superset of `.dvc/cache`- everything in your cache
is a copy of something in your remote (though there may be files in your DVC
remote that are not in your cache (and vice versa) if you have never attempted
to `push` or `pull` them locally).

In theory, if you are using an
[external cache](https://dvc.org/doc/use-cases/shared-development-server)-
meaning a DVC cache configured on a separate volume (like NAS, large HDD, etc.)
outside your project path- and all your projects and all your teammates use that
external cache, and you _know_ that the storage is highly reliable, you don't
need to also have a DVC remote. If you have any doubts about access to your
external cache or its reliability, we'd recommend also keeping a remote.

### [Q: One of my files is an output of a DVC pipeline, and I want to track this file with Git and store it in my Git repository since it isn't very big. How can I make this work?](https://discordapp.com/channels/485586884165107732/563406153334128681/732308317627613235)

Yes! There are two approaches. We'll be assuming you have a pipeline stage that
outputs a file, `myfile`.

- If you haven't declared the pipeline stage with `dvc run` yet, then you'll do
  it like this:

```dvc
$ dvc run -n <stage name> -d <dependency> -O myfile
```

Note that instead of using the flag `-o` for specifying the output `myfile`,
we're using `-O`- it's shorthand for `--outs-no-cache`. You can
[read about this flag in our docs](https://dvc.org/doc/command-reference/run#options).

- If you've already created your pipeline stage, go into your `dvc.yaml` and
  manually add the field `cache: false` to the stage as follows:

```yaml
outs:
  - myfile:
      cache: false
```

Please note one special case: if you previously enabled hardlinks or symlinks in
DVC via `dvc config cache`, you may need to run `dvc unprotect myfile` to fully
unlink `myfile` from your DVC cache. If you haven't enabled these types of file
links (and if you're not sure, _you probably didn't!_), this step is unncessary.
[See our docs for more.](https://dvc.org/doc/command-reference/unprotect)

### [Q: Can I change my `params.yaml` file to a `.json`?](https://discordapp.com/channels/485586884165107732/563406153334128681/730614265051873370)

Yes, this is straightforward- you change your `params.yaml` to `params.json` in
your workspace, and then use it in `dvc run`:

```dvc
$ dvc run -p params.json:myparam ...
```

Alternately, if your pipeline stage has already been created, you can manually
edit your `dvc.yaml` file to replace `params.yaml` with `params.json`.

For more about the `params.yaml` file,
[see our docs](https://dvc.org/doc/start/experiments#defining-parameters).

### [Q: Is there a guide for migrating from Git-LFS to DVC?](https://discordapp.com/channels/485586884165107732/485596304961962003/743559246599421974)

We don't know of any published guide. One of our users shared their procedure
for disabling LFS:

```dvc
$ git lfs uninstall
$ git rm .gitattributes
$ git rm .lfsconfig
```

Then you can `dvc add` files you wish to put in DVC tracking, and `dvc push`
them to your remote. After that, `git commit` and you're good!

Note that, if you're going to delete any LFS files, make sure you're certain the
corresponding data has been transferred to DVC.

### [Q: Is there a way to use DVC and CML to validate a model in a GitHub Action, without making the validation data available to the user opening the Pull Request?](https://discordapp.com/channels/485586884165107732/485596304961962003/739202123295883325)

We don't have special support for this use case, and there may be some security
downsides to using a confidential validation dataset with someone else's code
(be sure nothing in their code could expose your data!). But, there are ways to
implement this if you're sure about it.

One possible approach is to create a separate "data registry" repository using a
private cloud bucket to store your validation dataset
([see our docs about the why and how of data registries](https://dvc.org/doc/use-cases/data-registries#data-registries)).
Your CI system can be setup to have access to the data registry via secrets
(called "variables" in GitLab). Then when you run validation via
`dvc repro validate`, you could use `dvc get` to pull the private data from the
registry.

The data is never exposed to the user in an interactive setting, only on the
runner- and there it's ephemeral, meaning it does not exist once the runner
shuts down.

## CML questions

### [Q: Sometimes when I make a commit on a branch, my CI workflow isn't triggered. What's going on?](https://www.youtube.com/watch?v=9BgIDqAzfuA&lc=UgwKIYsCo194AErdeBJ4AaABAg)

If your workflow is set to trigger on a push (as in the CML use cases), it isn't
enough to `git commit` locally- you need to push to your GitHub or GitLab
repository. If you want every commit to trigger your workflow, you'll need to
push each one!

What about if you _don't_ want a push to trigger your worfklow? In GitLab, you
can use the
[`[ci skip]` flag](https://docs.gitlab.com/ee/ci/yaml/#skip-pipeline)- make sure
your commit message contains `[ci skip]` or `[skip ci]`, and GitLab CI won't run
the pipeline in your `gitlab-ci.yml` file.

In GitHub Actions, this flag isn't supported, so you can manually kill any
workflows in the Actions dashboard. For a programmatic fix,
[check out this workaround by Tim Heuer](https://timheuer.com/blog/skipping-ci-github-actions-workflows/).

### [Q: Can I do the bulk of my model training outside of my CI system, and then share the result with CML?](https://twitter.com/peterkuai/status/1295899690404175872)

Definitely! This is a desirable workflow in several cases:

- You have a preferred approach for experiment tracking (for example, DVC or
  MLFlow) that you want to keep using
- You don't want to set up a self-hosted runner to connect your computing
  resources to GitHub or GitLab
- Training time is on the order of days or more

CML is very flexible, and one strong use case is for sanity checking and
evaluating a model in a CI system post-training. When you have a model that
you're satisifed with, you can check it into your CI system and use CML to
evaluate the model in a production-like environment (such as a custom Docker
container), report its behavior and informative metrics. Then you can decide if
it's ready to be merged into your main branch.

### [Q: Can I make a CML report comparing models across different branches of a project?](https://github.com/iterative/cml/issues/188)

Definitely. This is what `dvc metrics diff` is for- like a `git diff`, but for
model metrics instead of code. We made a video about how to do this in CML!

https://youtu.be/xPncjKH6SPk

### [Q: In the function `cml-publish`, it looks like you're uploading published files to `https://asset.cml.dev`. Why don't you just save images in the Git repository?](https://discordapp.com/channels/485586884165107732/728693131557732403/745168931521822740)

If an image file is created as part of your workflow, it's ephemeral- it doesn't
exist outside of your CI runner, and will disappear when your runner is shut
down. To include an image in a GitHub or GitLab comment, a link to the image
needs to persist. You could commit the image to your repository, but typically,
[it's undesireable to automatically commit results of a CI workflow](https://stackoverflow.com/questions/61245284/is-it-necessary-to-commit-dvc-files-from-our-ci-pipelines).

We created a publishing service to help you host files for CML reports. Under
the hood, our service uploads your file to an S3 bucket and uses a key-value
store to share the file with you.

This covers a lot of cases, but if the files you wish to publish can't be shared
with our service for security or privacy reasons, you can emulate the
`cml-publish` function with your own storage. You would push your file to
storage and include a link to its address in your markdown report.
