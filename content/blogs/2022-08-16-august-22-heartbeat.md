---
title: August '22 Heartbeat
date: 2022-08-16
description: >
  Monthly updates are here! Phenomenal new posdcast, DVC with MinIO, Semantic
  similarity, DVC for Kaggle, new Model Registry in Studio, first Iterative
  Internal Hackathon and more! Welcome to August!

descriptionLong: |
  This month you will find:

    🎙 Vanishing Gradients podcast,

    👀 DVC used with Kaggle,
    
    🏢 S3 locally with MinIO and DVC,

    👯 Semantic similarity

    ® Iterative Studio Model Registry

    🧑🏽‍💻 Internal Hackathon

    🗣 IRL events,

    🚀 New hires, and more!
picture: 2022-08-16/august-heartbeat.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/august-2022-heartbeat/1298
tags:
  - Heartbeat
  - DVC
  - Kaggle
  - Hackathon
  - Git
  - Vanishing Gradients
  - Hugo Bowne-Anderson
  - Peter Wang
  - MinIO
  - AI Techpark
  - The NewStack
  - Semantic Similarity
---

Welcome to the August Heartbeat! As we all soak in the remaining summer days,
swing along in your hammock and take in all the great news from the Iterative
Community!

![Ukulele Hammock GIF by Northern Illinois University](https://media.giphy.com/media/2uI9paIuAWgaqfyX0Q/giphy.gif)

# From Greater AI/ML Community

## Vanishing Gradients Podcast

![Vanishing Gradients](../uploads/images/2022-08-16/vanishing-gradients.png 'Vanishing Gradients :wrap-left =300')
If you are not familiar with
[**Hugo Bowne-Anderson**](https://twitter.com/hugobowne), you should be. He was
the host of my all-time favorite Data Science podcast
[DataFramed](https://www.datacamp.com/podcast) while he was at
[DataCamp](https://www.datacamp.com/). DataFramed helped me immeasurably when I
started my data science journey. It provided great not only great teachings on
many data science concepts, but even more importantly, the ability to gain
perspectives from different people across all parts of the data space, talking
about challenges, danger zones, and issues that we all need to be aware of in
the field. Recently Hugo started a new podcast,
[Vanishing Gradients](https://vanishinggradients.fireside.fm/). This newer
endeavor is in a somewhat different format than DataFramed, but still with
Hugo's characteristic deep dive into all the challenges that come up when
working with data. Hugo uses a long-format conversation approach with many
leaders and great thinkers in the data science/machine learning/AI space. In
episodes [seven](https://vanishinggradients.fireside.fm/7) and
[eight,](https://vanishinggradients.fireside.fm/8) Hugo has a fascinating chat
with [**Peter Wang**](https://twitter.com/pwang), CEO of Anaconda, in which they
talk about a number of topics including how Python became so big in Data
Science, the emergence of open source collaborative environments, and things
that the PyData stack solves. Then it gets really interesting as they dive into
the open source model in the context of finite and infinite games and open
source software as a "paradigm of humanity's ability to create generative,
nourishing and anti-rivalrous systems." 🤯 Super interesting discussion and food
for thought. I've already listened to both episodes twice. I highly recommend
them and this new podcast in general.

# From the Iterative tools Community

## **Mikołaj Kania** - Can DVC Be Used for Kaggle?

[**Mikołaj Kania**](https://twitter.com/MikolajKania) suggests that you upgrade
your Kaggle competition workflow from the “spaghetti code” of Jupyter Notebooks
and use the more mature way of creating reproducible ML results by using DVC
[here on his blog](https://mikolajkania.com/2022/08/07/dvc-kaggle-mlops/).

He notes that notebooks are really bad to compare changes between runs. Instead,
he suggests developing a workflow where for every major experiment type,
creating a branch - experimenting in each and persisting the best and most
notable outcomes (good and bad). The best results are then submitted to Kaggle.
You can find more about his workflow in
[his repo for the project.](https://github.com/mikolajkania/kaggle-03-house-prices)

![Using DVC for Kaggle Competition](../uploads/images/2022-08-16/kaggle-dvc.png '=800')
_DVC with Kaggle
([Source link](https://mikolajkania.com/2022/08/07/dvc-kaggle-mlops/))_

Mikołaj explains how DVC's project structure ensures reproducible results and
develops habits on best practices. One drawback he noted was the lack of an
experimentation UI, but we just introduced the DVC extension for VS Code to help
with that, and there’s always Iterative Studio. Look out for improvement to the
experiment features in both tools in the coming months! Also, experimenting with
DVC in Kaggle may give you some good practice for things we are cooking up
internally! 😉🤫

## **Shambhavi Mishra** - Searching for Semantic Similarity

[**Shambhavi Mishra**](https://twitter.com/ShambhaviCodes) in her post
[Searching for Semantic Similarity](https://medium.com/towards-artificial-intelligence/searching-for-semantic-similarity-cfbff2388d04)
details the steps of her NLP project on similarity algorithms. She mainly
focuses on cosine similarity using a Stack Overflow questions dataset. The
end-to-end project uses Sentence BERT, Fast Text, DVC, DAGsHub, Streamlit and
deploys the web app on an AWS EC2 instance.

Once you follow all the steps you will have computed the similarity between a
search query and a database of texts and rank all the data by their similarity
score to retrieve the most similar text to its index.

![Cosine Similarity](../uploads/images/2022-08-16/cosine-similarity.png '=800')
_Understanding Cosine Similarity
([Source link](https://www.oreilly.com/library/view/mastering-machine-learning/9781785283451/ba8bef27-953e-42a4-8180-cea152af8118.xhtml))_

## **Evgenii Munin** - Run S3 Locally With MinIO for the DVC Machine Learning Pipeline

If you are in need of object storage to work with data through an API, but need
to do so in a private network,
[**Evgenii Munin**](https://www.linkedin.com/in/evgenii-munin-01932a143/) shows
how to set up MinIO as remote storage with DVC to do just that
[in this piece in Medium](https://betterprogramming.pub/run-s3-locally-with-minio-for-dvc-machine-learning-pipeline-7fa3d240d3ab).
In this cool use case, he starts with installing the MinIO server and builds a
Docker image to run it, sharing a great repo on Kafka-to S3 where MinIO was used
to mock the S3 for the data. Then he shows you how to link the MinIO server as
DVC remote storage.

![Minio Browser](../uploads/images/2022-08-16/minio.png '=800') _Minio Browser
with Data pushed from DVC
([Source link](https://betterprogramming.pub/run-s3-locally-with-minio-for-dvc-machine-learning-pipeline-7fa3d240d3ab))_

## **Caleb Kaiser** - Moving from Data Science to Machine Learning Engineering

It can sometimes be confusing to determine where data science stops and machine
learning engineering starts. [**Caleb Kaiser**](https://twitter.com/KaiserFrose)
helps clarify this
[in this old but good piece](https://www.kdnuggets.com/2020/11/moving-data-science-machine-learning-engineering.html)
in [KD Nuggets](https://www.kdnuggets.com). He provides four examples of real-
world projects and defines what portions of the project are data science and
what are ML engineering. In all what we find is that machine learning
engineering is all the tasks that need to happen to get the model the data
scientists create into production applications.

He goes on to dive deeper into one of the examples and shows the promise in some
tools that bridge the gap between machine learning and software engineering
where he highlights DVC and Huggingface. This is a good piece to read if you are
grappling with the difference!

![Season 2 Episode 6 GIF by Portlandia](https://media.giphy.com/media/xUNd9DLukkavmhybAs/giphy.gif)

## Just a few other things...

- GitHub Goodness alert for
  [Visual Data Preparation (VDP),](https://github.com/instill-ai/vdp) an
  open-source visual data ETL tool to streamline the end-to-end visual data
  processing pipeline. Among the highlights: a fast way to build end-to-end
  visual data pipelines, pre-built ETL data connectors, and integration with DVC
- [**Jillian Rowe**](https://twitter.com/jillianerowe) gave a shout-out to DVC
  on a
  [recent podcast](https://topenddevs.com/podcasts/adventures-in-devops/episodes/the-intersection-of-data-and-devops-devops-124)
  from
  [Adventures in DevOps Podcast](https://topenddevs.com/podcasts/adventures-in-devops)
  in an episode where they discuss the intersection of data and DevOps
- If you are interested in contributing to researchers' learning about machine
  learning experimentation tools, you can take
  [this survey](https://www.freelancer.com.au/projects/machine-learning/Seeking-Qualified-Respondents-for-Online-34294453.html).
  Spread the word!

## Company News

### 🎉 Model Registry released in Iterative Studio

On July 26th we released our new
[model registry in Iterative Studio.](https://iterative.ai/model-registry)  
The great work done by the MLEM team building a git-based model registry is now
incorporated in Studio in a web UI. This release took the work of half the
people in the company and we are proud of the steps we are taking to meet people
where they are and round out your options whether you are comfortable in the
CLI, API, or web UI. Be sure to try it out and give us your feedback. Learn more
[in the blog post](https://dvc.org/blog/iterative-studio-model-registry) and
[in the docs](https://dvc.org/doc/studio/user-guide/model-registry/what-is-a-model-registry).
Look out for a full tutorial coming soon!

https://www.youtube.com/watch?v=DYeVI-QrHGI

### 🧑🏽‍💻 Iterative's First Internal Hackathon

Last week we had our very first internal Hackathon! The entire company
participated in the 48-hour computer vision challenge classifying dogs, cats,
croissants and muffins. Part of the objective was to familiarize ourselves and
test a new tool that we are expecting to release later this year.

Eight teams competed for prizes for the best outcome, but also for the best
integrations with other tools, the best dog, cat, croissant, and muffin photos
from team members, and the best notes from the experience. I think the notes of
our newest DevRel [**Gema Parreño Piqueras**](https://twitter.com/SoyGema) are
in good running for the prize. (Learn more about Gema in the New Hires section
below!)

![Gema Parreño Piqueras' Hackathon notes](../uploads/images/2022-08-16/gema-hackathon-notes.jpeg '=800')
_Gema Parreño Piqueras' Hackathon notes
([Source link](https://twitter.com/SoyGema/status/1558135976698028034?s=20&t=lXyAWLISwf8gUl8SZS84AQ))_

See the members of the winning teams below. Team members
[**Daniel Kharitonov**](https://www.linkedin.com/in/danielkharitonov/) and
[**Jon Burdo**](https://www.linkedin.com/in/jon-burdo-59730a83/) organized the
whole event and put together an extremely comprehensive document to help guide
the teams. We are looking forward to more of these events in the future!

![Winners of the First Iterative Hackathon](../uploads/images/2022-08-16/winners.jpg '=800')
_Winners of the first Iterative Internal Hackathon, Source: Dmitry Petrov_

### 📰 Dmitry Petrov in AI Techpark and The New Stack

[**Dmitry Petrov**](https://twitter.com/FullStackML) gives a sneak peek into the
recent developments at Iterative.ai, highlights the most exciting trends, and
shares about his entrepreneurial journey
[in this article](https://ai-techpark.com/aitech-interview-with-dmitry-petrov-co-founder-ceo-at-iterative-ai/)
in [AI Techpark.](https://ai-techpark.com/ai/)

Dmitry also wrote a piece for [The NewStack](https://thenewstack.io/) entitled
[Why We Built an Open Source ML Model Registry with Git](https://thenewstack.io/why-we-built-an-open-source-ml-model-registry-with-git/).
As the title suggests the why is here as well as learnings from our customers'
use cases, and the realization of the need for Model Registry as Code (MRaC),
thus continuing our GitOps approach to tool building for machine learning.

## **David de la Iglesia Castro** - Making MLOps Uncool Again

If you haven't gotten a chance to make it to the conferences where
[**David de la Iglesia Castro**](https://twitter.com/daviddelachurch) presented
his popular talk or workshop entitled
[Making MLOps Uncool Again](https://www.youtube.com/watch?v=J6fduKE1j1g), you
can now catch it on our very own
[YouTube channel](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ)! In
this presentation you will learn how to build an MLOps workflow by extending the
power of Git and GitHub with open-source tools DVC and CML. In the end, you will
have an automated workflow that covers the entire lifecycle of an ML model, from
data labeling to monitoring predictions.
[Find the repo for the project here.](https://github.com/iterative/workshop-uncool-mlops)
And the
[solution here](https://github.com/iterative/workshop-uncool-mlops-solution).

https://www.youtube.com/watch?v=J6fduKE1j1g

## New hires

[**Gema Parreño Piqueras**](https://twitter.com/SoyGema) joins our team from
Madrid, Spain as a Developer Advocate. You may have already been familiar with
Gema if you've been taking our [online course](https://learn.iterative.ai) this
summer because of the
[gorgeous notes](https://twitter.com/SoyGema/status/1558135976698028034?s=20&t=pJAfd-S4aoKGf4UhsnlgCw)
she contributed per module. Gema was born and raised as an Architect (of
buildings) but switched to tech a while back. She had her own video game
start-up and has also worked as a Data Scientist in the Financial Industry. She
has contributed to open source StarCraft II ML project. Gema loves indie games,
puzzles, and croquettes! She makes the 4th teammate from España! 🇪🇸

[**Marcin Jasion**](https://www.linkedin.com/in/marcinjasion/) joins the team as
a Senior Platform Engineer from Poland. He has been friends with team member,
Paweł Redzyński, for years. When not working he likes travelling and eating,
motorcycling, and is an avid cross-fitter. He also has a cat that likes to be a
part of meetings! 🐈

[**Domas Monkus**](https://www.linkedin.com/in/domasmonkus/) joins the CML team
as an engineer from Lithuania. Before joining us at Iterative, Domas spent 10
years at Canonical working on juju, livepatch, and many internal projects. He's
a husband and father with a house outside the hustle and bustle of the city, so
he mentioned that lawn mowing is one of his main free time activities. 🏡

## Upcoming Events

This week is [AI4](https://ai4.io/)!
[**Dmitry Petrov**](https://twitter.com/fullstackml?lang=en) will give a talk as
well as participate in a panel discussion on MLOps. If you are attending, stop
by the booth and say hi or check out one of the in-booth demos we will have on
our tools throughout the day.

Additional conferences we will be attending this year:

- [**Gema Parreño Piqueras**](https://twitter.com/SoyGema) and our lead docs
  writer, [**Jorge Orpinel Perez**](https://twitter.com/JorgeOrpinel) will be
  heading to Mexico City August 31-September 1st for the
  [LATAM AI Conference](https://www.latam-ai.com/). Gema will give a
  presentation on experimentation in our new
  [DVC extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc).
- [Southern Data Science Conference](https://www.southerndatascience.com/) in
  Atlanta, GA on September 8-9th.
- [ODSC West](https://odsc.com/california/) in San Francisco
- [Deep Learning World](https://deeplearningworld.de/) - Berlin
- [MLOps Summit - Re-work](https://www.re-work.co/events/mlops-summit-2022) -
  London
- Dmitry Petrov will be speaking at
  [GitHub Universe](https://www.githubuniverse.com/) on November 9-10!
- [Toronto Machine Learning Summit](https://www.torontomachinelearning.com/)-
  Toronto

We also will be reviving our virtual meetups this fall so be sure to
[join our group on Meetup.](https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/)

## Open Positions

[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the open positions. Please share with anyone looking to
have a lot of fun building the next generation of machine learning to production
tools! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-08-16/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

### ✍🏼 Doc Updates

- As noted above there are
  [new docs for Iterative Studio's Model Registry](https://dvc.org/doc/studio/user-guide/model-registry/what-is-a-model-registry)
- In case you missed it, CML now supports
  [Bitbucket](https://bitbucket.org/product)! You can find the
  [docs for the Bitbucket integration here](https://cml.dev/doc/start/bitbucket#get-started-with-cml-on-bitbucket).

### ✍🏼 Blog post

- 💎 Don't miss
  [July's Community Gems](https://dvc.org/blog/july-22-community-gems) is full
  of great questions from the Community.
- [**Milecia McGregor**](https://twitter.com/FlippedCoding) provides a new
  tutorial for
  [Serving Machine Learning Models with MLEM.](https://dvc.org/blog/serving-models-with-mlem)
  Don't miss it!

## Tweet Love ❤️

Once again we have a tie for best Tweet! Looking forward to seeing the video on
this one from [**Avikalp Kumar Gupta**](https://twitter.com/AvikalpGupta)!🍿 You
can find the slides
[here](https://drive.google.com/file/d/1-iOgtVDWG13A9MxRDet246Gnbdrkb0vv/view).

https://twitter.com/AvikalpGupta/status/1556609442908884994?s=20&t=pJAfd-S4aoKGf4UhsnlgCw

Also so great to have our new DVC extension shouted out by
[**Harold Sinnot**](https://twitter.com/HaroldSinnott)!

https://twitter.com/HaroldSinnott/status/1545058509087092736?s=20&t=5jVO7zD2UBak4e6rk7mooQ

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
