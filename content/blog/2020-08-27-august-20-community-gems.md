---
title: August '20 Community Gems
date: 2020-08-27
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  using CI/CD to validate models, advanced DVC pipeline scenarios, and how CML adds pictures
  to your GitHub and GitLab comments.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  using CI/CD to validate models, advanced DVC pipeline scenarios, and how CML adds pictures
  to your GitHub and GitLab comments.
picture: 2020-08-27/Gems_Aug_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/august-20-community-gems/477
tags:
  - Discord
  - Gems
  - CML
  - hyperparameters
  - LFS
  - pipeline
---

Here are some of our top Q&A's from around the community. With the launch of
[CML](https://cml.dev) earlier in the month, we've got some new ground to cover!

## DVC questions

### [Q: What's the relationship between your DVC remote and cache? If I have an external cache, do I really need a DVC remote](https://discordapp.com/channels/485586884165107732/563406153334128681/747588572479094866)

You can think of your DVC remote similar to your Git remote- it's a place to
backup and share artifacts, like datasets and models, and it gives you methods
to push and pull those artifacts to and from your team.

By default, `.dvc/cache` is also similar to your `.git` cache. They're both
_local_ caches that optimize access to files (data and models for DVC cache, and
code for Git cache).

Your DVC remote is a superset of `.dvc/cache`- everything in your cache is a
copy of something in your remote (though there may be files in your DVC remote
that are not in your cache, if you have never attempted to `push` or `pull` them
locally).

In theory, if you are using an
[external cache](https://dvc.org/doc/command-reference/destroy#example-external-cache-directory)
(such as an S3 bucket), and all your projects and all your teammates use that
external cache, and you _know_ that the storage is highly reliable, you don't
need to also have a DVC remote. If you have any doubts about access to your
external cache or its reliability, we'd recommend also keeping a remote.

### [Q: One of my files is an output of a DVC pipeline, and I want to track this file with Git and store it in my Git repository since it isn't very big. How can I make this work?](https://discordapp.com/channels/485586884165107732/563406153334128681/732308317627613235)

If a file (call it `myfile`) is the output of a DVC pipeline, DVC takes several
steps to remove it from Git tracking. If you remove it from the `.gitignore` and
do `git add myfile`, you'll get an error when you try to reproduce your pipeline
with `dvc repro` (`myfile is already trakced by SCM`).

To get around this, you need to specify that DVC should not cache the outputs of
your pipeline]. When you declare a pipeline stage with `dvc run`, instead of
using the `-o` flag, use `-O`. This is shorthand for `--outs-no-cache` ([see
docs for `dvc run` and its flags
[here](https://dvc.org/doc/command-reference/run#options)).

In your `dvc.yaml` file, if you prefer to manually edit, you'll add a field for
`cache`:

```yaml
outs:
  - myfile:
      cache: false
```

### [Q: Can I change my `params.yaml` file to a `.json`?](https://discordapp.com/channels/485586884165107732/563406153334128681/730614265051873370)

Yes, this is straightforward- you change your `params.yaml` to `params.json` in
your workspace, and then use it in `dvc run`:

```dvc
$ dvc run -p params.json:myparam ...
```

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

We'd recommend creating a separate "data registry" repository using a private
cloud bucket to store your validation dataset
([see our docs about the why and how of data registries](https://dvc.org/doc/use-cases/data-registries#data-registries)).
Your CI system can be setup to have access to the data registry via secrets
(called "variables" in GitLab). Then when you run validation via
`dvc repro validate`, you could use `dvc get` to pull the private data from the
registry.

The data is never exposed to the user in an interactive setting, only on the
runner- and there it's ephemeral, meaning it does not exist once the runner
shuts down.

## CML questions

### Q: Sometimes when I make a commit on a branch, my CI workflow isn't triggered. What's going on?

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
