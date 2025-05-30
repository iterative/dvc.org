---
title: April '22 Heartbeat
date: 2022-04-15
description: >
  Monthly updates are here! You will find the future of AI Infrastruture is
  modular, articles on distribution drift and how to solve it, the usual great
  tutorials and workflows from the Community,  online course updates, new docs
  and more! Happy April!

descriptionLong: |
  This month you will find:

    🧱 AI infrastructure is becoming modular,

    🔎 Distribution drift with Chip Huyen

    🥰 Tutorials and workflows from the Community,

    🗣 IRL events,

    💻 Online course(s) updates,

    🚀 Quebec becoming an Iterative hub, and more!
picture: 2022-04-15/april-heartbeat-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/april-22-hearbeat/1158
tags:
  - Heartbeat
  - DVC
  - CML
  - Git
  - Modular Infrastructure
  - Chip Huyen
  - Distribution drift
  - AI Environments
---

<details>

This month's Heartbeat image is inspired by Community member Gudmundur
Heimisson. Gudmundur submitted some great PRs to update WebHDFS docs pending
some other issues in the DVC repo.

This image refelcts his Paris area team's view of Château de Vincennes out their
company windows!

We are grateful for all our Community members' contributions from all around the
world!

<summary>✨Image Inspo✨</summary>
</details>

Welcome to April! We have lots to ingest from the AI World and the Community so
let's get started with all the building blocks for success!

## AI News

