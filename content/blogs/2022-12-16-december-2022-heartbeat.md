---
title: December '22 Heartbeat
date: 2022-12-16
description: >
  Monthly updates are here! Great content from the Community, including a DVC
  extension for VS Code tutorial, sweet MLOps guide, framework agnostic ml
  pipeline with DVC and non-Python apps to integrate ML models with MLEM.
  Welcome to December!

descriptionLong: |
  This month you will find:

    🦮 MLOps Guide,

    🧪 DVC extension for VS Code Experimentation,
    
    🌌 A Fable about MLOps,

    ❣️ Unstructured Data Query Language coming,

    📈 DVC Live Experiment Tracking,

    🚀 GTO GitOps model registry tutorial,

    👀 New CML Commands, and more!
picture: 2022-12-16/december-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/december-22-heartbeat/1407
tags:
  - Heartbeat
  - DVC
  - CML
  - MLEM
  - Rust
  - DataChain Studio
---

<admon type="tip">

Unlike most of the text you've read over the past two weeks, this Heartbeat was
100% human generated. 😉

</admon>

Welcome to December! Wow, what a year! We introduced an online course, added
five new tools (TPI, GTO, MLEM, DVC Extension for VS Code, and a Model Registry
in Iterative Studio) plus tons of new features to DVC, CML, and Iterative
Studio. We also were thrilled to emerge from the pandemic and meet so many of
you in person at conferences around the world. We are excited about what's in
store for 2023, and we thank you all for being such fantastic community members.
While there are still challenging events happening around the globe, there is
much to be thankful for and victories to celebrate! Bring on 2023!

