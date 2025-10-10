---
title: September'21 Heartbeat
date: 2021-09-14
description: >
  Monthly updates are here! Awesome new tutorials and guides from the Community,
  cat's out of the bag on VS Code extension, doc updates, DVC + Streamlit Meetup
  video, and more!
descriptionLong: |
  This month you will find:
  - 🛠 New Tutorials and Guides,
  - 🤫 VS Code extension,
  - 📖 Doc Updates!,
  - 🎥 August Meetup Video available,
  - 🚀 and more!
picture: 2021-09-14/september21cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/september-21-heartbeat/888
tags:
  - Heartbeat
  - DVC
  - CML
  - VS Code
---

# This month's head-turning News from the Community!

![Head Turning Content from the DVC Community!](https://media.giphy.com/media/1hWHUCgi3wKT6/giphy.gif?cid=ecf05e47a5sz6kvyp4h1swih08yokkbdfr39pq9pxscg975u&rid=giphy.gif&ct=g)

### Tezan Sahu's 4-part blog series

Welcome to September! We'll kick off this month's Community picks with a
four-part series by [**Tezan Sahu**](https://twitter.com/SahuTezan) on the
[**Fundamentals of MLOps.**](https://tezansahu.medium.com/fundamentals-of-mlops-part-1-a-gentle-introduction-to-mlops-1b184d2c32a8)
Tehan introduces readers to the core ideas behind taking the best practices of
DevOps and how they are being adapted to machine learning projects that deploy
large scale AI powered applications. The series includes:

- Part 1:
  [A Gentle Introduction to MLOps](https://tezansahu.medium.com/fundamentals-of-mlops-part-1-a-gentle-introduction-to-mlops-1b184d2c32a8)
- Part 2:
  [Data & Model Management with DVC](https://tezansahu.medium.com/fundamentals-of-mlops-part-2-data-model-management-with-dvc-6be2ad284ec4)
  We love this part best! ❤️😉
- Part 3:
  [MLExperimentation with PyCaret](https://tezansahu.medium.com/fundamentals-of-mlops-part-3-ml-experimentation-using-pycaret-747f14e4c28d)
- Part 4:
  [Tracking with MLFlow & Deployment with Fast API](https://tezansahu.medium.com/fundamentals-of-mlops-part-4-tracking-with-mlflow-deployment-with-fastapi-61614115436)

![Fundamentals of MLOps](../uploads/images/2021-09-14/tezan-sahu.png) _Tezan
Sahu's 4 part series on the Fundamentals of MLOps
[Source link](https://ljvmiranda921.github.io/notebook/2021/07/30/data-centric-ml/)_

If you follow the steps through this series, you will learn how to build and
deploy an end-to-end ML project - all the steps leading to production!

### Miguel Méndez' Tutorial on DVC + MMdetection

This month [Miguel Méndez](https://www.linkedin.com/in/miguel-mendez/) of
[Gradiant](https://www.gradiant.org/en//) brings us a guide on object detection
using the [MMdetection]() framework in conjunction with DVC to design the
pipeline, version models and monitor training progress. This follows his
[first guide](https://mmeendez8.github.io/2021/07/01/dvc-tutorial.html) covering
how to version your datasets with DVC, which we shared in the
[July Heartbeat.](https://dvc.org/blog/july-21-dvc-heartbeat)

In
[this new guide,](https://mmeendez8.github.io/2021/08/30/mmdet-dvc-tutorial.html)
you'll gain a thorough understanding of the steps, have access to
[his repo](https://github.com/mmeendez8/mmdetection_dvc) for the project, and
find his thoughts on scaling hyperparameter tuning through this
[open issue](https://github.com/iterative/dvc/issues/5477#issuecomment-905440724)
about exeperiments that we are trying to resolve. Join the conversation! We'd
love your input!

![DVC + MMdetection](../uploads/images/2021-09-14/mmdetection.png) _Miguel
Méndez' second guide in a series using DVC in an object detecton project
[Source link](https://mmeendez8.github.io/2021/08/30/mmdet-dvc-tutorial.html)_

## Hrittik Roy's Complete Intro to DVC

It was just a few short months ago when [Hrittik Roy]() joined us at his first
[DVC Office Hours](). Now he's written
[DVC (Git for Data): A Complete Tutorial](https://dev.to/hrittikhere/dvc-git-for-data-a-complete-intro-4626)
on DVC and how it solves the challenges of ML engineers. In this piece he takes
you through set up, pipeline and versioning, experiments and sharing through our
built in shared caching, so that you and your teammates can reduce resource use
when focusing on a subset of datasets as you move through your project.

![DVC (Git for Data): A complete Intro](../uploads/images/2021-09-14/hrittik-roy.png)
_Hrittik Roy's Complete Intro on DVC
[Source link](https://dev.to/hrittikhere/dvc-git-for-data-a-complete-intro-4626)_

## Andrey Kurenkov's curated list of AI Newsletters

In case you missed it,
[Andy Kurenkov](https://twitter.com/andrey_kurenkov?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
tweeted that he finally got around to writing about his list of 21 favorite AI
Newsletters. You can find the article
[right here.](https://medium.com/@andreykurenkov/the-best-ai-newsletters-483dc75134b)
Be sure to check it out and get reading...

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279723437/"
title="One PhD student’s curated list of 21 newsletters to help you keep up with AI news and research"
description="Andrey Kurenkov's curated list of the best AI newsletters"
link="https://medium.com.com"
image="../uploads/images/2021-09-14/andrey-wordcloud.png"/>

# DVC News

We know there were a lot of peeps out on holiday over the last month so let me
fill you in!

![Grab the popcorn!](https://media.giphy.com/media/lz7212bWGdZbkm30KJ/giphy.gif?cid=ecf05e47hg6at9zmqb1pglypfrzi6vrgdsbay6zgza7wmwwu&rid=giphy.gif&ct=g)

## Yes, that's right, VS Code extension is coming!

[Paige Bailey](https://twitter.com/DynamicWebPaige) let the cat out of the bag
[with her tweet](https://twitter.com/DynamicWebPaige/status/1430920240251035649?s=20)
about the developent of our VS Code extension for DVC. We're getting closer
every day! If you'd like to be a part of the beta testing (how could you not?)
[join us here.](https://t.co/F64H9yyDH9?amp=1)

![VS Code Extension for DVC](../uploads/images/2021-09-14/VSCode.png) _Paige
Bailey let's the cat out of the bag
[Source link](https://twitter.com/DynamicWebPaige/status/1430920240251035649?s=20)_

## 📖 Docs Updates

As promised, we will be adding this section to the Heartbeat each month so that
you can stay in the know about the doc updates that will most impact your
workflows. You won't want to miss these...

### 📖 Fast and Secure Data Caching Hub

First up, a new doc on our
[Fast and Secure Data Caching Hub.](https://dvc.org/doc/use-cases/fast-data-caching-hub#fast-and-secure-data-caching-hub)
Checkout this doc to learn how DVC's built-in data caching lets you implement a
simple and efficient storage layer globally - FOR YOUR ENTIRE TEAM. This lets
you:

- ⏱ Speed data transfers from massive object stores currently on the cloud
- 💰 Pay only for fast access to frequently-used data
- 🙅🏻‍♂️ Avoid extra downloads and duplicating data
- ⚡️ Switch data inputs fast (without re-downloading) on a shared server used
  for machine learning experiments.

Status: Must read. 📖

![Fast and Secure Data Cachin Hub](../uploads/images/2021-09-14/fcaching.gif)
_Fast and Secure Data Cachin Hub
[Source link](https://dvc.org/doc/use-cases/fast-data-caching-hub#fast-and-secure-data-caching-hub)_

### 📖 CI/CD for Machine Learning

Is this your life?

![Rage Quit Job](../uploads/images/2021-09-14/cicd4ml-0.png) _Is this your life?
[Source link](https://dvc.org/doc/use-cases/ci-cd-for-machine-learning#continuous-integration-and-deployment-for-machine-learning)_

Our latest doc,
[Continuous Integration and Deployment for Machine Learning,](https://dvc.org/doc/use-cases/ci-cd-for-machine-learning#continuous-integration-and-deployment-for-machine-learning)
shows you how to move from the above chaos to CI/CD victory through:

- ✅ Data validation
- ✅ Model validation
- 🎟 Provisioning
- 📈 Metrics

Read the whole doc to learn how DVC and CML will enable you to run entire
experiments/research online and remove most of your managment headaches to look
more like this. 👇🏼

![Traditional ML meets CI/CD](../uploads/images/2021-09-14/cicd4ml-1.png)
_Traditional ML meets CI/CD with DVC and CML
[Source link](https://dvc.org/doc/use-cases/ci-cd-for-machine-learning#continuous-integration-and-deployment-for-machine-learning)_

### 📖 Need to Clean up Your Worksapce?

[Cleaning Up Experiments](https://dvc.org/doc/user-guide/experiment-management/cleaning-experiments)
has been made bright and shiny and new to do the same with your experiments. Be
sure to check it out!

### 📖 Hugging Face Integration with DVC Live

[Hugging Face](https://huggingface.co/) fans now have an integration with
DVCLive! Checkout how to
[get set up here!](https://dvc.org/doc/dvclive/api-reference/ml-frameworks/huggingface)
Thanks [@pacifikus](https://github.com/pacifikus), for the contribution! 🙏🏼

## Next Meetup

This Thursday at our
[September Office Hours Meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/280212578/),
[Milicia McGregor](https://twitter.com/FlippedCoding) will be presenting her
tutorial on
[Using Experiments For Transfer Learning.](https://dvc.org/blog/transfer-learning-experiments)
Join us on September 16th at 3:00 pm UTC! RSVP at this link below! 👇🏼

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/280212578/"
title="DVC Office Hours - Using Experiments For Transfer Learning"
description="Milecia McGregor shows how to use DVC experiment tracking to compare models in a transfer learning project"
link="https://meetup.com"
image="../uploads/images/2021-09-14/pretrained-models.png"/>

## Learning Opportunities

Our August Meetup video is out, so if you weren't able to make it, you can catch
all the details on [Antoine Toubhan's](https://twitter.com/AntoineToubhans)
tutorial on
[DVC + Streamlit = ❤️](https://www.sicara.ai/blog/dvc-streamlit-webui-ml)

https://youtu.be/F318uN01v7M

## Open Positions

We'll be introducing some new team member next month, but we are still hiring.
So do checkout our open positions
[here](https://www.notion.so/iterative/iterative-ai-is-hiring-852cb978129645e1906e2c9a878a4d22)
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

## Tweet Love ❤️

Last week this Tweet brought us another 300 Twitter followers, catapulting us
over 3000! Thanks Community for joining us on this MLOps ride! More to come! 🚀

https://twitter.com/DynamicWebPaige/status/1435256826375720964

---

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
