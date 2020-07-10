---
title: July '20 Heartbeat
date: 2020-07-10
description: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, we recap the DVC 1.0 release, making the list of top 20 fastest growing open-source startups, and interviews galore.
descriptionLong: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, we recap the DVC 1.0 release, making the list of top 20 fastest growing open-source startups, and interviews galore.
picture: 2020-07-10/july_20_heartbeat_header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/june-20-heartbeat/404
tags:
  - Heartbeat
  - GitHub Actions
  - DVC 1.0
  - SciPy
  - MLOps
  - Reproducibility
  - Meetup
---

Welcome to the July Heartbeat, our monthly roundup of [new releases](#news),
[talks](#community-activity), and [upcoming events](#coming-up-soon) in the DVC
community.

## News

### DVC 1.0 release

On June 22, DVC entered a new era: the
[official release of version 1.0](https://dvc.org/blog/dvc-1-0-release). After
several weeks of bug-catching with our pre-release, the team has issued DVC 1.0
for the public! Now when you
[install DVC through your package manager of choice](https://dvc.org/doc/install),
you'll get the latest version. Welcome to the future.

To recap, DVC 1.0 has some big new features like:

- Plots powered by Vega-Lite so you can compare metrics across commits
- New and easier pipeline configuration files- edit your DVC pipeline like a
  text file!
- Optimizations for data transfer speed

Read all the [release notes](https://dvc.org/blog/dvc-1-0-release) for more, and
stop by our [Discord](https://discordapp.com/invite/dvwXA2N) if you need support
migrating (don't worry, 1.0 is backwards compatible).

### DVC is in the top 20 fastest-growing open source startups

Konstantin Vinogradov at [Runa Capital](https://runacap.com/) used the GitHub
API to
[identify the fastest growing public repositories on GitHub](https://medium.com/runacapital/open-source-growth-benchmarks-and-the-20-fastest-growing-oss-startups-d3556a669fe6)
in terms of stars and forks. He used these metrics to estimate the top 20
fastest growing startups in open source software. And guess what, DVC made the
cut! We're in great company.

![](/uploads/images/2020-07-10/top20startups.png)

### New team member

We have a new teammate-[Maxim Shmakov](https://www.linkedin.com/in/mvshmakov/),
previously of Yandex, is joining us! Maxim is a front-end engineer joining us
from Moscow. Please welcome him to DVC. 👋

## Community activity

We've been busy! Although we are mostly homebound these days, there has been no
shortage of speaking engagements. Here's a recap.

Co-founders Dmitry and Ivan appeared on the HasGeek TV series
[Making Data Science Work](https://hasgeek.com/fifthelephant/making-data-science-work-session-3/)
to discuss engineering for data science with hosts
[Venkata Pingali](https://www.linkedin.com/in/pingali/) and
[Indrayudh Ghoshal](https://www.linkedin.com/in/indrayudhghoshal/). The
livestream is available for viewing on YouTube!

https://www.youtube.com/watch?v=EWcpALbzZRg

The same day, Dmitry appeared on the [MLOps.community](https://mlops.community/)
meetup to chat with host
[Demetrios Brinkmann](https://www.linkedin.com/in/dpbrinkm/). They talked about
the open source ecosystem, the difference between tools and platforms, and what
it means to codify data.

https://www.youtube.com/watch?v=ojV1tK9jXH8&t=2295s

I (Elle) gave another talk at the
[MLOps Production & Engineering World](https://mlopsworld.com/) meeting, called
"Adapting continuous integration and continuous delivery for ML". I shared an
approach to using GitHub Actions & GitLab CI to start using continuous
integration in ML model training- and it turns out, this conference is generally
very excited about GitHub Actions! In another talk, GitHub technical advocate
[Jonathan Peck](https://www.linkedin.com/in/peckjon/), shared some great use
cases, including how he used an Nvidia Jetson Nano to run Actions. Generally,
the mood around GitHub Actions in the ML community is very encouraging for a
future with more automated data science practices.

Extremely early the next morning, I co-led a workshop with clinician-scientist
[Cris Lanting](https://www.linkedin.com/in/crislanting/?originalSubdomain=nl)
about developing strong computational infrastructure and practices in research
as part of the
[Virtual Conference on Computational Audiology](https://computationalaudiology.com/).

In addition to outlining key components of scientific reproducibility and
project management, Cris and I did some investigating. We conducted an informal
survey asking about the biggest barriers to making research reproducible and
shareable. Participants overwhelmingly answered that they lack time and
incentives. Difficulty managing dependencies (both data and software) was
another popular answer. Sounds a bit like softare before
[DevOps](https://en.wikipedia.org/wiki/DevOps)... For the curious, the workshop
is still viewable!

https://www.youtube.com/watch?v=W4CoptalWw0

Lastly, check out our virtual poster for
[SciPy 2020](https://www.scipy2020.scipy.org/)! We prepared a demo about
[packaging models and datasets like software](https://dvc.org/blog/scipy-2020-dvc-poster)
so they can be widely disseminated via GitHub.

## Coming up soon

Some things to watch out for in the next few weeks:

- **DVC Virtual Meetup.** In May, we had our
  [first every virtual meetup](http://localhost:8000/blog/may-20-dvc-heartbeat).
  We had amazing talks from [Dean Pleban](https://twitter.com/DeanPlbn) and
  [Elizabeth Hutton](https://github.com/ehutt), plus time for Q&A with the DVC
  team- you can
  [watch the recording](https://www.youtube.com/watch?v=19GMtrFykSU&list=PLVeJCYrrCemiOc1SS_PIB3Tb3HX0Aqw3j)
  if you missed it!

  On Thursday, July 30, we're hosting our second meetup! Ambassador
  [Marcel Ribeiro-Dantas](http://mribeirodantas.me/) is hosting once again.
  We'll have short talks about causal modeling and CI/CD, plus lots of time for
  chatting and catching up. Please RSVP!

<blockquote class="embedly-card"><h4><a href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/271844501/">July DVC Meetup: Data Science & DevOps!</a></h4><p>This meetup will be hosted by DVC Ambassador Marcel! AGENDA:We have two 10-minute talks on the agenda:- Causal Modeling with DVC - Marcel- Continuous integration for ML case studies - Elle Following talks, we'll have Q&A with the DVC team and time for community discussion.</p></blockquote>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

- Please stay tuned for details about [ML REPA](http://ml-repa.ru/) leader and
  DVC Ambassador [Mikhail Rozhkov](https://twitter.com/mnrozhkov)'s Udemy
  course! It will cover DVC and MLOps fundamentals. We're thrilled there will
  soon be more ways for folks to learn rigorous data engineering concepts and
  practices.

As always, thanks for reading and being part of our community. There are lots of
ways to stay in touch. Follow us on [Twitter](twitter.com/dvcorg), join our
[Discord server](https://discordapp.com/invite/dvwXA2N), or leave a blog
comment. We always love to hear from you!
