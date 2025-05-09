---
title: December '21 Heartbeat
date: 2021-12-15
description: >
  Monthly updates are here! You will find great tutorials and workflows from  
  the Community, DVC, CML and Rasa project, Speech diarization use case,
  new  docs,  news from the team, update on the coming online course, and more!
  😅
descriptionLong: |
  This month you will find:
    
    🥰 Tutorials and workflows from the Community,

    🗣 DVC,  CML and Rasa,

    🎙 Speech Diarization,

    🧐 Research paper on MLOps AntiPatterns,

    📖 Docs updates,

    💻 Online Course updates,

    🚀 Info on our growing team, and more!
picture: 2021-12-15/heartbeat-december.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/december-21-heartbeat/1003
tags:
  - Heartbeat
  - DVC
  - CML
  - AntiPatterns
  - arXiv
  - RASA
---

# From the Community

We've made it to the end of the year! 2021 has been an amazing journey for us
and our growing Community all over the world. There's lots of great news this
month. Let's not waste a heartbeat and get right to it! 😉

![Heartbeat!](https://media.giphy.com/media/YAIOuXv2zYDW8/giphy.gif)

## DVC + CML + RASA = ❤️

[**Matthew Upson**](https://twitter.com/m_a_upson), Founder at
[MantisNLP,](https://mantisnlp.com/) an AI consultancy focused on NLP, along
with his team, put out the
[first blog post](https://medium.com/mantisnlp/mlops-for-conversational-ai-with-rasa-dvc-and-cml-part-i-beec756e8e7f)
in a series showing how to use DVC and CML along with Rasa in developing
conversational AI. This post sets the scene for the following more detailed
parts, but lays out DVC's use for generating the DAG as well as logging metrics
and using CML to do the testing. We're looking forward to the next installments!

![Heartbeat!](https://media.giphy.com/media/HYrBxW4xsPSP3wsUTk/giphy.gif)

## Curious about Speaker Diarization?

[The co-authored article entitled,](https://blogs.cisco.com/developer/speakerdiarization01)
“Who Said That?” A Technical Intro to Speaker Diarization," by
[**Dario Cazzani**](https://www.linkedin.com/in/dariocazzani/), and
[**Alex Huang**](https://github.com/alhuang10), machine learning engineers at
[Cisco,](https://www.cisco.com/) provides an introduction to the topic of
Speaker Diarization, or who spoke when, in audio recordings. Their team's
solution takes you through the fingerprinting of voices, clustering to assign
speaker labels, creating the needed data pipeline, and the integration with
Webex.

In this process, the team derives benefit from using DVC to version data and
models, as well as easily collaborate with each other and the transcription
team. More info on this project can be found
[in their repo.](https://github.com/CiscoDevNet/vo-id#train-the-vectorizer)

![Speaker Diarization](../uploads/images/2021-12-15/Dario-Cazzani-2.png '=800')
_Dario Cazzani and team's process for assinging speaker labels to audio files
([Source link](https://blogs.cisco.com/developer/speakerdiarization01))_

## Using DVC in Academic Research on a Compartmental Infectious Disease Model

[**Matthew Segal**,](https://www.linkedin.com/in/matthew-segal-aa132093/)
[in his post,](https://mattsegal.dev/devops-academic-research.html) "DevOps in
Academic Research," reviews his work of applying some of the tried and true
practices in DevOps to data science projects using a
[Markov chain Monte Carlo](https://en.wikipedia.org/wiki/Markov_chain_Monte_Carlo)
(MCMC) technique to create a model to simulate the spread of tuberculosis and
later, as the pandemic erupted, COVID-19.

The article covers mapping the workflow (see below), testing the codebase, smoke
tests
[(with a guide link),](https://mattsegal.dev/pytest-on-github-actions.html)
contiunuous integration, and data management (where he recommends DVC).

![Map Pipeline](../uploads/images/2021-12-15/matt-segal.png '=500') _Working to
develop a pipeline
([Source link](https://mattsegal.dev/devops-academic-research.html))_

## Are you confused by how many MLOps tools there are?

![Thoughtworks Trianglethoughtwork](../uploads/images/2021-12-15/thoughtworks-mlops-landscape.png 'Thoughtworks Platform vs. Specialist Triangle :wrap-right ==450')

Well
[Thoughtworks](https://www.thoughtworks.com/?utm_source=google-search&utm_medium=paid-media&utm_campaign=always-on-brand_2021-11&utm_term=thoughtworks&utm_content=RSAad1&gclid=Cj0KCQiA2NaNBhDvARIsAEw55hg2li5srltu8ppVsxLzcnv-pYWRmvnCk_jmljiC2ocyM4tc7EUEt9gaAoVWEALw_wcB)
included DVC in its recent
[Thoughtworks Guide to MLOps Platforms](https://www.thoughtworks.com/what-we-do/data-and-ai/cd4ml/guide-to-evaluating-mlops-platforms).
While being included is great, things move so fast that they seemed to have
missed our experiment capabilities and the CI/CD capabilities for machine
learning of CML.🤔

And if they only knew what's to come! 🚀 Lots planned in the new year!

![They don't know DVC has more tools coming](../uploads/images/2021-12-15/more-tools.png ' =800')
_Dmitry Petrov's meme
([Source Link](https://twitter.com/FullStackML/status/1465428233336201218?s=20))_

## What is MLOps - Everything You Must Know to Get Started

In his post,
[What is MLOps - Everything You Need to Know to Get Started,](https://towardsdatascience.com/what-is-mlops-everything-you-must-know-to-get-started-523f2d0b8bd8)
[**Harshit Tyagi**](https://www.linkedin.com/in/tyagiharshit/) provides an
overview of MLOps and why it's necessary for today's ML and AI to production
projects. You will learn the different parts of the puzzle that make up MLOps,
and review the machine learning life cycle. In the post, Harshit also provides a
video of the concepts as well as an interview with our CEO,
[**Dmitry Petrov**.](https://twitter.com/FullStackML) Be sure to check it out!

![What is MLOps](../uploads/images/2021-12-15/harshit-tyagi.jpeg '=800')
_Harshit Tyagi's ML Systems Engineering and Operations with their Stakeholders
([Source link](https://towardsdatascience.com/what-is-mlops-everything-you-must-know-to-get-started-523f2d0b8bd8))_

## Using AntiPatterns to avoid MLOps Mistakes

[**Nikhil Maralidhar**,](https://www.linkedin.com/in/nikhilmuralidhar/) et. al.,
in their survey paper,
[Using AntiPatterns to avoid MLOps Mistakes,](https://arxiv.org/abs/2107.00079)
aim to develop a vocabulary for anti-patterns found in machine learning projects
in the financial services industry. In the paper, they also give recommendations
for acheiving MLOps at an enterprise scale using processes for documentation and
management. Luckily, our tools help you to solve some of these challenges!

You can also catch Nikhil's interview with
[**Ben Lorica**](https://twitter.com/bigdata) from
[The Data Exchange](https://thedataexchange.media/)
[podcast here.](https://thedataexchange.media/mlops-anti-patterns/)

<external-link 
href="https://arxiv.org/abs/2107.00079"
title="Using AntiPatterns to avoid MLOps Mistakes"
description="Nikhil Maralidhar, et. al. paper on AntiPatterns in MLOps in the Financial Services industry and recommendations for improving machine learning operations."
link="https://arxiv.org"
image="../uploads/images/2021-12-15/arxiv.png"/>

# DVC News

## New Team Member

[**Amrit Ghimire**](https://www.linkedin.com/in/iamritghimire/) joins our Studio
team as a back end developer, from Pokhara, Nepal. Prior to joining Iterative,
he lead a team at Leapfrog, Inc. to develop applications for a drug discovery
company. Amrit likes to read and watch movies in this free time and works to
complete reading 3-4 books per month. Finally he enjoys working in Python, Rust
and customizing Linux systems and personal command line automations. Welcome
Amrit! 🎉

## Open Positions

As always, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions including:

- Senior Software Engineer (ML, Labeling, Python)
- Senior FronteEnd Engineer (Typescript, Node, React)
- Senior Software Engineer (ML, DevTools, Python)
- Senior Software Engineer (ML, Data Infra, GoLang)
- Field Data Scientist / Sales Engineer
- Developer Advocate (Machine Learning)
- Director / VP of Engineering (ML, DevTools)
- Director / VP of Product (ML, Data Infra, SaaS)
- Head of Talent
- Head of DevRel
- Account Executive (Sales)

Please pass this info on to anyone you know that may fit the bill. Come join our
rocket ship! 🚀

![Go Team Nasa GIF](https://media.giphy.com/media/3xz2BzSNxkwPqF8Wdy/giphy.gif)

## Docs Updates

The DVC team has been steadily adding to the Experiment Management section of
our docs. We want to make sure that all your experiment versioinng needs are met
and there's more to come! 🚀

![Dvc GIF](https://media.giphy.com/media/5qy3GWYwCydByEn3O6/giphy.gif)

And don't miss
[the latest Use Case on Machine Learning Experiment Tracking,](https://dvc.org/doc/use-cases/experiment-tracking)
which outlines going from the traditional, painful, note taking, to more
advanced methods, and compares how DVC can take you to the next level!

![Machine Learning Experiment Tracking](../uploads/images/2021-12-15/natural-experimentation.png)
_Tired of this? Check out our docs!
([Source link](https://dvc.org/doc/use-cases/experiment-tracking))_

## DVC Online Course Update!

The course is in editing mode and this week we are getting the second cuts for
review. The first course will focus on DVC for Data Scientists and Analysts. The
course is on track to be out by the end of the year! It will be 100% **FREE**
and available from our websites. We are so excited about how it's coming to
life! 🚀

👀 Note the the Udemy channel in Discord has now changed to
#iterative-online-course. We're getting ready!

![You Can Do It GIF by chuber channel](https://media.giphy.com/media/xUOxfh6ZM75efM3Bqo/giphy.gif)

## Next Meetup

Be sure to join us at the
[January Office Hours Meetup,](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/)
where [**Gennaro Todesco**,](https://www.linkedin.com/in/gennarotedesco/) Senior
Data Scientist at [Billie.io,](https://www.billie.io/) will present his workflow
with DVC and CML, and his Neovim-DVC plugin.
[**Tezan Sahu**,](https://www.linkedin.com/in/tezan-sahu/) will follow
presenting a workflow from a series of tutorials that we shared from him in the
[September Heartbeat,](https://dvc.org/blog/september-21-dvc-heartbeat)
including DVC, PyCaret, MLFlow and FastAPI.

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/"
title="January Office Hours Meetup - 2 workflows"
description="RSVP for DVC Office Hours - 2 Workflows with integrations including Neovim, PyCaret, MLFlow and FastAPI!"
link="https://meetup.com"
image="../uploads/images/2021-12-15/office-hours-meetup.png"/>

## Tweet Love ❤️

There were many candidates this month. Check out our Testimonials Wall of Love,
which is now live on our [Community Page](https://dvc.org/community) and holds
many of our favorite Tweets! If you'd like to give a shout our for our tools
[head here](https://testimonial.to/iterative-open-source-community-shout-outs)
to make a video or written testimonial. We'd appreciate it! 🙏🏼

But for this month, this Tweet wins the coveted Tweet Love slot.

https://twitter.com/ChrisSamiullah/status/1461702483965886468

## Thank you!

And with that we close out the year! We send a huge thank you to all of our
Community members that help us make our tools better. Thank you for your
contributions, trust and feedback! We look forward to continue to grow with you
in 2022! Have a wonderful holiday season and Happy New Year! 🎉

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
