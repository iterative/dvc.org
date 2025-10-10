---
title: October '21 Heartbeat
date: 2021-10-15
description: >
  Monthly updates are here! The word of the month is workflows! Checkout
  how  Community members improve their workflows with DVC and CML. Find out news
  from the team, new learning opportunities, and more!
descriptionLong: |
  This month you will find:

    🗺 MLOps workflows,

    🤔 Lots of ways to learn,

    🎥 Meetup and Conference videos,

    📖 Docs updates,

    🚀 Info on our growing team, and more!
picture: 2021-10-15/october21cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/october-21-heartbeat/916
tags:
  - Heartbeat
  - DVC
  - CML
  - MLOps Community
  - PyTorch Lightning
  - DAGsHub
  - shtab
---

# From the Community

This month we have been flooded with content from our Community. We are grateful
and inspired to keep serving you!

![Thank you!](https://media.giphy.com/media/xUA7aN1MTCZx97V1Ic/giphy.gif)

## Ricardo Manhães Savii: Trying to turn Machine Learning into value

If we can't turn machine learning into value, what good are we?
[**Ricardo Manhães Savii**](https://www.linkedin.com/in/ricardoms/)
[wrote a piece in Medium](https://medium.com/@ricardosavii/trying-to-turn-machine-learning-into-value-de9f28cde056)
where he tackles how to technically and visually define the steps to deliver an
Intelligent System with the same level of best practice maturity that software
development has today. He combines and synthesizes the ideas of some of the best
known thinkers in the space to build a thorough architecture of machine learning
best practices. You won't want to miss this post and wrap your head around these
diagrams!

![CI/CD for Machine Learning](../uploads/images/2021-10-15/manhaes.png) _Ricardo
Manhães Savii's Addendum to François
Chollet's](https://medium.com/@francois.chollet) figure on result of machine
learning
([Source link](https://medium.com/@ricardosavii/trying-to-turn-machine-learning-into-value-de9f28cde056))_

## RappiBank: How to build an efficient machine learning project workflow

Continuing the theme of ML workflow Complexity,
[**Daniel Baena**](https://www.linkedin.com/in/data-box-science/) wrote a
[great overview and tutorial piece](https://medium.com/rappibank/how-to-build-an-efficient-machine-learning-project-workflow-using-data-version-control-dvc-aaeaa9cfb79b)
outlining the challenges that his team at
[RappiBank](https://bank.rappi.com.br/) encountered and found ways to solve with
DVC including:

- confusing experiment files with different names
- disjointed messaging about training and models and dataset changes
- holding in your head or own notes progress that is not visible to the rest of
  the team
- heavy run and re-run times without a modularized system

Daniel shows how all of these things can be solved using DVC.🏆

<external-link
href="https://medium.com/rappibank/how-to-build-an-efficient-machine-learning-project-workflow-using-data-version-control-dvc-aaeaa9cfb79b"
title="How to Build an Efficient Machine Learning Project Workflow Usign Data Version Control (DVC)"
description="Daniel Baena's overview of common MLOps challenges encoutered at Rappi Bank and how they are solved with DVC."
link="https://medium.com"
image="../uploads/images/2021-10-15/baena.jpeg"/>

## DAGsHub: Production Oriented Work

Next up, [**Nir Barazida**](https://twitter.com/barazida) from
[DAGsHub](https://dagshub.com/)
[created a video](https://dagshub.com/docs/workshops/production_oriented_work/?utm_content=bufferef4d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer)
on Production-oriented work using a monorepo strategy and focusing on moving
from research to production-ready code using Git and DVC. If you are a data
scientist trying to wrap your head around going from your notebook to
production, this may help!

<external-link
href="https://dagshub.com/docs/workshops/production_oriented_work/?utm_content=bufferef4d6&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer"
title="Production-Oriented Work with Git, DVC and DAGsHub"
description="Nir Barazida's tutorial and video on who to use a monorepo strategy and go from your notebook to production-ready code."
link="https://dagshub.com"
image="../uploads/images/2021-10-15/dagshub.jpg"/>

## ML Data Versioning with DVC: How to Manage Machine Learning Data

[**Piotr Storożenko**](https://www.linkedin.com/in/piotr-storo%C5%BCenko-438087128/)
of [Appsilon](https://appsilon.com/) wrote
[a great tutorial](https://appsilon.com/ml-data-versioning-with-dvc/) taking
into account the many challenges data scientists and ML engineers encounter in
their data versioning efforts and how DVC solves them. Do these scenarios from
his article look familiar?

> Was it in `model_3final.pth` or `model_last.pth` that I used a bigger lerning
> rate?
>
> When did I start using data preprocessing, during `model_2a.pth` or
> `model_2aa.pth`
>
> Is `model_7.pth` trained on the new dataset or on the old one?`
>
> Oh, gosh, which set of parameters and data have I used to train `model_2.pth`?
> It was pretty good in the end…”

# Learning Opportunities

## Raviraja Ganta's 10-week course on Basic MLOps

Twitter and LinkedIn were a blaze in the last month when
[**Raviraja Ganta**](https://www.linkedin.com/in/ravirajag/) announced his
[10-Week Course](https://www.ravirajag.dev/blog/mlops-summary) on MLOps basics.
This course is chock full of resoures and practical tutorials to build your
MLOps platform and knowledge. [Week 3](https://www.ravirajag.dev/blog/mlops-dvc)
of the course is about DVC and its ability to solve your versioning and
reproducibility challenges. Be sure to check out
[the course repo](https://github.com/graviraja/MLOps-Basics) as well!

[**MLOps Community**](https://mlops.community/) is hosting him to speak about
his course on October 20th.
[Sign up to attend here!](https://airtable.com/shrh5eGdEbcBsdEdq)

![Raviraja Ganta's 10-Week MLOps Course](../uploads/images/2021-10-15/ganta.png)
_Raviraja Ganta's 10-Week Course on MLOps Basics
([Source link](https://www.ravirajag.dev/blog/mlops-summary))_

## Josh Willis video on COVID simulations with DVC

This week,
[this Tweet comment](https://twitter.com/josh_wills/status/1441456258746249216)
led me to
[this work](https://mlconf.com/sessions/the-covid-scenario-pipeline-high-stakes-data-science/)
by [**Josh Wills.**](https://twitter.com/josh_wills) Josh was tapped by
[**DJ Patil**](https://twitter.com/dpatil) to participate in some COVID
simulation research early on in the pandemic in which he used DVC. In his
presentation about the project, he tells of the tools he used and challenges of
the use case. Nice DVC shout out at 19:56! Ah, the fruits of a Twitter 🐇🕳!

https://www.youtube.com/watch?v=tu7N8M-jwPU&t=10s

## September Office Hours Video: Transfer Learning with Milecia McGregor

If you missed last month's Office Hours
[Meetup](https://www.meetup.com/DVC-Community-Virtual-Meetups/), you can now
catch the video! [**Milecia's**](https://twitter.com/FlippedCoding) presentation
was based on [her blog post](https://dvc.org/blog/transfer-learning-experiments)
on the same topic: Using Experiments for Transfer Learning. If you're curious
about transfer learning in general, AlexNet and SqueezeNet in particular, or
using DVC experiments and checkpoints to track all that you do, this video's for
you!

https://www.youtube.com/watch?v=RmJbyQ36zVk

## Quoc-Tien Au: Continuously Learning on the Job as a Data Scientist

[This Towards Data Science](https://towardsdatascience.com/the-what-where-and-how-about-continuously-learning-on-the-job-as-a-data-scientist-b0a31ea4ac48)
article by [**Quoc-Tien Au**](https://www.linkedin.com/in/quoctienau/) entitled
"The What, Where, and How about continuously learning on the job as a data
scientist," speaks to some higher points on the need to have a mindset for
continuous learning in the Data Science field. It's packed with great thought
processes and resources on what to learn, where to learn, and how to keep
learning while still getting your work done. Who stuggles with this? 😅

![Thats Me I Am GIF by Ryn Dean](https://media.giphy.com/media/icJCVO3GPDbCvvfgpf/giphy.gif)

# DVC News

## Amsterdam Off-site

Most of our team members from Europe got together in Amsterdam recently for a
couple days of brainstorming and team bonding. They went on a Treasure Hunt, ate
Ramen (a favorite among our team) and had great discussions on how to make our
tools and our team even better! Pictured below from front of the room left,
going clockwise (to the back of the room and back up) are David Ortega, Helio
Machado, David de la Iglesia Castro, Laurens Duijvesteijn, Ruslan Kupriev
(hidden), Dmitry Petrov, Jelle Bouwman, Batuhan Taskaya,Svetlana Sachkovskaya,
and Paweł Redzyński.

Be sure to check out this section next month as our Americas team members will
meet in San Francisco!

![Europe Iterative Team Members meet in Amsterdam](../uploads/images/2021-10-15/amsterdam.jpg)
_Iterative Team Members meet in Amsterdam
([Source: David Ortega](https://www.linkedin.com/in/gortegadavid/)))_

## New Team Members

[**Jordan Weber**](https://www.linkedin.com/in/jordanwweber/) joins us from Los
Angeles, California as our new Chief of Staff. She has previously held similar
roles at venture captial and FinTech firms. In Jordan's free time she enjoys
cooking, tennis, dance, and hiking! 🎾

[**Ken Thom**](https://www.linkedin.com/in/kenthom/) joins us from Palo Alto,
California as our new Director of Operations. His past work includes business
operations, product management, software and hardware development. In his spare
time he likes to spend time with his family, swim, ski, and hike! 🥾

[**Jon Burdo**](https://www.linkedin.com/in/jon-burdo-59730a83/) joins us from
Boston, Massachusetts as a Senior Software engineer. He's been working for the
past few years as a machine learnng engineer with a focus on NLP. In his last
role he used DVC and loved it, which is how he eventually ended up here! 🎉 In
his spare time, Jon likes learning about open source software, tinkering with
Linux, and inline skating.

[**Stephanie Roy**](https://www.linkedin.com/in/stephroy1/) joins the team as a
Senior Software Engineer from Quebec, Canada. Our first Canadian team member!
She has previously worked at LogMeln on one of their mobile apps. In her spare
time she likes taking care of her plants in her indoor grow house, playing
roller derby, and discovering new things to watch, listen to and eat! 😋

Welcome to all our new team members! We are so glad you are here! 🙌🏼

## Open Positions

And wouldn't you know it? We're still hiring!
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

![High Five Amy Poehler GIF](https://media.giphy.com/media/120jXUxrHF5QJ2/giphy.gif)

## Docs Updates

Here are a few important docs updates you may want to take a look at this month!

### 📖 PyTorch Lightning

We all have
[**Ilia Sirotkin**](https://www.linkedin.com/search/results/all/?keywords=ilia%20sirotkin&origin=RICH_QUERY_SUGGESTION&position=0&searchId=e7bb3154-797a-44a5-a209-90ffece95246&sid=GeC)
to thank for his contribution to our docs. He created the
[PyTorch Lightning integration docs](https://dvc.org/doc/dvclive/api-reference/ml-frameworks/pytorch-lightning)
for all to use!

### 📖 CML with DVC guide:

[Our updated CML with DVC Guide](https://cml.dev/doc/cml-with-dvc) provides
updated code and streamlined information on Cloud Storage Provider credentials
and GitHub Actions set up.

```yaml
name: CML & DVC
on: [push]
jobs:
  run:
    runs-on: ubuntu-latest
    container: docker://ghcr.io/iterative/cml:0-dvc2-base1
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Train model
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          pip install -r requirements.txt  # Install dependencies
          dvc pull data --run-cache        # Pull data & run-cache from S3
          dvc repro                        # Reproduce pipeline
      - name: Create CML report
        env:
          REPO_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          echo "## Metrics" >> report.md
          dvc metrics diff master --show-md >> report.md

          # Publish confusion matrix diff
          echo "## Plots" >> report.md
          echo "### Class confusions" >> report.md
          dvc plots diff \
            --target classes.csv \
            --template confusion \
            -x actual \
            -y predicted \
            --show-vega master > vega.json
          vl2png vega.json -s 1.5 > plot.png
          cml publish --md plot.png >> report.md

          # Publish regularization function diff
          echo "### Effects of regularization" >> report.md
          dvc plots diff \
            --target estimators.csv \
            -x Regularization \
            --show-vega master > vega.json
          vl2png vega.json -s 1.5 > plot.png
          cml publish --md plot.png >> report.md

          cml send-comment report.md
```

### 📖 Shtab

Team member [**Casper da Costa-Luis**](https://cdcl.ml) has
[created a docs website](https://docs.iterative.ai/shtab/) for his python tab-
completion script generator project [shtab](https://github.com/iterative/shtab).
For more info checkout
[the original blog post](https://dvc.org/blog/shtab-completion-release) about it
as well.

## Next Meetups

For the second class of
[DVC Learn,](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/280814336/)
join us to learn about getting started running experiments! This lesson will
include information on how to use our
[checkpoints](https://dvc.org/doc/user-guide/experiment-management/checkpoints)
feature as well. We look forward to seeing you there!

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/280814336/"
title="DVC Learn - Getting Started with Running Experiments"
description="Milecia McGregor shows us how to get started with DVC Experiments and Checkpoints"
link="https://meetup.com"
image="../uploads/images/2021-10-15/dvc_learn.png"/>

Be sure to join us at the
[November Office Hours Meetup,](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/281355245/)
where [**Maykon Shots**](https://www.linkedin.com/in/maykon-schots/) will talk
about how he used DVC and CML to create an internal Kaggle competition for his
team to arrive at their best models in their work for the largest bank in
Brazil.

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/281355245//"
title="DVC Office Hours - Creating an Internal Kaggle Competition with DVC and CML"
description="Maykon Shots shows us how he used DVC and CML to create an internal Kaggle competition for his team"
link="https://meetup.com"
image="../uploads/images/2021-10-15/office-hours-meetup.png"/>

## Tweet Love ❤️

This month, it was exceedingly hard to pick just one Tweet. I'm leaving you with
one that ballooned our followers over the last month. But there have been many!
I encourage you to visit our newly created
[_Wall of Love ❤️_](https://testimonial.to/iterative-open-source-community-shout-outs/all)
to see all the beautiful Iterative tool love. 🛠❤️🤗

https://twitter.com/DynamicWebPaige/status/1435256826375720964?s=20

---

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
