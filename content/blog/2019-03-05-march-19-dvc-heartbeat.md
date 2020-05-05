---
title: March ’19 DVC❤️Heartbeat
date: 2019-03-05
description: |
  The very first issue of the DVC Heartbeat! News, links, Discord discussions
  from the community.
descriptionLong: |
  Every month we are sharing here our news, findings, interesting reads,
  community takeaways, and everything along the way.

  Some of those are related to our brainchild [DVC](https://dvc.org) and its
  journey. The others are a collection of exciting stories and ideas centered
  around ML best practices and workflow.
picture: 2019-03-05/post-image.jpeg
author: svetlana_grinchenko
commentsUrl: https://discuss.dvc.org/t/march-19-dvc-heartbeat/293
tags:
  - Heartbeat
  - Discord Gems
---

This is the very first issue of the DVC❤️Heartbeat. Every month we will be
sharing our news, findings, interesting reads, community takeaways, and
everything along the way.

Some of those are related to our brainchild [DVC](https://dvc.org) and its
journey. The others are a collection of exciting stories and ideas centered
around ML best practices and workflow.

## News and links

We read a ton of articles and posts every day and here are a few that caught our
eye. Well-written, offering a different perspective and definitely worth
checking.

- **[Data science is different now](https://veekaybee.github.io/2019/02/13/data-science-is-different/)
  by [Vicki Boykis](https://veekaybee.github.io/)**

<external-link
href="https://veekaybee.github.io/2019/02/13/data-science-is-different/"
title="Data science is different now"
description="Woman holding a balance, Vermeer 1664 What do you think of when you read the phrase 'data science'? It's probably some…"
link="veekaybee.github.io"
image="/uploads/images/2019-03-05/data-science-is-different-now.png" />

> What is becoming clear is that, in the late stage of the hype cycle, data
> science is asymptotically moving closer to engineering, and the
> [skills that data scientists need](https://www.youtube.com/watch?v=frQeK8xo9Ls)
> moving forward are less visualization and statistics-based, and
> [more in line with traditional computer science curricula](https://tech.trivago.com/2018/12/03/teardown-rebuild-migrating-from-hive-to-pyspark/).

- **[Data Versioning](https://emilygorcenski.com/post/data-versioning/) by
  [Emily F. Gorcenski](https://emilygorcenski.com/)**

<external-link
href="https://emilygorcenski.com/post/data-versioning/"
title="Data Versioning"
description="Productionizing machine learning/AI/data science is a challenge. Not only are the outputs of machine-learning…"
link="emilygorcenski.com"
image="/uploads/images/2019-03-05/data-versioning.jpeg" />

> I want to explore how the degrees of freedom in versioning machine learning
> systems poses a unique challenge. I’ll identify four key axes on which machine
> learning systems have a notion of version, along with some brief
> recommendations for how to simplify this a bit.

- **[Reproducibility in Machine Learning](https://blog.mi.hdm-stuttgart.de/index.php/2019/02/26/reproducibility-in-ml/)
  by [Pascal Fecht](https://blog.mi.hdm-stuttgart.de/index.php/author/pf023/)**

<external-link
href="https://emilygorcenski.com/post/data-versioning/"
title="Reproducibility in Machine Learning | Computer Science Blog"
description="The rise of Machine Learning has led to changes across all areas of computer science. From a very abstract point of…"
link="blog.mi.hdm-stuttgart.de"
image="/uploads/images/2019-03-05/reproducibility-in-machine-learning.jpeg" />

> ...the objective of this post is not to philosophize about the dangers and
> dark sides of AI. In fact, this post aims to work out common challenges in
> reproducibility for machine learning and shows programming differences to
> other areas of Computer Science. Secondly, we will see practices and workflows
> to create a higher grade of reproducibility in machine learning algorithms.

<hr />

## Discord gems

There are lots of hidden gems in our Discord community discussions. Sometimes
they are scattered all over the channels and hard to track down.

We will be sifting through the issues and discussions and share the most
interesting takeaways.

### Q: [Edit and define DVC files manually, in a Makefile style](https://discordapp.com/channels/485586884165107732/485586884165107734/541622187296161816)

There is no separate guide for that, but it is very straight forward. See
[DVC file format](https://dvc.org/doc/user-guide/dvc-file-format) description
for how DVC file looks inside in general. All `dvc add` or `dvc run` does is
just computing `md5` fields in it, that is all. You could write your DVC-file
and then run `dvc repro` that will run a command(if any) and compute all needed
checksums,[read more](https://discordapp.com/channels/485586884165107732/485586884165107734/541622187296161816).

### Q: [Best practices to define the code dependencies](https://discordapp.com/channels/485586884165107732/485586884165107734/547424240677158915)

There’s a ton of code in that project, and it’s very non-trivial to define the
code dependencies for my training stage — there are a lot of imports going on,
the training code is distributed across many modules,
[read more](https://discordapp.com/channels/485586884165107732/485586884165107734/547424240677158915)

### Q: [Azure data lake support](https://discordapp.com/channels/485586884165107732/485586884165107734/548495589428428801)

DVC officially only supports regular Azure blob storage. Gen1 Data Lake should
be accessible by the same interface, so configuring a regular azure remote for
DVC should work. Seems like Gen2 Data Lake
[has disable](https://discordapp.com/channels/485586884165107732/485586884165107734/550546413197590539)
blob API. If you know more details about the difference between Gen1 and Gen2,
feel free to join [our community](https://dvc.org/chat) and share this
knowledge.

### Q: [What licence DVC is released under](https://discordapp.com/channels/485586884165107732/485596304961962003/542390986299539459)

Apache 2.0. One of the [most common](https://opensource.org/licenses) and
permissible OSS licences.

### Q: Setting up S3 compatible remote

([Localstack](https://discordapp.com/channels/485586884165107732/485596304961962003/543445798868746278),
[wasabi](https://discordapp.com/channels/485586884165107732/485596304961962003/541466951474479115))

```dvc
$ dvc remote add upstream s3://my-bucket
$ dvc remote modify upstream region REGION_NAME
$ dvc remote modify upstream endpointurl <url>
```

Find and click the `S3 API compatible storage` on
[this page](https://dvc.org/doc/commands-reference/remote/add)

### Q: [Why DVC creates and updates `.gitignore` file?](https://discordapp.com/channels/485586884165107732/485596304961962003/543914550173368332)

It adds your data files there, that are tracked by DVC, so that you don’t
accidentally add them to git as well you can open it with file editor of your
liking and see your data files listed there.

### Q: [Managing data and pipelines with DVC on HDFS](https://discordapp.com/channels/485586884165107732/485596304961962003/545562334983356426)

With DVC, you could connect your data sources from HDFS with your pipeline in
your local project, by simply specifying it as an external dependency. For
example let’s say your script `process.cmd` works on an input file on HDFS and
then downloads a result to your local workspace, then with DVC it could look
something like:

```dvc
$ dvc run -d hdfs://example.com/home/shared/input \
          -d process.cmd \
          -o output process.cmd
```

[read more](https://discordapp.com/channels/485586884165107732/485596304961962003/545562334983356426).

<hr />

If you have any questions, concerns or ideas, let us know
[here](https://dvc.org/support) and our stellar team will get back to you in no
time.
