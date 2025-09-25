---
title: September '22 Heartbeat
date: 2022-09-19
description: >
  Monthly updates are here! Food for thought on Meta's Wikipedia fact checker
  and the EU AI Act, creating an artifact registry with GTO, MLOps course
  materials from DTU, a new O'Reilly course, and more! Welcome to September!

descriptionLong: |
  This month you will find:

    🤔 Meta to fact-check Wikipedia,

    🇪🇺 EU AI Act,
    
    ® Creating an artifact registry with GTO,

    🎓 MLOps Course at the DTU

    😆 xkcd comics

    🐶 Our new dog-fooding policy

    ✨ O'Reilly Course,

    🚀 New hires, and more!
picture: 2022-09-19/september-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/september-22-heartbeat/1336
tags:
  - Heartbeat
  - DVC
  - CML
  - MLEM
  - GTO
  - TechCrunch
  - EU AI Act
  - Meta
  - Wikipedia
  - Replicability crisis
  - O'Reilly
  - Technical University of Denmark
  - xkcd
---

<details>

This month’s image inspiration is community member
[**Sami Jawhar**](https://www.linkedin.com/in/sami-jawhar-a58b9849/). Sami has
contributed to DVC in the past and most recently to the DVC and CML teams with
regard to extending our remote experimenting features to include running
experiments in parallel, which you can check out
[here](https://github.com/iterative/dvc/commit/c7d63e8c59819592d2a749ab721fe5c85379fece)
and
[here]([https://github.com/iterative/terraform-provider-iterative/compare/master...sjawhar:terraform-provider-iterative:feature/nfs-volume](https://github.com/iterative/terraform-provider-iterative/compare/master...sjawhar:terraform-provider-iterative:feature/nfs-volume).
Look out for him speaking at a Meetup soon on this topic!

Last year Sami presented at one of our
[Office Hours meetups](https://www.youtube.com/watch?v=DxZdWq3Weng) on “What is
an experiment?” More specifically he asked, at what level of granularity do you
experiment and when do you share with your team? He shared great ideas, tips,
and code in the session and spurred a great discussion with other community
members. We look forward to the next Meetup!

<summary>✨Image Inspo✨</summary>
</details>

<details>
Our Community has grown and so has the monthly Heartbeat! To help you better navigate to the content you desire, use the following ToC:

# Table of contents

1. [From Greater AI/ML Community](#from-greater-aiml-community)
   1. [Meta Is Building an AI to Fact-Check Wikipedia](#meta-is-building-an-ai-to-fact-check-wikipediaall-65-million-articles)
   2. [EU AI Act](#european-ai-act)
   3. [💗Pulse Check](#pulse-check)
2. [Iterative Community News](#iterative-community-news)
   1. [Story of GTO-based model registry](#francesco-calcavecchia---we-refused-to-use-a-hammer-on-a-screw-story-of-gto-based-model-registry)
   2. [MLOps Course at University of Denmark](#mlops-course-at-the-technical-university-of-denmark-includes-dvc-and-cml)
   3. [Made With ML MLOps Interactive Course](#goku-mohandas---made-with-ml-mlops-interactive-course)
   4. [Lakera Review of DVC (video)](#adrià-romero---youtube-review-of-dvc)
   5. [Reproducibility, Replicability, and Data Science](#sydney-firmin---reproducibility-replicability-and-data-science)
   6. [Iterative xkcd lore](#iterative-xkcd-lore)
3. [Company News](#company-news)
   1. [We are eating our own dog food](#mlem-mlem-mlem-this-dog-food-is-good)
   2. [New O'Reilly Course with Alex Kim](#alex-kim-oreilley-mlops-course)
   3. [LATAM AI](#latam-ai)
   4. [New Hires](#new-hires)
   5. [Open Positions](#open-positions)
   6. [New Blog posts](#new-blog-posts)
   7. [Upcoming Conferences](#upcoming-conferences)
4. [Tweet Love](#tweet-love)

<summary>Table of Contents</summary>
</details>

As the summer fades and we get revved up to finish off the year, we start the
September Heartbeat with some juicy food for thought AI topics.

![Will Ferrell Lol GIF by NBA](https://media.giphy.com/media/kPtv3UIPrv36cjxqLs/giphy.gif)

## From Greater AI/ML Community

### Meta Is Building an AI to Fact-Check Wikipedia—All 6.5 Million Articles

![Meta Fact-Checking Wikipedia](../uploads/images/2022-09-19/wikipedia.png 'Meta Fact-checking Wikipedia Ai :wrap-left =300')
[**Vanessa Bates Ramirez**](http://twitter.com/vanessabramirez) writes
[an article](https://singularityhub.com/2022/08/26/meta-is-building-an-ai-to-fact-check-wikipedia-all-6-5-million-articles/)
in [Singularity Hub](https://singularityhub.com) about Meta's plans to
fact-check Wikipedia. Under the premise of making Wikipedia more accurate,
[Meta](https://about.facebook.com/?utm_source=meta.com&utm_medium=redirect), in
conjunction with [Amazon Alexa.AI](https://www.amazon.science/tag/alexa) and
[some University contributors](https://openreview.net/pdf?id=qfTqRtkDbWZ) is
building an AI system trained on 4 million Wikipedia citations. The system
architecture made up of retrieval and verification engines, cross references not
only content, but specific figures to verify accuracy.

They’ve built an index of web pages that are chunked into passages and then
provide an accurate representation of the passage to train the model. Their aim
is to more accurately capture meaning as opposed to word pattern. From
[**Fabio Petroni**](https://twitter.com/Fabio_Petroni), Meta’s Fundamental AI
Research tech lead manager:

> [This index] is not representing word-by-word the passage, but the meaning of
> the passage. That means that two chunks of text with similar meaning will be
> represented in a very close position in the resulting n-dimensional space
> where all these passages are stored.

They hope to ultimately be able to suggest accurate sources and create a grading
system on accuracy.
[You can find a demo of the project, named Side, here](https://verifier.sideeditor.com/)
to look at samples and go deeper into the research. They are looking for people
to give feedback on the quality of the system.

Vanessa brings up some great questions regarding this:

> If you imagine a not-too-distant future where everything you read on Wikipedia
> is accurate and reliable, wouldn’t that make doing any sort of research a bit
> too easy? There’s something valuable about checking and comparing various
> sources ourselves, is there not? It was a big leap to go from paging through
> heavy books to typing a few words into a search engine and hitting “Enter”; do
> we really want Wikipedia to move from a research jumping-off point to a
> gets-the-last-word source?

To these I’d add, what’s Meta’s/Amazon Alexa's monetary motivation to do this
(because there always is one), and given past ethical infractions on Meta's part
( [1,](https://link.springer.com/article/10.1007/s43681-021-00068-x)
[2,](https://www.abc.net.au/triplej/programs/hack/facebook-whistleblower-says-instagram-content-hurts-teens/13573020)
[3,](https://www.theguardian.com/news/2018/mar/17/cambridge-analytica-facebook-influence-us-election)
[4,](https://www.buzzfeednews.com/article/craigsilverman/viral-fake-election-news-outperformed-real-news-on-facebook)
and
[5,](https://www.theatlantic.com/technology/archive/2014/06/everything-we-know-about-facebooks-secret-mood-manipulation-experiment/373648/))
should we applaud this? Or is this collaboration with Universities a step in the
right direction?

### European AI Act

![EU AI Act](../uploads/images/2022-09-19/eu.jpg 'EU AI Act :wrap-rightt =300')
[**Kyle Wiggers**](https://twitter.com/Kyle_L_Wiggers) reports on the EU's AI
Act and its potential ill effects on open source efforts in
[this piece](https://techcrunch.com/2022/09/06/the-eus-ai-act-could-have-a-chilling-effect-on-open-source-efforts-experts-warn/)
in [TechCrunch](https://techcrunch.com). The proposed new rules would require
that open source developers adhere to guidelines across a spectrum of categories
including risk management, data governance, technical documentation and
transparency, standards and accuracy, and cyber security. Not a negligible list.

The article covers critiques of the Act from
[**Alex Engler**](https://www.brookings.edu/experts/alex-engler/) of think tank
[Brookings](https://brookings.edu) through
[this piece.](https://www.brookings.edu/blog/techtank/2022/08/24/the-eus-attempt-to-regulate-open-source-ai-is-counterproductive/)
While [**Oren Etzioni**](https://twitter.com/etzioni), the founding CEO of the
[Allen Institute for AI](https://allenai.org/) adds that such regulation could
create an undue burden where only large tech companies could comply:

> “Open source developers should not be subject to the same burden as those
> developing commercial software. It should always be the case that free
> software can be provided ‘as is’ — consider the case of a single student
> developing an AI capability; they cannot afford to comply with EU regulations
> and may be forced not to distribute their software, thereby having a chilling
> effect on academic progress and on reproducibility of scientific results.”

The article discusses some proponents to the Act, as well as alternative thought
processes on the granularity of regulations (product vs. category, or downstream
responsibility). Finally, it ends with some thoughts from Hugging Face CEO,
[**Clément Delangue**](https://twitter.com/ClementDelangue) and his colleagues'
comments on the vagueness and the problems that can arise out of this lack of
clarity, including stifling competition and innovation. They also point out the
growing Responsible AI initiatives such as AI licensing and model cards
outlining the intended use of such open source technology as positives that are
community-born.

So does regulation stifle technology or provide guard rails?

My colleague [**Rob de Wit**](https://www.linkedin.com/in/rcdewit/) would like
to point out that similar concerns were raised when the EU introduced the GDPR
in 2016, which has turned out to be of major importance to people's rights to
privacy -- in the EU and worldwide.

To what degree should AI technology be regulated? Where do you draw lines? It’s
quite clear that it moves faster than lawmakers can keep up with and the
potential for harm is well known at this point. We could say, as I believe, that
reflection on the consequences should be baked into the building process.
However, the reality in practice is that --despite best intentions-- the
overarching push for better and faster often results in negative consequences
that are only discovered after the fact.

How do we incentivize reflecting on consequences in our processes? Would
regulation force this? Make development slower, but necessarily force the social
good work that must be done in the development of AI tech?

What other industries have similar dilemmas and how do they handle it? The
Hippocratic Oath has served medicine well for thousands of years.  
[Do We Need a Hippocratic Oath for Artificial Intelligence Scientists?](https://ojs.aaai.org/index.php/aimagazine/article/view/15090)

### Pulse Check

We would love to hear (read) your thoughts on this! We are starting a “Pulse
check” topic from the Heartbeat each month up for discussion in our Discord
server in the General channel.
[Come join the discussion!](https://discord.com/invite/dvwXA2N)

![Heartbeat GIF](https://media.giphy.com/media/W5JywCYOCSP8VMiVZg/giphy.gif)

## Iterative Community News

### **Francesco Calcavecchia** - We refused to use a hammer on a screw: Story of GTO-based model registry

[**Francesco Calcavecchia**](https://www.linkedin.com/in/francescocalcavecchia/)
[wrote a piece](https://medium.com/@francesco.calcavecchia/we-refused-to-use-a-hammer-on-a-screw-story-of-a-gto-based-model-registry-c540ac5d129f)
in [Medium](https://medium.com) about building a custom model registry with
[GTO](https://github.com/iterative/gto).

He acknowledges the main reasons for needing a model registry as:

1. When you need model versioning
2. When you need to promote or assign models to different stages
3. When you need to establish production model governance

Additionally, he finds registering the data analysis and model evaluation
outputs into an artifact registry is necessary, and as such used GTO and DVC to
accomplish this. He goes into more detail about why he chose GTO over MLFlow -
essentially appreciating our UNIX philosophy that empowers agility over
prescriptive methods that hamper your design choices. He notes:

> **It is hard to think of something simpler than this. And simplicity is
> beauty** ❤️

He then discusses some things he found missing for his needs, such as using it
in a production pipeline as opposed to committing models by hand. He discusses
working on solutions to build the artifact registry, introduce new commands, and
streamline the process for the `dvc push` remote storage secret requirements.
Please join him in his contributions. We love to see where this is going! 🚀

![DVC GTO Artifact Registry schematic](../uploads/images/2022-09-19/artifact-gto.jpeg '=800')
_Francesco Calcavecchia's schematic for a proposed artifact registry with DVC
and GTO
([Source link](https://medium.com/@francesco.calcavecchia/we-refused-to-use-a-hammer-on-a-screw-story-of-a-gto-based-model-registry-c540ac5d129f))_

### MLOps Course at the Technical University of Denmark includes DVC and CML

![DTU MLOps Course Memes](../uploads/images/2022-09-19/dtu-mlops.jpeg 'DTU MLOps Course Meme :wrap-left =300')
The [Technical University of Denmark (DTU)](https://www.dtu.dk/english) has
included DVC and CML in its MLOps Course at the University. The lectures,
slides, exercises, and code can be found in
[this repo](https://github.com/SkafteNicki/dtu_mlops) from
[**Nicki Skafte Detlefsen**](https://github.com/SkafteNicki), Postdoc in the
section of Cognitive Systems at the University with a focus on generative models
and geometrical deep learning. There are 10 sections covering:

1. Getting started
2. Organization and version control (find Git and DVC here)
3. Reproducibility
4. Debugging and logging
5. Continuous X (find CML here)
6. The Cloud
7. Scalable applications
8. Deployment
9. Monitoring
10. Extra Resources

The materials are great and even include some funny memes. Isn't an open-source
model amazing for learning? Cheers to DTU for including our tools and the open
source sharing of these learning materials with the world!

![DTU bad code comic](../uploads/images/2022-09-19/dtu-bad-code.jpeg '=800')
_Good code review vs. Bad code review
([Source link](https://github.com/SkafteNicki/dtu_mlops/blob/main/s2_organisation_and_version_control/S2.md))_

### **Goku Mohandas** - Made With ML MLOps Interactive Course

You likely already know of [**Goku Mohandas'**](https://github.com/GokuMohandas)
wildly popular free course [Made with ML](https://madewithml.com/#mlops), which
includes DVC. Knowing that it can be challenging to learn everything on your
own, he is starting an interactive class beginning on October 1st. The deadline
for application is September 25th.  
[For more info find the details here.](https://madewithml.com/#interactive-course)

![Goku Mohandas - Made with ML MLOps](../uploads/images/2022-09-19/made-with-ml.png '=800')
_Goku Mohandas' Made with ML Interactive Course
([Source link](https://madewithml.com/#mlops))_

### **Adrià Romero** - YouTube review of DVC

[**Adrià Romero**](https://www.linkedin.com/in/adriaromero/), Computer Vision
Developer at [Lakera](https://www.lakera.ai/), has a regular tool review on
tools that can make computer vision easier, and recently reviewed DVC. He does a
demo of DVC pushing up to a Google Drive remote and goes over how to share
DVC-tracked data. He then covers the data pipelines functionality that can be
used for CI/CD pipelines and shows the benefits of tracking the versions of
everything including data, models, pipelines, parameters, and experiments.
Finally, he mentioned that our documentation is super clear and useful, which
makes us very happy. 🦉Check out the review below.

https://www.youtube.com/watch?v=DXlxr4sEnc0

### **Sydney Firmin** - Reproducibility, Replicability, and Data Science

![Sydney Firmin - Reproducibility, Replicability, and Data Science](../uploads/images/2022-09-19/the_difference.png ' :wrap-right =300')

[**Sydney Firmin**](https://www.linkedin.com/in/sydney-f-4369a65b/) writes
[a wonderful piece](https://www.kdnuggets.com/2019/11/reproducibility-replicability-data-science.html)
in KD Nuggets outlining the replicability crisis, the importance of
reproducibility in science in general and data science in particular. She
highlights the growing awareness of irreproducible research due to technology's
help to make all research better circulated. She encourages standardizing a
paradigm of reproducibility in data science work to promote efficiency,
accuracy, and to help your future self and colleagues check work and reduce
bugs.

Of course, she recommends DVC as a possible tool to help with this and notes,

> fun fact, this is my second attempt at writing this post after my computer was
> [bricked](<https://en.wikipedia.org/wiki/Brick_(electronics)>) last week. I am
> now compulsively saving all of my work
> in [the cloud](https://www.vox.com/2015/4/30/11562024/too-embarrassed-to-ask-what-is-the-cloud-and-how-does-it-work).

Haven’t we all been there? 🙋🏻‍♀️ She goes on to describe other contributors to
irreproducible results including p-hacking and discusses other methods in
addition to tooling that can help, such as preventing overfitting and using a
sufficiently large dataset, and team review. All this and some fun xkcd comics
can be found in the post including [this one shown above](https://xkcd.com/242)!

<details>

Speaking of xkcd comics,
[**Casper da Costa Luis**](https://github.com/casperdcl), CML Product Manger,
loves xkcd and regularly regales us with the comics in our internal Slack. He is
also an expert at TL;DRing (yes, I just made that a verb). Part of his process
in this excellence is to
“[suppress my latent desire to add a relevant xkcd comic](https://tldr.cdcl.ml).”
As you can see, they do not appear every day. Self-discipline is a good thing.

![Casper da Costa Luis and xkcd comics](../uploads/images/2022-09-19/casper-xkcd.png '=800')
_Casper da Costa Luis' propensity for Slack slinging xkcd comics_

<summary id="iterative-xkcd-lore">😄 Iterative xkcd Lore</summary>
</details>

## Company News

![Happy Dog Food GIF by Diamond Pet Foods](https://media.giphy.com/media/ji6BdEco3I29DTXddx/giphy-downsized-large.gif)

### MLEM, MLEM, MLEM, this dog food is good!

So over the summer, you may have noticed that our blog has moved from the
[DVC](https://dvc.org) website to the [Iterative](https://iterative.ai) website.
This is because as we now have many more tools than DVC, we wanted to make a
blog home for them all. In this transition, we have also changed our internal
blog writing process from being just Git-dependent to Git- and DVC- dependent,
such that the writing is in Git, but the images are versioned with DVC and
stored in a remote. 🤗

This admittedly may be like bringing a
[CNC router](https://arclightcnc.com/product/cnc-router-kit) to a steak dinner
(I feel like there should be a Myth Busters episode on this). **But** it will
help both the DevRel team and the Websites team become intimately familiar with
what our users feel when using our tools and potentially drive more feature
improvements for you. In other words, we ❤️ you and we're really serious about
making our tools better for you so you don't have to build them yourselves!

![Ken Jeong Masked Singer GIF by FOX TV](https://media.giphy.com/media/wdA6Ql7ku32JZKXBFV/giphy.gif)

### **Alex Kim** O'Reilly MLOps Course

![Open-source MLOps in 4 weeks with Alex Kim](../uploads/images/2022-09-19/alex-oreilly.png 'Open Source MLOps in 4 weeks :wrap-left =300')
[**Alex Kim**](https://twitter.com/alex000kim) is working with
[O'Reilly](https://www.oreilly.com/) on a course entitled _Open-source MLOps in
4 weeks_. Here is an outline of what you will be learning in the course which
starts on November 8th and again on January 10th:

- Week 1: Kick-starting an ML project
- Week 2: ML pipelines and reproducibility
- Week 3: Serving ML models as web API services
- Week 4: CI/CD and monitoring for ML projects

[Head here to sign up for the course](https://learning.oreilly.com/live-events/open-source-mlops-in-4-weeks/0636920080215/0636920080214/)

### LATAM AI

[**Gema Parreño Piqueras**](https://twitter.com/SoyGema) and our lead docs
writer, [**Jorge Orpinel Perez**](https://twitter.com/JorgeOrpinel), got to
experience [LATAM AI](https://www.latam-ai.com/) this year. Gema gave the talk
_Reproducibility and version control are important: Follow-up experiments with
the DVC extension for VS Code_. Both Gema and Jorge enjoyed the conference and
meeting lots of people. Below you can see Gema with the winners of our DeeVee's
Ramen Run Game. In the game, players have to roam DeeVee city answering
questions to win Ramen and the highest place on the leaderboard. Get yourself to
one of the conferences we are attending to play! See winners Miguel Moran
Flores, Efren Bautista Linares and Rodofo Ferro below.

![Efren Bautista Linares, Miguel Moran Flores, Rodolfo Ferro with Gema Parreño](../uploads/images/2022-09-19/latam-ai-winners.jpg '=800')
_Winners of DeeVee's Ramen Run game with Gema, Left to Right: Efren Bautista
Linares, Miguel Moran Flores, Gema Parreño Piqueras, and Rodolfo Ferro_

### New Hires

[**Ronan Lamy**](https://www.linkedin.com/in/ronan-lamy-84133612/) joins the DVC
team from Bristol, UK. He has a Ph.D. in physics and had been working as an
open-source contractor as core dev of PyPy and HPy before joining Iterative.
When he's not working Ronan enjoys exploring the many fine restaurants and great
local beers of Bristol. Originally from France, Ronan recently shared with me
that his friends and family back home don't believe that the food can be so good
in Bristol, but he insists it is. Add it to your bucket list! When in Bristol,
Ronan has recommendations for you!

[**Aleksei Shaikhaleev**](https://github.com/nimdraugsael) joins the Studio team
as a backend developer. Originally from Russia, Aleksei has called Phuket,
Thailand his home base for the last 10 years. When he's not working, he's really
into surfing, skateboarding, motorcycles, and other fun activities like these.
Aleksei also has a heart for rescuing cats, having adopted and caring for five
stray cats at home!

[**David Tulga**](https://www.linkedin.com/in/david-tulga-60b29410/) is our
latest hire, and joins the LDB team from California as a Senior Software
Engineer. He previously worked at Asimov and Freenome. When not working David
enjoys a variety of outdoor activities such as Biking, Hiking, Kayaking,
Sailing, and Astronomy.

David's arrival marks the 4th David on the team, putting the name David in a
three-way tie with versions of Daniel and Alexander! Indeed over 20% of our
workforce is named David, Daniel, or Alexander. 😅

## Open Positions

[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the open positions. Please share with anyone looking to
have a lot of fun building the next generation of machine learning to production
tools! 🚀 But don't apply if your name is David, Daniel, or Alexander. Unless
you're willing to be nick-named, of course! It's getting confusing around here.
😂

![Iterative.ai is Hiring](../uploads/images/2022-09-19/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## ✍🏼 New Blog posts {#new-blog-posts}

- [**Rob de Wit**](https://www.linkedin.com/in/rcdewit/) created a tutorial for
  using CML with [Bitbucket](https://bitbucket.org/), which CML now supports. Be
  sure to read it if Bitbucket is your Git provider of choice!
- [**Gema Parreño Piqueras'**](https://twitter.com/SoyGema)
  [August Community Gems](https://dvc.org/blog/august-22-community-gems) is full
  of great questions from the Community from our
  [Discord server](https://discord.com/invite/dvwXA2N).

## Upcoming Conferences

Conferences we will be attending through the end of the year:

- [**Dmitry Petrov**](https://twitter.com/FullStackML) and
  [**Mike Sveshnikov**](https://github.com/mike0sv) will be giving a talk and
  workshop on our GitOps approach to a Model registry at
  [TWIML Con](https://twimlai.com/conf/twimlcon/2022/) on October 4-7 (On-line)
- [**Dmitry Petrov**](https://twitter.com/FullStackML) will speak at
  [ODSC West](https://odsc.com/california/) in San Francisco on November 1-3 on
  the same topic
- [**Rob de Wit**](https://www.linkedin.com/in/rcdewit/) will be speaking at
  [Deep Learning World](https://deeplearningworld.de/) - Berlin, October 5-6
  with the talk _Becoming a Pokémon Master with DVC: Experiment Pipelines for
  Deep Learning Projects_
- [**Casper da Costa Luis**](https://cdcl.ml/) will be giving the talk _Painless
  cloud orchestration without leaving your IDE_ at
  [MLOps Summit - Re-work](https://www.re-work.co/events/mlops-summit-2022) -
  London, November 8-9
- [**Dmitry Petrov**](https://twitter.com/FullStackML) will be speaking at
  [GitHub Universe](https://www.githubuniverse.com/) on November 9-10 with the
  talk _Connecting Machine Learning with Git: ML experiment tracking with
  Codespaces_!
- Finally, we will be participating in
  [Toronto Machine Learning Summit](https://www.torontomachinelearning.com/) -
  November 29-30 in Toronto, talks TBD

  ## ❤️ Tweet Love {#tweet-love}

  We loved finding DVC and CML used for benchmarking and reporting at
  [Huggingface](https://huggingface.co) thanks to the tip-off from
  [Omar Sanseviero](https://twitter.com/osanseviero)! Look out for more projects
  involving Hugginface and our tools coming soon!

https://twitter.com/SoyGema/status/1567824457296642048?s=20&t=7f4KT9cRzEhrcgXu3qQAlw

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
