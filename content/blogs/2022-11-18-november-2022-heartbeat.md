---
title: November '22 Heartbeat
date: 2022-11-18
description: >
  Monthly updates are here! NLP will have a bigger impact than Computer
  vision?  WDYT? Dmitry speaks at Github Universe, MLEM new deployment features,
  SOC 2 Type 1 compliance, more events, and great Community content. Welcome to
  November!

descriptionLong: |
  This month you will find:

    ❓ Will NLP have more impact than Computer Vision,

    🐙 Dmitry Petrov speaks at GitHub Universe,
    
    🧐 CML in research at NeurIPS,

    ❣️ Unstructured Data Catalog coming,

    ✅ SOC 2 Type 1 Compliance,

    🚀 MLEM adds Sagemaker and Kubernetes deployment,

    👀 Lots of new docs,

    🚀 Upcoming events, and more!
picture: 2022-11-18/november-cover.jpg
pictureComment: Image generated with the help of Stable Diffusion
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/november-22-heartbeat/1385
tags:
  - Heartbeat
  - DVC
  - CML
  - MLEM
  - GitHub Universe
  - SOC 2
  - Sagemaker
  - Kubernetes
  - NeurIPS
  - ODSC
---

Welcome to November! In the US, this is the time of year we reflect and give
thanks. It's been a productive year despite the world's rather extreme
challenges. There's lots to be thankful for. Here are some of those things from
the last month in the Iterative Community.

# AI News

### Robert Toews - The Biggest Opportunity in Generative AI Is Language, Not Images

