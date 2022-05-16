---
title: May '22 Heartbeat
date: 2022-05-16
description: >
  Monthly updates are here! You will find the future of AI Infrastruture is
  modular, articles on distribution drift and how to solve it, the usual great
  tutorials and workflows from the Community,  online course updates, new docs
  and more! Happy April!

descriptionLong: |
  This month you will find:

    📖 Chip Huyen's new book,

    🔎 Distribution drift with 
    
    🥰 Tutorials and workflows from the Community,

    🗣 IRL events,

    💻 Online course(s) updates,

    🚀 Spotify MLOps playlist addition, and more!
picture: 2022-05-16/may-heartbeat.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/may-22-heartbeat/1191
tags:
  - Heartbeat
  - DVC
  - CML
  - Git
  - Modular Infrastructure
  - Mission Statement
  - TPI Release
  - Chip Huyen
---

# AI/ML News

![Designing Machine Learning Systems](/uploads/images/2022-05-16/chip-huyen.jpeg 'Designging Machine Learning Systems :wrap-left ==200')

## Chip Huyen: Designing Machine Learning Systems

[**Chip Huyen**](https://www.linkedin.com/in/chiphuyen/) just came out with a
new book with [O'Reilly](https://oreilly.com) entitled
[Designing Machine Learning Systems](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/).  
I'm not going to pontificate here, Chip Huyen wrote it, the reviews are shining,
need I say more?

## Jenny Abramov: An Agile Framework for AI Projects — Development, QA, Deployment and Maintenance

[**Jenny Abramov**](https://www.linkedin.com/in/jennyabramov/)
[wrote a piece](https://towardsdatascience.com/an-agile-framework-for-ai-projects-development-cbe115ba86a2)
in [Toward Data Science](https://towardsdatascience.com/) with the purpose to
present an "iterative-lifecycle framework, that is adapted to AI-centered
software. She outlines important considerations as you work through the
framework that depends on your use case, data, and business problem.

She suggests using DVC for your larger, more complex datasets and also about the
need for reproducibility in experimentation with which DVC can help you
[(see Technical Product Manager, Dave Berenbaum’s post on experiment versioning.)](https://dvc.org/blog/ml-experiment-versioning)

In addition she discusses issues with quality assuarnce in Deployment and the
maintenance of the system.

![Jenny Abromov iterative-lifecycle framework](/uploads/images/2022-05-16/jenny-abramov.png '=800')
_Jenny Abramov's iterative-lifecycle framework
([Source link](https://towardsdatascience.com/an-agile-framework-for-ai-projects-development-cbe115ba86a2))_

## MLOps Guide from INNOQ

[**Dr. Larysa Visengeriyeva**](https://www.linkedin.com/in/larysavisenger/),
[**Anja Kammer,**](https://www.linkedin.com/in/anja-kammer-berlin/)
[**Isabel Bär,**](https://www.linkedin.com/in/isabel-b%C3%A4r-a89705213/)
[**Alexander Kniesz,**](https://www.linkedin.com/in/alexander-kniesz-656256197/)
and [Michael Plöd](https://www.linkedin.com/in/michael-ploed/) of
[**INNOQ**](https://www.innoq.com/en/) (a software development, strategy and
techonology consultancy) created
[this](https://ml-ops.org/content/mlops-principles) very thorough resource on
MLOps, going through all the principles and "iterative-incremental" steps of the
process (there's a pattern here 😉). The authors cover Automation, Continuous X
(hello CML and TPI), Versioning (hello DVC!), Experiments Tracking (noted DVC
here because indeed DVC does experiment tracking too!), Testing, Monitoring, the
"ML Test Score" System, Reproducibility, Modularity, ML-based Software Delivery
Metrics, and MLOps Principles and Best Practices. Definitely a good resource for
for MLOps and filled with more resources as well.

![INNOQ MLOps Guide](/uploads/images/2022-05-16/innoq.jpeg '=800') _INNOQ MLOps
Guide ([Source link](https://ml-ops.org/content/mlops-principles))_

Also interesting from INNOQ is their
[Artist-in-residence program](https://www.innoq.com/en/artists/) created because
they "believe in the conscious reflection between technology and society" and
feel art is well suited for this refection. See the work below by Studio Waltz
Binaire based on the question: What traces do we leave behind with technology?

https://media.giphy.com/media/NxdrJ6a4IQKyW5gGjL/giphy.gif

([Source link](https://www.innoq.com/en/artists/))

## Laszlo Sragner: LinkedIn discussion on Code Quality

[**Laszlo Sragner**](https://www.linkedin.com/in/laszlosragner/?trk=public_post-embed_share-update_actor-text&originalSubdomain=uk)
a frequent contributor to the MLOps Community in general, often driving
discusssions and helping others in the
[MLOps Community Slack channel,](https://mlops-community.slack.com/join/shared_invite/zt-178s99cyv-Q~whRpqbhgMTBrOcbjnDIQ#/shared-invite/email)
posed and interesting point about code quality on LinkedIn. Join the discussion
and weigh in at this post:

<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:6931541880090324992" height="800" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
## Company News

# Community News

## Yet another tool comparison

https://media.giphy.com/media/lWa7aAo62YZLwtk3nj/giphy.gif

So each month I tell you about yet another post to help you attempt to make
sense of the vast MLOps tool space. Well this month is no different. I mean you
could be new here, right? 🤷🏽‍♀️ [DoltHub](https://dolthub.com) tries to bring some
clarity
[with this piece](https://www.dolthub.com/blog/2022-04-27-data-version-control/)
comparing different data versioning tools. You do your reseearch. You know we're
partial.

![Data Version Control tools](/uploads/images/2022-05-16/data-version-control.png '=800')
_Data Version control tools
([Source link](https://ml-ops.org/content/mlops-principles))_

I’m starting to wonder if all Data Science/AI teams need a role with the sole
responsibility of the job to keep up to date with all the new tooling and
changes/updates to existing tooling in the MLOps space and what might best work
for the team. Two people might be needed for each team at this point. What
should this position be called? Best answer wins a DVC t-shirt. See this Twitter
thread to answer. (Hint: Funny answers will likely win 😉). Deadline: May 31st.
Pass it around...

{Adding Notebooks}

https://media.giphy.com/media/qxtxlL4sFFle/giphy.gif

## Upcoming Events

- 📣 Our next in-person conference will be
  [MLOps World](https://mlopsworld.com/) from June 7-10 in Toronto! We look
  forward to seeing Community members there!
- 📣 PyLadies Berlin is hosting Doreen, a data scientist working at
  [Opinary](https://opinary.com/), who will be presenting "Reporducible Machine
  Learning with DVC and Poetry."
  [Join the event here](https://www.meetup.com/PyLadies-Berlin/events/285313817/)
- 📣 [**Nicolás Eiras**](https://www.linkedin.com/in/nicolas-eiris/) will be
  presenting "Data Vesioning: Towards Reproducibility in Machine Learning" at
  [Embeded Vision Summit](https://embeddedvisionsummit.com/2022/session/data-versioning-towards-reproducibility-in-machine-learning/)
  on May 18th in Santa Clara, California.

## Other Fun Stuff

- [New Awesome list](https://github.com/gaocegege/awesome-open-source-mlops)
- [New Udemy Course including DVC](https://www.udemy.com/course/dvc-and-git-for-data-science/)
- Would you like to get some good practice in? Join this
  [Kaggle competition](https://www.the-odd-dataguy.com/2022/04/28/dvc_kaggle/)
  created by
  [Jean-Michel Daignan](https://www.linkedin.com/in/jeanmicheldaignan/) based on
  a previous comptetition from Petfinder.my with some really cute pet images.

![DVC Kaggle Competition](/uploads/images/2022-05-16/img_pawpularity.png '=800')
_DVC Kaggle Competition based on Pawfinder.my
([Source link](https://www.the-odd-dataguy.com/2022/04/28/dvc_kaggle/))_

# Company News

## ICYMI: We released TPI! 🎉

On April 27th we released the latest offering to our tool ecosystem.

https://media.giphy.com/media/ut7lqhIfOscbjuU6YQ/giphy.gif

[Terraform Provider Iterative (TPI)](https://tpi.cml.dev) is a Terraform plugin
built with machine learning in mind. Full lifecycle management of computing
resources (including GPUs and respawning spot instances) from several cloud
vendors (AWS, Azure, GCP, K8s)... without needing to be a cloud expert.

- **Lower cost with spot recovery:** transparent data checkpoint/restore &
  auto-respawning of low-cost spot/preemptible instances
- **No cloud vendor lock-in:** switch between clouds with just one line thanks
  to unified abstraction
- **No waste:** auto-cleanup unused resources (terminate compute instances upon
  task completion/failure & remove storage upon download of results), pay only
  for what you use
- **Developer-first experience:** one-command data sync & code execution with no
  external server, making the cloud feel like a laptop

- ⭐️ [Star the Repo](https://tpi.cml.dev)
- ✍🏼 [Read the blog post](https://dvc.org/blog/terraform-provider)
- ⚙️ Read:
  [Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI) tutorial](https://dvc.org/blog/local-experiments-to-cloud-with-tpi)
- 🎥 [Watch the video](https://www.youtube.com/watch?v=2fEgO8SazSE&t=2s)
- 🪐
  [TPI with Jupyter Notebooks Repo](https://github.com/iterative/blog-tpi-jupyter)

https://media.giphy.com/media/MrCYIN3x0SgdG/giphy.gif

## 🚀~~Mission Impossible~~ - We have a mission statement!

We did it! This year we surveyed the entire team to arrive at a mission
statement for Iterative. It was no small feat to decide on what it should be
given the early stage of our industry, the variety of our tools (and those to
come), and always a stuggle - figuring out the best and most concise way to
convey these ideas (you know our penchant for abbreviations). But we persevered
and succeeded. Behold Iterative's new mission statement:

> We deliver the best developer experience for machine learning teams by
> creating an ecosystem of open, modular ML tools.

As always the door is open for your feedback on how we can serve your needs
better.

## ODSC East

We attended our first post-pandemic, in-person conference in Boston last month.
It was awesome to be together as a team, see
[**Dmitry Petrov**](https://twitter.com/FullStackML),
[**Milicia Mc Gregor**](https://twitter.com/FlippedCoding), and
[**Alex Kim**](https://www.linkedin.com/in/alex000kim/) in action, and talk to
attendees and other vendors at the conference. We are looking forward to
[MLOps World](https://mlopsworld.com/) next month!

![Iterative Team at ODSC East](/uploads/images/2022-05-16/odsc.jpeg '=800')
_Iterative team (left to right) - Mike Moynihan, me, Dave Berenbaum, Daniel
Barnes, Rob De Wit, Milicia Mc Gregor, Dmitry Petrov, Jervis Hui, Alex Kim, Chaz
Black_

## ✍🏼 Tons of new content on the blog

Our team has been on fire creating content for you. 🔥 Don't miss the following:

- Needing to get started with CML and AWS?
  [**Rob de Wit**](https://www.linkedin.com/in/rcdewit?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAA5CEPkB9fI02IpClBKhRdq2brULPHMhmR8&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B9MrcxBhQSG6IKzSgJDyfQQ%3D%3D)
  shows you how to train and save your models with CML in a two-part series
  using a
  [self-hosted AWS EC2 runner](https://dvc.org/blog/CML-runners-saving-models-1)
  and
  [with CML and DVC on a dedicated AWS EC2 runner](https://dvc.org/blog/CML-runners-saving-models-2)
- The
  [Part 1](https://dvc.org/blog/end-to-end-computer-vision-api-part-1-data-versioning-and-ml-pipelines),
  [Part 2](https://dvc.org/blog/end-to-end-computer-vision-api-part-2-local-experiments)
  and
  [Part 3](https://dvc.org/blog/end-to-end-computer-vision-api-part-3-remote-exp-ci-cd)
  tutorials of [**Alex Kim's**](https://www.linkedin.com/in/alex000kim/)
  End-to-End Computer Vision API project are out and filled with great learning!
- [**Milecia McGregor**](https://twitter.com/FlippedCoding) brings the monthly
  roundup of the Community's best technical questions in our latest
  [April Community Gems.](https://dvc.org/blog/april-22-community-gems) 💎

## ✨ Shiny New Docs

We have a new doc page on visualizations.  
[This new page](https://dvc.org/doc/start/visualization) showcses the new
visualizations added to the
[example-dvc-expermitens repo](https://github.com/iterative/example-dvc-experiments).  
 Whether you need to create plots from tabular data, user-genrated plots, autogenerating
plots from deep learning code, we've got you covered.

{To add} TFIR with Dmitry

Release Party Meetup

## New hires

[**Wolmir Nemitz**]() is our first team member from South America! We're getting
closer to covering all the continents in
[our remote team map](https://iterative.ai/about)! From Brazil, Wolmir joins us
as an Engineer for the 🤫 team (you'll find out June 14th). Wolmir has four
dogs, two tortoises and a budgie! 🦜

[**Pavel Chekmaryov**](https://www.linkedin.com/in/ufijuice/) joins us in People
Operations, managing the hiring pipeline from Frankfurt, Germany, but soon to be
Canada! He has spent the last eight years in startups, most recently at OccurAI,
reinventing recruitment in the deeptech/ML field. We look forward to him helping
to grow our amazing team!

## Open Positions

Even with our amazing new additions to the team, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions and share with anyone you think may be
interested! 🚀

![Iterative.ai is Hiring](/uploads/images/2022-01-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

We love when our Community does conference talks on our tools! 🥰

https://twitter.com/tryolabs/status/1525103969885888512?s=20&t=0h7bHyIeOl49soQpnf6aDA

This Heartbeat was brought to you by the song "Tarkus" from Emerson, Lake and
Palmer which can be found on our
[MLOps Playlist,](https://open.spotify.com/playlist/3eahsf3T9iEJkfWECC7VEp?si=cbcf1f9d3e424d62)
and the letters **T, P and I.** 😉 See you next month!

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
