---
title: February '21 Community Gems
date: 2021-02-26
description: |
  A roundup of technical Q&A's from the DVC community. 
  This month: best practices for config files, pipeline
  dependency management,and caching data for CI/CD.
  Plus a new CML feature to launch cloud compute with 
  Terraform!
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. 
  This month: best practices for config files, pipeline
  dependency management,and caching data for CI/CD.
  Plus a new CML feature to launch cloud compute with 
  Terraform!
picture: 2021-02-26/feb-gems-cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/february-21-community-gems/686
tags:
  - Discord
  - Gems
  - CML
  - config
  - Pipelines
  - Terraform
  - Conda
---

## DVC Questions

### [Q: I noticed I have a DVC `config` file and a `config.local` file. What's best practice for committing these to my Git repository?](https://discord.com/channels/485586884165107732/563406153334128681/666708671333400599)

DVC uses the `config` and `config.local` files to link your remote data
repository to your project. `config` is intended to be committed to Git, while
`config.local` is not - it's a file that you use to store sensitive information
(e.g. your personal credentials - username, password, access keys, etc. for
remote storage) or settings that are specific to your local environment.

Usually, you don't have to worry about ensuring your `config.local` file is
being ignored by Git- the only way to create a `config.local` file is using the
`--local` flag explicitly in functions like `dvc remote` and `dvc config`
commands, so you'll know you've made one! And your `config.local` file is
`.gitignored` by default. If you're concerned, take a look and make sure there
are no settings in your `config.local` file that you actually want in your
regular `config` file.