![NLP](../uploads/images/2022-11-18/forbes.jpg 'Rob Toews bets on languge over
images :wrap-left =200')
[In this article](https://www.forbes.com/sites/robtoews/2022/11/06/the-biggest-opportunity-in-generative-ai-is-language-not-images/?sh=303a5719789d)
entitled _The Biggest Opportunity In Generative AI Is Language, Not Images_,
[**Robert Toews**](https://www.linkedin.com/in/robtoews/) argues that AI-powered
text generation will create many orders of magnitude more value than
text-generated images.

> Language is humanity’s single most important invention. More than anything
> else, it is what sets us apart from every other species on the planet.
> Language enables us to reason abstractly, to develop complex ideas about what
> the world is and could be, to communicate these ideas to one another, and to
> build on them across generations and geographies. Almost nothing about modern
> civilization would be possible without language.

He points out the many examples from a variety of industries and academia that
have gained and will continue to gain massive improvements due to the power of
large language models (LLMs) in the coming years. Read the article for all the
applications.

### State of AI Report

The
[State of AI Report](https://docs.google.com/presentation/d/1WrkeJ9-CjuotTXoa4ZZlB3UPBXpxe4B3FMs9R9tn34I/edit#slide=id.g164b1bac824_0_2794)
is generated each year and reports on the most interesting things the authors,
[**Nathan Benaich**](https://twitter.com/nathanbenaich),
[**Ian Hogarth**](https://twitter.com/soundboy),
[**Othmane Sebbouh**](https://twitter.com/osebbouh), and
[**Nitarshan Rajkumar**](https://twitter.com/nitarshan) come across in the world
of AI throughout the year.

- Slide 22: Mirroring the ideas of the Toews article above, this slide discusses
  the LLM use case of conversational code generation. OpenAI's Codex, which
  powers [GitHub's Copilot](https://github.com/features/copilot) to produce this
  capability was on display at the recent
  [GitHub Universe](https://watch.githubuniverse.com/home). Other companies
  including Salesforce, Google, and DeepMind are working on Code generating
  projects of their own with Google's LLM PaLM coming out as a favored option
  with 50x less code than Codex. Alternatively DeepMind's AlphaCode generates
  the whole program as opposed to lines of code.
- Slide 24: Continuing to echo Toews' article, in research LLMs are greatly
  improving their mathematical abilities, jumping to far better scores than
  previous model versions. Techniques that helped to achieve these gains are
  discussed
- Slides 30 and 31: Challenging Toews' stance, these slides show the great
  progress in Computer Vision. Diffusion models are doing more than just
  text-to-image generation. Now they are being used for text-to-video, text
  generation, audio, molecular design, and more. Info on the techniques now
  being used can be found in Slide 30. Side 31 discusses the huge improvement in
  the next generation of text-to-image generation competing models including
  DALL-E, Imagen, and Parti.

Be sure to digest the whole report for even more AI advances!

💓 So for our “Pulse check” this month:

<admon type="tip">

Do you agree that NLP will have more impact than computer vision? Tell us about
what you are working on with NLP. We’d love to get you connected with others
struggling with similar issues and know how we can improve our tools to help you
with your NLP projects.

</admon>

Join us in the `#general` channel in
[Discord](https://discord.com/invite/dvwXA2N) to weigh in.

# Community Content Highlights

## Thank you Hacktoberfest Contributors!

We would like to thank
[**Francesco Calcavecchia**](https://github.com/francesco086),
[**vvssttkk**](https://github.com/vvssttkk), and
[**deepyaman**](https://github.com/deepyaman) for their contributions to
[GTO](https://github.com/iterative/gto),
[MLEM,](https://github.com/iterative/mlem) and
[CML](https://github.com/iterative/cml) respectively. They will be receiving
their own personalized shirts that note their contributions! And many thanks to
[**Mert Bozkir**](https://www.linkedin.com/in/mertbozkir/) for leading the
Hacktoberfest charge here at Iterative!

![Hacktoberfest Contributors](../uploads/images/2022-11-18/hacktoberfest.png '=800')
_2022 Hacktoberfest Contributions_

## João Santiago and team presenting on their use of DVC at the NLP in Closure Session 2 event

One of our Community Champions,
[**João Santiago**](https://www.linkedin.com/in/jcpsantiago/) of
[Billie.io](https://www.billie.io/) gives an introduction to DVC in preparation
for the remainder of the session where
[**Carsten Behring**](https://scicloj.github.io/blog/predict-real-vs.-fake-disaster-tweets/),
author of [Metamorph](https://cljdoc.org/d/scicloj/metamorph/0.2.1/doc/readme)
and the [scicloj.ml](https://github.com/scicloj/scicloj.ml) platform presents
how NLP pipelines can be managed with DVC, Closure & Python.

[https://www.youtube.com/watch?v=eubg-fjRh9E&t=914s](https://www.youtube.com/watch?v=eubg-fjRh9E&t=914s)

## CML at NeurIPS

Last month we reported on CML turning up in research
[here](https://iterative.ai/blog/october-heartbeat#cml). Well, this work will be
presented within the virtual Workshop
[Challenges In Deploying and Monitoring Machine Learning Systems](https://neurips.cc/media/PosterPDFs/NeurIPS%202022/62157.png)
at NeurIPS virtual this year on December 9th.
[Find out more and register here.](https://neurips.cc/)

![CML at NeurIPS](../uploads/images/2022-11-18/cml-neurips.png '=800') _Research
on CML to be presented at NeurIPS
([Source link](https://neurips.cc/media/PosterPDFs/NeurIPS%202022/62157.png))_

# Company News

## New Unstructured Data Catalog

Do you use Amazon S3, Azure Blob Storage, or Google Cloud Storage? We have a new
solution for finding and managing your datasets of unstructured data like
images, audio files, and PDFs! Extend your DVC environment with the first data
catalog and query language (SQL->DQL) for unstructured data and machine
learning. Learn more on [our website](https://iterative.ai/data-catalog-for-ml)
and/or [schedule a meeting with us](https://calendly.com/gtm-2/iterative-datamgmt-overview)!

## MLEM

![MLEM Sagemaker and Kubernetes
deployment](../uploads/images/2022-11-18/dog-on-a-broomstick.png 'MLEM adds
Kubernetes and Sagemaker Deployment :wrap-left =250')
In case you missed it MLEM announced a release on Halloween! MLEM now supports
[Sagemaker](https://mlem.ai/doc/user-guide/deploying/sagemaker) and
[Kubernetes](https://mlem.ai/doc/user-guide/deploying/kubernetes) in addition to
[Heroku](https://mlem.ai/doc/user-guide/deploying/heroku) and
[Docker](https://mlem.ai/doc/user-guide/deploying/docker). You can learn about
how easy it now is to package your models for deployment with only a few lines
of code and never have to get lost in Kubernetes docs again! Find the
[blog post here](https://iterative.ai/blog/mlem-k8s-sagemaker) and be sure to
[visit the docs](https://mlem.ai/doc/user-guide/deploying)!

## SOC 2 Type 1 Compliance

![Iterative Achieves SOC 2 Type 1
Compliance](../uploads/images/2022-11-18/soc-2-cover.png 'Iterative Achieves SOC 2
Type 1 Compliance :wrap-right =250')
We are very excited to announce that Iterative is now SOC 2 Type 1 compliant.
This certification signals to our customers our commitment to Security,
Availability, Processing Integrity, Confidentiality, and Privacy within our
organization. We have successfully endured the rigorous process and have learned
much as a team in the process.
[**Guro Bokum**](https://www.linkedin.com/in/gurobokum/) reviews the five key
learnings [in this blog piece](https://iterative.ai/blog/SOC-2). You can find
the full report on our
[Security and Privacy](https://iterative.ai/security-and-privacy) page.

## Dmitry Petrov at GitHub Universe

On November 8th, our CEO, [**Dmitry Petrov**](https://twitter.com/FullStackML)
spoke at [GitHub Universe](https://githubuniverse.com/) on _ML with Git:
experiment tracking in Codespaces._ In his presentation, he shows how to use the
DVC extension for VS Code and Codespaces to streamline your machine learning
experimentation process. You can find his video below in the event platform if
you are registered. We expect the video to be available on YouTube in the next
of couple months. We'll keep you updated!

![Dmitry Petrov at GitHub Universe](../uploads/images/2022-11-18/gh-universe.jpeg '=800')
_Dmitry Petrov during his talk, 𝗠𝗟 𝘄𝗶𝘁𝗵 𝗚𝗶𝘁: 𝗲𝘅𝗽𝗲𝗿𝗶𝗺𝗲𝗻𝘁 𝘁𝗿𝗮𝗰𝗸𝗶𝗻𝗴 𝗶𝗻 𝗖𝗼𝗱𝗲𝘀𝗽𝗮𝗰𝗲𝘀_

## Rob de Wit - From Jupyter Notebook to DVC pipeline for reproducible ML experiments

Jupyter Notebooks are great for prototyping, but eventually, you will want to
move toward reproducible experiments. Converting a notebook to a DVC pipeline
requires a bit of a mental shift.
[**Rob de Wit**](https://www.linkedin.com/in/rcdewit/) shows you how to
accomplish it with an intermediate step: use
[Papermill](https://papermill.readthedocs.io/en/latest/) to build a one-stage
DVC pipeline that executes our entire notebook, and use the resulting pipeline
to run and version ML experiments. Look out for a future post with a more
advanced pipeline!

![Dvc GIF](https://media.giphy.com/media/wnWvARibI7pykx0mTf/giphy.gif)

## Meetups

At our next meetup on December 14th,
[**Sami Jawhar**](https://www.linkedin.com/in/sami-jawhar-a58b9849/) will
present _An Open Discussion of Parallel data pipelines with DVC and TPI_, an
advanced use case for distributing experiments in the cloud. Sami is a great
discussion driver. If you are interested in higher-level use cases you will want
to join the discussion!

<external-link
href="https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/events/289771497/"
title="Sami Jawhar on Running Parallel Pipelines with DVC and TPI"
description="Join us on December 14th for an open discussion on Running Parallel Pipelines with DVC and
TPI!" link="https://meetup.com" image="../uploads/images/2022-11-18/meetup.png"/>

On January 11th,
[**Francesco Calcavecchia**](https://www.linkedin.com/in/francescocalcavecchia/)
will be joining us to share about his recent contribution to MLEM through his
work on GTO and how this helps him in his work at
[E.On Energie Deutschland](https://www.eon.de/de/pk.html) with creating a
Git-based model registry.

<external-link
href="https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/events/289772002/"
title="Francesco Calcavecchia on Designing a model Registry with Legacy Systems
using DVC and GTO" description="Join us on January 11th. Designing a Model
Registry with Legacy Systems using GTO!" link="https://meetup.com"
image="../uploads/images/2022-11-18/meetup.png"/>

## Events

### ODSC West

We had a great time at [ODSC West](https://odsc.com/california/)! We had great
conversations with conferencegoers and attended great sessions! Dmitry had a
packed room for his in-person talk _Why You Need a GitOps-based Machine Learning
Model Registry_ and [**Alex Kim**](https://twitter.com/alex000kim) presented
_CI/CD for Machine Learning_ virtually. At each of the conferences we've
sponsored this year, we've had a game called Deevee's Ramen Run. (If you don't
know the Ramen connection, you need to spend more time reading the monthly
Heartbeats 😉). Below find the top three winners of the game.

![Winners of DeeVees Ramen Run](../uploads/images/2022-11-18/winners.png '=800')
_Winners 1st - 3rd shown above: Alexandra Hagmeyer (pictured with myself and
teammate Daniel Barnes), Ryan Renslow, and (name asked to be withheld, but she
was good with the picture and DeeVee!)_

### MLOps Summit London

We were also part of the
[MLOps Summit in London](https://london-ml-ops.re-work.co/) only a week later!
Admittedly, there were different team members in attendance and staffing the
booth. Aside from attending a variety of great talks, we met many wonderful
people from all over the world. This resulted in some really interesting
discussions about how different companies approach MLOps.

Casper da Costa-Luis gave a well-received talk on how to painlessly run ML
experiments in the cloud with CML at the summit. The recording will be made
available in the near future, so look out for that! The talk answered at least
one of the questions of Deevee's Ramen Run, which yielded
[some surprised (but excited!) winners](https://www.linkedin.com/posts/rebecca-gorringe_machinelearning-iterative-reworkai-activity-6998338419772772353-FUip?utm_source=share&utm_medium=member_desktop)
this time around.

![Iterative Team at MLOps Summit - London](../uploads/images/2022-11-18/team.png '=800')
_Iterative Team members, clockwise from top right: Rob de Wit, Gema Parreño
Piqueras, Casper da Costa-Luis, and Chaz Black)_

### TechWeek

[**Gema Parreño Piqueras**](https://twitter.com/SoyGema) presented at
[TechWeek](https://www.ambito.com/negocios/tecnologia/comenzo-la-tech-week-latam-y-espana-mas-600-ofertas-empleo-it-n5578240)
in Spain with her talk _Reproducibilty and Version Control are Important: Follow
up with the DVC extension for VS Code_. She will be presenting the same talk at
[Codemotion](https://events.codemotion.com/conferences/online/2022/online-tech-conference-2022-spanish-edition-autumn).
You can find her talk in Spanish at 2:02 below!

https://youtu.be/zXl9qINlbcI

### Upcoming events

- We will be participating in
  [Toronto Machine Learning Summit](https://www.torontomachinelearning.com/) -
  on November 29-30 in Toronto
- [**Alex Kim**](https://twitter.com/alex000kim) _CI/CD for Machine Learning_
  for an ODSC Webinar.
  [Register here.](https://app.aiplus.training/courses/CI-CD-for-Machine-Learning)
- We will be at [PyData Eindhoven](https://pydata.org/eindhoven2022/) on
  December 2nd. Come say hi at the booth if you are attending! We have some
  tickets to give away for the event in
  [Discord](https://discord.com/channels/485586884165107732/497187456051970048/1036999675951190056).
  First come first serve!
- We are sponsoring [NormConf](https://normconf.com/) on December 15th. They
  will have Slack-based booths there. We are looking forward to supporting this
  new conference!

Stay tuned to
[our Newsletter ](https://iterative.ai/#:~:text=Go%20to%20Twitter-,Subscribe,-for%20updates.%20We)
for what we will be up to conference-wise in 2023!

## ✍🏼 Doc Updates!

![Computer Working GIF](https://media.giphy.com/media/BemKqR9RDK4V2/giphy.gif)

The team has been busy improving the docs for you. See all the latest and
greatest updates below.

### DVC Docs

- [DVCFileSystem](https://dvc.org/doc/api-reference/dvcfilesystem) -
  DVCFileSystem provides a pythonic file interface
  ( [fsspec-compatible](https://filesystem-spec.readthedocs.io/) ) for a DVC
  repo. It is read-only. DVCFileSystem provides a unified view of all the
  files/directories in your repository, be it Git-tracked or DVC-tracked, or
  untracked (in the case of a local repository). It can reuse the files in the
  DVC cache and can otherwise stream
  from [supported remote storage](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).
- We’ve now added
  [Horizontal bar plots](https://dvc.org/doc/command-reference/plots/show#example-horizontal-bar-plot)
  to the mix of `dvc plots show` !
- You can now list contents from supported URLs with `dvc ls-url` Find the
  description, options, and example code
  [here.](https://dvc.org/doc/command-reference/list-url)
- Based on some feedback we reorganized the
  [User Guide](https://dvc.org/doc/user-guide/overview) to help you better
  navigate. Let us know what you think!
- Similarly, we reorganized the
  [DVCLive documentation](https://dvc.org/doc/dvclive) for better navigation.

### CML docs

- In CML you can now publicly self-host images with `cml comment`. Find the
  options [here.](https://cml.dev/doc/ref/comment#--publish)
- Also, we’ve updated the
  [self-hosted runners](https://cml.dev/doc/self-hosted-runners) docs in CML.
- We've now added a guide for bringing your data to GitLab using DVC. Find the
  details [in this doc.](https://cml.dev/doc/cml-with-dvc?tab=GitLab)

### MLEM docs

- [MLEM docs](https://mlem.ai/doc) have received a nearly full overhaul.
- Additionally the [Get Started](https://mlem.ai/doc/get-started) section has
  been greatly improved.
- Look out for new docs to come out soon for
  [GTO](https://github.com/iterative/gto) on the [MLEM](https://mlem.ai/doc)
  website.

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
