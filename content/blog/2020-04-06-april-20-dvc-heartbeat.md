---
title: April '20 DVC❤️Heartbeat
date: 2020-04-06
description: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, learn what we're up to in MLOps, CI/CD, and the 
  intersection of data science and software engineering.

descriptionLong: |
  Every month we share news, findings, interesting reads, community takeaways,
  and everything else along the way.

  Look here for updates about [DVC](https://dvc.org), our journey as a startup,
  projects by our users and big ideas about best practices in ML and data
  science.
picture: 2020-04-06/april_header.png
pictureComment:
  A view from [Barrancas del
  Cobre](https://en.wikipedia.org/wiki/Copper_Canyon), shot by Jorge Orpinel
  Pérez. Jorge has mastered the art of working on DVC remotely.
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/april-20-heartbeat/347
tags:
  - Heartbeat
  - Google Drive
  - MLOps
  - CI/CD
  - Podcast
  - DivOps
---

Welcome to the April Heartbeat, our
[monthly roundup of cool happenings](https://dvc.org/blog/tags/heartbeat), good
reads and other bright spots in our community.

## News

**Adapting to the pandemic.** Although the world seems different than when we
posted last month, the DVC community is steady and strong. As a predominantly
distributed company, we've been developing our infrastructure for remote work
from the get-go. It isn't always _easy_ to schedule an all-hands meeting across
9 time zones but we make it work. This experience has prepared us well for the
COVID-19 pandemic: although there are new challenges (like caring for families
while working from home) we've been able to weather the transition to fully
remote work relatively well.

![](/static/uploads/images/2020-04-06/laptop_on_boat.jpeg)_Before social
distancing started, DVC technical writer Jorge Orpinel Pérez has worked from a
canoe. Check out more photos from his workations
[on Instagram](https://www.instagram.com/workationer/)._

**DVC sponsors DivOps.** In a time when many conferences are going remote out of
necessity, we were fortunate to be part of an _intentionally_ remote conference
this month! We sponsored [DivOps](https://divops.org/), a fully-online meeting
led by women in DevOps. The DivOps lineup included speakers from GitHub,
DropBox, Gremlin and more. DVC data scientist Elle (that's me!) gave a
ten-minute talk about MLOps and CI/CD, so
[please check out the video](https://dvc.org/blog/reimagining-devops-video).
Another very relevant talk was from Anna Petrovicheva, CEO of
[Xperience AI](http://xperience.ai/); Anna
[spoke about her team's development workflow for deep learning projects](https://youtu.be/8nwpCQufeE0)
and gave a clear overivew of how they use DVC.

**DVC on the airwaves.** In early March, Elle was interviewed on an episode of
[The Data Stream podcast](https://www.interviewquery.com/tag/podcast/) about a
DVC data science project,
[building a public dataset of posts](https://dvc.org/blog/a-public-reddit-dataset)
from the "Am I the Asshole?" subreddit.

<external-link
href="https://www.interviewquery.com/blog-who-is-the-asshole/"
title="The Data Stream #3 - Who is the A-hole? With Elle"
description="Ever wonder if it's possible to train a model to discover whether your friends are assholes or not? Today Elle comes on the show to talk about her project building a classifier to predict the results from reddit's hottest advice community: Am I the Asshole (or AITA for short)."
link="interviewquery.com"
image="/uploads/images/2020-04-06/data_stream.png"/>

## New releases

This month, DVC has
[released some new features](https://github.com/iterative/dvc/releases) and
updates:

- Did you know you can use Google Drive for remote storage with DVC? We've been
  hard at work delivering the best performance with Google Drive and are
  thrilled to invite users to try it out. Brand new
  [docs](https://dvc.org/doc/user-guide/setup-google-drive-remote#setup-a-google-drive-dvc-remote)
  explain how to get started.
- We're introducing the `metrics diff` functionality, which lets you compare
  metrics from different commits side-by-side
  ([check out the docs](https://dvc.org/doc/command-reference/metrics/diff) to
  learn more)
- Windows users, we are here for you. Contributor
  [rxxg](https://github.com/rxxg) helped us get better performance on copy
  operations in Windows.

## From the community

**DVC and R working together** One of our favorite blogs this month came from
Marcel Ribeiro-Dantas, a developer and PhD student at the
[Institut Curie](https://institut-curie.org/). Marcel wrote about using DVC to
manage projects in R, particularly defining and versioning pipelines of data
processing and analysis that can be reproduced easily. While DVC is language
agnostic, much of our user content has been Python-centric, so it's exciting to
see a detailed post for the R-using data scientist (for more about R with DVC,
see
[Marija Ilić's post](https://dvc.org/blog/r-code-and-reproducible-model-development-with-dvc))!

<external-link
href="https://mribeirodantas.xyz/blog/index.php/2020/03/05/r-dvc-and-rmarkdown/"
title="Manage your Data Science Project in R"
description="A simple project tutorial with R/RMarkdown, Packrat, Git, and DVC."
link="mribeirodantas.xyz"
image="/uploads/images/2020-04-06/marcel.jpeg"/>

Also, Marcel recently gave an interview on
[The Data Hackers Podcast](https://medium.com/data-hackers/health-data-e-o-coronav%C3%ADrus-data-hackers-podcast-22-2b059d460cb1),
a Portuguese-language show. Listen for a shout-out about DVC!

**DVC is in another book!** Last month we reported that DVC is part of a Packt
book,
["Learn Python by Building Data Science Applications"](https://www.packtpub.com/programming/learn-python-by-building-data-science-applications).
This month, DVC got a mention in a just-released O'Reilly book,
["Building Machine Learning Pipelines"](https://www.oreilly.com/library/view/building-machine-learning/9781492053187/)
by Hannes Hapke and Catherine Nelson.

<external-link
href="https://www.oreilly.com/library/view/building-machine-learning/9781492053187/"
title="Building Machine Learning Pipelines"
description="Automating Model Life Cycles with TensorFlow"
link="oreilly.com"
image="/uploads/images/2020-04-06/oreilly.jpeg"/>

**Some more links we like.** Here are a few other discussions that have caught
our attention.

- **MLOps can be fun.** Jeroen France's blog, "MLOps: Not as boring as it
  sounds!", reads like a "coming of age" story about embracing engineering as a
  data scientist. It's part-motivational, part tutorial- definitely worth a
  read. Here's a sample:

  > No-one wants to baby-sit, maintain, and troubleshoot their own models once
  > they are in production. Every data scientist secretly hopes they can pawn
  > that job off to an engineering team, or maybe an intern, right? Well, in
  > fact MLOps is going to make your data science life a lot better.

- **Leveling up your Jupyter notebooks.** In a series called
  ["How to Use Jupyter Notebooks in 2020"](https://ljvmiranda921.github.io/notebook/2020/03/16/jupyter-notebooks-in-2020-part-2/),
  Lj Miranda discusses how to use Jupyter Notebooks in a mature software
  development workflow. He makes several recommendations for tools, including
  DVC.

- **Reddit discussion about CI/CD** When we shared around our DivOps conference
  presentation on Reddit, some
  [great discussion happened](https://www.reddit.com/r/MachineLearning/comments/fshh9p/p_a_talk_about_adapting_cicd_systems_for_ml_full/).
  We chatted about how CI/CD might work for data scientists, who often begin a
  project with a phase of rapid exploration, and what version control for ML
  could look like without Git.

- **Smashing the data monolith.** Engineer Juan López López wrote a blog called
  ["A complete guide about how to break the data monolith"](https://medium.com/packlinkeng/a-complete-guide-about-how-to-break-the-data-monolith-caa2ab2d01f6),
  which is a neat manifesto about treating infrastructure _and_ data as code.
  It's got nice coverage of DVC, code examples, and some deeply enjoyable
  artwork.

![](/static/uploads/images/2020-04-06/monolith.jpeg)_From Juan Juan López
López's
[blog](https://medium.com/packlinkeng/a-complete-guide-about-how-to-break-the-data-monolith-caa2ab2d01f6)._

Thanks for reading. As always, let us know what you're making with DVC and what
links are catching your interest in the blog comments, on
[Twitter](https://twitter.com/DVCorg), and our
[Discord channel](https://dvc.org/chat). Be safe and be in touch!
