---
title: September '20 Community Gems
date: 2020-09-28
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  customizing your DVC plots, the difference between external dependencies
  and outputs, and how to save models and data in CI.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  customizing your DVC plots, the difference between external dependencies
  and outputs, and how to save models and data in CI.
picture: 2020-09-28/Gems_Sept_20.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/september-20-community-gems/512
tags:
  - Discord
  - Gems
  - CML
  - Hyperparameters
  - External
  - SSH
  - Vega
---

## DVC questions

### [Q: When I try to push to my DVC remote, I get an error about my SSH-RSA keys. What's going on?](https://discordapp.com/channels/485586884165107732/485596304961962003/748735263634620518)

If you're using DVC with an SSH-protected remote, DVC uses a Python library
called `paramiko` to create a connection to your remote. There is a
[known issue](https://stackoverflow.com/questions/51955990/base64-decoding-error-incorrect-padding-when-loading-putty-ppk-private-key-to)
that `paramiko` expects RSA keys in OpenSSH key format, and can throw an error
if the keys are in an alternative format (such as default PuTTY formatted keys).
If this is the case, you'll likely see:

```
ERROR: unexpected error - ('... ssh-rsa ...=', Error('Incorrect padding',))
```

To fix this, convert your RSA key to the OpenSSH format. Tools like
[PuTTYgen](https://www.puttygen.com/) and
[MobaKeyGen](https://mobaxterm.mobatek.net/) can help you do this.

### [Q: Can I have multiple `param.yaml` files in a project?](https://discordapp.com/channels/485586884165107732/563406153334128681/753322309942509578)

Yes, you can have as many separate parameter files as you'd like. It's only
important that they are correctly specified in your DVC pipeline stages.

For example, if you have files `params_data_processing.yaml` and
`params_model.yaml` in your project (perhaps to store hyperparameters of your
data processing and model fitting stages, respectively), you'll want to call the
right file at each stage. For example:

```dvc
$ dvc run -n preprocess \
   -p params_data_process.yaml:param1,param2,...
```

### [Q: Is there a way to automatically produce SVG plots from `dvc plot`? I don't like having to click through the Vega-Lite GUI to get an SVG, and my plots look so small when I access them in the browser.](https://discordapp.com/channels/485586884165107732/563406153334128681/750012082149392414)

If your DVC plots (and by DVC plots, we mean Vega-Lite plots 😉) look small in
your browser, you can modify this programmatically! DVC generates Vega-Lite
plots by way of a few templates that come pre-loaded. The templates are in
`.dvc/plots` (assuming you're in a DVC directory).

Find the template that corresponds to your plot (if you didn't specify a plot
type in your CLI command, it's probably `default.json`) and modify the `height`
and `width` paramters. Then save your changes.

For more about how to modify your plot templates, check out the
[Vega docs](https://vega.github.io/vega/docs/specification/). If you're
considering making a whole new template that's custom for your data viz needs,
[we've got docs on that](https://dvc.org/doc/command-reference/plots#custom-templates),
too.

One last tip: did you know about the
[Vega-Lite CLI](https://anaconda.org/conda-forge/vega-lite-cli)? It provides
functions for converting Vega-Lite plots to `.pdf`,`.png`,`.svg`, and `.vg`
(Vega) formats. To use this approach with DVC, you'll want to use the
`--show-vega` flag to print your plot specification to a `.json` file.

```dvc
$ dvc plots --show-vega  > vega.json
$ vl2svg vega.json
```

### [Q: I'm confused about external dependencies and outputs. What's the difference?](https://discordapp.com/channels/485586884165107732/485596304961962003/752478399326453840)

First, let's talk about **external outputs**. You might use an external output
when you have a dataset in storage that is so large, you can't reasonably
transfer it to your local workspace to start DVC-tracking it. For example, if
you have a TB of data in S3 storage, you want to treat it as an external output
so DVC can version it without resorting to time-consuming data transfer
operations.

External outputs are configured using using `dvc add --external`
([there are plenty more details and tips about managing external data in our docs](https://dvc.org/doc/user-guide/managing-external-data)).

One useful note: when you use an external output, you'll want to set up an
[external cache](https://dvc.org/doc/use-cases/shared-development-server#configure-the-external-shared-cache)
in the same remote location. This is because the default cache location (in your
local workspace) no longer makes sense when the dataset never "visits" your
local workspace! An external cache works largely the same as a typical cache in
your workspace- DVC will try to use the cache/link type you set up in the remote
location where the external data and cache are.

Now, let's talk about **external dependencies**. An external dependency might
come into play when you run a DVC pipeline stage that depends on a file or
directory in a remote location. For example, a pipeline stage could depend on a
`data.csv` file in your S3 bucket:

```dvc
$ dvc run -d s3://mybucket/data.csv
```

DVC connects to the remote location (here, your S3 bucket) to check whether or
not the indicated file (`data.csv`) has changed since the last time `dvc repro`
was run, but that's it. There's no caching involved.

## CML questions

### [Q: How can I use CML with my own Docker container?](https://discordapp.com/channels/485586884165107732/728693131557732403/757553135840526376)

In many of our CML docs and videos, we've shown how to get CML on your CI
(continuous integration) runner via a Docker container that comes with
everything installed. But this is not the only way to use CML, especially if you
want workflows to run in your own Docker container.

You can install CML via `npm`, either in your own Docker container or in your CI
workflow (i.e., in your GitHub Actions `.yaml` or GitLab CI `.yml` workflow
file).

To install CML as a package, you'll want to run:

```bash
$ npm i -g @dvcorg/cml
```

Note that you may need to install additional dependencies if you want to use DVC
plots and Vega-Lite commands:

```bash
$ sudo apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev \
          librsvg2-dev libfontconfig-dev
$ npm install -g vega-cli vega-lite
```

If you're installing CML as part of your workflow, you may need to install Node
first-
[check out our docs](https://github.com/iterative/cml#install-cml-as-a-package)
for how to do this in GitHub Actions and GitLab CI.

### [Q: After running a GitHub Action workflow that runs a DVC pipeline, I want to save the output of the pipeline. Why doesn't CML automatically save the output?](https://discordapp.com/channels/485586884165107732/728693131557732403/757686601953312988)

What you're talking about sounds like an auto-commit: a `git commit` at the end
of your CI workflow to commit any new artifacts to your Git repository. However,
auto-commits have a lot of downsides- they don't make sense for a lot of users,
and generally, it's better to re-create outputs as needed than save them forever
in your Git repo.

We created the DVC `run-cache` in part
[to solve this issue](https://stackoverflow.com/questions/61245284/is-it-necessary-to-commit-dvc-files-from-our-ci-pipelines).
Here's how it works: you'll setup a DVC remote with access credentials passed to
your GitHub Action/GitLab CI via CML (see, for example,
[this workflow](https://github.com/iterative/cml_dvc_case/blob/master/.github/workflows/cml.yaml)).
Then you'll use the following protocol in your CI workflow (your workflow config
file in GitHub/GitLab):

```dvc
$ dvc pull --run-cache
$ dvc repro
$ dvc push --run-cache
```

When you use this design, any artifacts of `dvc repro`, such as models or
transformed datasets, will be saved in DVC storage and indexed by the pipeline
version that generated them. You can access them via `dvc checkout` in your
local workspace.

While we think this is ideal for typical data science and machine learning
workflows, there are other approaches too- if you want to go deeper exploring
auto-commits, checkout the
[Add & Commit GitHub Action](https://github.com/marketplace/actions/add-commit).

### [Q: What can CML do that Circle CI can't do?](https://www.youtube.com/watch?v=9BgIDqAzfuA&lc=Ugylt6QR5ClmD8uHe4B4AaABAg)

To be clear, CML isn't a competitor to Circle CI. Circle CI is more analogous to
GitHub Actions or GitLab CI; it's a continuous integration system.

CML is a toolkit that works with a continuous integration system to 1) provide
big data management (via DVC & cloud storage), 2) help you write model metrics
and data viz to comments in GitHub/Lab, and 3) orchestrate cloud resources for
model training and testing. Currently, CML is only available for GitHub Actions
and GitLab CI.

So to sum it up: CML is not a standalone continuous integration system! It's a
toolkit that works with existing systems, which in the future could include
Circle CI, Jenkins, Bamboo, Azure DevOps Pipelines, and Travis CI. Feel free to
[open a feature request ticket](https://github.com/iterative/cml/issues), or
leave a 👍 on open requests, to "vote" for the integrations you'd like to see
most.
