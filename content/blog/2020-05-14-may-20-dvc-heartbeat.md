---
title: May '20 DVC❤️Heartbeat
date: 2020-05-14
description: |
  Catch up on new DVC releases, talks, and projects in our community. 
  This month, learn about new features in the DVC 1.0 release, ways 
  to get involved, and more from the intersection of data science 
  and software engineering.

descriptionLong: |
  Every month we share news, findings, interesting reads, community takeaways,
  and everything else along the way.

  Look here for updates about [DVC](https://dvc.org), our journey as a startup,
  projects by our users and big ideas about best practices in ML and data
  science.
picture: 2020-05-14/May_20_Heartbeat.png
pictureComment: A big hello from DVC mascot DeeVee.
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/dvc-heartbeat-may-20/391
tags:
  - Heartbeat
  - Plots
  - MLOps
  - Meetup
  - Google Season of Docs
  - Ambassador
---

Welcome to the May Heartbeat, our [monthly roundup of cool happenings](#news),
[new releases](#new-releases), [good reads](#from-the-community) and other
noteworthy developments the DVC community.

## News

**DVC turns 3.** On May 4th, we celebrated DVC's third birthday! Fearless leader
Dmitry Petrov
[wrote a retrospective](https://dvc.org/blog/dvc-3-years-and-1-0-release) about
how the team has grown and what we've learned from our users, contributors, and
colleagues. Thanks to everyone who celebrated with us!

**Ambassador program launched.** DVC has just kicked off our ambassador program
with the help of our first ambassador,
[Marcel Ribeiro-Dantas](https://twitter.com/messages/40813700-894970070358564864).
Marcel is an early-stage researcher at the Institut Curie, a veteran
[ambassador of the Fedora Project](https://fedoraproject.org/wiki/User:Mribeirodantas),
and a [data science blogger](http://mribeirodantas.me/). Becoming an ambassador
is a way for folks who are passionate about contributing to the DVC community to
get recognized for their efforts. It's also a way for us to help volunteers with
financial support for meetups and travel, as well as chances to work more
closely with our team. The program is ideal for anyone who already likes
blogging about DVC, contributing code, and hosting get-togethers (virtual or
otherwise), but especially advanced students and early career data scientists
and engineers!
[Learn more about it here.](https://dvc.org/blog/dvc-ambassador-program-announcement)

**DVC is part of 2020 Google Season of Docs.** Another way to get involved with
DVC is through
[Google Season of Docs](https://developers.google.com/season-of-docs), a program
we're participating in for the second year in a row. This program is for
technical writers to get paid experience working with the DVC team in fall 2020.
Right now, we're accepting proposals from interested writers.
[Find out more here.](https://dvc.org/blog/gsod-ideas-2020)

**5000 GitHub Stars.** It finally happened- we passed 5,000 stars
[on our GitHub repo!](https://github.com/iterative/dvc)

https://media.giphy.com/media/igWE67cPgTrWwXq4Nz/giphy.gif

## New releases

Coincident with DVC's 3rd birthday, we shared a pre-release of DVC 1.0. The
release is expected in a few weeks, but you can experiment with 1.0 now (and
make [tickets in our project repo](https://github.com/iterative/dvc) if you get
a bug 🐛). Some major new features include:

- **Run cache**, a cache of pipelines you've reproduced on your local workspace.
  If you re-run `dvc repro` on a pipeline version that's already been executed,
  run cache will save you compute time by returning the cached result.

- **Multi-stage DVC files**. Users reported that their DVC pipelines changed a
  lot, so we've made pipeline `.dvc` files more human-readable and editable for
  fast redesigns.

- **Plots** We've got plots powered by
  [Vega-Lite](https://vega.github.io/vega-lite/) for making beautiful
  vizualizations comparing model performance across commits! Developer Paweł
  Redzyński is hard at work:

https://twitter.com/Paffciu1/status/1260119918525194241

You can read more about the big updates coming in DVC 1.0
[in our birthday blog](https://dvc.org/blog/dvc-3-years-and-1-0-release#dvc-10-is-the-result-of-3-years-of-learning).

## From the community

Developers weren't the only ones hustling this month...

**First ever virtual DVC Meetup.** Marcel, our new ambassador, lead an
initiative to
[organize a virtual meetup](https://tulu.la/events/dvc-virtual-meetup-2020-00032c)!
Marcel shared his latest scientific work about creating a
[new comprehensive dataset about mobility](https://www.sciencedirect.com/science/article/pii/S2352340920305928?via%3Dihub)
during the COVID-19 pandemic and then passed off the mic to our two guest
speakers. Data scientist [Elizabeth Hutton](https://github.com/ehutt) spoke how
she was building a workflow for her NLP team with DVC, and
[DAGsHub](https://dagshub.com/) co-founder
[Dean Pleban](https://twitter.com/DeanPlbn) shared his custom remote file system
setup for modeling Reddit post popularity. It was quite well-attended for our
first ever virtual hangout: we logged 40 individual logins to the meetup with
more than 30 people staying the whole time! A video of the meetup is
[on the event page](https://tulu.la/events/dvc-virtual-meetup-2020-00032c), so
you can still check out the talks and discussion we enjoyed.

https://twitter.com/DeanPlbn/status/1258475031530790916

**Some blogs we like.** As usual, there's a lot of share-worthy writing in the
data science and MLOps space:

- [Tania Allard](https://twitter.com/ixek) wrote an intensely readable,
  extremely sharp guide to practical steps anyone can take to improve the
  reproducibility of their ML projects. She really nails the complexity of the
  workflow and the importance of decoupling code and data (which we obviously
  agree with very much 😏). The graphics are also 💯- Tania is a developer
  advocate to follow.

<external-link
href="https://dev.to/azure/10-top-tips-for-reproducible-machine-learning-36g0"
title="10 top tips for reproducible Machine Learning"
description="The one where you get some advice to make your workflows more reproducible"
link="dev.to"
image="/uploads/images/2020-05-14/dev_logo.png"/>

- [Vimarsh Karbhari](https://medium.com/@vimarshk) blogged about how teams that
  work with data can strategize better about versioning their data and analysis
  pipelines. On the opposite end of giving very practical recommendations,
  Vimarsh stresses a deliberate and caeful approach. He emphasizes how the
  team's choices should depend on factors like project maturity and how much
  flexibility is going to be needed. It's a solid overview of how to begin
  thinking about MLOps at a high level.

<external-link
href="https://medium.com/acing-ai/ml-ops-data-science-version-control-5935c49d1b76"
title="ML Ops: Data Science Version Control"
description="Data versioning primer for model, data and code."
link="medium.com"
image="/uploads/images/2020-05-14/acing_ai.png"/>

- Over at [AutoRegresed](https://www.autoregressed.com/), Jack Pitts shared a
  thorough tutorial about using [Pipenv](https://pypi.org/project/pipenv/), DVC
  and Git together. As a trio, this manages dependencies and versions the
  working environment, source code, dataset _and_ trained models. It's not only
  a cool use case, but a very clear step-by-step explanation that should be easy
  to try at home. Stay till the end for a neat trick about deploying a model as
  a web service with Pipenv and DVC.

<external-link
href="https://www.autoregressed.com/blog/pipenv-and-dvc-reproducibility-in-data-science"
title="Pipenv and DVC: Reproducibility in Data Science"
description="Without standards and tools to easily reproduce models, Data Science teams can become bogged down in technical debt that will make it difficult to deploy and iterate on models. "
link="autoregressed.com"
image="/uploads/images/2020-05-14/ar_logo.jpg"/>

## Nice tweets

Last, here are some of our favorite tweets to read this past month:

https://twitter.com/braaannigan/status/1257918525345234949

https://twitter.com/josh_wills/status/1249774857614553097

https://twitter.com/tcgarvin/status/1258855168436813826

_Thank you, thank you very much._

https://media.giphy.com/media/gJ2sDSKAQHUCIYUFhx/giphy.gif

As always, we want to hear what you're making with DVC and what you're reading.
Tell us in the blog comments, and be in touch on
[Twitter](https://twitter.com/DVCorg) and
[Discord channel](https://dvc.org/chat). Happy coding!
