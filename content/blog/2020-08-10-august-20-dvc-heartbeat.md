---
title: August '20 Heartbeat
date: 2020-08-10
description: |
  Catch our monthly updates- featuring the CML release, DVC meetup recap, 
  a new video tutorial series, and the best reading about pipelines and
  DataOps.
descriptionLong: |
  Catch our monthly updates- featuring the CML release, DVC meetup recap, 
  a new video tutorial series, and the best reading about pipelines and
  DataOps.
picture: 2020-08-10/header.png
pictureComment: DeeVee avoids the summer sun at Mount Rainier National Park.
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/august-20-heartbeat/465
tags:
  - Heartbeat
  - CML
  - DVC
  - Meetup
---

Welcome to our August roundup of cool news, new releases, and recommended
reading in the MLOps world!

## News

### CML release

At the beginning of July, we went live with a new project:
[Continuous Machine Learning, or CML](https://cml.dev) for short. If you
hadven't heard, CML is an open-source toolkit for adapting popular continuous
integration systems like GitHub Actions and GitLab CI for machine learning and
data science. This release marks a new stage for our organization: while CML can
work with DVC, and both are built around Git, CML is designed for standalone
use. That means we're supporting TWO projects now!

https://media.giphy.com/media/X5i2BoQeD9kWY/giphy.gif

Luckily, we received plenty of encouraging and helpful feedback following the
CML release. CML was on the front page of Hacker News for most of release day!
We also got
[covered on Heise](https://www.heise.de/news/Machine-Learning-CML-schickt-Daten-und-Modelltraining-in-die-Pipeline-4841023.html),
a popular German IT news source. I (Elle, a proud part of the CML team!) also
gave a talk presenting our approach as part of the MLOps World meeting, which is
now available for online viewing.

https://youtu.be/yp0su5mOeko

Of course, we're fielding lots of questions too! We've compiled some of the most
common questions (and their answers!) in our last
[Community Gems post](https://dvc.org/blog/july-20-community-gems), and CML
developer [David G. Ortega](https://github.com/DavidGOrtega) has written a
tutorial for a much-asked-for use case: doing
[continuous integration with on-demand GPUs](https://dvc.org/blog/cml-self-hosted-runners-on-demand-with-gpus).

If you have comments, questions, or feature requests about CML, we _really_ want
to hear from you. A few ways to be in touch:

- Open an [issue on the project repo](https://github.com/iterative/cml/issues)
- Drop by the [CML Discord channel](https://discord.gg/bzA6uY7)
- Send us [an email](mailto:support@dvc.org)

### July Meetup

Last week, we had another meetup!
[DVC Ambassador Marcel](http://mribeirodantas.me/) kicked us off with a short
talk about how he's using DVC as part of his causal modeling approach to
bioinformatics. It's cool stuff. Then, I talked a bit about CML and did some
live-coding. The beauty of live-coding is getting to answer questions in
real-time, and if you're totally new to the idea of continuous integration (or
want to understand how CML works with GitHub Actions/GitLab CI) seeing a project
in-action is one of the best ways to learn.

You can watch a recording of the meetup online now (it's lightly edited to
remove some pesky Zoom trolls), and
[join our Meetup group](https://www.meetup.com/DVC-Community-Virtual-Meetups) to
get updates for the next one. In future meetups, we'd love to support community
members sharing their work, so get in touch if you'd like to present.

https://youtu.be/tnTPHG5seDs

### New video series

We're starting up some new YouTube features! If you haven't seen our channel,
[check it out and consider subscribing](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ)
for hands-on tutorials and demos. Our
[first video introduced continuous integration and GitHub Actions](https://youtu.be/9BgIDqAzfuA),
and the second showed
[how to use DVC and free Google Drive storage to add external data storage to a GitHub project](https://youtu.be/kZKAuShWF0s).

In the coming weeks, we'll be covering:

- Using CML and GitHub Actions with hardware for deep learning, like on-premise
  GPUs
- Understanding Vega plots and making data viz part of your CI system
- Some DVC basics to supplement our docs

## From the community

### SpaCy + DVC = ❤️

We're huge fans of a recent Python Bytes episode featuring
[Ines Montani](https://twitter.com/_inesmontani), founder of Explosion and one
of the makers of the incredible SpaCy library for NLP (seriously, I have the
highest recommendations for SpaCy).

https://twitter.com/_inesmontani/status/1286222512762871808

Ines' episode discussed DVC, and DVC is going to be integrated with SpaCy in
their 3.0 release. SpaCy + DVC is going to be a powerhouse and we can't wait.

### Take a stab at shtab

Another cool software project:
[Casper da Costa-Luis](https://github.com/casperdcl), DVC contributor and
creator of the popular [tqdm library](https://github.com/tqdm/tqdm), has
published a tab-completion script generator for Python applications! `shtab`, as
it's called, was originally designed for DVC, but Casper developed it into a
generic tool that can be used for virtually any Python CLI application. Check
out [`shtab` on GitHub](https://github.com/iterative/shtab) and read the release
blog.

<external-link
href="https://dvc.org/blog/shtab-completion-release"
title="(Tab) Complete Any Python Application in 1 Minute or Less"
description="We've made a painless tab-completion script generator for Python applications!"
link="dvc.org"
image="/uploads/images/2020-08-10/shtab.png"/>

### DVC 1.0 migration script

Our friends at [DAGsHub](https://dagshub.com/) have released a script to help
DVC users upgrade their pipelines to the new DVC 1.0 format! Says Simon, a
DAGsHub engineer, in his tutorial:

> In this post, I'll walk you through the process of migrating your existing
> project from DVC ≤ 0.94 to DVC 1.X using a single automated script, and then
> demonstrate a way to check that your migration was successful.

Read the blog and get migrating (but don't worry if you can't; DVC 1.0 is
backwards compatible). <external-link
href="https://towardsdatascience.com/automatically-migrate-your-project-from-dvc-0-94-to-dvc-1-x-416a5b9e837b"
title="Automatically migrate your project from DVC≤ 0.94 to DVC 1.x"
description="Migrating your project from DVC ≤ 0.94 to DVC 1.x can be a very involved process. Here’s an easy way to do it."
link="medium.com"
image="/uploads/images/2020-08-10/dagshub.jpg"/>

### Recommended reading

Here are some of our favorite blogs from around the internet 🌏.

- [Déborah Mesquita](https://www.deborahmesquita.com/), data scientist (and an
  excellent writer to follow), published a tutorial about DVC pipelines that is
  truly deserving of the moniker "ultimate guide". It's a start-to-finish case
  study about a typical machine learning project, with DVC pipelines to automate
  everything from grabbing the data to training and evaluating a model. Also, it
  comes with a video tutorial if you prefer to watch instead of read!

<external-link
href="https://towardsdatascience.com/the-ultimate-guide-to-building-maintainable-machine-learning-pipelines-using-dvc-a976907b2a1b"
title="The ultimate guide to building maintainable Machine Learning pipelines using DVC"
description="Learn the principles for building maintainable Machine Learning pipelines using DVC"
link="medium.com"
image="/uploads/images/2020-08-10/deborah.jpg"/>

- Software engineer
  [Vaithy Narayanan](https://www.linkedin.com/in/vaithyanathan/) created the
  first ever ☝️ CML user blog! Vaithy created a pipeline that covers data
  collection to model training and testing, and used CML to automate the
  pipeline execution whenever the project's GitHub repository is updated. He
  ends with some insightful discussion about the strengths and weaknesses of the
  approach.

<external-link
href="https://medium.com/@karthik.vaithyanathan/using-continuous-machine-learning-to-run-your-ml-pipeline-eeeeacad69a3"
title="Using Continuous Machine Learning to Run Your ML Pipeline"
description="Vaithy Narayanan"
link="medium.com"
image="/uploads/images/2020-08-10/vaithy.jpg"/>

- [Ryan Gross](https://www.linkedin.com/in/ryan-w-gross/), a VP at Pariveda
  Solutions, blogged about the future of data governance and the lessons from
  DevOps that might save the day. Honestly, you should probably start reading
  for this cover image alone.

  ![](/uploads/images/2020-08-10/dataops.png) _DataOps is accurately depicted as
  a badass flaming eagle._ Check out the blog here:

<external-link
href="https://towardsdatascience.com/the-rise-of-dataops-from-the-ashes-of-data-governance-da3e0c3ac2c4"
title="The Rise of DataOps (from the ashes of Data Governance)"
description="Legacy Data Governance is broken in the ML era. Let’s rebuild it as an engineering discipline to drive orders-of-magnitude improvements."
link="medium.com"
image="/uploads/images/2020-08-10/ryan.png"/>

And, there's a
[noteworthy counterpoint](https://locallyoptimistic.com/post/git-for-data-not-a-silver-bullet/?utm_campaign=Data_Elixir&utm_source=Data_Elixir_298)
by
[Michael Kaminsky](https://www.linkedin.com/in/michael-the-data-guy-kaminsky/).
Read them both!

Thanks everyone, that's it for this month. We hope you're staying safe and
making cool things!

https://media.giphy.com/media/35EsMpEfGHkVoHbNTU/giphy.gif
