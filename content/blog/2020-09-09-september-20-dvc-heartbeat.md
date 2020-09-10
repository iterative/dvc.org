---
title: September '20 Heartbeat
date: 2020-09-09
description: |
  This month, catch us on the Software Engineering Daily Podcast, 
  check out our favorite DVC and CML tutorials and projects, and 
  celebrate 1000 YouTube subscribers!
descriptionLong: |
  This month, catch us on the Software Engineering Daily Podcast, 
  check out our favorite DVC and CML tutorials and projects, and 
  celebrate 1000 YouTube subscribers!
picture: 2020-09-09/header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/september-20-heartbeat/488
tags:
  - Heartbeat
  - CML
  - DVC
  - R
  - Meetup
  - Videos
---

## News

### Dmitry on Software Engineering Daily

Our CEO Dmitry Petrov was interviewed on the much-beloved Software Engineering
Daily podcast! Host [Jeff Meyerson](https://twitter.com/the_prion) kicked off
the discussion:

> Code is version controlled through Git, the version control system originally
> built to manage the Linux codebase. For decades, software has been developed
> using git for version control. More recently, data engineering has become an
> unavoidable facet of software development. It is reasonable to ask–why are we
> not version controlling our data?

For the rest of the episode, listen here!

<external-link
href="https://softwareengineeringdaily.com/2020/08/24/data-version-control-with-dmitry-petrov/"
title="Data Version Control with Dmitry Petrov"
description=""
link="softwareengineeringdaily.com"
image="/uploads/images/2020-09-09/sedaily.jpeg"/>

### Contributor's meetup

Last week, we held a meetup for contributors to DVC! Core maintainer
[Ruslan Kupriev](https://github.com/efiop) hosted a get-together for folks who
contribute new features, bug fixes, and more to the community. If you missed it,
you can watch it on YouTube.

https://youtu.be/jUYSTERXxWg

### New videos

We've released several new videos to our growing
[YouTube channel](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ)- and
cool news, we passed 1,000 subscribers! The support has been surprising in the
best way possible. We're seeing a lot of repeat commenters and folks from the
DVC meetups! It's been so rewarding to get positive feedback from the community
and we're planning to build our YouTube presence even more.

https://media.giphy.com/media/ZE0JppdERv8t4jVCAt/giphy.gif

_Even Skeletor finds joy in this._

We now have 4 tutorials in our MLOps series. In the latest, we cover how to use
your own GPU (on-premise or in the cloud) to run GitHub Actions workflows. Check
it out and give it a try, the code examples are freely available :)

https://youtu.be/rVq-SCNyxVc

We also made our first ever "explainer" video to talk through how DVC works in
five minutes.

https://youtu.be/UbL7VUpv1Bs

As always, video requests are welcome! Reach out and let us know what topics and
tutorials you want to see covered. And we appreciate any likes, shares, and
subscribes on our growing YouTube channel.

## From the community

### A three-part CML series (featuring R!)

DVC ambassador [Marcel Ribeiro-Dantas](https://twitter.com/mribeirodantas) has
published two of three tutorial blogs in a series on CML! Marcel's use case is
especially cool because he's using R, plus some causal modeling related to his
work in bioinformatics, with GitHub Actions.

In Part I, Marcel introduces his project and how he uses DVC, CML and GitHub
Actions together (with his custom R library).

<external-link
href="https://mribeirodantas.xyz/blog/index.php/2020/08/10/continuous-machine-learning/"
title="Continuous Machine Learning - Part I"
description="by Marcel Ribeiro-Dantas"
link="mribeirodantas.xyz"
image="/uploads/images/2020-09-09/MLOps.png"/>

In Part II, Marcel takes a deeper dive into Docker. He explains how to create a
your own Docker image and test it. This case should be helpful for folks who
want to include the CML library in their own Docker container.

<external-link
href="https://mribeirodantas.xyz/blog/index.php/2020/08/18/continuous-machine-learning-part-ii/"
title="Continuous Machine Learning - Part II"
description="by Marcel Ribeiro-Dantas"
link="mribeirodantas.xyz"
image="/uploads/images/2020-09-09/docker_logo.png"/>

### Real Python talks DVC

[Kristijan Ivancic](https://twitter.com/kristijan_ivanc) of
[Real Python](realpython.com), a library of online Python tutorials and lessons,
created a _seriously_ impressive DVC tutorial (this thing is a beast 🐺- it has
a table of contents!)

![](/uploads/images/2020-09-09/Real_Python.png)_How cool is this artwork?_

And, the Real Python podcast discussed their DVC tutorial (plus the joys of
version control for data!) on a recent episode.

<external-link
href="https://realpython.com/podcasts/rpp/25/"
title="Episode 25: Data Version Control in Python and Real Python Video Transcripts"
description="The Real Python Podcast"
link="realpython.com"
image="/uploads/images/2020-09-09/podcast_log.png"/>

### Recommended reading

There's a lot of cool stuff happening out there in the data science world 🌏!

- [Fabiana Clemente](https://twitter.com/fab_clemente), Chief Data Officer of
  [YData](https://ydata.ai/), published a blog for The Startup about four
  reasons to start using data version control- and, with her expertise in data
  privacy, she's especially well-qualified to explain the role of DVC in
  compliance and auditing! Check out her blog (it comes with a quick-start
  tutorial, too).

<external-link
href="https://medium.com/swlh/4-reasons-why-data-scientists-should-version-data-672aca5bbd0b"
title="4 reasons why data scientists should version data"
description="How to start data versioning using DVC"
link="medium.com"
image="/uploads/images/2020-09-09/fabiana.jpg"/>

- Ryzal Kamis at the [AI Singapore Makerspace](makerspace.aisingapore.org)
  shared a blog (the first of two!) about creating end-to-end CI/CD workflows
  for machine learning. In his first blog, Ryzal gives a high-level overview of
  the need for data version control and compares several tools in the space.
  Then he gives a walkthrough (quite easy to follow!) of how DVC fits in his
  workflow. We're eagerly awaiting the second installment of this series, which
  promises to bring more advanced automation scenarios and a CI/CD pipeline.

<external-link
href="https://makerspace.aisingapore.org/2020/08/data-versioning-for-cd4ml-part-1/"
title="Data Versioning for CD4ML"
description="Part 1"
link="makerspace.aisingapore.org"
image="/uploads/images/2020-09-09/singapore.jpg"/>

- [Isaac Sacolick](https://www.infoworld.com/author/Isaac-Sacolick/),
  contributing editor at InfoWorld, penned an article about the growing field of
  MLOps and its role in data-driven businesses. He writes:

> Too many data and technology implementations start with poor or no problem
> statements and with inadequate time, tools, and subject matter expertise to
> ensure adequate data quality. Organizations must first start with asking smart
> questions about big data, investing in dataops, and then using agile
> methodologies in data science to iterate toward solutions.

Read the rest here:

<external-link
href="https://www.infoworld.com/article/3570716/mlops-the-rise-of-machine-learning-operations.html"
title="MLops: The rise of machine learning operations"
description="Once machine learning models make it to production, they still need updates and monitoring for drift. A team to manage ML operations makes good business sense"
link="infoworld.com"
image="/uploads/images/2020-09-09/infoworld.png"/>

Thanks everyone, that's a wrap for this month. Be safe, stay in touch, and get
ready for pumpkin spice latte season 🎃.

https://media.giphy.com/media/EDpVRPFK5bjfq/giphy.gif
