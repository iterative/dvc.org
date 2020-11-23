---
title: October '20 Community Gems
date: 2020-10-26
description: |
  A roundup of technical Q&A's from the DVC community. This month, learn how
  DVC files work, how to use DVC plots for multi-class classification problems,
  and how to deal with some spooky error messages 👻.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, learn how
  DVC files work, how to use DVC plots for multi-class classification problems,
  and how to deal with some spooky error messages 👻.
picture: 2020-10-26/Gems_Oct_20.png
pictureComment: |
  Happy Halloween from Pirate DeeVee!
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/october-20-community-gems/535
tags:
  - Discord
  - Gems
  - CML
  - Vega
  - Metrics
---

## DVC questions

### [Q: What's in a `.dvc` file, and what would happen if decided not push my `.dvc` files to my Git repo?](https://discordapp.com/channels/485586884165107732/485596304961962003/760920403064520755)

DVC creates lightweight metafiles (`.dvc` files) that correspond to large
artifacts in your project. These `.dvc` files contain pointers to your artifacts
in remote storage (we use a simple content-based storage scheme). Because we use
content-based storage, the remote storage itself isn't designed for browsing
(although
[there are some discussions](https://github.com/iterative/dvc/issues/3621) about
how to make stored files more "discoverable", and you can always identify them
manually by their contents and meta-information like timestamps).

Your `.dvc` files help establish meaningful links between human-readable
filenames and file contents in remote storage, as well as to use Git versioning
on your stored datasets and models. You can think of your DVC remote storage as
a _compliment_ to your Git repository, not a replacement.

In other words... if you're not Git versioning your `.dvc` files, you're not
versioning anything in DVC remote storage!

### [Q: Can I limit the number of network connections used by DVC during `dvc pull`?](https://discordapp.com/channels/485586884165107732/485596304961962003/739760523293360182)

Yep- by default, DVC data transfer operations use a number of threads
proportional to the number of CPUs detected. But, there's a handy flag for
`dvc pull` and `dvc push` that lets you override the defaults:

```dvc
-j <number>, --jobs <number> - number of threads to run
simultaneously to handle the downloading of files from
the remote. The default value is 4 * cpu_count(). For
SSH remotes, the default is just 4. Using more jobs may
improve the total download speed if a combination of small
and large files are being fetched.
```

### [Q: I'm working on a multi-class classification task. Can `dvc plots` show multiple precision recall curves- one for each class?](https://discordapp.com/channels/485586884165107732/485596304961962003/765117500530491472)

Currently, `dvc plots` doesn't support multiple linear curves on a single plot
(except for `dvc plots diff`, of course!). But, you could make one precision
recall curve per class and display them side-by-side.

To do this, you'd want to write the precision recall curve values to separate
files for each class (`prc-0.json`,`prc-1.json`, etc.). Then you would run:

```dvc
$ dvc plots show prc-0.json prc-1.json
```

And you'll see two plots side-by-side! A benefit of this approach is that when
you run `dvc plots diff` to compare precision recall curves across Git commits,
you'll get a comparison plotted for each class.

### [Q: Are you sure I should commit my `.dvc/config` file? It contains my logging credentials for storage, and I'm nervous about adding it to a shared Git repository.](https://discordapp.com/channels/485586884165107732/563406153334128681/768770079596740650)

This is a common scenario- you don't necessarily want to broadcast your remote
storage credentials to everyone on your team, but you still want to check-in
your DVC setup (meaning, your `.dvc/config` file). In this case, you want to use
a `local` config file!

You can use the command

```dvc
$ dvc config --local
```

to setup remote credentials that will be stored in `.dvc/config.local`- by
default, this file is in your `.gitignore` so you don't have to worry about
accidentally committing secrets to your Git repository.
[Check out the docs](https://dvc.org/doc/command-reference/config) for more,
including the `--system` and `--global` options for setting your configuration
for multiple projects and users respectively.

## CML Questions

### [Q: What's the file size limit for publishing files with `cml-publish`?](https://discordapp.com/channels/485586884165107732/728693131557732403/751001285100306502)

`cml-publish` is a service for hosting files that are embedded in CML reports,
like images, audio files, and GIFS. By default, we have a limit of 2 MB per
upload.

If your files are larger than this (which can happen, depending on the machine
learning problem you're working on!) we recommend using GitLab's artifact
storage.
[Based on discussions in the community](https://github.com/iterative/cml/issues/232),
we recently implemented a CML flag (`--gitlab-uploads`) to streamline the
process:

```dvc
$ cml-publish movie.mov --md --gitlab-uploads > report.md
```

Note that we don't currently have an analagous solution for GitHub, because
GitHub artifacts expire after 90 days (whereas they're permanent in GitLab).

### [Q: I'm getting a mysterious error message, `Failed guessing mime type of file`, when I try to use `cml-publish`. What's going on?](https://discordapp.com/channels/485586884165107732/728693131557732403/763840404675756042)

This error message usually means that the target of `cml-publish`- for example,

```dvc
$ cml-publish <target file>
```

is not found. Check for typos in the target filename and ensure that the file
was in fact generated during the run (if it isn't part of your Git repository).
We've [opened an issue](https://github.com/iterative/cml/issues/308) to add a
more informative error message in the future.

### [Q: In my GitHub Actions workflow, I use `dvc metrics diff` to compare metrics generated during the run to metrics on the main branch and print a table- but the table isn't showing any of the metrics from `main`. What could be happening?](https://discordapp.com/channels/485586884165107732/728693131557732403/768815157034876929)

When a continuous integration runner won't report metrics from previous versions
of your project (or other branches), that's usually a sign that the runner
doesn't have access to the full Git history of your project or your metrics
themselves. Here are a few things to check for:

1. **Did you fetch your Git working tree in the runner?** Functions like
   `dvc metrics diff` require the Git history to be accessible- make sure that
   in your workflow, before you run this function, you've done a `git fetch`. We
   recommend:

```dvc
$ git fetch --prune --unshallow
```

2. **Are your metrics in your DVC remote?** If your metrics are _cached_ (which
   they are by default when you create a DVC pipeline), your DVC remote should
   be accessible to your runner. That means you need to add any credentials as
   repository secrets (or variables, in GitLab), and do `dvc pull` in your
   workflow before attempting `dvc metrics diff`.

3. **Are your metrics in your local workspace?** If you are _not_ using a DVC
   remote, your metric files must be _uncached_ and committed to your Git
   repository. To explore an example, say you have a pipeline stage that creates
   `metric.json`:

```dvc
$ dvc run -n mystage -m metric.json train.py
```

By default, `metric.json` is cached and ignored by Git- which means that if you
aren't using a DVC remote in your CI workflow, `metric.json` will effectively be
abandoned on your local machine! You can avoid this by using the `-M` flag
instead of `-m` in `dvc run`, or manually adding the field `cache: false` to
your metric in `dvc.yaml`. Be sure to remove your metrics from any `.gitignore`
files, and commit and push them to your Git repository.

That's all for this month- Happy Halloween! Watch out for scary bugs. 🐛
