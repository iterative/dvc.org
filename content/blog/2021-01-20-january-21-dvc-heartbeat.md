---
title: January '21 Heartbeat
date: 2021-01-20
description: |
  Monthly updates are here- read all about 
  our new R language tutorial, putting DVC 
  to work on an image segmentation pipeline,
  and a new fast way to setup your DVC remote.
descriptionLong: |
  Monthly updates are here- read all about 
  our new R language tutorial, putting DVC 
  to work on an image segmentation pipeline,
  and a new fast way to setup your DVC remote.
picture: 2020-12-18/cover.png
pictureComment: |
  This holiday season, show your loved ones
  you care with our new shirt.

author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/dvc-heartbeat-jan-21/632
tags:
  - Heartbeat
  - CML
  - DVC
  - DAGsHub
  - R
  - MLOps
---

## News

Welcome to the first Heartbeat of 2021! Here's some new year news.

### We're still hiring

Our search continues for a
[**Developer Advocate**](https://weworkremotely.com/remote-jobs/iterative-developer-advocate)
to support and inspire developers by creating new content like blogs, tutorials,
and videos- plus lead outreach through meetups and conferences.

Does this sound like you or someone you know? Be in touch!

### 7000 stars on GitHub

We recently passed 7000 stars on the
[DVC GitHub repository](https://github.com/iterative/dvc)! We crossed the 7k
mark extremely close to midnight on New Year's Eve, so we probably hit it in
time for the new year in at least one time zone. Anyway, it made for a very
suspenseful countdown to midnight. Woot woot!

https://media.giphy.com/media/QAPFLCrpfalPi/giphy.gif

The repo is HQ for DVC development, meaning- if you have an issue to report, a
feature to request, or a pull request to offer, this is where you should start!

### New video for R users

A lot of our videos about GitHub Actions have used Python scripts, but there's
no reason to restrict [Continuous Machine Learning](https://cml.dev) to one
language. We've just released our first-ever R language video, which covers

- How to install R on a GitHub Actions runner
- How to manage R package dependencies for continuous integration (teaser: CRAN
  binaries are amazing)
- Putting a `ggplot` or a `kable` table in your pull request

Watch and follow along! If you make something based on this approach, or if you
think there's a better way, please tell us- we're eager to see what the R
community thinks.

https://youtu.be/NwUijrm2U2w

### Workshops and talks

Coming up Friday, Jan 21, I (Elle) will be speaking with
[Alexey Grigorev](https://twitter.com/Al_Grigor), author of a
[Data Science Bookcamp](https://mlbookcamp.com/), on his podcast about being a
developer advocate in the machine learning space! If you're curious about what
the role entails, or what to look for when hiring a developer advocate for your
machine learning project, please come by. The event will be recorded live and
then shared for your listening pleasure 🎧

https://twitter.com/Al_Grigor/status/1351955523890012167

## From the community

As ever, we have much to share from the great citizens of the DVC community.

### Where's Baby Yoda?

There's a brand new blog post we love, and only half of that has to do with its
impressive collection of Baby Yoda pics.
[Simon Lousky](https://dagshub.com/blog/author/simon/), developer at
[DAGsHub](https://dagshub.com), published a blog provocatively titled
[_Datasets should behave like git repositories_](https://dagshub.com/blog/datasets-should-behave-like-git-repositories/).
He writes:

> While data versioning solves the problem of managing data in the context of
> your machine learning project, it brings with it a new approach to managing
> datasets. This approach, also described as data registries here, consists of
> creating a git repository entirely dedicated to managing a dataset. This means
> that instead of training models on frozen datasets - something researchers,
> students, kagglers, and open source machine learning contributors often do -
> you could link your project to a dataset (or to any file for that matter), and
> treat it as a dependency. After all, data can and should be treated as code,
> and follow through a review process.

We agree! Lousky goes on to show us a brilliant code example wherein he segments
instances of Baby Yoda out of frames from The Mandalorian. DVC plays a key role
in keeping track of all the Baby Yodas, which is pretty much the most important
use case we could've imagined.

![](/uploads/images/2021-01-20/bb_yoda.png)_Found them!_

There's also a
[lively discussion about the post on Reddit](https://www.reddit.com/r/MachineLearning/comments/l0l0oc/p_datasets_should_behave_like_git_repositories/).
Check it out and consider contributing your own Baby Yoda image annotations to
grow the dataset!

### Data Version Control Explained

Researcher [Nimra Ejaz](https://blog.crowdbotics.com/author/nimra/) published a
fantastically detailed introduction to DVC. She even included a "History of DVC"
section, which is pretty cool for us- this might be a first!

Her blog covers not only the key features of DVC, but a thoughtful pros-and-cons
list _and_ a case study about using DVC in an image classification project. If
you want an up-to-date, high-level overview of DVC and some help deciding if it
fits your needs, I couldn't recommend Nimra's blog more.

<external-link
href="https://blog.crowdbotics.com/data-version-control-explained/"
title="Data Version Control Explained"
description="Nimra Ejaz"
link="crowdbotics.com"
image="/uploads/images/2021-01-20/crowdbotics.png"/>

### One more thing from DAGsHub

[Dean Pleban](https://twitter.com/DeanPlbn), CEO of DAGsHub, shared an important
update: they now offer FREE dataset and model hosting for DVC projects (up to 10
GB per user and project, with flexibility for public projects)! And with no
configuration!

That means you don't have to configure your DVC remote to use DVC with model and
data storage in the cloud- DAGsHub will handle _all_ of it. Your DVC remote can
be added as easily as a Git remote, in other words. Read the announcement, and
then dig into their
[basic tutorial](https://dagshub.com/docs/experiment-tutorial/overview/) to get
started.

<external-link
href="https://dagshub.com/blog/dagshub-storage-zero-configuration-dataset-model-hosting/"
title="Free Dataset & Model Hosting with Zero Configuration – Launching DAGsHub Storage"
description="Dean Pleban"
link="dagshub.com"
image="/uploads/images/2021-01-20/dagshub.jpg"/>

### A nice tweet

[Bilgin Ibryam](https://twitter.com/bibryam), author of the
[Kubernetes Patterns](https://www.redhat.com/en/engage/kubernetes-containers-architecture-s-201910240918)
book, gave us a shoutout for being an interesting data engineering project
(according to a list by another expert we trust,
[Dmitry Ryabov](https://twitter.com/squarecog)). Thanks Bilgin and Dmitry, we
think you're very interesting too!

https://twitter.com/bibryam/status/1341777034448650242
