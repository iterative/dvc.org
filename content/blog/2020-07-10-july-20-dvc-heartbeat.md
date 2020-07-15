---
title: July '20 Heartbeat
date: 2020-07-10
description: |
  Catch up on new DVC releases, talks, and projects in our 
  community. This month, we recap the DVC 1.0 release, 
  making the list of top 20 fastest growing open-source 
  startups, and interviews galore. Plus: 📣 an invitation to 
  the next DVC meetup!
descriptionLong: |
  Catch up on new DVC releases, talks, and projects in our 
  community. This month, we recap the DVC 1.0 release, 
  making the list of top 20 fastest growing open-source 
  startups, and interviews galore. Plus: 📣 an invitation to 
  the next DVC meetup!
picture: 2020-07-10/july_20_heartbeat_header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/july-20-dvc-heartbeat/439
tags:
  - Heartbeat
  - CI/CD
  - DVC 1.0
  - SciPy
  - MLOps
  - Reproducibility
  - Meetup
---

Welcome to the July Heartbeat, our monthly roundup of [new releases](#news),
[talks](#community-activity), [great articles](#good-reads), and
[upcoming events](#coming-up-soon) in the DVC community.

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

### Virtual meetup!

In May, we had our
[first every virtual meetup](http://localhost:8000/blog/may-20-dvc-heartbeat).
We had amazing talks from [Dean Pleban](https://twitter.com/DeanPlbn) and
[Elizabeth Hutton](https://github.com/ehutt), plus time for Q&A with the DVC
team- you can
[watch the recording](https://www.youtube.com/watch?v=19GMtrFykSU&list=PLVeJCYrrCemiOc1SS_PIB3Tb3HX0Aqw3j)
if you missed it!

On Thursday, July 30, we're hosting our second meetup! Ambassador
[Marcel Ribeiro-Dantas](http://mribeirodantas.me/) is hosting once again. We'll
have short talks about causal modeling and CI/CD, plus lots of time for chatting
and catching up. Please RSVP!

<blockquote class="embedly-card"><h4><a href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/271844501/">July DVC Meetup: Data Science & DevOps!</a></h4><p>This meetup will be hosted by DVC Ambassador Marcel! AGENDA:We have two 10-minute talks on the agenda:- Causal Modeling with DVC - Marcel- Continuous integration for ML case studies - Elle Following talks, we'll have Q&A with the DVC team and time for community discussion.</p></blockquote>
<script async src="//cdn.embedly.com/widgets/platform.js" charset="UTF-8"></script>

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

### Meetings and talks

- Co-founders Dmitry and Ivan appeared on the HasGeek TV series
  [Making Data Science Work](https://hasgeek.com/fifthelephant/making-data-science-work-session-3/)
  to discuss engineering for data science with hosts
  [Venkata Pingali](https://www.linkedin.com/in/pingali/) and
  [Indrayudh Ghoshal](https://www.linkedin.com/in/indrayudhghoshal/). The
  livestream is available for viewing on YouTube!

https://www.youtube.com/watch?v=EWcpALbzZRg

- Dmitry appeared on the [MLOps.community](https://mlops.community/) meetup to
  chat with host [Demetrios Brinkmann](https://www.linkedin.com/in/dpbrinkm/).
  They talked about the open source ecosystem, the difference between tools and
  platforms, and what it means to codify data.

https://www.youtube.com/watch?v=ojV1tK9jXH8&t=2295s

- I (Elle) gave a talk at the
  [MLOps Production & Engineering World](https://mlopsworld.com/) meeting,
  called "Adapting continuous integration and continuous delivery for ML". I
  shared an approach to using GitHub Actions with ML projects. Video coming
  soon!

https://twitter.com/TMLS_TO/status/1273693487104503808

- Extremely early the next morning, clinician-scientist
  [Cris Lanting](https://www.linkedin.com/in/crislanting/?originalSubdomain=nl)
  and I co-led a workshop about developing strong computational infrastructure
  and practices in research as part of the
  [Virtual Conference on Computational Audiology](https://computationalaudiology.com/).
  We talked about big ideas for making scientific research reproducible,
  manageable, and shareable. For the curious, the workshop is still viewable!

https://www.youtube.com/watch?v=W4CoptalWw0

- DVC has a virtual poster at [SciPy 2020](https://www.scipy2020.scipy.org/)! We
  prepared a demo about
  [packaging models and datasets like software](https://dvc.org/blog/scipy-2020-dvc-poster)
  so they can be widely disseminated via GitHub.

### Good reads

Some excellent reading recommendations from the community:

- Data scientist Déborah Mesquita published a thorough guide to using new DVC
  1.0 pipelines in a sample ML project. It's truly complete, covering data
  collection to model evaluation, with detailed code examples. If you are new to
  pipelines, do not miss this!

<external-link
href="https://towardsdatascience.com/the-ultimate-guide-to-building-maintainable-machine-learning-pipelines-using-dvc-a976907b2a1b"
title="The ultimate guide to building maintainable Machine Learning pipelines using DVC"
description="Learn the principles for building maintainable Machine Learning pipelines using DVC"
link="medium.com"
image="/uploads/images/2020-07-10/pipes.jpg"/>

- Caleb Kaiser of [Cortex](https://github.com/cortexlabs/cortex) (another
  startup in the Runa Capital's Top 20 list!) shared a thinkpiece about
  challenges from software engineering that can inform production ML. We really
  agree with what he has to say about reproducibility:

> You typically hear about “reproducibility” in reference to ML research,
> particularly when a paper doesn’t include enough information to recreate the
> experiment. However, reproducibility also comes up a lot in production ML.
> Think of it this way — you’re on a team staffed with data scientists and
> engineers, and you’re all responsible for an image classification API. The
> data scientists are constantly trying new techniques and architectural tweaks
> to improve the model’s baseline performance, while at the same time, the model
> is constantly being retrained on new data. Looking over the APIs performance,
> you see one moment a week ago where the model’s performance dropped
> significantly. What caused that drop? Without knowing exactly how the model
> was trained, and on what data, it’s impossible to know for sure.

<external-link
href="https://towardsdatascience.com/what-software-engineers-can-bring-to-machine-learning-25f458c80e5"
title="What software engineers can bring to machine learning"
description="Many production machine learning challenges are paralleled in software engineering"
link="medium.com"
image="/uploads/images/2020-07-10/tds.jpg"/>

- Mukul Sood wrote about the Real World, a place beyond Jupyter notebooks where
  data is non-stationary and servers are unreliable! He covers some very real
  challenges for taking a data science project into production and introduces
  the need for CI/CD practices in healthy, scalable ML applications.

<external-link
href="https://towardsdatascience.com/scaling-machine-learning-in-real-world-cb601b2baf4a"
title="Scaling Machine Learning in the  Real World"
description="Any conversation around scaling or productionizing data science, would need to talk about Continuous Integration/Continuous Deployment."
link="medium.com"
image="/uploads/images/2020-07-10/storm.jpg"/>

### A nice tweet

We'll close on a nice tweet from [Russell Jurney](https://datasyndrome.com/):

https://twitter.com/rjurney/status/1266735603921547264

Thanks, we couldn't do it without our community! As always, thanks for joining
us and reading. There are lots ofways to stay in touch and we always love to
hear from you. Follow us on [Twitter](twitter.com/dvcorg), join our
[Discord server](https://discordapp.com/invite/dvwXA2N), or leave a blog
comment. Until next time! 😎
