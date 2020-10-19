---
title: June '20 Heartbeat
date: 2020-06-08
description: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, learn about finishing touches on DVC 1.0, DVC in biomedical
  research, recommended reading and upcoming MLOps talks.
descriptionLong: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, learn about finishing touches on DVC 1.0, DVC in biomedical
  research, recommended reading and upcoming MLOps talks.
picture: 2020-06-08/June_20_Heartbeat_small.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/june-20-heartbeat/404
tags:
  - Heartbeat
  - Udemy Course
  - Pipelines
  - Plots
  - MLOps
---

Welcome to the June Heartbeat, our monthly roundup of cool happenings,
[good reads](#from-the-community) and
[up-and-coming developments](#coming-up-soon) in the DVC community.

## News

In the beginning of May, we
[pre-released DVC 1.0](https://dvc.org/blog/dvc-3-years-and-1-0-release). Ever
since, we've been putting the final touches on 1.0- wrapping up features, fixing
bugs 🐛, and responding to feedback from intrepid users
[trying the pre-release](https://dvc.org/doc/install/pre-release). To recap,
here are some of the big features coming:

- **Plots powered by Vega-Lite** We're building
  [functions for visualizing metrics](https://dvc.org/doc/command-reference/plots#plots)
  in your project, as well as comparing metrics across commits. We chose
  [Vega-Lite plots](https://github.com/vega/vega-lite) because they're
  high-level, compatible with ML projects written in any language, and beautiful
  by default.

- **Human readable and writeable pipelines.** We're reworking pipelines so you
  can modify dependencies, outputs, metrics, plots, and entire stages easily:
  via manual edits to a `.yaml` pipeline fines. This redesign will consolidate
  pipeline `.dvc` files into a single file (yay, simpler working directory). No
  worries for pipeline enthusiasts- DVC 1.0 is backwards compatible, so your
  existing projects won't be interrupted.

- **Run cache.** One of the most exciting features is the run-cache, a local
  record of pipeline versions that have previously been run and the outputs of
  those runs. It can seriously cut down on compute time if you find yourself
  repeating pipeline executions. For our CI/CD users, it also offers a way to
  save the output of your pipeline- like models or results-
  [without auto-commits](https://stackoverflow.com/questions/61245284/will-you-automate-git-commit-into-ci-cd-pipline-to-save-dvc-run-experiments).

DVC 1.0 work has been our top priority this past month, and we are _extremely
close_ to the releae. Think 1-2 weeks!

Another neat announcement: DVC moved up on
[ThoughtWorks Technology Radar](https://www.thoughtworks.com/radar/tools)! To
quote ThoughtWorks:

> In 2018 we mentioned DVC in conjunction with the versioning data for
> reproducible analytics. Since then it has become a favorite tool for managing
> experiments in machine learning (ML) projects. Since it's based on Git, DVC is
> a familiar environment for software developers to bring their engineering
> practices to ML practice. Because it versions the code that processes data
> along with the data itself and tracks stages in a pipeline, it helps bring
> order to the modeling activities without interrupting the analysts’ flow.

And here we are on the radar, in the Trial zone:

![](/uploads/images/2020-06-08/radar.png) _Blip, blip, blip!_

We are honored. In fact, this was validating in several ways. We field a lot of
questions about our decision to build around Git, rather than creating a
platform. It's awesome to know our approach is resonating with teams at the
intersection of ML and software development. Thanks, ThoughtWorks!

Last up in company news: you might recall that in early May, we hosted an online
meetup. [Marcel Ribeiro-Dantas](http://mribeirodantas.me) hosted guest talks
from [Elizabeth Hutton](https://github.com/ehutt) and
[Dean Pleban](https://twitter.com/DeanPlbn)- we heard about constructing a new
COVID-19 dataset, using DVC with transformer language models, and building
custom cloud infrastructure for MLOps. There's also Q&A with the DVC team, where
we fielded audience questions. A video of the meetup is available now, so check
it out if you missed the event.

https://youtu.be/19GMtrFykSU

## From the community

As usual, there's a ton of noteworthy action in the DVC community.

[Derek Haynes](https://twitter.com/dhaynes23), MLOps expert and new
[DVC Ambassador](https://dvc.org/blog/dvc-ambassador-program-announcement)-
wrote an excellent overview of using
[GitHub CodeSpaces](https://github.com/features/codespaces/). CodeSpaces is a
new development environment (currently in beta) that we're eagerly watching. As
Derek shows in his blog, it lets you have a Jupyter Notebook experience without
sacrificing on development standards- he uses
[whisk](https://docs.whisk-ml.org/en/latest/) to structure the project and
manage Python package dependencies, and DVC to version the model training
pipeline.

This use case is telling in the
[battle over Jupyter notebooks](https://towardsdatascience.com/the-case-against-the-jupyter-notebook-d4da17e97243):
we might just be able to have both a notebook _and_ mature project management.
Give Derek's blog a read and tell us what you think.

<external-link
href="https://dlite.cc/2020/05/26/github-codespaces-machine-learning.html"
title="GitHub Codespaces for Machine Learning"
description="With Codespaces, contributors can spin up a ready-to-go GitHub project-specific dev environment in the cloud. In this post, I’ll show how to give potential contributors a graceful start by configuring Codespaces for an ML project."
link="dlite.cc"
image="/uploads/images/2020-06-08/derek_haynes.jpg"/>

DVC Ambassador Marcel gave a tutorial about DVC to a bioinformatics student
group, and then an even bigger talk at the Federal University of Rio Grande de
Norte. His talk focused on how to use DVC in the context of scientific
reproducibility- specifically, large biological datasets, which are often
transformed and processed several times before ML models are fit. In my
experience, Git-flow is severely underutilized in life sciences research, so
it's exciting to see Marcel's ideas getting a big audience.

https://twitter.com/ppgeecufrn/status/1263260554443005954

Also, Marcel is the first author of a new scientific paper about mobility data
across 131 countries during the COVID-19 pandemic. The preprocessing pipeline is
versioned with DVC. We don't know how Marcel gets this much done.

<external-link
href="https://www.sciencedirect.com/science/article/pii/S2352340920305928"
title="Dataset for country profile and mobility analysis in the assessment of COVID-19 pandemic"
description="M. Ribeiro-Dantas, G. Alves, R.B. Gomes, L.C.T. Bezerra, L. Lima and I. Silva"
link="sciencedirect.com"
image="/uploads/images/2020-06-08/data_in_brief_logo.jpeg"/>

Also just released is a scientific paper by Christoph Jansen et al. about a
framework for computational reproducibility in the life sciences that integrates
DVC. The framework is called
[Curious Containers](https://github.com/curious-containers/curious-containers)-
definitely worth checking out for biomedical researchers interested in deep
learning.

<external-link
href="https://www.sciencedirect.com/science/article/abs/pii/S0167739X19318096"
title="Curious Containers: A framework for computational reproducibility in life sciences with support for Deep Learning applications"
description="C. Jansen, J. Annuscheit, B. Schilling, K. Strohmenger, M. Whitt, F. Bartusch, C. Herta, P. Hufnagl, and D. Krefting"
link="sciencedirect.com"
image="/uploads/images/2020-06-08/fgcs_cover.jpg"/>

In other work of vital interest to the good of humanity, this month has seen
some awesome applictions of the
[public Reddit dataset we released in February](https://dvc.org/blog/a-public-reddit-dataset).
The dataset is designed for an NLP task of mighty importance: will Redditors
vote that the poster is an asshole, or not?

Daniele Gentile beat our benchmark classifier (62% accuracy, but not bad for
logistic regression!) with Doc2Vec embeddings and a 500-neuron network. He got
71% accuracy on held out data- nice! His blog is a fun read, and code's included
if you want to follow along.

<external-link
href="https://medium.com/@danielegentili/artificial-intelligence-confirms-you-are-an-a-hole-e8eef354dc2"
title="Artificial Intelligence confirms you are an a**hole"
description="Q-LO is a small artificial brain that can determine if you are the a**hole or not in a situation from its description."
link="medium.com"
image="/uploads/images/2020-06-08/medium_logo.png"/>

Elsewhere on the internet, data scientist Dan Cassin delivered this beautiful
tweet:

https://twitter.com/Dan_Cassin/status/1256999648901787648

Last, I want to point you to two other excellent blogs.
[Venelin Valkov](https://github.com/curiousily) released a blog,
[Reproducible machine learning and experiment tracking pipeline with Python and DVC](https://www.curiousily.com/posts/reproducible-machine-learning-and-experiment-tracking-pipiline-with-python-and-dvc/),
that contains not only a detailed sample project but a livecoding video!

https://youtu.be/6_kK6wRtzhk

[Matthew McAteer](https://www.linkedin.com/in/matthewmcateer0/) revisited the
famous 2015
[Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper/5656-hidden-technical-debt-in-machine-learning-systems.pdf)
paper to ask which recommendations still work five years later. It's pretty
great-
[please read it](https://matthewmcateer.me/blog/machine-learning-technical-debt/).

![](/uploads/images/2020-06-08/spongebob.png) _Meme by Matthew McAteer. Click to
enlarge._

## Coming up soon

There are a couple of events to look forward to in the next few weeks. I'll be
speaking at two conferences: first,
[MLOps World](https://mlopsworld.com/program/) about CI/CD and ML. Next, I'm
[organizing a workshop](https://computationalaudiology.com/the-critical-role-of-computing-infrastructure-in-computational-audiology/)
at the Virtual Conference on Computational Audiology. To get ready, I'm
gathering resources about good computing practices for scientists and biomedical
research labs-
[contributions are welcome](https://github.com/andronovhopf/Lab_Computing_Resources).

Another talk on our radar is at EuroPython 2020. Engineer
[Hongjoo Lee will be talking about building a CI/CD workflow for ML with DVC](https://ep2020.europython.eu/talks/CXG7TcM-automating-machine-learning-workflow-with-dvc/)-
we're very interested to learn about their approach.

Lastly, [ML REPA](http://ml-repa.ru/) leader and new DVC Ambassador
[Mikhail Rozhkov](https://twitter.com/mnrozhkov) is working on a Udemy course
about DVC. Look for more updates this summer!

Thanks for reading this month. As always, we're proud of the ways our community
works for better, more rigorous ML.
