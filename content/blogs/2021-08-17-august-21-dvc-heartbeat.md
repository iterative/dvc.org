---
title: August'21 Heartbeat
date: 2021-08-17
description: >
  Monthly updates are here! The new data centricity focus, a comparison of DVC,
  MLFlow and Metaflow, tutorials and tool stacks, doc updates and more!
descriptionLong: |
  This month you will find:
  - 🧑🏽‍💻 Data-centric for the win,
  - 🧐 Comparison of DVC, MLFlow and Metaflow,
  - 🛠 Tutorials and Tool Stacks,
  - 📈 DVC + Streamlit = ❤️,
  - 📖 Doc Updates,
  - 🎥 July Meetup Video available,
  - 🚀 and more!
picture: 2021-08-17/august21cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/august-heartbeat/843
tags:
  - Heartbeat
  - DVC
  - CML
  - Streamlit
---

# It's all about that Data!

![Data! Data! Data!](https://media.giphy.com/media/4FQMuOKR6zQRO/giphy.gif)

# From the Community

This month we are seeing the progression of a couple of pieces from the
[June Heartbeat](https://media.giphy.com/media/62HBhssMOgdJUZQp1X/giphy.gif) as
well as checking out a use case, tool stack, and some great tutorials of our
Community members.

## LJ Miranda synthesizes the MLOps space once again!

[LJ Miranda](https://twitter.com/ljvmiranda921) writes another amazing article
after the series of articles he wrote covering the MLOps tools landscape we
covered in the June Heartbeat. This time he focuses on the wave of data-centric
focus taking over the space giving a review of the methods, approaches, and
techniques to ensure quality data for ML projects. If the adroit summaries of
complex concepts doesn't thrill you, the links to no less than 63 (😱) resources
will get you on your way to data-centric nirvana.

![Data Centric Framework](../uploads/images/2021-08-17/lj-miranda-data-centric.png)
_LJ Miranda's Framework for putting data-centric machine learning into context
[Source link](https://ljvmiranda921.github.io/notebook/2021/07/30/data-centric-ml/)_

## Neda Sultova's Comparison of DVC, MLFlow and Metaflow

Also covered in the June Hearbeat was
[Neda Sultova's](https://www.linkedin.com/in/neda-sultova-597a811a8/) piece on
the rubric she is using to decide on the what MLOps tools to use for the teams
at [Helmholtz AI](https://www.helmholtz.ai/). This
[next article](https://medium.com/geekculture/comparing-metaflow-mlflow-and-dvc-e84be6db2e2)
reviews her research into DVC, MLFlow and Metaflow and offers a thorough
analysis of the tools across multiple dimensions. Beyond the article, check out
her [MLOps Comparison repository](https://github.com/hzdr/mlops_comparison) as
well as her
[Comparison Table](https://github.com/hzdr/mlops_comparison/blob/master/Content/Comparison_table.pdf).
They will not disappoint!

![Machine Learning Lifecycle](../uploads/images/2021-08-17/neda-sultova-2.png)
_Machine Learning Lifecycle
[Source link](https://medium.com/geekculture/comparing-metaflow-mlflow-and-dvc-e84be6db2e2)_

## Amit Kulkarni's Tutorials

Writing for the
[Analytics Vidhya Data Science Blogathon,](https://datahack.analyticsvidhya.com/contest/data-science-blogathon-9/#LeaderBoard)
[Amit Kulkarni](https://www.linkedin.com/in/amitvkulkarni2/) created two
tutorials on DVC.
[Tracking ML Experiments with Data Version Control](https://www.analyticsvidhya.com/blog/2021/06/mlops-tracking-ml-experiments-with-data-version-control/?utm_source=dlvr.it&utm_medium=twitter)
reviews DVC and takes you through getting started, setup, fetching data and
pre-processing, and the steps of an ML project. Next it sets up DVC, the
pipeline, and shows how to run model metrics and plots. In
[MLOps| Versioning with Git & DVC,](https://www.analyticsvidhya.com/blog/2021/06/mlops-versioning-datasets-with-git-dvc/)
Amit continues with an explanation how data and model versioning works with
Github paired with DVC.

In a previous article entitled
[Bring DevOps to Data Science with MLOps](https://www.analyticsvidhya.com/blog/2021/04/bring-devops-to-data-science-with-continuous-mlops/)
Amit walks through a tutorial using CML to bring CI/CD functionality to your ML
project and automate the process. All great posts to check out!👇🏼

<external-link
href="https://www.analyticsvidhya.com/blog/2021/06/mlops-tracking-ml-experiments-with-data-version-control/?utm_source=dlvr.it&utm_medium=twitter"
title="Tracking ML Experiments With Data Version Control"
description="Amit Kulkarni's tutorial on getting started with DVC and tracking eperiments"
link="https://analyticsvidhya.com"
image="../uploads/images/2021-08-17/a-v.png"/> <external-link
href="https://www.analyticsvidhya.com/blog/2021/06/mlops-versioning-datasets-with-git-dvc/"
title="MLOps | Versioning Datasets with Git & DVC"
description="Amit Kulkarni's tutorial on how to DVC works with Git to version your datasets."
link="https://analyticsvidhya.com"
image="../uploads/images/2021-08-17/a-v.png"/> <external-link
href="https://www.analyticsvidhya.com/blog/2021/04/bring-devops-to-data-science-with-continuous-mlops/"
title="Bring DevOps To Data Science With MLOps"
description="Amit Kulkarni's tutorial on how to use CML to bring the CI/CD functionality of DevOps to your data science projects."
link="https://analyticsvidhya.com"
image="../uploads/images/2021-08-17/a-v.png"/>

## Andreas Malekos' MLOps Tool Stack at Continuum Industries

Last but not least, we bring you a great article from
[Andreas Malekos](https://www.linkedin.com/in/andreasmalekos/), Chief Scientist
at [Continuum Industries](https://www.continuum.industries/). In
[the post](https://neptune.ai/blog/mlops-tool-stack-continuum-industries) he
outlines the tool stack and MLOps platform they use to do their work automating
and optimizing the design of linear infrastructure assets like water pipelines,
overhead transmission lines, subsea power lines, or telecommunication cables.

Amongst their tool stack are DVC and CML, and the article outlines what they
like (!🙈Spoiler alert🙊! DVC making repeatability achievable) and the things
that they don't like that still need to be improved.

![Continuum Industries MLOps Tool Stack](../uploads/images/2021-08-17/continuum-tool-stack.png)
_Continuum Industries MLOps Tool Stack
[Source link](https://neptune.ai/wp-content../uploads/Continuum-Industries-tool-stack-final.png)_

# DVC News

Though the team has been taking some vacation time in the last month, there's
still a lot going on!

![Typing Cat](https://media.giphy.com/media/aNqEFrYVnsS52/giphy.gif)

## Docs Updates

This month we are introducing docs updates so that you will always be aware of
what has changed as our open source projects mature.

Our docs team made up of
[Jorge Orpinel](https://www.linkedin.com/in/jorgeorpinel/),
[Emre Şahin](https://emresahin.net), [Casper da Costa-Luis](https://cdcl.ml),
and
[David de la Iglesia-Castro,](https://www.linkedin.com/in/david-de-la-iglesia-castro-b4b67b20a/)
has been hard at work updating our docs to make sure you have what you need to
be successful using our tools! Updates include:

- Complete [DVCLive docs](https://dvc.org/doc/dvclive)
- We have a new [Glossary page](https://dvc.org/doc/user-guide/glossary) and a
  first Basic Concepts page
  ([_DVC Workspace_](https://dvc.org/doc/user-guide/basic-concepts/workspace))
- [CML Docs migration to CML.Dev](https://cml.dev/doc)
- [Added Videos to Get Started: Metrics and Experiments pages](https://dvc.org/doc/start)
  and
  [Checkpoints Guide](https://dvc.org/doc/user-guide/experiment-management/checkpoints)
- Authentication examples for
  [Azure Blob remote storage](https://dvc.org/doc/command-reference/remote/modify#example-some-azure-authentication-methods)
  from Community member @meierale ❤️

## Batuhan Taskaya's Refactor Project hits First Page in HackerNews!

A [Refactor Project](https://github.com/isidentical/refactor) created by team
Member [Batuhan Taskaya](https://twitter.com/isidentical) (AKA @isidentical),
was shared by someone on HackerNews and made it to the main page! You can
[catch all the comments here](https://news.ycombinator.com/item?id=28027016)!

Explanation of the project:

> refactor is an end-to-end refactoring framework that is built on top of the
> 'simple but effective refactorings' assumption. It is much easier to write a
> simple script with it rather than trying to figure out what sort of a regex
> you need in order to replace a pattern (if it is even matchable with regexes).

> Every refactoring rule offers a single entrypoint, match(), where they accept
> an AST node (from the ast module in the standard library) and respond with
> either returning an action to refactor or nothing. If the rule succeeds on the
> input, then the returned action will build a replacement node and refactor
> will simply replace the code segment that belong to the input with the new
> version.

Way to go Batuhan! 🚀

## July Office Hour Meetup

If you missed our July Office Hours, good news! It's now available on our
[YouTube Channel](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ) and
you can see [João Santiago](https://twitter.com/jcpsantiago) shares about
{dvthis}, and how his team at [Billie.io](https://www.billie.io/) uses DVC to
productionize rstats.

Also in the Meetup is a DVC Studio demo by
[Tapa Dipti Situala](https://www.linkedin.com/in/tapa-dipti-sitaula/), Senior
Product Engineer for Studio. You can catch the presentations along with great
questions and discussion from the Community!

https://www.youtube.com/watch?v=H22j1lWIvMw&t=1546s

## Next Meetup

So remember when I told you last month about DVC + Streamlit = ❤️ ? Well at our
August Office Hours Meetup,
[Antoine Toubhans](https://www.linkedin.com/in/antoine-toubhans-92262119/) of
[Sicara](https://www.sicara.fr/) will be presenting
[his tutorial](https://www.sicara.ai/blog/dvc-streamlit-webui-ml) on how to do
just that! Join us in the integrating fun on August 19th at 3:00 pm UTC! RSVP at
this link below! 👇🏼

<external-link
href="https://www.meetup.com/DVC-Community-Virtual-Meetups/events/279723437/"
title="DVC Office Hours - DVC and Streamlit Integration"
description="Antoine Toubhans of Sicara shares his tutorial for using Streamlit with DVC to create a customizable web UI"
link="https://meetup.com"
image="../uploads/images/2021-08-17/streamlit-oh.png"/>

## Learning Opportunities

This week's DVC Learn Meetup (August 18th) will be the last in our series of DVC
Learn Meetups designed to get teams up and running with DVC. We will digest our
learnings from this first cohort and revamp for the next set of three classes
that will begin in September. Subscribe to
[our Meetup group](https://www.meetup.com/DVC-Community-Virtual-Meetups/) and
and follow us in [Twitter](https://twitter.com/DVCorg) and
[LinkedIn](https://www.linkedin.com/company/18657719) to stay in the know about
all of our upcoming events!

If you are interested in weighing in on what kinds of educational content you
would like to see from us, we'd be grateful if you'd fill out
[**this survey**](https://docs.google.com/forms/d/e/1FAIpQLSdmwjs0ZkxDdODfZTvSwP2bVW4JAVVdxiYhQPyW5dSbsZC8qg/viewform?pli=1)
to help us plan! 🙏🏼

![DVC Online Course survey](../uploads/images/2021-08-17/survey.png) _Help us
plan our Online Course! 🙏🏼
[Source link](https://docs.google.com/forms/d/e/1FAIpQLSdmwjs0ZkxDdODfZTvSwP2bVW4JAVVdxiYhQPyW5dSbsZC8qg/viewform?pli=1))_

## Open Positions

Looking for a great opportunity at an amazing company? Check out our open
postions
[at this link](https://www.notion.so/iterative/iterative-ai-is-hiring-852cb978129645e1906e2c9a878a4d22)
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

---

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