![Believe Jason Sudeikis GIF by Apple TV](https://media.giphy.com/media/DEZA7FlHbMesUF1jm9/giphy.gif)

## From the Community

### MLOps Guide

For their engineering final project at [Insper,](https://www.insper.edu.br/en/)
[**Arthur Olga**](https://github.com/arthurolga), [**Gabriel Monteiro**](https://github.com/gabriellm1), [**Guilherme Leite**](https://github.com/guipleite),
 and [**Vinicius Lima**](https://github.com/ViniGl) created the
[MLOps Guide](https://mlops-guide.github.io/), which provides a Complete MLOps
development cycle using DVC, CML, and IBM Watson. The multi-page guide covers
the principles of MLOps as well as a full tutorial for building an MLOps
environment. It covers data and model versioning, feature management and
storing, automation of pipelines and processes, CI/CD for machine learning, and
continuous monitoring of models. The guide uses both DVC and CML and includes
videos outlining the project and much of the coding, as well as a project
repository that you can work through.

![MLOps Guide](../uploads/images/2022-12-16/DiagramMLOPs.png '=800') _MLOps
Guide ([Source link](https://mlops-guide.github.io/))_

### Turn VS Code Into a One-Stop Shop for ML Experiments

[**Eryk Lewinson**](https://www.linkedin.com/in/eryklewinson/) wrote a fabulous,
[in-depth tutorial](https://towardsdatascience.com/turn-vs-code-into-a-one-stop-shop-for-ml-experiments-49c97c47db27)
on experiment tracking using our new DVC Extension for VS Code. He starts off
with, “One of the biggest threats to productivity in recent times is context
switching.” As a Community Manager, I can so relate! 😅 He posits that the
extension is a great way to both code our experiments and evaluate and compare
them happily in our IDE, without having to jump back and forth between
platforms.

![DVC Extension for VS Code Experiment Tracking](../uploads/images/2022-12-16/eryk-lewinson.gif)

Eryk uses a credit card risk dataset and project to show most of the
capabilities of the
[DVC Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
and take us through all the steps to show the entire workflow and the resulting
project structure. He notes the best points of the extension are its experiment
bookkeeping with an emphasis on reproducibility and its extended plotting
capabilities including live plotting to visualize model performance while the
model is still being trained. He goes over some tricks and functionality of the
extension as well.

### A Fable About MLOps...and Broken Dreams

![A Fable About MLOps...And Broken Dreams](../uploads/images/2022-12-16/alex-burlacu.png '=800')
_A Fable About MLOps... and Broken Dreams
([Source link](https://alexandruburlacu.github.io/posts/2022-11-22-mlops-fable))_

[**Alex Burlacu**](https://www.linkedin.com/in/alexandru-burlacu) tells a great
story and provides many tips on his experience in MLOps
[in this piece](https://alexandruburlacu.github.io/posts/2022-11-22-mlops-fable)
on his blog called _A Fable About MLOps... and Broken Dreams_. The tale is
likely all too familiar to many of you in our Community in addition to being
validating and entertaining to read. He offers some great prerequisites for
beginning your MLOps journey including quickly finding and accessing your data,
seeding that model training code, and recording your experiment configuration.
Last of these he recommends MLFlow, but as the previous summary from Eryk points
out, this can be done very effectively with the new DVC extension AND be truly
fully reproducible. 🤗

Generally, he recommends starting early and starting small with MLOps. More
technically, he recommends a simple data collection and discovery system, data
versioning with DVC, replicable experiments, experiment tracking, ML serving,
testing, and CI/CD. It's all great advice and fun to read!

### ML Pipeline Decoupled - I managed to write a framework-agnostic ml pipeline with DVC, Rust, and Python

![Framework Agnostic ML Pipeline with DVC, Rust and Python](../uploads/images/2022-12-16/mr-data-psycho.png 'Rob Toews bets on languge over
images :wrap-left =300')
[**Sheikh Samsuzzhan Alam, aka Mr. Data Psycho**,](https://www.linkedin.com/in/mr-data-psycho/)
writes
[this great piece](https://towardsdev.com/ml-pipeline-decoupled-i-managed-to-write-a-framework-agnostic-ml-pipeline-with-dvc-rust-python-287de68104c9)
that reminds us that DVC is language agnostic! While Python is the most popular
language used in Data Science and with DVC, there are some instances where you
may want to use languages such as Rust to speed up memory efficiency and offer a
faster solution for parts of your project. The good news is you can! Mr. Data
Psycho extols the virtues of DVC’s pipelining feature and shows how to use Rust
(Polars) as a pre-processing framework, Sci-kit Learn for model training, and
the rest in Python. Using the yaml files, each stage could be put together using
dependencies written in whatever language your heart desires! You can find the
repo for the project [here](https://github.com/DataPsycho/mlpipeline-with-dvc).
R users may be interested in this related content
[here](https://github.com/jcpsantiago/dvthis),
[here,](https://www.youtube.com/watch?v=NwUijrm2U2w&t=2s) and
[here](https://iterative.ai/blog/r-code-and-reproducible-model-development-with-dvc).

### Digital Cheatsheet for DVC

If you’d like an online CheatSheet for DVC you can find one
[here](https://cheat.sh/dvc) created by
[**Igor Chubin**](https://twitter.com/igor_chubin). Pick a command from the
drop-down menu and bam 💥, you’ve got the info you need! It’s very cool, but do
always remember to check our docs [here](https://dvc.org/doc),
[here](https://cml.dev/doc), and [here](https://mlem.ai/doc); we are always
updating them!

![DVC Cheat sheet](../uploads/images/2022-12-16/cheatsheet.png '=800') _DVC
Cheat Sheet ([Source link](https://cheat.sh/dvc))_

### Akvelon enables non-Python apps to integrate machine learning models with MLEM

[**Aleksandr Dudko**](https://www.linkedin.com/in/aleksandr-dudko-bb475476/),
[**Anatoly Bolshakov**](https://www.linkedin.com/in/anatolii-bolshakov-9a25b2199/),
[**Denis Nosov**](https://www.linkedin.com/in/denis-nosov/), and
[**Vladimir Krestov**](https://www.linkedin.com/in/vladimir-krestov-4873391ba/),
of [Akvelon,](https://akvelon.com/) wrote
[this great tutorial](https://akvelon.com/akvelon-enables-non-python-apps-to-integrate-machine-learning-models-with-mlem/)
on using MLEM to make the process of integrating, packaging, and deploying
machine learning models much easier. In the tutorial, they show how to do this
with Akvelon’s .NET and Java clients for use in existing or new Web (ASP.Net,
Java Spring), Mobile (Xamarin, Android), and Desktop (WPF, WinForms, Java
Spring, Java Spring). Explore the project directory
[here.](https://github.com/akvelon/MLEM-SDK-for-Java)

![Akvelon enables non-Python apps to integrate machine learning models with MLEM](../uploads/images/2022-12-16/akvelon.png '=800')
_Akvelon enables non-Python apps to integrate machine learning models with MLEM
([Source link](https://akvelon.com/akvelon-enables-non-python-apps-to-integrate-machine-learning-models-with-mlem/))_

# Company News

![Awesome Thats Lit GIF by Samsung Austria](https://media.giphy.com/media/LdBroIIcAdoj8NuG6Q/giphy.gif)

## DVC Live Experiment Tracking

We’ve been listening to the greater Community and know you’d like to see easier
experiment tracking from DVC and we’re on it!
[The latest release of DVCLive](https://iterative.ai/blog/exp-tracking-dvc-python?tab=DVC-extension-for-VS-Code)
helps bring that goal to fruition. Now you can track your experiments with only
a couple of lines of code directly from your notebook or your .py file. You can
start with just a repo with Git and DVC initialized, using your existing tools;
eliminating the need for a hosted solution or setting up a server or database.
Keep track of all the metadata related to the experiment in your Git provider of
choice (GitHub/GitLab), and your cloud storage, and share with your team when
you are ready. In addition, you can use Iterative Studio to share the results of
your experiments with teammates.

![Ariel Biller Experiment Tracking meme](../uploads/images/2022-12-16/ariel-biller.jpeg '=400')
_Ariel Biller's Experiment Tracking meme
([Source link](https://twitter.com/untitled01ipynb/status/1593911944989270016?s=20&t=h0rvf7Bi7ikf9E3hna4vYw))_

## New Unstructured Data Query Language

Do you use Amazon S3, Azure Blob Storage, or Google Cloud Storage? We have a new
solution for finding and managing your datasets of unstructured data like
images, audio files, and PDFs! Extend your DVC environment with the first
unstructured data query language (think SQL -> DQL) for machine learning. We are
looking for beta customers for this new tool.

[Schedule a meeting with us](https://calendly.com/gtm-2/iterative-datamgmt-overview)
if that's what you're needing!

![Unstructured Data Query Language from the makers of DVC](../uploads/images/2022-12-16/dvc-cloud.png '=800')
_Unstructured Data Query Language Prototype_

## GTO Tutorial on the Blog

A model registry is a tool to catalog ML models and their versions. Models from
your data science projects can be discovered, tested, shared, deployed, and
audited from there. Learn how to build a model registry in a DVC Git repo
without involving any extra services, integrations, and APIs in
[this new post](https://iterative.ai/blog/gto-model-registry) from
[**Alex Guschin**](https://www.linkedin.com/in/1aguschin/)!

![Building a GitOps ML Model Registry with DVC and GTO](../uploads/images/2022-12-16/drawing-owl-step-by-step.jpg)

## Next Meetup

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
image="../uploads/images/2022-12-16/meetup.png"/>

## Flappy DeeVee

Our global, all-remote team works hard, but we also have fun! We have a weekly
All-Hands meeting where our teams report progress via pre-recorded video so that
everyone can be prepared to discuss the topic during the meeting.

As we all level up our video production skills, the videos have started to get
more fun!
[**Jesper Svendsen**](https://www.linkedin.com/in/jesper-svendsen-10892b1bb/)
inserted this FlappyDeeVee video in the middle of our Iterative Studio update!
Try the game [here!](https://flappycreator.com/flappy.php?id=638f6f7f1e9c8)
Confession: I can’t get past the first pipe! 😆

<video controlslist="nodownload" preload="metadata" autoplay muted loop
style="width:100%;"><source src="../uploads/images/2022-12-16/FlappyDeeVee.mp4" type="video/mp4"/> Your
browser does not support the video tag. </video>

Stay tuned to
[our Newsletter ](https://iterative.ai/#:~:text=Go%20to%20Twitter-,Subscribe,-for%20updates.%20We)
for more content from the Community and what we will be up to conference-wise in
2023!

## ✍🏼 Doc Updates!

The [CML](https://cml.dev) team recently made updates to their commands to make
them more intuitive. If you were used to the old ones, do not fret, info will
pop up in the CLI to remind you if you use the old commands and what the new
ones are. In the meantime, you can get up to date on the changes
[here](https://cml.dev/doc/ref).

### Tweet Love ❤️

Our
[Notebooks to DVC Pipeline for Reproducible Experiments](https://iterative.ai/blog/jupyter-notebook-dvc-pipeline)
from
[**Rob de Wit**](https://www.linkedin.com/in/rcdewit?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAA5CEPkB9fI02IpClBKhRdq2brULPHMhmR8&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BaKm1eO7JQle9sN63j%2FHHFA%3D%3D)
was noted in [Deep Learning Weekly.](https://twitter.com/dl_weekly)

https://twitter.com/dl_weekly/status/1592900833741393920?s=20&t=eOc76y6a-XcqV1UlhVp9Jg

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