![Lego Rotate GIF by sheepfilms](https://media.giphy.com/media/l0JMrPWRQkTeg3jjO/giphy.gif)

### The Future of AI Infrastructure is Becoming Modular: Why Best-of-Breed MLOps Solutions are Taking Off & Top Players to Watch

[**Casber Wang**](https://twitter.com/CasberW) of
[Sapphire VC](https://twitter.com/SapphireVC) recently wrote
[a piece in Medium](https://medium.com/sapphire-ventures-perspectives/the-future-of-ai-infrastructure-is-becoming-modular-why-best-of-breed-mlops-solutions-are-taking-fd85c6ca8bcf)
on the necessary trend of AI infrastructure tooling becoming modular. He notes
three types of AI user types, "Off-the-shelfers," "Bet-the-Farmers," and "Rocket
Scientists." As the industry matures he makes the case (and we concur) for the
need for modular infrastructure tooling to provide AI teams with the most
flexible approach as they fine-tune their advancing and ever-growing processes.

> Where organizations used to seek all-in-one solutions to operationalize
> machine learning (ML) due to limited in-house resources and expertise, we’re
> seeing a rise in the demand for modular, best-in-class tooling that equips
> today’s more robust ML teams with the ability to flexibly run highly-custom
> and performant ML workloads.

![Clayton Christensen's Modularity Theory](../uploads/images/2022-04-15/clayton-christensen.png '=800')
_Clayton Christensen's Modularity Theory
([Source link](https://medium.com/sapphire-ventures-perspectives/the-future-of-ai-infrastructure-is-becoming-modular-why-best-of-breed-mlops-solutions-are-taking-fd85c6ca8bcf))_

> Soon, large data teams will turn to modular toolkits with dozens of solutions
> that manage different stages of the AI lifecycle. This will be particularly
> true of the “bet-the-farmers”, who will need customized, best-in-class tools
> that provide the flexibility that can match their exact challenge.

Wang describes the different toolchain groupings in the AI Lifecycle and
discusses some of the players in each of them. DVC shows up in the Model
Evaluation & Experiment Tracking group, but soon you will see that our tools
deliver flexible, modular building blocks for some other pieces of the puzzle.

## Data Distribution Shifts and Monitoring

[**Chip Huyen's**](https://twitter.com/chipro)
[most recent blog post](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html)
created for the course at Stanford
[CS 329S: Machine Learning Systems Design](https://cs329s.stanford.edu/) goes
into detail on all things related to data distribution shifts and the monitoring
of them. The piece provides great examples to understand concepts such as
natural labels, the types of distribution shifts, causes of ML System failure,
and the metrics needed to monitor these things to determine when your model is
no longer producing the desired results. She discusses tools that can help
identify these shifts including logs, dashboards, and alerts, acknowledging the
pluses and minuses of each approach. Finally, the emergence of the favoring of
the term _observability_ over _monitoring_ is discussed because it is a stronger
concept for determining what went wrong with the internal states of a system by
observing the external outputs.

![Drift Detection Algorithms](../uploads/images/2022-04-15/chip-huyen.png '=800')
_Drift detection algorithms by open-source package alibi-detect
([Source link](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html#monitoring-toolbox))_

Related to this, you can find a tutorial on how to detect drift and how to
correct your model with [Evidently AI](https://evidentlyai.com/) and DVC, see
[**Milecia McGregor's**](https://twitter.com/FlippedCoding) latest post on
[Preventing Stale Models in Production!](https://dvc.org/blog/stale-models)

![Preventing Stale Models in Production](../uploads/images/2022-04-15/stale-model-cover.png '=800')
_Preventing Stale Models in Production
([Source link](https://dvc.org/blog/stale-models))_

### MLOps is the Solution for Machine Learning and AI Projects

The team at [**xpresso.ai**](https://xpresso.ai) created
[this short post](https://xpresso.ai/resources/blogs/mlops-is-the-solution-for-machine-learning-and-ai-projects/?utm_source=rss&utm_medium=rss&utm_campaign=mlops-is-the-solution-for-machine-learning-and-ai-projects)
about all the facets that make up MLOps. While the tried and true
[CRISP-DM](https://en.wikipedia.org/wiki/Cross-industry_standard_process_for_data_mining)
model for Data Science takes us right up to production, MLOps encompasses
considerably more processes that keep and maintain a model in production over
time. You can see all of these things highlighted in their image below,
providing lots to ponder!

![Machine Learning Operations](../uploads/images/2022-04-15/Machine-Learning-Operations.jpeg '=800')
_Machine Learning Operations
([Source link](https://xpresso.ai/resources/blogs/mlops-is-the-solution-for-machine-learning-and-ai-projects/?utm_source=rss&utm_medium=rss&utm_campaign=mlops-is-the-solution-for-machine-learning-and-ai-projects))_

## Community News

### Kaushik Shakkari: The three environments for AI Professionals — Research, Development, and Production

![The three environments for AI Professionals - Research, Development, and Production](../uploads/images/2022-04-15/kaushik-shakkari.png 'The three environments for AI Professional - Research, Development, and Production :wrap-left ==300')
If your head is spinning with all the ample facets of the MLOps world as
outlined in xpresso.ai's diagram above and where you fit, or in the AI world in
general, [**Kaushik Shakkari**](https://www.linkedin.com/in/kaushik-shakkari/)
wrote
[this article](https://kaushikshakkari.medium.com/the-three-environments-for-ai-professionals-research-development-and-production-cffb86dfe533)
dividing up the AI space into three environments: Research, Development, and
Production. He goes into detail about the type of work, skillsets, and roles
found in each. This breakdown can help the reader zero in on where he or she may
best fit and be fulfilled in this vast and often confusing space as well as
determine a pathway for their career.

### Yashaswi Nayak: Continuous Machine Learning - An Introduction to CML (Iterative.ai)

![Continuous Machine Learning - An Introduction to CML](../uploads/images/2022-04-15/yashaswi-nayak.png 'Continuous Machine Learning - An Introduction to CML :wrap-right ==300')
[**Yahaswi Nayak**](https://twitter.com/YashaswiNayak) writes
[a wonderful guide](https://towardsdatascience.com/continuous-machine-learning-e1ffb847b8da)
for data scientists and engineers, filled with great story-telling and fun
images created by the author about using [CML](https://cml.dev) to provide CI/CD
to ML projects. He discusses the usual software development cycle using Git and
then follows with the complexities introduced by ML projects. He identifies the
reasons why CML is needed in the ML space, and how CML works.

Yahaswi gives the scenario of a team working on a classifier problem and how CML
would work for different team members tackling different parts of the problem.
He details all the questions a CML.yml file answers and takes care of in the
workflow. Finally, he lists a number of use cases for readers to try out with
CML. We'd love to see some Community members write about some of these use cases
that they've put into action!

![Continuous Machine Learning](../uploads/images/2022-04-15/cml-workflow.jpeg '=800')
_CML workflow
([Source link](https://towardsdatascience.com/continuous-machine-learning-e1ffb847b8da))_

### Zoumana Keita: MLops — Data And Model Versioning With DVC and Azure Blob Storage

If you've ever struggled with setting up your Azure Blob Storage with DVC, or
you know you will need to in the near future, you're in luck!
[**Zoumana Keita**](https://twitter.com/zoumana_keita_) shows you how to do just
that
[in this post](https://towardsdatascience.com/large-data-versioning-with-dvc-and-azure-blob-storage-a-complete-guide-b97344827c81)
in [Towards Data Science.](https://towardsdatascience.com) He recently was
struggling with the same problem and team member,
[David de la Iglesia Castro](https://twitter.com/daviddelachurch) came to the
rescue on our [Discord Server.](https://discord.com/invite/dvwXA2N) Zoumana was
kind enough to write a blog article on the detailed steps for the benefit of the
Community.

At this point in this Heartbeat, you probably grasp the importance of data,
model, and experiment versioning and how DVC easily versions large files in
conjunction with Git, which Zoumana describes. But he then takes you on a
detailed journey with screenshots of all the steps to get DVC set up with Azure
Blob Storage. Many thanks for this tutorial! 🙏🏼

<external-link
href="https://towardsdatascience.com/large-data-versioning-with-dvc-and-azure-blob-storage-a-complete-guide-b97344827c81"
title="MLOps — Data And Model Versioning With DVC And Azure Blob Storage"
description="Zoumana Keita's detailed tutorial on how to set up Azure Blob Storage with DVC"
link="https://towardsdatascience.com"
image="../uploads/images/2022-04-15/zoumana-keita.png"/>

### Ahmed Abdullah: Perfect Way of Versioning Models & Training Data

[**Ahmed Abdullah**](https://www.linkedin.com/in/ahmed-abdullah-7b1806180/)
[wrote this tutorial](https://medium.com/red-buffer/perfect-way-of-versioning-models-training-data-318819a1510d)
in Medium about how to get DVC set up to version your data and models with a
Google Drive. He takes you in detail through the steps and discusses many of the
reasons why this versioning is important to your success as an ML engineer
including ever-changing data, effective collaboration with teammates, and the
need for keeping data separated from code for security reasons.

<external-link
href="https://medium.com/red-buffer/perfect-way-of-versioning-models-training-data-318819a1510d"
title="Perfect Way of Versioning Models & Training Data"
description="Ahmed Abdullah's detailed tutorial on using DVC for versioning data, models with a Google Drive"
link="https://medium.com"
image="../uploads/images/2022-04-15/ahmed-abdullah.png"/>

## Conference News

In-person conferences are going on and we are excited to be able to see the
Community in person again!

- [**Gift Ojeabulu**](https://twitter.com/GiftOjeabulu_) presented at
  [Open Source Festival 2022](https://festival.oscafrica.org/) in Lagos, Nigeria
  with the talk: _MLOps Exploration with Git & DVC for Machine Learning Project
  on DAGsHub_
  [[slides](https://speakerdeck.com/giftojabu1/mlops-exploration-with-git-and-dvc-for-machine-learning-project-on-dagshub?slide=2)]
- [**Antoine Toubhans**](https://twitter.com/AntoineToubhans) presented
  _Flexible ML Experiment Tracking System for Python Coders with DVC and
  Streamlit_ at PyCon Berlin
  [[repo, slides](https://github.com/sicara/pycon-2022-dvc-streamlit)]
- [**David de la Castro Iglesia**](https://twitter.com/daviddelachurch)
  presented _Making MLOps Uncool Again_ at PyCon Berlin
  [[repo](https://github.com/iterative/workshop-uncool-mlops)]
- Next week at [ODSC East](https://odsc.com/boston/), come see
  [**Dmitry Petrov**](https://twitter.com/FullStackML) presenting _Model
  Registry with OpenSource Tools: Git, GitHub, and CI/CD_;
  [**Milecia McGregor**](https://twitter.com/FlippedCoding) with _Preventing
  Stale Models in Production_; and
  [**Alex Kim**](https://twitter.com/alex000kim) _Reproducibility, ML Pipelines,
  and CI/CD in Computer Vision Projects_
  [more info](https://odsc.com/boston/schedule/)
- Visit us at [MLOps World](https://mlopsworld.com/) June 9-10!

## Company News

### Online Course Updates

![Surprised Owl GIF](https://media.giphy.com/media/EdRgVzb2X3iJW/giphy.gif)

We've grown from 250 students last month to 450 right now!🎉 We are so happy to
see you all in the [platform](https://learn.dvc.org) learning! What's coming:

- We have heard from some of you that you would like captions. We are working on
  it!
- Course guide - you will start to see each video have a course guide that will
  have corresponding resources, explanations, and diagrams for those lessons and
  be able to take your own notes.

Thank you to all who have provided feedback after each course module! We are
going through this feedback, making adjustments, and keeping them in mind for
the next course!

### 5 New Hires!🎉

[**Dan Martinec**](https://www.linkedin.com/in/dan-martinec-30739a54/) joins us
from the Czech Republic as a field data scientist. Dan first learned about
Iterative through using DVC in his work as an ML Engineer. Dan originally
studied Control Engineering at CTU in Prague. He graduated with a PhD and has
worked in various fields (C++ development at Porsche, mathematical optimization
in a small start-up, ML engineer at Avast). When not working Dan enjoys hobby
projects in the garden such as building my own storage lodge for firewood,
building a wooden composter, implementing a wireless water level reader in the
water tank, etc. And after that hard work, he is known to appreciate a good
movie. Welcome, Dan!

[**Yury Kasimov**](https://www.linkedin.com/in/yury-kasimov-103962b8/) also
joins us from Prague, the Czech Republic as Field Data Scientist. He studied
Robotics during his Bachelor's studies and then Artificial Intelligence for his
Master degree. Yury worked for some as a part of a university group that helps
protect NGOs from different cyber attacks. Prior to joining the team, he spent
the last 4 years as an ML engineer at Avast. In his free time, Yury plays a lot
of tennis and is learning to play the drums. He speaks English, Czech, Russian,
and a bit of Spanish. Bienvenidos, Yury!

[**Chaz Black**](https://www.linkedin.com/in/chazblack1/) joins us as an Account
Executive from Atlanta, Georgia. Most recently he worked at H2O.ai leading their
business development team for 3 years. When Chaz is not helping clients, you may
find him checking out the ever-growing Atlanta food scene and hunting new and
exciting coffees and brewing styles. He is also a big audiophile and like many
on our team, Chaz enjoys board and video games when he has the time, with his
two cats looking over his shoulder. Welcome, Chaz!

Many in our Community already know our latest hire,
[**Daniel Barnes**](https://github.com/dacbd), as he has already been a great
contributor to our tools! We are excited to welcome him officially to the team
as a Software Engineer. Daniel is based in the Seattle, Washington area, having
recently moved back after two years in Korea. He has had a varied career path,
starting in IT security, programming, as a medic, then cyber in the US military,
and then to PACCAR where he discovered our open-source community! When not
solving complex software engineering challenges, Daniel has been noted as a bit
of an adrenaline junky with "hobbies" like skydiving, paragliding, and
motorcycles. Welcome, Daniel!

[**Maxim Aginsky**](https://www.linkedin.com/in/maximaginsky/) joins the team as
a Senior Product Designer from Montreal, Canada, marking our 4th employee from
the Province of Quebec! Maxim has worn many hats over the years working on
Product Development and most recently was the Director of Design for a Montreal
Fintech company. You can [explore his portfolio here.](https://arrowww.space/)
Welcome, Maxim!

## Open Positions

Even with our amazing new additions to the team, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions and share with anyone you think may be
interested! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-01-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

We've been following along on [**Anna's**](https://twitter.com/__anavc__)
journey through #100daysofcode to learn DVC. And now she's working on a project
of her own using Amazon Best Seller data.

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
