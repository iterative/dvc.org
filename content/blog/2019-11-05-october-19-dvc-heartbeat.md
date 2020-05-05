---
title: October ’19 DVC❤️Heartbeat
date: 2019-11-05
description: |
  Every month we are sharing here our news, findings, interesting reads,
  community takeaways, and everything along the way.
descriptionLong: |
  Every month we are sharing here our news, findings, interesting reads,
  community takeaways, and everything along the way.

  Some of those are related to our brainchild [DVC](https://dvc.org) and its
  journey. The others are a collection of exciting stories and ideas centered
  around ML best practices and workflow.
picture: 2019-11-05/post-image.png
author: svetlana_grinchenko
commentsUrl: https://discuss.dvc.org/t/october-19-dvc-heartbeat/285
tags:
  - Meetup
  - Heartbeat
  - Hacktoberfest
---

## News and links

Autumn is a great season for new beginnings and there is so much we love about
it this year. Here are some of the highlights:

- Co-hosting our
  [first ever meetup](https://www.meetup.com/San-Francisco-Machine-Learning-Meetup/events/264846847/)!
  Our [Dmitry Petrov](https://twitter.com/FullStackML) partnering with
  [Dan Fischetti](https://www.linkedin.com/in/daniel-fischetti-4a6592bb/) from
  [Standard Cognition](https://twitter.com/standardAI) to discuss Open-source
  tools to version control Machine Learning models and experiments. The
  recording is available now here.

  https://youtu.be/RHQXK7EC0jI

- [Getting ready for the Hacktoberfest](https://blog.dataversioncontrol.com/dvc-org-for-hacktoberfest-2019-ce5320151a0c)
  and having the whole team get together to pick up and label nice issues and be
  ready to support the contributors.

- Discovering some really cool blogposts, talks and tutorials from our users all
  over the world: check
  [this blogpost in French](https://blog.octo.com/mise-en-application-de-dvc-sur-un-projet-de-machine-learning/)
  or
  [this tutorial in German](https://jupyter-tutorial.readthedocs.io/de/latest/productive/dvc/)!

- Having a great time working with a
  [tech writer](https://github.com/dashohoxha) brought to us by the
  [Google Season of Docs](https://developers.google.com/season-of-docs) program.
  Check out these
  [interactive tutorials](https://dvc.org/doc/tutorials/interactive) we’ve
  created together.

- Having hot internal discussion about Discord vs Slack support/community
  channels. If you are on the edge like us, have a look at
  [this discussion](https://internals.rust-lang.org/t/exploring-new-communication-channels/7859)
  in the Rust community, so helpful.

- Seeing [Dmitry Petrov](https://twitter.com/FullStackML) being really happy one
  day:

  https://twitter.com/FullStackML/status/1169403554290814976

<hr />

We at [DVC.org](https://dvc.org) are so happy every time we discover an article
featuring DVC or addressing one of the burning ML issues we are trying to solve.
Here are some of the links that caught our eye past month:

- **Continuous Delivery for Machine Learning by
  [Danilo Sato](https://twitter.com/dtsato),
  [Arif Wider](https://twitter.com/arifwider),
  [Christoph Windheuser](https://twitter.com/intellification) and curated by
  [Martin Fowler](https://martinfowler.com/).**

> As Machine Learning techniques continue to evolve and perform more complex
> tasks, so is evolving our knowledge of how to manage and deliver such
> applications to production. By bringing and extending the principles and
> practices from Continuous Delivery, we can better manage the risks of
> releasing changes to Machine Learning applications in a safe and reliable way.

<external-link
href="https://martinfowler.com/articles/cd4ml.html"
title="Continuous Delivery for Machine Learning"
description="bio I am a consultant at ThoughtWorks Germany, where I am leading our data and machine learning activities. I enjoy…"
link="martinfowler.com"
image="/uploads/images/2019-11-05/continuous-delivery-for-machine-learning.png" />

- **[The Path to Identity Validation](https://medium.com/signaturit-tech-blog/the-path-to-identity-validation-2-3-4f698b2ffae9)
  by [Víctor Segura](https://medium.com/@victor.segura).**

> So, the first question is clear: how to choose the optimal hardware for neural
> networks? Secondly, assuming that we have the appropriate infrastructure, how
> to build the machine learning ecosystem to train our models efficiently and
> not die trying? At **Signaturit**, we have the solution ;)

<external-link
href="https://medium.com/signaturit-tech-blog/the-path-to-identity-validation-2-3-4f698b2ffae9"
title="The Path to Identity Validation (2/3)"
description="How to start your own machine learning project?"
link="medium.com"
image="/uploads/images/2019-11-05/the-path-to-identity-validation.jpeg" />

- **Talk:
  [Managing Big Data in Machine Learning projects](https://pretalx.com/pyconuk-2019/talk/GCLBFH/)
  by [V Vishnu Anirudh](https://twitter.com/vvasworld) at the
  [Pycon UK 2019.](https://2019.pyconuk.org/)**

> My talk will focus on Version Control Systems (VCS) for big-data projects.
> With the advent of Machine Learning (ML) , the development teams find it
> increasingly difficult to manage and collaborate on projects that deal with
> huge amounts of data and ML models apart from just source code.

https://youtu.be/4XpHk85_x0E

- **Podcast: TWIML Talk #295
  [Managing Deep Learning Experiments](https://twimlai.com/twiml-talk-295-managing-deep-learning-experiments-with-lukas-biewald/)
  with [Lukas Biewald](https://twitter.com/l2k)**

> Seeing a need for reproducibility in deep learning experiments, Lukas founded
> Weights & Biases. In this episode we discuss his experiment tracking tool, how
> it works, the components that make it unique in the ML marketplace and the
> open, collaborative culture that Lukas promotes. Listen to Lukas delve into
> how he got his start in deep learning experiments, what his experiment
> tracking used to look like, the current Weights & Biases business success
> strategy, and what his team is working on today.

<external-link
href="https://twimlai.com/twiml-talk-295-managing-deep-learning-experiments-with-lukas-biewald/"
title="Managing Deep Learning Experiments with Lukas Biewald — Talk #295"
description="Today we are joined by Lukas Biewald, CEO and Co-Founder of Weights & Biases. Lukas, previously CEO and Founder of…"
link="twimlai.com"
image="/uploads/images/2019-11-05/managing-deep-learning-experiments.jpeg" />

<hr />

## Discord gems

There are lots of hidden gems in our Discord community discussions. Sometimes
they are scattered all over the channels and hard to track down.

We are sifting through the issues and discussions and share with you the most
interesting takeaways.

### Q: I’ve just run a `dvc run` step, and realised I forgot to declare an output file. [Is there a way to add an output file without rerunning the (computationally expensive) step/stage?](https://discordapp.com/channels/485586884165107732/485596304961962003/593743448020877323)

If you’ve already ran it, you could just open created DVC-file with an editor
and add an entry to the outs field. After that, just run `dvc commit my.dvc` and
it will save the checksums and data without re-running your command.
`dvc run --no-exec` would also work with commit instead of modifying the
DVC-file by hand.

### Q: [For metric files do I have to use dvc run to set a metric or can I do it some other way?](https://discordapp.com/channels/485586884165107732/485596304961962003/593869598651318282) Can I use metrics functionality without the need to setup and manage DVC cache and remote storage?

Any file that is under DVC control (e.g. added with `dvc add` or an output in
`dvc run -o`) can be made a metric file with dvc metrics add file. Alternatively
a command `dvc run -M` file makes file a metric without caching it. It means dvc
metrics show can be used while file is still versioned by Git.

### Q: [Is there a way not to add the full (Azure) connection string to the .dvc/config file that is being checked into Git for using dvc remotes](https://discordapp.com/channels/485586884165107732/485596304961962003/595586670498283520)? I think it’s quite unhealthy to have secrets checked in SCM.

There are two options — use `AZURE_STORAGE_CONNECTION_STRING` environment
variable or use `--local` flag that will put it into the `.dvc/config.local`
that is added to the `.gitignore`, so you don’t track it with it and so won’t
expose secrets.

### Q: [I would like to know if it is possible to manage files under DVC whilst keeping them in their original locations (e.g. on a network drive in a given folder structure)](https://discordapp.com/channels/485586884165107732/485596304961962003/601068667131920385)? [If I want to add a large file to be tracked by DVC, and it is in a bucket on S3 or GCS, can I do that without downloading it locally?](https://discordapp.com/channels/485586884165107732/485596304961962003/615278138896941101)

Yes, you are probably looking for external dependencies and outputs. This is the
[link](https://dvc.org/doc/user-guide/managing-external-data) to the
documentation to start.

### Q: [How do I setup DVC so that NAS (e.g. Synology) acts as a shared DVC cache?](https://discordapp.com/channels/485586884165107732/485596304961962003/606388040377565215)

Using NAS (e.g. NFS) is a very common scenario for DVC. In short you use
`dvc cache dir` to setup a cache externally. Set cache type to use symlinks and
enable protected mode. We are preparing a
[document](https://github.com/iterative/dvc.org/blob/31c5d424c6530bb793af69c2af578d2b8a374d02/static/docs/use-cases/shared-storage-on-nfs.md)
how to setup the NFS as a shared cache, but I think it can be applied to any
NAS.

### Q: So I have some data that is in the hundreds of gigs. [If I enable symlink, hardlink strategy and cache protecting, will DVC automatically choose this strategy over copying when trying to use dvc add](https://discordapp.com/channels/485586884165107732/485596304961962003/608013531010301952)?

Yes, it will! Here is some clarification. So when you set those settings like
that, `dvc add` data will move data to your cache and then will create a
hardlink from your cache to your workspace.

Unless your cache directory and your workspace are on different file systems,
move should be instant. Please, find more information
[here](https://dvc.org/doc/user-guide/large-dataset-optimization).

### Q: My repo’s DVC is “busy and locked” and I’m not sure how it got that way and how to remove/diagnose the lock. [Any suggestions?](https://discordapp.com/channels/485586884165107732/485596304961962003/608392956679815168)

DVC uses a lock file to prevent running two commands at the same time. The lock
[file](https://dvc.org/doc/user-guide/dvc-files-and-directories#dvc-files-and-directories)
is under the `.dvc` directory. If no DVC commands running and you are still
getting this error it’s safe to remove this file manually to resolve the issue.

### Q: [I’m trying to understand how does DVC remote add work in case of a local folder and what is the best workflow when data is outside of your project root?](https://discordapp.com/channels/485586884165107732/485596304961962003/611209851757920266)

When using DVC, in most cases we assume that your data will be somewhere under
project root. There is an option to use so called
[external dependencies](https://dvc.org/doc/user-guide/managing-external-data),
which is data that is usually too big to be stored under your project root, but
if you operate on data that is of some reasonable size, I would recommend
starting with putting data somewhere under project root. Remotes are usually
places where you store your data, but it is DVC task to move your data around.
But if you want to keep your current setup where you will have data in different
place than your project, you will need to refer to data with full paths. So, for
example:

1. You are in `/home/gabriel/myproject` and you have initialized dvc and git
   repository

2. You have `featurize.py` in your project dir, and want to use data to produce
   some features and than `train.py` to train a model.

3. Run the command:

```dvc
$ dvc run -d /research_data/myproject/videos \
          -o /research_data/myproject/features \
          python featurize.py
```

to tell DVC, that you use `/research_data/myproject/videos` to featurize, and
produce output to your features dir. Note that your code should be aware of
those paths, they can be hardcoded inside `featurize.py`, but point of `dvc run`
is just to tell DVC what artifacts belong to currently defined step of ML
pipeline.

### Q: When I run `du` command to check how much space DVC project consumes I see that it duplicates/copies data. [It’s very space and time consuming to copy large data files, is there a way to avoid that?](https://discordapp.com/channels/485586884165107732/485596304961962003/613935477896249364) It takes too long to add large files to DVC.

Yes! You don’t have to copy files with DVC. First of all, there are two reasons
when du can show that it takes double the space to store data under DVC control.
du can be inaccurate when the underlying file system supports reflinks (XFS on
Linux, APFS on Mac, etc). This is actually the best scenario since no copying is
happening and no changes are required to any DVC settings. Second, case means
that copy semantics is used by default. It can be turned off by providing cache
type `symlinks`, `hardlinks`. Please, read more on this
[here](https://dvc.org/doc/user-guide/large-dataset-optimization#file-link-types-for-the-dvc-cache).

### Q: [How can I detach a file from DVC control?](https://discordapp.com/channels/485586884165107732/485596304961962003/615479227189559323)

Just removing the corresponding DVC-file and running `dvc gc` after that should
be enough. It’ll stop tracking the data file and clean the local cache that
might still contain it. Note! Don’t forget to run `dvc unprotect` if you use
advanced[ DVC setup with symlinks and hardlinks](https://dvc.org/doc/user-guide/large-dataset-optimization)
(`cache.type` config option is not default). If `dvc gc` behavior is not
granular enough you can manually find the by its cache from the DVC-file in
`.dvc/cache` and remote storage. Learn
[here](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory)
how they are organized.

### Q: [I’m trying to understand if DVC is an appropriate solution for storing data under GDPR requirements.](https://discordapp.com/channels/485586884165107732/485596304961962003/621057268145848340) That means that permanent deletion of files with sensitive data needs to be fully supported.

Yes, in this sense DVC is not very different from using bare S3, SSH or any
other storage where you can go and just delete data. DVC can give a bit of
overhead to locate a specific file to delete, but otherwise it’s all the same
you will be able to delete any file you want. See more details on how you
retrospectively can edit directories under DVC control
[here](https://discordapp.com/channels/485586884165107732/485596304961962003/621062105524862987).

<hr />

If you have any questions, concerns or ideas, let us know in the comments below
or connect with DVC team [here](https://dvc.org/support). Our
[DMs on Twitter](https://twitter.com/DVCorg) are always open, too.
