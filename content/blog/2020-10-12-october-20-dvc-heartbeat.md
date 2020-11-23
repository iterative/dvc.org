---
title: October '20 Heartbeat
date: 2020-10-12
description: |
  This month, hear about our international talks, 
  new video docs on our YouTube channel, 
  and the best tutorials from our community.
descriptionLong: |
  This month, hear about our international talks, 
  new video docs on our YouTube channel, 
  and the best tutorials from our community.
picture: 2020-10-12/cover.png
pictureComment:
  Double DeeVee! One of these birds is on a layover before heading to Germany.
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/october-20-heartbeat/527
tags:
  - Heartbeat
  - CML
  - DVC
  - Tutorial
  - Conference
  - Meetup
  - YouTube
---

## News

### Paweł gets ready to speak at Poland's largest data science meeting

DVC developer Paweł Redzyński (he's written a lot of the code behind
`dvc plots`) is giving at talk at the [Data Science Summit](https://dssconf.pl/)
in Poland! The virtual meeting is on October 16, but talks are available for
streaming on demand up to a week before. Paweł's talk is part of the DataOps &
Development track, where he'll be sharing about CML and GitHub Actions (note
that it'll be delivered in English).

[![](/uploads/images/2020-10-12/dss.png)](https://dssconf.pl)

### Dmitry talks at Data Engineering Melbourne

CEO
[Dmitry Petrov dropped into the Data Engineering Melbourne meetup](https://www.meetup.com/Data-Engineering-Melbourne/events/267033998/)
to talk about Data Versioning and DataOps! He spoke about the differences
between end-to-end platforms and ecosystems of tools, and how this distinction
informs the development of software like DVC and CML (hint: we picked tools over
platforms).

Keep an eye on this meetup, which is now accessible to folks on all continents
thanks to the magic of the internet :)

<external-link
href="https://www.meetup.com/Data-Engineering-Melbourne/"
title="Data Engineering Melbourne"
description="Dmitry Petrov presents on DataOps and versioning."
link="meetup.com"
image="/uploads/images/2020-10-12/Meetup_Logo.png"/>

### Elle has talks at PyCon India and PyData Global

Last week I gave a talk about CML at
[PyCon India](https://in.pycon.org/cfp/2020/proposals/how-to-make-continuous-integration-work-with-machine-learning~avK5b/),
and have another one coming up at
[PyData Global](https://global.pydata.org/talks/321) this November 11-15.

<external-link
href="https://global.pydata.org/talks/321"
title="DevOps for science: using continuous integration for rigorous and reproducible analysis"
description="PyData Global"
link="https://global.pydata.org"
image="/uploads/images/2020-10-12/pydata.png"/>

PyData Global has a fantastic lineup of talks spanning science and engineering,
so please consider joining!

### DVC at DataFest

DVC Ambassador Mikhail Rozhkov co-hosted the Machine Learning REPA
(Reproducibility, Experiments and Pipelines Automation) track of
[DataFest 2020](https://datafest.ru/), and DVC showed up in full force! There
were talks from Dmitry, ambassador Marcel Ribeiro-Dantas, and myself about all
aspects of MLOps and automation.

DataFest is over (until next year, anyway), but
[visit the ML-REPA community](http://ml-repa.ru/en#about) for ongoing content
and opportunities for networking.

### New videos

Since the summer, we've been building our
[YouTube channel](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ).
It's going great- we've gotten more than 18,000 views in the last few months and
1,500 subscribers!

Our latest video in the
[MLOps Tutorials](https://www.youtube.com/playlist?list=PL7WG7YrwYcnDBDuCkFbcyjnZQrdskFsBz)
series introduced using GitHub Actions for model testing- instead of training a
model in continuous integration, the idea is to train locally and "check-in"
your favorite model for testing in a standardized environment. This approach
lets you completely control the environment, infrastructure, and code used to
evaluate your model, and save the run in a place that's easy to share (GitHub!).

https://youtu.be/bSXUJRnQPPo

We'll be going deeper into the art and craft of testing ML models in the next
few weeks, so stay tuned. Another big initative is adding videos to our docs:
since video seems like a popular format for a lot of learners, we're working to
supplement our official docs with embedded videos. Check out our first
installment on the
[Getting Started with Data Versioning](https://dvc.org/doc/start/data-versioning).

https://youtu.be/kLKBcPonMYw

## From the community

Our community makes some amazing tutorials. Here are a few on our radar:

Data scientist and full-stack developer
[Ashutosh Hathidara](https://github.com/ashutosh1919) shared an end-to-end
machine learning project made with DVC and CML... and released it in video form!
It's a neat setup and a nice model for folks to study.

https://youtu.be/H1VBsK7XiKs

Another detailed and easy-to-follow tutorial, with a similarly impressive scope,
appared on [Heise Online](https://www.heise.de/). This project puts together
DVC, Cortex, and ONNX to develop and deploy a model trained on the Fashion MNIST
dataset (note: the article is in German, and I read it with Chrome's English
translation).

<external-link
href="https://www.heise.de/hintergrund/Verwaltung-und-Inbetriebnahme-von-ML-Modellen-4911723.html"
title="Managing and commissioning ML models"
description="Tools like DVC and Cortex, which are designed for the operationalization of AI projects, are intended to help developers deploy models in production."
link="https://heise.de"
image="/uploads/images/2020-10-12/heise.png"/>

You'll also want to check out [anno.ai](https://www.anno.ai/)'s tutorial about
managing large datasets with DVC and S3 storage- it's detailed, but also a
quick-start guide informed by the team's practical experience.

<external-link
href="https://medium.com/@anno.ai/mlops-and-data-managing-large-ml-datasets-with-dvc-and-s3-part-1-d5b8f2fb8280"
title="MLOps and Data: Managing Large ML Datasets with DVC and S3 (Part 1)"
description="A quick start guide to version control for machine learning data"
link="medium.com/@anno.ai"
image="/uploads/images/2020-10-12/legos.jpg"/>

Data scientist and mathematician [Khuyen Tran](https://twitter.com/KhuyenTran16)
blogged about why and how to start using DVC- and her tutorial includes Google
Drive remote storage, a feature we're especially excited about. Check it out and
follow along with her code examples!

<external-link
href="https://towardsdatascience.com/introduction-to-dvc-data-version-control-tool-for-machine-learning-projects-7cb49c229fe0"
title="Introduction to DVC: Data Version Control Tool for Machine Learning Projects"
description="Just like Git, but with Data!"
link="medium.com"
image="/uploads/images/2020-10-12/khuyen_tran.jpg"/>

And to end on a thoughtful note... have you seen this thread by ML Engineer
[Shreya Shankar](https://twitter.com/sh_reya)? She beautifully summarizes many
of the ideas and technical challenges our community thinks about every day. Read
and reflect!

https://twitter.com/sh_reya/status/1314338372073263112