To learn more about `config` and `config.local`,
[read up in our docs](https://dvc.org/doc/command-reference/remote#example-add-a-default-local-remote).

### [Q: What's the best way to install the new version of DVC in a Conda environment? I'm concerned about the `paramiko` dependency.](https://discord.com/channels/485586884165107732/563406153334128681/669173874247729165)

When you install DVC via `conda`, it will come with dependencies like
`paramiko`.

The only exception when installing DVC as a Python library is with with `pip`:
you might want to specify the kind of remote storage you need to make sure all
dependencies are present (like `boto` for S3). You can run
`pip install dvc[<option>]`, with supported options like `[s3]`, `[azure]`,
`[gdrive]`, `[gs]`, `[oss]`, `[ssh]`. Or, use `[all]` to include them all.

For more about installing DVC and its dependencies,
[check out our docs](https://dvc.org/doc/install).

### [Q: How do I keep track of changes in _modules_ that my DVC pipeline depends on? For example, I have a pipeline stage that runs a script `prepare.py`, which imports a module `module.py`. If `module.py` changes, how will DVC know to rerun the pipeline stage?](https://discord.com/channels/485586884165107732/563406153334128681/663952575984435220)

If your DVC pipeline only lists `prepare.py` as a dependency, then changing code
in module files won't trigger a re-run of the pipeline. Meaning that if you run
`dvc repro` after updating `module.py`, DVC will simply return the result of
your last pipeline run and a message that nothing has changed.

To explain further why this happens:

DVC is platform agnostic and it doesn't know whether your command's executable
is `python`, some other script interpreter, or a compiled binary for that
matter.

> E.g. this is a valid stage: `dvc run -o hello.txt 'echo "Hello!" > hello.txt'`
> (where the executable is echo).

DVC also doesn't know what's going on inside the command's source code.
Therefore, any file that your code requires internally should be explicitly
specified as a pipeline stage dependency (in CLI, `dvc run -d` , or in YAML,
`deps:`) for DVC to track it.

If you're not interested in adding modules as explicit dependencies, there are a
few other approaches:

- Make your `requirements.txt` file a stage dependency in (if the loaded module
  comes from a package).
- Manually rebuild the pipeline (with `dvc repro --force <stage>.dvc`) when you
  know an unmarked dependency is changed – although this is prone to human
  error.
- Have a version/build number comment in the main script that always gets
  updated when an unmarked dependency changes – this could be automated.

[See here for more information on similar use cases.](https://discordapp.com/channels/485586884165107732/563406153334128681/658501655641325580)

We also have an ongoing discussion about this issue on our GitHub repository,
and we'd love your input.
[Please participate in this issue if you can here!](https://github.com/iterative/dvc/issues/1577#issuecomment-568391709)

### [Q: My DVC pipeline has _a lot_ of dependencies, and I don't want to manually write them all out in my `dvc.yaml` file. Are there any ways to use wildcards (like `*`) or specify directories as dependencies?](https://discord.com/channels/485586884165107732/563406153334128681/803961071135883294)

Yes, you can set a directory to be a dependency or an output of a DVC pipeline
stage. This means you can have tens, hundreds, thousands or millions of
dependency files in one directory, and all you have to declare in the pipeline
is the address of that directory.

[Check out the all the options here.](https://dvc.org/doc/command-reference/run#options)

## CML Questions

### [Q: I heard there's a new CML feature using Terraform to provision runners. When is this coming out?](https://discord.com/channels/485586884165107732/728693131557732403/812069229473562624)

You're in luck, because we just shared this feature as part of the CML 0.3.0
pre-release! The pre-release introduced a new function, `cml-runner`, which
upgraded our
[previous method for launching instances in the cloud from a CI workflow using Docker Machine](https://github.com/iterative/cml_cloud_case/blob/b76aba13791ce18c5715f464f58877ffa10d4cfa/.github/workflows/cml.yaml).
In the new `cml-runner` function built on Terraform, you can deploy instances in
AWS and Azure with a single command (it used to take about 30 lines of code!).
For example, to launch a `t2.micro` instance on AWS from your GitHub Actions or
GitLab CI workflow, you'll run:

```bash
cml-runner \
	--cloud aws \
	--cloud-region us-west \
	--cloud-type=t2.micro \
	--labels=cml-runner
```

Check out the [pre-release notes](https://dvc.org/blog/cml-runner-prerelease)
and our
[example project repository](https://github.com/iterative/cml-runner-base-case)
to get started.

### [Q: My CI workflow creates a `[report.md](http://report.md)` document that gets published to my pull request by CML. I want to save the `report.md` file to my repository, too. Is this possible?](https://discord.com/channels/485586884165107732/728693131557732403/810946119374340127)

By default, files that are created in a GitHub Actions or GitLab CI workflow
only exist on the runner- as soon as the runner turns off, they vanish.
Functions like `cml-publish` and `cml-send-comment` create persistent links to
data visualizations, tables, and other outputs of your workflow so you can view
them long after your run ends. However, by design, CML doesn't commit files to
your repository (not all users want this!)

What you're likely looking for is an auto-commit, to essentially `git add` and
`git commit` files generated by the workflow to your repository. You can
manually write this code into your workflow file, or you can use a GitHub Action
tool like the
[Auto Commit](https://github.com/marketplace/actions/git-auto-commit) or
[Add & Commit](https://github.com/marketplace/actions/add-commit) Actions.

### [Q: Do you have any suggested caching strategies with CML and DVC? My DVC pipeline runs in a CI workflow, and it depends on ~15 GB of data. I don't want to download this dataset to my runner every time the workflow runs.](https://discord.com/channels/485586884165107732/728693131557732403/812059539696386079)

Downloading data to a runner on every CI workflow can be needlessly time
consuming, particularly when the data rarely changes.

While we don't have a CML-specific mechanism in the works for this use case,
there are two main approaches we see as viable:

1. **Attach an EBS volume** to the instance that runs your workflow. If you're
   using DVC, DVC needs to run in that volume (at the very least, your DVC cache
   must be there). A user
   [recently let us know](https://discord.com/channels/485586884165107732/728693131557732403/812059539696386079)
   that this approach is working well for them and prevents unnecessary
   re-downloads of their DVC cache. They also
   [recommended this article](https://towardsdatascience.com/stop-duplicating-deep-learning-training-datasets-with-amazon-ebs-multi-attach-d9f61fdc1de4)
   for setup guidelines.
2. **Use a shared DVC cache.** Currently, many DVC users configure their cache
   in shared [NFS](https://en.wikipedia.org/wiki/Network_File_System). A similar
   setup that might help here is using a single shared development server-
   [check out our docs for a use case](https://dvc.org/doc/use-cases/shared-development-server).

<hr />

As always, if you have any use case questions or need support, join us in
[Discord](https://discord.com/invite/dvwXA2N)! Or head to the
[DVC Forum](https://discuss.dvc.org/) to discuss your ideas and best practices.

And, you can follow us on [Twitter](https://twitter.com/dvcorg) and
[LinkedIn](https://www.linkedin.com/company/iterative-ai)!
