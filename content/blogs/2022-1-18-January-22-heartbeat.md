---
title: January '22 Heartbeat
date: 2022-01-18
description: >
  Monthly updates are here! You will find great tutorials and workflows from  
  the Community, Online course is now open, decision making strategies
  for  MLOps tools, and more! Welcome to 2022!🎇

descriptionLong: |
  This month you will find:
    
    🥰 Tutorials and workflows from the Community,

    🗣 Upcoming Events,

    📰 Data Science and AI News,

    🧐 MLOps tool decision strategies,

    😎 GitHub Awesomeness,

    💻 Online Course is live,

    🚀 Info on our growing team, and more!
picture: 2022-01-18/heartbeat-january.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/january-22-heartbeat/1025
tags:
  - Heartbeat
  - DVC
  - CML
  - DataChain Studio
  - Heroku
  - Reproducibility
  - Stateful training
  - SQL
  - Git
---

# From the Community

Happy New Year! Hope you got some good rest and stayed healthy at the end of
2021, because 2022 has lots of great things in store!

![Heartbeat!](https://media.giphy.com/media/7ILAGpJWoQYWA0j60C/giphy.gif)

## Diego Jardim - MLOps: A Complete Hands-On Introduction

[In Part 1](https://poatek.com/2021/12/20/mlops-a-complete-and-hands-on-introduction-part-1/)
of his two-part series,
[**Diego Jardim**](https://www.linkedin.com/in/diegosevero/) of
[Poatek](https://poatek.com/) takes us through the basics of MLOps and the
stages of implementation and maturity of an MLOps pipeline. He closes by
introducing us to some tools to help a team progress through these stages, which
include DVC and CML.

[In Part 2](https://poatek.com/2021/12/29/mlops-a-complete-and-hands-on-introduction-part-2/)
he delves into more detail and code on how to set up version control of
everything with DVC as well as automation of experimentation and reporting with
CML. Finally, he uses FastAPI and Heroku for model serving and deployment. You
can find all the scripts for the project in
[this GitHub repository.](https://github.com/dsjardim/fraud-detection-mlops)

<external-link 
href="https://poatek.com/2021/12/29/mlops-a-complete-and-hands-on-introduction-part-2/"
title="MLOps: A Complete Hands-On Tutorial"
description="In his 2-part series, Diego Jardim of Paotek introduces concepts and stages of MLOps and provides a tutorial on how to create an MLOps pipeline."
link="https://poatek.com/"
image="../uploads/images/2022-01-18/diego-jardim.png"/>

## Carl W. Handlin Wallace - Reproducible Data Science and Why it Matters

[**Carl W. Handlin Wallace**](https://www.linkedin.com/in/carlhandlin/) of
[RappiBank](https://www.rappibank.pe/) wrote a
[great article](https://medium.com/rappibank/reproducible-data-science-and-why-it-matters-e4e62fd60b9a/)
for their company [Medium](https://medium.com/) profile on the importance of
reproducibility, AKA replicability, in science in general, and the challenges in
Data Science in particular. As he points out, from
[Nature's survey,](https://doi.org/10.1038/533452a) over half of all researchers
have failed to reproduce even their own work, let alone that of another
scientist. While initiatives like
[Papers With Code](https://paperswithcode.com/) are helping to encourage
reproducibility in the industry, there's still work to be done. He notes DVC as
a part of the solution to this problem along with other tools to round out the
whole picture. Check out the article for good food for thought and other
resources!

![Proposed Reproducibility Framework for Data Science](../uploads/images/2022-01-18/carl-handlin-rappibank.png '=800')

_Carl W. Handlin Wallace's Proposed Reproducibility Framework for Data Science
([Source link](https://medium.com/rappibank/reproducible-data-science-and-why-it-matters-e4e62fd60b9a/))_

## Abid Ali Awan - Tips & Tricks of Deploying Deep Learning Webapp on Heroku Cloud

![DVC Heroku Integration](../uploads/images/2022-01-18/abid-ali-awan.png 'Heroku Hidden Tricks :wrap-right ==450')

[**Abid Ali Awan**'s](https://www.linkedin.com/in/1abidaliawan/)
[article in KDNuggets](https://www.kdnuggets.com/2021/12/tips-tricks-deploying-dl-webapps-heroku.html)  
guides
you on how to create a smooth process to deploy a deep learning web application
with Heroku. In the guide, he covers integration with DVC and optimizing storage
using Docker, Git & CLI-based deployment, how to deal with error code H10, and
tweaking Python packages to stay within the 500 MB Heroku limitation. If you've
been looking for a way to create a deep learning web app, this may help!

## Amit Kulkarni - Overview of MLOps with Open Source Tools

In the very
[**FIRST** tutorial of DVC Studio](https://www.analyticsvidhya.com/blog/2022/01/overview-of-mlops-with-open-source-tools/)
from the Community,
[**Amit Kulkarni**](http://www.linkedin.com/in/amitvkulkarni2) reviews the set
up process of DVC Studio and MLFlow and their ability to ease the operational
aspects of machine learning teams by providing a clear way to solve the
formidable task of tracking all the factors that go into the iterative process.
Amit covers the easy setup process, adding a view, model comparison, and running
experiments from the DVC Studio UI.

![DVC Studio Experiment Tracker UI](../uploads/images/2022-01-18/amit-kulkarni-studio.png '=800')
_Amit Kulkarni's DVC Studio tutorial
([Source link](https://www.analyticsvidhya.com/blog/2022/01/overview-of-mlops-with-open-source-tools/))_

# GitHub Goodness 😎

![Will Ferrell Reaction GIF](https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif)

In case you missed it we now have an
[Awesome Iterative Projects Repository.](https://github.com/iterative/awesome-iterative-projects)
This repository is a list of projects relying on Iterative tools to achieve
awesomeness. Recent additions to the list include:

- [zincware/ZnTrack](https://github.com/zincware/ZnTrack): Create, visualize,
  run & benchmark DVC pipelines in Python & Jupyter notebooks.
- [nvim-dvc](https://github.com/gennaro-tedesco/nvim-dvc): Neovim plugin for
  DVC.

We'd love to see more of the Community's awesome work added to this list. Feel
free to submit your project!

Other repos that came across my radar this last month that may be of interest to
our Community:

- [An Awesome List of Awesomes](https://github.com/Nachimak28/awesome-list-of-awesomes):
  an aggregation of all the Awesome lists
- [Awesome MLOps](https://github.com/visenger/awesome-mlops): an awesome list of
  references for MLOps.
- [Project Atlas - São Paulo](https://github.com/mateuspicanco/project-atlas-sao-paulo)
  : a Data Science and Engineering initiative that aims to develop relevant and
  curated Geospatial features of São Paulo, Brazil (includes DVC).
- [NN Template](https://github.com/lucmos/nn-template): Generic template to
  bootstrap your PyTorch project (includes DVC)

# Deciding on MLOps tools?

![Think Season 2 GIF by Portlandia](https://media.giphy.com/media/3ohjUZZEFfWJfaeKUE/giphy.gif)

[Last month](https://media.giphy.com/media/3ohjUZZEFfWJfaeKUE/giphy.gif) I told
you about Thoughtworks' guide to MLOps Platforms. If you prefer video content,
you may like
[this webinar](https://www.thoughtworks.com/what-we-do/data-and-ai/cd4ml/guide-to-evaluating-mlops-platforms1?utm_source=linkedin&utm_medium=social-organic&utm_campaign=tw-webinars_2021-12&gh_src=463a2f181us)
from [**Ryan Dawson**](https://www.linkedin.com/in/ryan-dawson-501ab9123/) on
CD4ML covering the process of identifying the best tools for your team's needs.

![MLOPs Tool evaluation process](../uploads/images/2022-01-18/ryan-dawson-thoughtworks-cd4ml.png '=800')
_Ryan Dawson's MLOps tool evaluation process
([Source link](https://www.thoughtworks.com/what-we-do/data-and-ai/cd4ml/guide-to-evaluating-mlops-platforms1?utm_source=linkedin&utm_medium=social-organic&utm_campaign=tw-webinars_2021-12&gh_src=463a2f181us))_

[**Dean Pleban**,](https://www.linkedin.com/in/deanpleban/) CEO of
[DAGsHub,](https://dagshub.com) also gave a great talk on a decision making
framework for deciding on your tools in his presentation at
[DevOpsDays Tel Aviv](https://devopsdays.org/events/2021-tel-aviv/welcome/). In
this talk you will learn guidelines and mental models that will help you choose
tools in whatever stage of the process you are in.

https://youtu.be/XLc733qO2lE

## In Other Data Science and AI News

### Rob Toews AI Predictions in Forbes

[**Rob Toews**](https://www.twitter.com/_RobToews) wrote
[10 AI Predictions for 2022](https://www.forbes.com/sites/robtoews/2021/12/22/10-ai-predictions-for-2022/?sh=559c4c8d482d)
for [Forbes.](https://forbes.com) In it he predicts more startups getting funded
in NLP than any other category, reinforcement learning to become increasingly
important, the rise of synthetic data, and powerful new AI tools being built for
video. My favorite prediction:

> Responsible AI' will begin to shift from a vague catch-all term to an
> operationalized set of enterprise practices."  
> That's good news!

<external-link 
href="https://www.forbes.com/sites/robtoews/2021/12/22/10-ai-predictions-for-2022/?sh=559c4c8d482"
title="10 AI Predictions for 2022"
description="Rob Toews predicts the rise of NLP, reinforcement learning, operationalized responsible AI and more."
link="https://forbes.com"
image="../uploads/images/2022-01-18/forbes.jpeg"/>

### Chip Huyen's Latest Blog Post

You may remember [**Chip Huyen**](https://twitter.com/chipro) from
[MLOps Tooling Landscape v2](https://huyenchip.com/2020/12/30/mlops-v2.html) and
[DVC's inclusion in her Machine Learning Systems Design Lecture series](https://docs.google.com/presentation/d/15ZrLFzimfy-8ob7mJ0qHPNyVoTtSfKBF5gPPG5f0Lz8/edit#slide=id.p).
But at the turn of the new year, she published a new blog post entitled
[Real-time machine learning: Challenges and Solutions.](https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html)
The article describes her learning from working with approximately 30 companies
in different industries doing real-time machine learning. She describes the
online prediction processes of batch prediction and streaming prediction.

Additionally she discusses continual learning and the difference between
stateless retraining (the model is trained from scratch each time), and stateful
training (the model continues training on new data) and moving from a manual
process to a more automated one. Definitely worth a read and we believe DVC and
CML can help you with your stateful training!

She and her team are running a [survey](https://forms.gle/dDvgF7QgpPdvJE5b8) to
better understand the adoption and challenges of real-time ML. We enourage your
participation!

![Stateful Training](../uploads/images/2022-01-18/stateful-training.png '=800')
_Chip Huyen's Stateless vs.Stateful Training
([Source link](https://huyenchip.com/2022/01/02/real-time-machine-learning-challenges-and-solutions.html))_

### Vicki Boykis' Top three Fundamental Tools for a Machine Learning Engineer

![Git, SQL, CLI](../uploads/images/2022-01-18/git-sql-cli.jpeg 'Git, SQL, CLI :wrap-left ==300')
If you're interested in becoming a machine learning engineer and you're not
familiar with [**Vicki Boykis**,](https://twitter.com/vboykis) you should be.
She has an amazing blog with years of well-written, funny, technical content on
machine learning. Her latest piece entitled
[Git, SQL, CLI](https://vickiboykis.com/2022/01/09/git-sql-cli/) tells why she
thinks these three tools are fundamental tools for any technical job. We think
so too.

# DVC News

## Our Online Course is Live! 🎉

You can register for the FREE new course
[here on the Iterative website](https://learn.dvc.org). The course is currently
in beta mode. We already have some things we are working on to make it even
better, but we would love your feedback! 🙏🏼 So far we have had some minor
glitches and a lot of positive feedback! But we want your critiques too!

**Whoever can give us feedback on any three modules by February 6th will receive
some fresh new swag!**

We are already planning our next course!

## Experiment Versioning piece in KDNuggets

Our Senior Developer Advocate
[**Maria Khalusova**](https://twitter.com/mariaKhalusova) wrote a tutorial piece
on `exp init` and experiment versioning entitled
[Versioning Machine Learning Experiments vs Tracking Them.](https://www.kdnuggets.com/2021/12/versioning-machine-learning-experiments-tracking.html)
The command helps you quickly set up a pipeline and codify your experiments with
all of the factors that contributed to each of them, including data, code,
pipeline, model version and all hyperparameters. This is a step above other
experiment tracking tools and enables you to achieve true reproducibility.

<external-link 
href="https://www.kdnuggets.com/2021/12/versioning-machine-learning-experiments-tracking.html"
title="Versioning Machine Learning Experiments vs Tracking Them"
description="Maria Khalusova's tutorial on DVC's `exp init` command and the next level of experiment tracking that delivers true reproducibility."
link="https://kdnuggets.com"
image="../uploads/images/2022-01-18/kdnuggets.jpeg"/>

## New Team Members

We have a few new team members this month!

[**Daniele Trifirò**](https://github.com/dtrifiro) is our first team member from
Italy! He joins us as a Senior Software Engineer. Daniele has a background in
Physics/Astrophysics and worked for 4 years as a researcher in the LIGO
Scientific collaboration and then went on to positions at Cloudian and illimity.
It was at illimity where he "fell in love" with DVC! In his free time Daniele
likes listening to and sometimes playing music himself, as well as rock
climbing. 🧗🏼‍♂️

[**Thomas Kunwar**](https://github.com/yathomasi) is a software engineer joining
the team from Nepal. He's been working as a fullstack developer specializing in
the MERN stack and has lead a team on multiple projects. In his free time Thomas
enjoys trekking, watching and playing sports, watching movies, and learning.
Welcome Thomas! 👏🏼

[**Madhur Tandon**](https://github.com/madhur-tandon) joins our team as a
Software Engineer from Delhi, India. He is active in open source and some of his
famous contributions are to projects such as Pyodide (the Python Scientific
Stack compiled to WebAssembly) and Jupyterlite (a Jupyter distribution running
in the browser). He has also been a speaker in PyData and JupyterCon. Talk to
him about his solo trip to SF, his experiences at Mozilla or about books, Indian
governance, food, and crypto. When not working, he is working out!💪🏼

## Open Positions

Even with these amazing new additions to the team, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions and share with anyone you think may be
interested! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-01-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Upcoming Events

### January Office Hours!

Be sure to join us at the
[January Office Hours Meetup,](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/)
where [**Gennaro Todesco**,](https://www.linkedin.com/in/gennarotedesco/) Senior
Data Scientist at [Billie.io,](https://www.billie.io/) will present his workflow
with DVC and CML. [**Tezan Sahu**,](https://www.linkedin.com/in/tezan-sahu/)
will follow presenting a workflow from a series of tutorials that we shared from
him in the
[September Heartbeat,](https://dvc.org/blog/september-21-dvc-heartbeat)
including DVC, PyCaret, MLFlow and FastAPI.

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/"
title="January Office Hours Meetup - 2 workflows"
description="RSVP for DVC Office Hours - 2 Workflows with integrations including Neovim, PyCaret, MLFlow and FastAPI!"
link="https://meetup.com"
image="../uploads/images/2021-12-15/office-hours-meetup.png"/>

### Milecia Mc Gregor at Conf 42

![Conf42](../uploads/images/2022-01-18/Conf42.png 'Milecia McGregor at Conf42 :wrap-left ==375')

Don't miss [**Milecia McGregor**](https://twitter.com/FlippedCoding) at the
upcoming
[Conf42](https://www.conf42.com/Python_2022_Milecia_McGregor_reproducible_experiments_better_ml_models)
on January 27th! She will be presenting her talk on Using Reproducible
Experiments To Create Better Machine Learning Models. If you haven't caught this
talk yet, now's the time!

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
