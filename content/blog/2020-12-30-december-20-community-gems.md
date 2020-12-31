---
title: December '20 Community Gems
date: 2020-12-30
description: |
  A roundup of technical Q&A's from the DVC community. 
  This month, read about custom DVC plots, teamwork 
  with DVC, CML without Docker, and maintaining 
  several pipelines in parallel!
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. 
  This month, read about custom DVC plots, teamwork 
  with DVC, CML without Docker, and maintaining 
  several pipelines in parallel!
picture: 2020-12-30/cover.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/december-20-gems/606
tags:
  - Discord
  - Gems
  - CML
  - Plots
  - Pipelines
  - Docker
---

## DVC questions

### [Q: Is there a way to plot all columns in a `.csv` file on a single graph using `dvc plot`?](https://discord.com/channels/485586884165107732/563406153334128681/768689062314770442)

By default, `dvc plot` graphs one or two columns from the metric file of your
choice (use the `-x` and `-y` flags to specify which columns).

However, there's nothing special about the way DVC makes plots. The plot
function is a wrapper for the [Vega-Lite](https://vega.github.io/vega-lite-v1/)
grammar, which can make pretty much any kind of plot you can imagine. If you
check inside `.dvc/plots/`, you'll see a few Vega-Lite template files- that's
where the plotting instructions are stored!

You can create your own, or modify the existing templates, by
[following the instructions in our docs](https://dvc.org/doc/command-reference/plots#plot-templates).
In short, you'll create a new template and then run
`dvc plot show -t <name-of-template>` to use it!

Vega-Lite has an
[interactive template editor online](https://vega.github.io/editor/#/), which
might help you test out ideas. Happy creating, and if you come up with a
template you'd like to share with the DVC community,
[consider opening a pull request!](https://github.com/iterative/dvc)

### [Q: My teammate and I are having some issues keeping our workplaces synced. We're tracking some folders with DVC, and he recently added a new file to each of these folders. How does he update the tracked folder and push the new contents so I can access them, too?](https://discord.com/channels/485586884165107732/563406153334128681/785965719367843860)

Your partner should first run

```dvc
$ dvc add <folder>
$ dvc push
```

to update DVC about the new file and then push its contents to remote storage.
Next, they'll run:

```dvc
$ git commit <folder>.dvc
$ git push
```

to update your shared Git repository. Then you can do a `git pull` and
`dvc pull` to sync the changes with your local workspace!

### [Q: I forgot to declare a metric output in my `dvc.yaml` file, so one of my metrics is currently untracked. How can I fix this without rerunning the stage? It takes a long time to run.](https://discord.com/channels/485586884165107732/485596304961962003/781643749050155009)

No problem- what you'll want to do is edit your `dvc.yaml` case and then run
`dvc commit dvc.yaml` to store the change.

`dvc commit` is a helpful function that updates your `dvc.lock` file and `.dvc`
files as needed, which foces DVC to accept any modifications to tracked data
currently in your workspace. That should cover the case where you have a metric
file from your last pipeline run in your workspace, but forgot to add it to the
`dvc.yaml` as an output!

[Check out the docs](https://dvc.org/doc/command-reference/commit#commit) for
more about `dvc commit` and how it can help you edit pipeline dependencies as
you work.

### [Q: Can I have multiple `dvc.yaml` files?](https://discord.com/channels/485586884165107732/485596304961962003/784083794583486496)

If you have multiple independent pipelines (for example, `main-data-pipeline`
and `secondary-data-pipeline`), you can have a `dvc.yaml` for each. The catch
is, they have to be in separate directories. Here are two approaches we
recommend:

#### Option 1

```
.
├── main_data_pipeline
│   └── dvc.yaml
└── secondary_data_pipeline
    └── dvc.yaml
```

#### Option 2

```
.
└── main_data_pipeline
    ├── dvc.yaml
    └── secondary_data_pipeline
        └── dvc.yaml
```

### [Q: I want to work on my DVC pipeline on a different computer than usual. For the stage I'm developing, I don't need access to all the data dependencies of the earlier stages- is there a way to download only what I need?](https://discord.com/channels/485586884165107732/563406153334128681/788068487246512158)

Say for example that you have a pipeline like this:

```
+----------+
| data.dvc |
+----------+
      *
      *
      *
   +----+
   | s1 |
   +----+
      *
      *
      *
   +----+
   | s2 |
   +----+
      *
      *
      *
   +----+
   | s3 |
   +----+
```

where stage `s2` is frozen (meaning, its dependencies will not change and we can
be reasonably sure the outputs of `s2` are static).

To work on stage `s3` in a new workspace, you could run:

```dvc
$ dvc pull s2
$ dvc repro s3
```

This set of commands will pull only the targeted stage (not the data
corresponding to `data.dvc`), and then execute the final stage of your pipeline
only.

## CML questions

### [Q: Why do you need Docker to run CML?](https://www.youtube.com/watch?v=rVq-SCNyxVc&lc=UgzohiMVxO1GKB30bad4AaABAg)

Even though we use Docker in many of our tutorials, you technically _don't_ need
it at all! Here's what's going on:

We use a custom Docker container that comes with the CML functions installed (as
well as some useful data science tools like Python, Vega-Lite, and CUDA
drivers). If you want to use your own Docker container, that's fine too- just
make sure you install the CML library of functions on your runner.

To install CML as an `npm` package on your runner, we recommend:

```dvc
npm i -g @dvcorg/cml
```

Once this is done, you should be able to execute functions like `cml-publish`
and `cml-send-comment` on your runner.

For more tips about using CML without Docker,
[see our docs](https://github.com/iterative/cml#install-cml-as-a-package).

### [Q: I'm using CML to print a `dvc metrics diff` to my pull request in GitHub, but I'm getting an error: `token not found`. What does that mean?](https://discord.com/channels/485586884165107732/728693131557732403/786382971706933258)

Generally, `token` refers to an authorization token that grants your runner
certain permissions with the GitHub API- such as the ability to post a comment
on your pull request. If you're working in GitHub, you don't have to follow any
manual steps to create a token. But you _do_ need to make sure your
environmental variables in the workflow are named properly.

Make sure you've specified the following field in your workflow file:

```yaml
env:
  repo_token: ${{ secrets.GITHUB_TOKEN }}
```

The variable must be called `repo_token` for CML to recognize it!

A few other pointers:

- In GitLab, you have to set a variable in your repository called `repo_token`
  whose value is Personal Access token. We have
  [step-by-step instructions in our docs](https://github.com/iterative/cml/wiki/CML-with-GitLab#variables).
  Forgetting to set this is the #1 issue we see with first-time GitLab CI users!
- In BitBucket Cloud, you need to set a variable in your repository called
  `repo_token` whose value is your API credentials. We have
  [detailed docs for creating this token](https://github.com/iterative/cml/wiki/CML-with-Bitbucket-Cloud#repository-variables),
  too.
- Need to see more sample workflows to get a feel for it? We have plenty
  [of case studies](https://dvc.org/doc/cml#case-studies) to examine.

### [Q: Is there any reason why an experimental DVC feature wouldn't work on the CML Docker container?](https://discord.com/channels/485586884165107732/728693131557732403/788512890394247178)

Generally, no- the container `dvcorg/cml:latest` should have the latest DVC
release and the latest CML release (you can see where DVC and CML are installed
from in our
[Dockerfile](https://github.com/iterative/cml/blob/master/docker/Dockerfile)).
So besides the time it takes for releases to be published on various package
managers, there shouldn't be any lag. That means experimental features are ready
to play on your runner!

Note that you can also install pre-release versions of DVC- check out our
[docs about installing the latest stable version ahead of official releases](https://dvc.org/doc/install/pre-release).
