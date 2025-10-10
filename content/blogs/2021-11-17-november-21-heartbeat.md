---
title: November '21 Heartbeat
date: 2021-11-17
description: >
  Monthly updates are here! You will find great tutorials and workflows
  from  the Community, Apache Airflow Integration, new CML docs, DVC en
  Español,  news from the team, update on the coming online course, and more! 😅
descriptionLong: |
  This month you will find:
    
    🥰 Tutorials and workflows from the Community,

    🤔 Lots of ways to learn,

    🇺🇾 🇪🇸 DVC en Español,

    🎥 Meetup videos,

    📖 Docs updates,

    💻 Online Course updates,

    🚀 Info on our growing team, and more!
picture: 2021-11-17/heartbeat-november.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/november-21-heartbeat/968
tags:
  - Heartbeat
  - DVC
  - CML
  - Apache Airflow
  - Flask
  - Evidently AI
  - Cookiecutter
  - DAGsHub
---

# From the Community

I can't believe it's already November! Our Community has given us a lot to be
thankful for!

![Hello November!](https://media.giphy.com/media/vLxTOSEfHIr0A/giphy.gif)

## Thanakorn Panyapiang's Two Part tutorial: Data Versioning with DVC

In his two part tutorial which can be found
[here](https://medium.com/@thanakornpanyapiang/data-versioning-why-do-data-science-projects-need-it-a44cb7a471c9)
and
[here,](https://medium.com/@thanakornpanyapiang/data-versioning-with-dvc-a474af1247f5)
[**Thanakorn Panyapiang**](https://www.linkedin.com/in/tpanyapiang/) first
explains why data versioning is so important to successful machine learning
projects. Next he takes us through a tutorial of DVC showing how to install and
initiate DVC. Finally he covers tracking, pushing to remote storage, modifying
and switching the data. In the future look out for more posts on the other
features of DVC, including pipelines, metrics, experiments and continuous
integration through CML from Thanakorn!

<external-link 
href="https://medium.com/@thanakornpanyapiang/data-versioning-with-dvc-a474af1247f5/"
title="Data Versioning with DVC"
description="Thanakorn Panyapiang's explanation of the importance of data version control in ML projects and tutorial on DVC."
link="https://medium.com"
image="../uploads/images/2021-11-17/panyapiang.jpeg"/>

## Sanaka Chathuranga: End to End Machine Learning Pipeline with MLOps tools

[**Shanaka Chathuranga**](https://www.linkedin.com/in/shanakac/) uses multiple
tools including DVC to build an end to end Machine Learning Pipeline. In the mix
you'll find Cookiecutter, DVC, Mlflow, GitHub Actions, Heroku, Flask, Evidently
AI, and PyTest in
[his post](https://medium.com/@shanakachathuranga/end-to-end-machine-learning-pipeline-with-mlops-tools-mlflow-dvc-flask-heroku-evidentlyai-github-c38b5233778c)
in [Medium.](https://medium.com/) DVC is used for data versioning and model
pipeline management in this tutorial.

![End to End Machine Learning Pipeline](../uploads/images/2021-11-17/shanaka.png)
_Shanaka Chathuranga's End to End ML Pipeline Tools Stack
([Source link](https://medium.com/@shanakachathuranga/end-to-end-machine-learning-pipeline-with-mlops-tools-mlflow-dvc-flask-heroku-evidentlyai-github-c38b5233778c))_

📣 Swag to the first person to do a similar tutorial using DVC for experiment
tracking and versioning and CML for CI/CD. 🚦Go!👉🏽

## COVID Genomics Apache Airflow and DVC Integration

[In this blog post,](https://covidgenomics.com/blog/airflow_dvc/)
[**Piotr Styczyński**](https://www.linkedin.com/in/piotrstyczynski/) of
[COVID Genomics](https://covidgenomics.com/) shares how they use Airflow and DVC
together in their work to model SARS Cov-2 and optimizing RT-PCR tests. They
needed to update the data used for the training model daily and automate their
processses to make sure the whole process stays up-to-date.

Be sure to check out the very detailed tutorial with lots of delicious code and
two repositories [here](https://github.com/covid-genomics/airflow-dvc) and
[here.](https://github.com/covid-genomics/dvc-fs)

![Airflow + DVC Integration](../uploads/images/2021-11-17/covid-genomics.png)
_Piotr Styczyński's blog on COVID Genomics use of Airflow with DVC
([Source link](https://covidgenomics.com/blog/airflow_dvc/))_

## Looking to create a light weight Feature Store?

Remember [**João Santiago**](https://twitter.com/jcpsantiago) from
[dvthis?](https://github.com/jcpsantiago/dvthis) Well he's back at it solving ML
engineering challenges, sharing his new blog post,
[Unlocking Our Data with a Feature Store.](https://medium.com/billie-finanzratgeber/unlocking-our-data-with-a-feature-store-402ade0743b)
In this article from the [Billie.io](https://www.billie.io/) engineering crew,
Santiago shows how they implemented a light weight feature store creating a
system in which features are defined in YAML files (gotta love those YAML files
😉) interfacing with Snowflake. Check out how they did it, and learn the term
"instarejected" which he coined and we all should instaadopt!

![Billie.io Lightweight Feature Store](../uploads/images/2021-11-17/billie.png)
_Billie.io's feature store: Snowflake + Lambda + Redis
([Source link](https://medium.com/billie-finanzratgeber/unlocking-our-data-with-a-feature-store-402ade0743b))_

# Learning Opportunities

## Learn about DVC en Español!

[TryoLabs](https://tryolabs.com/) held an Open Meetup recently in Uraguay
teaching about some of the technology they use at this consultancy.
[**Ian Spektor**,](https://www.linkedin.com/in/ianspektor/)
[**Diego Kiedanski**,](https://www.linkedin.com/in/diego-kiedanski/) and
[**Nicolás Eiris**](https://www.linkedin.com/in/nicol%C3%A1s-eiris-64916194/)
presented on the their learnings and use of DVC to get better organization of
their data for the various projects they work on with their clients. In addition
to streamlining the onboarding of the data for their projects, DVC has provided
them reproducibility of the various data and code versions in their workflows.

https://www.youtube.com/watch?v=4uEjIa-f_FE&t=268s

Also en Español, our own
[**David de la Iglesia Castro**](https://twitter.com/daviddelachurch) will be
presenting at
[Python Barcelona](https://pybcn.org/events/pyday_bcn/pyday_bcn_2021/) on
"Making MLOps Uncool Again." In this workshop David will show you how to use
HuggingFace, DVC and CML to create an MLOps workflow, extending the power of Git
and GitHub without the need for external platforms or complicated
infrastructure.

<external-link 
href="https://pybcn.org/events/pyday_bcn/pyday_bcn_2021/"
title="Python Barcelona"
description="Join David de la Iglesia Castro for his workshop entitled Making MLOps Uncool Again."
link="https://pybcn.org"
image="../uploads/images/2021-11-17/py-barcelona.png"/>

## October Office Hours Video: Continuum Industries Tool Stack with Ivan Chan

If you missed last month's Office Hours
[Meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/), you can now
catch the video! [**Ivan Chan**](https://www.linkedin.com/in/ivanchc/) took us
on a journey through the
[Continuum Industries](https://www.continuum.industries/) tool stack and showed
us how they save tons of time weekly by integrating DVC and CML into their
workflows.

https://www.youtube.com/watch?v=TBZKfyYWtXs

## Are you a Data Scientist Struggling with some of the ML engineering concepts?

### Atinuke Oluwabamikemi Kayode: Common Github Terms for Open Source Contributors

For the learners out there,
[**Atinuke Oluwabamikemi Kayode's**](https://twitter.com/oluwabamikemi) piece
[Common Github Terms for Open Source Contributors](https://iambami.dev/common-github-terms-for-open-source-contributors-ckvuhdzsf0jcocms1fggb0fj3)
shares about all the most common terminology you need to know when using GitHub
in your projects. Need to understand what "checkout" is? The difference between
"origin" and "master?" Atinuke has you covered in this piece.

<external-link 
href="https://iambami.dev/common-github-terms-for-open-source-contributors-ckvuhdzsf0jcocms1fggb0fj3"
title="Common GitHub Terms for Open Source Contributors"
description="Atinuke Oluwabamikemi Kayode helps you navigate the common terminalogy in GitHub."
link="https://iambami.dev"
image="../uploads/images/2021-11-17/kayode.jpeg"/>

### Vincent Driessen: A Successful Git Branching Architecture

For a deeper dive into how Git and versioning works, checkout
[A Successful Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)
piece by [**Vincent Driessen**](https://twitter.com/nvie) which explains in
detail the git branching model. While this explanation is as it relates to
software development, it will help you understand how git versioning works. This
foundation will help provide the insight into how DVC works, delivering the same
capabilities for data, models and experimentation.

![Git Versioning in Software Development](../uploads/images/2021-11-17/git-model.png)
_Vincent Driessen's Git Model Branch
([Source link](https://nvie.com/posts/a-successful-git-branching-model/))_

### Nir Barazida: Notebook to Production

[**Nir Barazida**](https://twitter.com/barazida) of
[DAGsHub](https://dagshub.com/) brings us a blog post on
[Notebook to Production](https://dagshub.com/blog/notebook-to-production-ready-machine-learning/)
which explains why you should, and how you can, move your code from notebooks to
scripts when working on production ready ml projects. You'll see how DVC is used
to version everything in the process so your team will always know which version
of all the possible elements that go into your project produced or failed to
produce the best results.

<external-link 
href="https://dagshub.com/blog/notebook-to-production-ready-machine-learning/"
title="Notebook to Production"
description="Nir Barazida shows you why and how to bring your notebook to production ready code."
link="https://dagshub.com"
image="../uploads/images/2021-11-17/dagshub-dvc.png"/>

## DVC Online Course Update!

We know you've wanted it, and the day is getting closer and closer! By the end
of this week we will be about 90% done recording videos for the first course,
and then it's on to video processing and platform set up. The first course will
focus on DVC for Data Scientists and Analysts. You can expect to see the course
out by the end of the year. The course will be 100% **FREE** and available from
our website. We are so excited about how it's coming to life! 🚀

![Loading Downloading GIF by Vera Verreschi](https://media.giphy.com/media/hL9q5k9dk9l0wGd4e0/giphy.gif)

# DVC News

## San Francisco Off-site

The group of us from the Americas met in San Francisco last week. We had a great
time getting to know each other better and working on ways and processes to make
our tools even better for you! Amidst our working, we also took time out to
visit Alcatraz, go on a scavenger hunt, and eat some great food! Pictured below
from left front, going clockwise: Jorge Orpinel, Stephanie Roy, Ivan Shcheklein,
Dmitry Petrov, Dave Berenbaum, Jervis Hui, Ken Thom, Jon Burdo, Peter Rowlands,
Julie Galvan, Jeny De Figueiredo, Jordan Weber, and Maria Khalusova! 🎉

![America Team Members meet in San Francisco](../uploads/images/2021-11-17/team.jpg)
_Iterative Team Members meet in San Francisco
([Source: Jorge Orpinel](https://www.linkedin.com/in/jorgeorpinel/))_

## New Team Members

[**Maria Khalusova**](https://www.linkedin.com/in/maria-khalusova-a958aa14/)
joins us from Montreal, Canada as a Senior Developer Advocate. Previously at Jet
Brains for 14 years, Maria brings a ton of experience in developer advocacy and
product management. She has already dove in working on CML and the upcoming
releases. She also organizes PyData Montreal. In her free time Maria likes to
spend time with her two kids, walk their mixed bull dog, and garden. 👩🏻‍🌾 Welcome
Maria!

## Open Positions

As always, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions including:

- Senior Software Engineer (ML, Labeling, Python)
- Senior Software Engineer (ML, Labeling, Python)
- Senior Software Engineer (ML, DevTools, Python)
- Field Data Scientist / Sales Engineer
- Developer Advocate (ML)
- Director / VP of Engineering (ML, DevTools)
- Director / VP of Product (ML, Data Infra, SaaS)
- Head of Talent
- Head of DevRel

Please pass this info on to anyone you know that may fit the bill. We look
forward to new team members! 🎉

![Hyper RPG GIF](https://media.giphy.com/media/ZcQXsVrAuKMePTJYG6/giphy.gif)

## Docs Updates

This month's important doc updates come from CML! The CML team has been on fire
🔥 building new things. You will want to keep your eyes tuned to
[CML.dev](https://cml.dev/) and our social media channels for big news before
the end of the year!

### 📖 CML: Self-hosted Runners

Check out the new
[Self-hosted Runners](https://cml.dev/doc/self-hosted-runners?tab=GitLab#allocating-cloud-compute-resources-with-cml)
doc. This will help you set up your own runners and allocate cloud computing
resources. Whether you are a GitHub or GitLab user, you will be able to toggle
between the respective code needed right there at your fingertips!

### 📖 CML: Command Reference: `send-comment`

The new
[Command Reference: send-comment](https://cml.dev/doc/ref/send-comment#command-reference-send-comment)
doc provides a way for you to post a markdown comment on a commit and flags for
associating the comment with another pull/merge request or if a `cml pr` was
used earlier in your workflow.

### 📖 Branding Assets

If you are interested in writing a blog post about our tools, we now have a very
easy way for you to get your hands on our logos as well as a guide to let you
know how and where it's appropriate to use our logos and images. We love when
the Community shares about our tools!  
[Find our branding assets here.](https://iterative.ai/brand)

![Iterative.AI Branding Asseets](../uploads/images/2021-11-17/brand.png)
_Iterative.AI branded assets from your next blog post 😉
([Source:](https://iterative.ai/brand))_

## Next Meetup

Be sure to join us at the
[December Office Hours Meetup,](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282064369/)
where we will be showing a demo on a new feature! We can't say more just yet 🤐,
but be sure to RSVP!

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282064369/"
title="DVC Office Hours - New Feature Release"
description="Join us at the December Office Hours for a demo of a new feature in DVC!"
link="https://meetup.com"
image="../uploads/images/2021-10-15/office-hours-meetup.png"/>

## Tweet Love ❤️

Last but never least, I leave you with this great tweet from Paige Bailey, this
time about CML's docs:

https://twitter.com/DynamicWebPaige/status/1459395186027470849?s=20

---

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
