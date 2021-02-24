---
title: December '20 Heartbeat
date: 2020-12-18
description: |
  Monthly updates are here- read all about 
  our brand new video docs, the DVC Udemy 
  course, open jobs with our team, and 
  essential reading about Git-flow with DVC.
descriptionLong: |
  Monthly updates are here- read all about 
  our brand new video docs, the DVC Udemy 
  course, open jobs with our team, and 
  essential reading about Git-flow with DVC.
picture: 2020-12-18/cover.png
pictureComment: |
  This holiday season, show your loved ones
  you care with our new shirt.

author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/december-20-heartbeat/585
tags:
  - Heartbeat
  - CML
  - DVC
  - Udemy
  - MLOps
---

## News

Welcome to the December Heartbeat! Let's dive in with some news from the team.

### We're still hiring

Our search continues for two roles:

- A
  [**Senior Software Engineer**](https://weworkremotely.com/remote-jobs/iterative-senior-software-engineer-open-source-dev-tools-3)
  for the core DVC team- someone with strong Python development skills who can
  build and ship essential DVC features.

- A
  [**Developer Advocate**](https://weworkremotely.com/remote-jobs/iterative-developer-advocate)
  to support and inspire developers by creating new content like blogs,
  tutorials, and videos- plus lead outreach through meetups and conferences.

Does this sound like you or someone you know? Be in touch!

### Video docs complete!

As you may have heard
[last month](https://dvc.org/blog/november-20-dvc-heartbeat), we've been working
on adding complete video docs to the "Getting Started" section of the DVC site.
We now have 100% coverage! We have videos that mirror the tutorials for:

- [Data versioning](/doc/start/data-and-model-versioning) - how to use Git and
  DVC together to track different versions of a dataset

- [Data access](/doc/start/data-and-model-access) - how to share models and
  datasets across projects and environments

- [Pipelines](/doc/start/data-pipelines) - how to create reproducible pipelines
  to transform datasets to features to models

- [Experiments](/doc/start/experiments) - how to do a `git diff` for models that
  compares and visualizes metrics

https://media.giphy.com/media/L4ZZNbDpOCfiX8uYSd/giphy.gif

The
[full playlist is on our YouTube channel](https://www.youtube.com/playlist?list=PL7WG7YrwYcnDb0qdPl9-KEStsL-3oaEjg)-
where, by the way, we've recently passed 2,000 subscribers! Thanks so much for
your support. There's much more coming up soon.

### Collaboration with GitLab

We recently released a new blog with GitLab all about using [CML](cml.dev) with
GitLab CI.

https://twitter.com/gitlab/status/1334631001956487171

You may notice that the tweet spelled our name differently, and since Twitter
doesn't have an edit button, I think that means we're "Interative" now.
[Hurry up and get your merch!](https://www.zazzle.com/t_shirt-235920696568133954)

![](/uploads/images/2020-12-18/newname.png)

### Workshops

We gave a workshop at a virtual meetup held by the
[Toronto Machine Learning Society](https://mlopsworld.com/about-us/), and you
can catch a video recording if you missed it. This workshop was all about
getting started with GitHub Actions and CML! It starts with some high-level
overview and then gets into live-coding.

https://youtu.be/51H13lfHdMw

## From the community

There's no shortage of cool things to report from the community:

### The DVC Udemy Course

Now you can learn the fundamentals of machine learning engineering, from
experiment tracking to data management to continuous integration, with DVC and
Udemy! Data scientists/DVC ambassadors
[Mikhail Rozhkov](https://www.udemy.com/user/mnrozhkov/) and
[Marcel Ribeiro-Dantas](https://www.udemy.com/user/marcel-da-camara-ribeiro-dantas/)
created a course full of
[practical tips and tricks for learners of all levels](https://www.udemy.com/course/machine-learning-experiments-and-engineering-with-dvc/?referralCode=68BEB2A7E246A54E5E35).

<external-link
href="https://www.udemy.com/course/machine-learning-experiments-and-engineering-with-dvc/?referralCode=68BEB2A7E246A54E5E35"
title="Machine Learning Experiments and Engineering with DVC"
description="Automate machine learning experiments, pipelines and model deployment (CI/CD, MLOps) with Data Version Control (DVC)."
link="udemy.com"
image="/uploads/images/2020-12-18/udemy.png"/>

### A proposal for Git-flow with DVC

[Fabian Rabe](https://www.uni-augsburg.de/en/fakultaet/fai/informatik/prof/swtpvs/team/fabian-rabe/)
at [Universität Augsburg](https://www.uni-augsburg.de/en/) wrote a killer doc
about his team's tried-and-true approach to creating a workflow for a DVC
project. He writes,

> Over the past couple of months we have started using DVC in our small team.
> With a handful of developers all coding, training models & committing in the
> same repository, we soon realized the need for a workflow.

The post outlines three strategies his team adopted:

1. Create a "debugging dataset" containing a subset of your data, with which you
   can test your complete DVC pipeline locally on a developer's machine

2. Use CI-Runners to execute the DVC pipeline on the full dataset

3. Adopt a naming convention for Git branches that correspond to machine
   learning experiments, in addition to the usual feature branches

Agree? Disagree? Fabian is actively soliciting feedback on his proposal (and
possible solutions for some unresolved issues), so please read and
[chime in on our discussion board](https://discuss.dvc.org/t/git-flow-for-dvc/578/6).

<external-link
href="https://git.rz.uni-augsburg.de/rabefabi/git-flow-for-dvc"
title="Git Flow for DVC"
description="Fabian Rabe"
link="git.rz.uni-augsburg.de"
image="/uploads/images/2020-12-18/universitat_augs.jpg"/>

### Channel 9 talks Machine Learning and Python

[The AI Show on Channel 9](https://channel9.msdn.com/Shows/AI-Show), part of the
Microsoft DevRel universe, put out an episode all about ML and scientific
computing with Python featuring [Tania Allard](https://twitter.com/ixek) and
[Seth Juarez](https://twitter.com/sethjuarez). Their episode includes how DVC
can fit in this development toolkit, so check it out!

<iframe src="https://channel9.msdn.com/Shows/AI-Show/Machine-Learning-and-Scientific-Computing-with-Python/player" width="960" height="540" allowFullScreen frameBorder="0" title="Machine Learning and Scientific Computing with Python - Microsoft Channel 9 Video"></iframe>

### A nice tweet

We'll end on a tweet we love:

https://twitter.com/iamjoyheron/status/1336698583689596929

This beautiful diagram, made by [Joy Heron](https://twitter.com/iamjoyheron) in
response to a talk by [Dr. Larysa Visengeriyeva](https://twitter.com/visenger)
about MLOps, is a wonderful encapsulation of the many considerations (at many
scales) that go into ML engineering. Do you see DVC in there? 🕵️

Thank you for reading, and happy holidays to you! ❄️ 🎁 ☃️
