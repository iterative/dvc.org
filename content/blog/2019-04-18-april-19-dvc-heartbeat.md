---
title: April ’19 DVC❤️Heartbeat
date: 2019-04-18
description: |
  DVC creator Dmitry Petrov is giving a talk on PyCon 2019 🎤, new DVC logo
  design, new Discord discussions, interesting reads that caught our eye, and
  everything along the way.
descriptionLong: |
  Every month we are sharing here our news, findings, interesting reads,
  community takeaways, and everything along the way.

  Some of those are related to our brainchild [DVC](https://dvc.org) and its
  journey. The others are a collection of exciting stories and ideas centered
  around ML best practices and workflow.
picture: 2019-04-18/post-image.jpeg
author: svetlana_grinchenko
commentsUrl: https://discuss.dvc.org/t/april-19-dvc-heartbeat/292
tags:
  - Heartbeat
  - Discord Gems
  - PyCon
---

## News and links

We have some exciting news to share this month!

DVC is going to [PyCon 2019](https://us.pycon.org/2019/)! It is the first
conference that we attend as a team. When we say ‘team’ — we mean it. Our
engineers are flying from all over the globe to get together offline and catch
up with fellow Pythonistas.

The [speaker pipeline](https://us.pycon.org/2019/schedule/talks/list/) is
amazing! DVC creator Dmitry Petrov is giving a talk on
[Machine learning model and dataset versioning practices](https://us.pycon.org/2019/schedule/presentation/176/).

Stop by our booth at the Startup Row on Saturday, May 4, reach out and let us
know that you are willing to chat, or simply find a person with a huge DVC owl
on their shirt!

Speaking of the owls — DVC has done some rebranding recently and we love our new
logo. Special thanks to [99designs.com](https://99designs.com/) for building a
great platform for finding trusted designers.

![](/uploads/images/2019-04-18/trusted-designers.png)

DVC is moving fast (almost as fast as my two-year-old). We do our best to keep
up and totally love all the buzz in our community channels lately!

Here is a number of interesting reads that caught our eye:

- **[A walkthrough of DVC](https://blog.codecentric.de/en/2019/03/walkthrough-dvc/)
  by [Bert Besser](https://www.linkedin.com/in/bert-besser-284564182/)**

<external-link
href="https://blog.codecentric.de/en/2019/03/walkthrough-dvc/"
title="A walkthrough of DVC — codecentric AG Blog"
description="This post is on how to systematially organize Machine Learning (ML) model development. A model’s performance improves…"
link="blog.codecentric.de"
image="/uploads/images/2019-04-18/walkthrough-of-dvc.png" />

A great article about using DVC with a quite advanced scenario and docker. If
you haven’t had a chance to try [DVC.org](http://dvc.org/) yet — this is a great
comprehensive read on why you should do so right away.

- **[The state of machine learning operations](https://github.com/EthicalML/state-of-mlops-2019)
  by [Alejandro Saucedo](https://www.linkedin.com/in/axsaucedo/)**

<external-link
href="https://github.com/EthicalML/state-of-mlops-2019"
title="The state of machine learning operations"
description="Contribute to EthicalML/state-of-mlops-2019 development by creating an account on GitHub."
link="github.com"
image="/uploads/images/2019-04-18/the-state-of-machine-learning-operations.jpeg" />

A short (only 8 minutes!) and inspiring talk by Alejandro Saucedo at FOSDEM.
Alejandro covers the key trends in machine learning operations, as well as most
recent open source tools and frameworks. Focused on reproducibility, monitoring
and explainability, this lightning talk is a great snapshot of the current state
of ML operations.

- **[Interview with Kaggle Grandmaster, Senior Computer Vision Engineer at Lyft: Dr. Vladimir I. Iglovikov](https://hackernoon.com/interview-with-kaggle-grandmaster-senior-cv-engineer-at-lyft-dr-vladimir-i-iglovikov-9938e1fc7c)
  by [Sanyam Bhutani](https://twitter.com/bhutanisanyam1)**

<external-link
href="https://hackernoon.com/interview-with-kaggle-grandmaster-senior-cv-engineer-at-lyft-dr-vladimir-i-iglovikov-9938e1fc7c"
title="Interview with Kaggle Grandmaster, Senior Computer Vision Engineer at Lyft: Dr. Vladimir I. Iglovikov"
description="Part 24 of The series where I interview my heroes."
link="hackernoon.com"
image="/uploads/images/2019-04-18/interview-with-kaggle-grandmaster.jpeg" />

> There is no way you will become Kaggle Master and not learn how to approach
> anew, the unknown problem in a fast hacking way with a very high number of
> iterations per unit of time. This skill in the world of competitive learning
> is the question of survival

<hr />

## Discord gems

There are lots of hidden gems in our Discord community discussions. Sometimes
they are scattered all over the channels and hard to track down.

We are sifting through the issues and discussions and share with you the most
interesting takeaways.

### Q: [What are the system requirements to install DVC (type of operating system, dependencies of another application (as GIT), memory, cpu, etc).](https://discordapp.com/channels/485586884165107732/485596304961962003/552098155861114891)

- It supports Windows, Mac, Linux. Python 2 and 3.

- No specific CPU or RAM requirements — it’s a lightweight command line tool and
  should be able run pretty much everywhere you can run Python.

- It depends on a few Python libraries that it installs as dependencies (they
  are specified in the
  [`setup.py`](https://github.com/iterative/dvc/blob/master/setup.py)).

- It does not depend on Git and theoretically could be run without any SCM.
  Running it on top of a Git repository however is recommended and gives you an
  ability to actually save history of datasets, models, etc (even though it does
  not put them into Git directly).

### Q: [Do I have to buy a server license to run DVC, do you have this?](https://discordapp.com/channels/485586884165107732/485596304961962003/560212552638791706)

No server licenses for DVC. It is 100% free and open source.

### Q: [What is the storage limit when using DVC?](https://discordapp.com/channels/485586884165107732/485596304961962003/560154903331340289)

I am trying to version control datasets and models with >10 GB (Potentially even
bigger). Can DVC handle this?

There is no limit. None enforced by DVC itself. It depends on the size of your
local or [remote storages](https://dvc.org/doc/commands-reference/remote). You
need to have some space available on S3, your SSH server or other storage you
are using to keep these data files, models and their version, which you would
like to store.

### Q: [How does DVC know the sequence of stages to run](https://discordapp.com/channels/485586884165107732/485596304961962003/553731815228178433)?

How does it connect them? Does it see that there is a dependency which is
outputted from the first run?

DVC figures out the pipeline by looking at the dependencies and outputs of the
stages. For example, having the following:

`gist:SvetaGr/a2a28fbc9db0a675422785bc5f925e14#heartbeat-dvc-run-2019-04.sh`

you will end up with two stages: `download.dvc` and `duplicate.dvc`. The
download one will have `joke.txt` as an output . The duplicate one defined
`joke.txt` as a dependency, as it is the same file. DVC detects that and creates
a pipeline by joining those stages.

You can inspect the content of each stage file
[here](https://dvc.org/doc/user-guide/dvc-file-format) (they are human
readable).

### Q: [Is it possible to use the same data of a remote in two different repositories?](https://discordapp.com/channels/485586884165107732/485596304961962003/560022999848321026)

(e.g. in one repo `run dvc pull -r my_remote` to pull some data and running the
same command in a different git repo should also pull the same)

Yes! It’s a frequent scenario for multiple repos to share remotes and even local
cache. DVC file serves as a link to the actual data. If you add the same DVC
file (e.g. `data.dvc`) to the new repo and do `dvc pull -r remotename data.dvc`-
it will fetch data. You have to use `dvc remote add` first to specify the
coordinates of the remote storage you would like to share in every project.
Alternatively (check out the question below), you could use `--global` to
specify a single default remote (and/or cache dir) per machine.

### Q: [Could I set a global remote server, instead of config in each project?](https://discordapp.com/channels/485586884165107732/485586884165107734/559653121228275727)

Use `--global` when you specify the remote settings. Then remote will be visible
for all projects on the same machine. `--global` — saves remote configuration to
the global config (e.g. `~/.config/dvc/config`) instead of a per project one —
`.dvc/config`. See more details
[here](https://dvc.org/doc/commands-reference/remote/add).

### Q: [How do I version a large dataset in S3 or any other storage?](https://discordapp.com/channels/485586884165107732/485596304961962003/554679392823934977)

We would recommend to skim through our
[get started](https://dvc.org/doc/get-started) tutorial, to summarize the data
versioning process of DVC:

- You create stage (aka DVC) files by adding, importing files (`dvc add` /
  `dvc import`) , or run a command to generate files:

```dvc
$ dvc run --out file.csv "wget https://example.com/file.csv"
```

- This stage files are tracked by `git`

- You use git to retrieve previous stage files (e.g. `git checkout v1.0`)

- Then use `dvc checkout` to retrieve all the files related by those stage files

All your files (with each different version) are stored in a `.dvc/cache`
directory, that you sync with a remote file storage (for example, S3) using the
`dvc push` or `dvc pull` commands (analogous to a `git push` / `git pull`, but
instead of syncing your `.git`, you are syncing your `.dvc` directory) on a
remote repository (let’s say an S3 bucket).

### Q: [How do I move/rename a DVC-file?](https://discordapp.com/channels/485586884165107732/485596304961962003/558216007684980736)

If you need to move your dvc file somewhere, it is pretty easy, even if done
manually:

`gist:SvetaGr/b25a5b45773bf94d36e60d48462502f4#heartbeat-dvc-rename.sh`

### Q: [I performed `dvc push` of a file to a remote. On the remote there is created a directory called `8f` with a file inside called `2ec34faf91ff15ef64abf3fbffa7ee`. The original CSV file doesn’t appear on the remote. Is that expected behaviour?](https://discordapp.com/channels/485586884165107732/485596304961962003/555431645402890255)

This is an expected behavior. DVC saves files under the name created from their
checksum in order to prevent duplication. If you delete “pushed” file in your
project directory and perform `dvc pull`, DVC will take care of pulling the file
and renaming it to “original” name.

Below are some details about how DVC cache works, just to illustrate the logic.
When you add a data source:

`gist:SvetaGr/b69fa8ce36bcce00ecd69e7f2d7ccd2e#heartbeat-remote-file-naming.sh`

It computes the (md5) checksum of the file and generates a DVC file with related
information:

`gist:SvetaGr/110ae76df929654ec573ea9e4b1e1980#heartbeat-dvc-file-2019-04.yaml`

The original file is moved to the cache and a link or copy (depending on your
filesystem) is created to replace it on your working space:

`gist:SvetaGr/133cb93e5a21c6f21a86f8709ed39ea9#heartbeat-cache-structure-2019-04.sh`

### Q: [Is it possible to integrate dvc with our in-house tools developed in Python?](https://discordapp.com/channels/485586884165107732/485586884165107734/553570391000481802)

Absolutely! There are three ways you could interact with DVC:

1. Use [subprocess](https://docs.python.org/3/library/subprocess.html) to launch
   DVC

2. Use `from dvc.main import main` and use it with regular CLI logic like
   `ret = main(‘add’, ‘foo’)`

3. Use our internal API (see `dvc/repo` and `dvc/command` in our source to get a
   grasp of it). It is not officially public yet, and we don’t have any special
   docs for it, but it is fairly stable and could definitely be used for a POC.
   We’ll add docs and all the official stuff for it in the not-so-distant
   future.

### Q: [Can I still track the linkage between data and model without using `dvc run`](https://discordapp.com/channels/485586884165107732/485586884165107734/555750217522216990) and a graph of tasks? Basically what would like extremely minimal DVC invasion into my GIT repo for an existing machine learning application?

There are two options:

1. Use `dvc add` to track models and/or input datasets. It should be enough if
   you use `git commit` on DVC files produced by `dvc add`. This is the very
   minimum you can get with DVC and it does not require using DVC run. Check the
   first part (up to the Pipelines/Add transformations section) of the DVC
   [get started](https://dvc.org/doc/get-started).

2. You could use `--no-exec` in `dvc run` and then just `dvc commit` and
   `git commit` the results. That way you’ll get your DVC files with all the
   linkages, without having to actually run your commands through DVC.

If you have any questions, concerns or ideas, let us know
[here](https://dvc.org/support) and our stellar team will get back to you in no
time.
