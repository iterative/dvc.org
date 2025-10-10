---
title: July '21 Heartbeat
date: 2021-07-16
description: >
  Monthly updates are here! Great new tutorials from the Community, uptick in
  jobs requiring DVC, awesome Community discussion on experiments at our June
  Meetup and a cipher. Can you figure it out?
descriptionLong: |
  This month you will find:
  - 📈 DVC + Streamlit = ❤️,
  - 🇯🇵 DVC in Japanese,
  - 📖 A new Udacity Course that includes DVC,
  - 🧑🏽‍💻 More and more jobs requiring DVC
  - 🧪 June Meetup on Experiments,
  - 🚀 New team member, a secret code and more!
picture: 2021-07-16/july21cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/july-heartbeat/825
tags:
  - Heartbeat
  - DVC
  - CML
  - Streamlit
  - Udacity
---

# Welcome to Summer!

![It's summer!](https://media.giphy.com/media/WuY9yfI89DbNu/giphy.gif)

# From the Community

<span style="color:purple">**A**</span>s usual we have a ton of goodness from
the Community! Let's jump in!

## Antoine Toubhans' Post Combining Streamlit and DVC!

[Antoine Toubhans](https://www.linkedin.com/in/antoine-toubhans-92262119/) of
[Sicara](https://www.sicara.fr/) wrote a fantastic and detailed tutorial
entitled
[**How to Build Customizable Web UI for Machine Learning with Streamlit and DVC**](https://www.sicara.ai/blog/dvc-streamlit-webui-ml)
bringing together the best of DVC and integrating it with Streamlit to provide a
customizable UI. The tutorial <span style="color:purple">**g**</span>oes through
the steps of setting up a pipeline, spltting a dataset, training and evaluating
a model, tracking changes to data and model, dvc
<span style="color:purple">**m**</span>etrics and plots and then bridging the
gap in visualizations using <span style="color:purple">**S**</span>treamlit. You
won't want to miss this one!

![DVC and Streamlit](../uploads/images/2021-07-16/streamlit2.png '=700') _DVC +
Streamlit = ♥️!
[Source link](https://www.sicara.ai/blog/dvc-streamlit-webui-ml)_

## DVC and CML in Japanese!

For our friends that speak Japanese,
[these slides](https://www.slideshare.net/yusukeshibui/testing-machine-learningdevelopment)
created by
[Yusuke Shibui](https://www.slideshare.net/yusukeshibui?utm_campaign=profiletracking&utm_medium=sssite&utm_source=ssslideview)
walk you through a machine learning to production project using
D<span style="color:purple">**V**</span>C and
C<span style="color:purple">**M**</span>L. We love seeing our tools being used
all around the world! 🌏

![DVC and CML in Japanese](../uploads/images/2021-07-16/in-japanese.png) _DVC
and CML in Japanese!
[Source link](https://www.slideshare.net/yusukeshibui/testing-machine-learningdevelopment)_

## Miguel Méndez' DVC Tutorial

[Miguel Méndez](https://www.linkedin.com/in/miguel-mendez/) and his team at
[Gradiant](https://www.gradiant.org/en/)
<span style="color:purple">**s**</span>truggled with reproducibility before
using DVC for versioning their image dataset and annotations. The dataset and
annotaions are held in a shared storage space and used by the whole team. DVC
enables the team to track changes and know what versions of the dataset produce
the best results. His tutorial walks you through the steps to set it up!

<external-link
href="https://mmeendez8.github.io/2021/07/01/dvc-tutorial.html"
title="Version Control Your Dataset with DVC"
description="Miguel Méndez' tutorial on using DVC for versioning datasets and providing reproducibility"
link="https://github.io"
image="../uploads/images/2021-07-16/git-dvc.png"/>

## Jobs requiring DVC!

We have been seeing an uptick in the number of jobs requiring knowledge of DVC.
It's exciting to see that our tools are
helpin<span style="color:purple">**g**</span> these companies in their MLOps
workflows! 🎉

![](../uploads/images/2021-07-16/job-descriptions.png)

# Learning Opportunities

With all those DVC job opportunities out there, you
<span style="color:purple">**b**</span>etter get on it! 😉

## A New Udacity Course Incorporating DVC!

Just this month a new
[Udacity](https://www.udacity.com/course/machine-learning-dev-ops-engineer-nanodegree--nd0821)
nannodegree program came out entitled
[**Machine Learning DevOps Engineer**](https://www.udacity.com/course/machine-learning-dev-ops-engineer-nanodegree--nd0821),
that teaches DVC as part of the program. This course includes sections on:

- Clean Code Principles
- Building a Reproducible <span style="color:purple">**M**</span>odel Workflow
- Deploying a Scalable ML Pipeline in Production
- Automated Model Scoring and Monitoring

<external-link
href="https://www.udacity.com/course/machine-learning-dev-ops-engineer-nanodegree--nd0821"
title="Machine Learning DevOps Engineer"
description="A new nanodegree program offered by Udacity teaching DVC as part of the curriculum"
link="https://udacity.com"
image="../uploads/images/2021-07-16/udacity.png"/>

## DVC Lea<span style="color:purple">**r**</span>n

This week we kicked off our new DVC Learn Meetup series with
[**Milecia McGregor**](https://twitter.com/FlippedCoding). This set of three,
short, half-hour classes are designed to get you up and running in DVC. If you
are just getting started with <span style="color:purple">**D**</span>VC or
kicking the tires, this Meetup series is for you! Our next class on August 4th
will get you started with experiments.

If you are interested in weighing in on what kinds of educational content you
would like to see from us, we'd be grateful if you'd fill out
[**this survey**](https://docs.google.com/forms/d/e/1FAIpQLSdmwjs0ZkxDdODfZTvSwP2bVW4JAVVdxiYhQPyW5dSbsZC8qg/viewform?pli=1)
to help us plan! 🙏🏼

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279447414/"
title="DVC Learn - Getting Started: Experiments"
description="The next DVC Learn Meetup taught by Melecia McGregor designed to get you started with DVC Experiments"
link="https://meetup.com"
image="../uploads/images/2021-07-16/dvc_learn.png"/>

## Data Science Journal Article on Reproducibility Practices in Research

New research presented in the
[Data Science Journal](https://datascience.codata.org/) aims to provide best
practices for providing reproducibility in research datasets. This is necessary
to pinpoint the version of the dataset that grounds any research. In this work
the authors reviewed 39 use cases from 33 organizations to arrive at six
principles for versioning datasets. These include **Revision**, **Release**,
**Granularity**, **Manifestation**,
<span style="color:purple">**P**</span>**rovenance** and **Citation**. See the
full work below. 👇🏼

<external-link
href="https://datascience.codata.org/articles/10.5334/dsj-2021-012/"
title="Versioning Data is About More Than Revisions:  A Conceptual Framework and Proposed Priniciples"
description="Authors analyze 39 use cases in 33 organziations to arrive at proposed principles when versioning data."
link="https://datascience.codata.org"
image="../uploads/images/2021-07-16/dsj.png"/>

## June Office Hours Meetup

The June Office Hours Meetup was 🔥! Amazing discussion on experiments ignited
by [Sami Jawhar](https://www.linkedin.com/in/sami-jawhar-a58b9849/) of
[Kernel](https://www.kernel.com/) around experiment use cases and workflows.  
You can
[find the repo for his presentation here](https://github.com/sjawhar/dvc-cloud-runner)
and watch all the great DVC discussion below.

https://youtu.be/DxZdWq3Weng

# DVC News

<span style="color:purple">**S**</span>ummer and vaccinations mean travel! ☀️💉
And that travel has enabled some of our team members to get together! Pictured
below are Dmitry Petrov, Alexander Guschin, Max Shmakov, Mikhail Rozhkov, Sergey
Kryukov, Mikhail Sveshnikov, and Guro Bokum... But not necessarily in that
order.

The first person to guess the correct order of our teammates starting from the
upper right of the picture moving clockwise, **and** post in the corresponding
[Twitter](https://twitter.com/DVCorg) Heartbeat post, will win some DVC SWAG!
Hint: If you've been wondering why there are random purple letters in this blog
post, they're a clue to this cipher. 🧐

![](../uploads/images/2021-07-16/team.png '=700') _Team Meetup in Moscow! (hand
signals obscured for our UK friends, because we care! 🤗)_

## New Team Member

[David de la Iglesia Castro](https://www.linkedin.com/in/david-de-la-iglesia-castro-b4b67b20a/)
is the third teammate joining us from Spain! 🇪🇸 And also the third David! He
hails from Galicia and has been an active member of our Community for over two
years. We are so excited to have him join the team as a software enginer where
he will wor<span style="color:purple">**k**</span> to improve DVC Live. When
he's not contributing to DVC, David likes to go climbing, surfing or just hiking
whenever he can! Welcome David!

## Open Positions

And yes indeed, we are still hiring!
[Use this link](https://www.notion.so/iterative/iterative-ai-is-hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions including:

- Senior Front-End Engineer (TypeScript, Node, React)
- Senior Software Engineer (ML, Dev Tools, Python)
- Senior Software Engineer (ML, Data Infra, GoLang)
- Machine Learning Engineer/Field Data Scientist
- Developer Advocate (ML)
- Director/VP of Engineering (ML, DevTools)
- Director/VP of Product (ML, Data Infra, SaaS)
- Director/VP of Operations/Chief of Staff

Please pass this info on to anyone you know that may fit the bill. We look
forward to new team members! 🎉

## Next Meetup

Don't miss our
[Meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/)
July 28th at 2:00 pm UTC (7:00 am PDT), where
[João Santiago](https://www.linkedin.com/in/jcpsantiago/) of
[Billie](https://www.billie.io/) will present "DVThis" a set of utility
functions for DVC pipelines using R scripts. Additionally the project aims to
document the usual workflows of a DVC pipeline using these scripts and create
templates for the use of DVC and R together.

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279024694/"
title="DVThis"
description="July DVC Office Hours with João Santiago of Billie shows us how to use R with DVC, presenting DVThis."
link="https://meetup.com"
image="../uploads/images/2021-07-16/office-hours-meetup.png"/>

## Tweet Love ❤️

https://twitter.com/DataChaz/status/1410319379837894656

---

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
