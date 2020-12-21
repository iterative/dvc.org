---
title: July ’19 DVC❤️Heartbeat
date: 2019-08-01
description: |
  As we continue to grow DVC together with our fantastic contributors, we enjoy
  more and more insights, discussions, and articles either created or brought to
  us by our community.
descriptionLong: |
  Every month we are sharing here our news, findings, interesting reads,
  community takeaways, and everything along the way.

  Some of those are related to our brainchild [DVC](https://dvc.org) and its
  journey. The others are a collection of exciting stories and ideas centered
  around ML best practices and workflow.
picture: 2019-08-01/post-image.png
pictureComment: |
  Special edition
  [DVC shirt](https://twitter.com/rkuprieiev/status/1144298339200098306?s=20).
  We made this one for [Ruslan](https://github.com/efiop) — DVC maintainer and
  the best tech lead.
author: svetlana_grinchenko
commentsUrl: https://discuss.dvc.org/t/july-19-dvc-heartbeat/288
tags:
  - Heartbeat
  - Open Source Summit
  - Discord Gems
---

## News and links

As we continue to grow DVC together with our fantastic contributors, we enjoy
more and more insights, discussions, and articles either created or brought to
us by our community. We feel it is the right time to start sharing more of your
news, your stories and your discoveries. New Heartbeat is here!

Speaking of our own news — next month DVC team is going to the
[Open Source North America Summit](https://events.linuxfoundation.org/events/open-source-summit-north-america-2019/).
It is taking place in San Diego on August 21–23.
[Dmitry](https://ossna19.sched.com/speaker/dmitry35) and
[Sveta](https://ossna19.sched.com/speaker/svetlanagrinchenko) will be giving
talks and we will run a booth. So looking forward to it! Stop by for a chat and
some cool swag. And if you are in San Diego on those days and want to catch up —
please let us know [here](http://dvc.org/support) or on Twitter!

<external-link
href="https://ossna19.sched.com/event/PUVv/open-source-tools-for-ml-experiments-management-dmitry-petrov-ruslan-kuprieiev-iterative-ai"
title="Open Source Summit + ELC North America 2019: Open Source Tools for ML Experiments Man..."
description="Speakers Software Engineer, Iterative AI Ruslan is a Software Engineer at Iterative AI. Previously he worked on live…"
link="ossna19.sched.com"
image="/uploads/images/2019-08-01/open-source-north-america-summit.png" />

<external-link
href="https://ossna19.sched.com/event/PWNk/speaker-preparation-simple-steps-with-a-tremendous-impact-svetlana-grinchenko-dvcorg"
title="Open Source Summit + ELC North America 2019: Speaker Preparation: Simple Steps with a..."
description="Speakers Head of Developer Relations, DVC.org Svetlana is driving developer relations and community at DVC.org…"
link="ossna19.sched.com"
image="/uploads/images/2019-08-01/open-source-north-america-summit.png" />

Every month our team is excited to discover new great pieces of content
addressing some of the burning ML issues. Here are some of the links that caught
our eye in June:

- **[Principled Machine Learning: Practices and Tools for Efficient Collaboration](https://dev.to/robogeek/principled-machine-learning-4eho)
  by [David Herron](https://medium.com/@7genblogger)**

<external-link
href="https://dev.to/robogeek/principled-machine-learning-4eho"
title="Principled Machine Learning: Practices and Tools for Efficient Collaboration"
description="Machine learning projects are often harder than they should be. The code to train an ML model is just software, and we…"
link="dev.to"
image="/uploads/images/2019-08-01/principled-machine-learning.jpeg" />

> As we’ve seen in this article some tools and practices can be borrowed from
> regular software engineering. However, the needs of machine learning projects
> dictate tools that better fit the purpose.

- **First
  [ML-REPA](http://ml-repa.ru/)[Meetup: Reproducible ML experiments](http://ml-repa.ru/page6697700.html)
  hosted by [Raiffeisen DGTL](https://dgtl.raiffeisen.ru/) check out the video
  and slide decks.**

<external-link
href="http://ml-repa.ru/"
title="Machine Learning REPA"
description="Анонсы мероприятий, проектов, обзоров инструментов и кейсов про ML проекты, управление экспериментами, автоматизацию и…"
link="ml-repa.ru"
image="/uploads/images/2019-08-01/machine-learning-repa.png" />

[ML-REPA](http://ml-repa.ru/) is an a new fantastic resource for
Russian-speaking folks interested in Reproducibility, Experiments and Pipelines
Automation. Curated by [Mikhail Rozhkov](https://twitter.com/mnrozhkov) and
highly recommended by our team.

### [How do you manage your machine learning experiments?](https://www.reddit.com/r/MachineLearning/comments/bx0apm/d_how_do_you_manage_your_machine_learning/) discussion on Reddit is full of insights.

<blockquote class="reddit-card" data-card-created="1576789144"><a href="https://www.reddit.com/r/MachineLearning/comments/bx0apm/d_how_do_you_manage_your_machine_learning/">[D] How do you manage your machine learning experiments?</a> from <a href="http://www.reddit.com/r/MachineLearning">r/MachineLearning</a></blockquote>

<hr />

## Discord gems

There are lots of hidden gems in our Discord community discussions. Sometimes
they are scattered all over the channels and hard to track down.

We are sifting through the issues and discussions and share with you the most
interesting takeaways.

### Q: I have within one git repository different folders with very different content (basically different projects, or content I want to have different permissions to), and I thought about using different buckets in AWS as remotes. [I’m not sure if it’s possible with DVC to store some files in some remote, and some other files in some other remote, is it?](https://discordapp.com/channels/485586884165107732/485596304961962003/575718048330416158)

You can definitely add more than one remote (see
[dvc remote add](https://dvc.org/doc/commands-reference/remote/add)) and then
[dvc push](https://dvc.org/doc/commands-reference/push) has a `-R` option to
pick which one to send the cached data files (deps, outs, etc) to. We would not
recommend doing this though. It complicates the commands you have to run — you
will need to remember to specify a remote name for every command that deals with
data — `push`, `pull`, `gc`, `fetch`, `status`, etc. Please, leave a comment in
the relevant issue [here](https://github.com/iterative/dvc/issues/2095) if this
case is important for you.

### Q: [Is that possible with DVC to have multiple (few) metric files and compare them all at once?](https://discordapp.com/channels/485586884165107732/485596304961962003/578532350221352987) For example, we’d like to consider as metrics the loss of a neural network training process (loss as a `-M` output of a training stage), and also apart knowing the accuracy of the NN on a test set (another `-M` output of eval stage).

Yes, it is totally fine to use `-M` in different stages. `dvc metrics show` will
just show both metrics.

### Q: [I have a scenario where an artifacts (data) folder is created by the dvc run command via the `-o` flag. I have manually added another file into or modified the artifacts folder but when I do `dvc push` nothing happens, is there anyway around this?](https://discordapp.com/channels/485586884165107732/485596304961962003/577362750443880449)

Let’s first do a quick recap on how DVC handles data files (you can definitely
find more information on the [DVC documentation site](http://dvc.org/docs)).

- When you do `dvc add`, `dvc run` or `dvc import` DVC puts artifacts (in case
  of `dvc run` artifacts == outputs produced by the command) into `.dvc/cache`
  directory (default cache location). You don’t see this happening because
  [DVC keeps links](https://dvc.org/doc/user-guide/large-dataset-optimization)
  (or in certain cases creates a copy) to these files/directories.

- `dvc push` does not move files from the workspace (that what you see) to the
  remote storage, it always moves files/directories that are already in cache
  (default is .dvc/cache).

- So, now you’ve added a file manually, or made some other modifications. But
  these files are not in cache yet. The analogy would be `git commit`. You
  change the file, you do `git commit`, only after that you can push something
  to Git server (Github/Gitlab, etc). The difference is that DVC is doing commit
  (moves files to cache) automatically in certain cases — `dvc add`, `dvc run`,
  etc.

There is an explicit command — `dvc commit` - that you should run if you want to
enforce the change to the output produced by `dvc run`. This command will update
the corresponding DVC- files (.dvc extension) and will move data to cache. After
that you should be able to run `dvc push` to save your data on the external
storage.

Note, when you do an explicit commit like this you are potentially “breaking”
the reproducibility. In a sense that there is no guarantee now that your
directory can be produced by `dvc run`/`dvc repro` — since you changed it
manually.

### Q: [I’d like to transform my dataset in-place to avoid copying it, but I can’t use `dvc run` to do this because it doesn’t allow the same directory as an output and a dependency.](https://discordapp.com/channels/485586884165107732/485596304961962003/578898899469729796)

You could do this in one step (one stage). So that getting your data and
modifying it, is one stage. So you don’t depend on the data folder. You just
could depend on your download + modifying script.

### Q: [Can anyone tell me what this error message is about?](https://discordapp.com/channels/485586884165107732/485596304961962003/579283950778712076) “To avoid unpredictable behavior, rerun command with non overlapping outs paths.”

Most likely it means that there is a DVC-file that have the same output twice.
Or there two DVC-files that share the same output file.

### Q: [I’m getting “No such file or directory” error when I do `dvc run` or `dvc repro`](https://discordapp.com/channels/485586884165107732/485596304961962003/580176327701823498). The command runs find if I don’t use DVC.

That happens because dvc run is trying to ensure that your command is the one
creating your output and removes existing outputs before executing the command.
So that when you run `dvc repro` later, it will be able to fully reproduce the
output. So you need to make the script create the directory or file.

### Q: [I’m implementing a CI/CD and I would like to simplify my CI/CD or even my training code (keeping them cloud agnostic) by using `dvc pull` inside my Docker container when initializing a training job. ](https://discordapp.com/channels/485586884165107732/485596304961962003/581256265234251776) Can DVC be used in this way?

Yes, it’s definitely a valid case for DVC. There are different ways of
organizing the storage that training machines are using to access data. From the
very simple — using local storage volume and pulling data from the remote
storage every time — to using NAS or EFS to store a shared DVC cache.

### Q: [I was able to follow the getting started examples, however now I am trying to push my data to Github, I keep getting the following error: “ERROR: failed to push data to the cloud — upload is not supported by https remote”.](https://discordapp.com/channels/485586884165107732/563406153334128681/598866528984891403)

HTTP remotes do not support upload yet. Example Get Started repository is using
HTTP to keep it read-only and abstract the actual storage provider we are using
internally. If you actually check the remote URL, you should see that it is an
S3 bucket and AWS provides an HTTP end-point to read data from it.

### Q: I’m looking to configure AWS S3 as a storage for DVC. I’ve set up the remotes and initialized dvc in the git repository. I tried testing it by pushing a dataset in the form of an excel file. The command completed without any issues but this is what I’m seeing in S3. [DVC seems to have created a subdirectory in the intended directory called “35” where it placed this file with a strange name.](https://discordapp.com/channels/485586884165107732/485596304961962003/585967551708921856)

This is not an issue, it is an implementation detail. There’s no current way to
upload the files with the original filename (In this case, the S3 bucket will
have the file `data.csv` but with another name `20/893143…`). The reason behind
this decision is because we want to store a file only once no matter how many
dataset versions it’s used in. Also, it’s a reliable way to uniquely identify
the file. You don’t have to be afraid that someone decided to create a file with
the same name (path) but a different content.

### Q: [Is it possible to only have a shared ‘local’ cache and no remote?](https://discordapp.com/channels/485586884165107732/563406153334128681/587730054893666326) I’m trying to figure out how to use this in a 40 node cluster which already has very fast NFS storage across all the nodes. Not storing everything twice seems desirable. Esp. for the multi-TB input data

Yes and it’s one of the very common use case, actually. All you need to do is to
use dvc cache dir command to setup an external cache. There are few caveats
though. Please, read
[this link](https://discuss.dvc.org/t/share-nas-data-in-server/180/4?u=shcheklein)
for an example of the workflow.

<hr />

If you have any questions, concerns or ideas, let us know in the comments below
or connect with DVC team [here](https://dvc.org/support). Our
[DMs on Twitter](https://twitter.com/DVCorg) are always open, too.
