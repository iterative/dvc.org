---
title: July '22 Heartbeat
date: 2022-07-18
description: >
  What a couple months it's been! This month you will find lots that's happening
  in IRL  conferences again and in case you missed it, we've had some new,
  exciting releases! In addtion you'll find a guide to migrate from Git-LFS to
  DVC, the first Community piece on MLEM, and demo videos. Welcome to July!

descriptionLong: |
  This month you will find:

    🎙 MLOps World,

    🚀 MLEM Release,

    🔥 DVC extension for VS Code,
    
    🥰 Guide to migrating from Git-LFS to DVC,

    ✍🏼 New Docs and Blog content,

    🚀 New demo videos, and more!
picture: 2022-07-18/july-heartbeat-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/july-22-heartbeat/1256
tags:
  - Heartbeat
  - DVC
  - MLEM
  - VS Code
  - MLOps World
  - Git
  - Git-LFS
  - MyMLOps.com
---

<details>

This month our cover image is inspired by a Community member
[Gift Ojebulu](https://twitter.com/GiftOjeabulu_). Gift is a champion of
Community and is a leader in the data movement in Nigeria. Recently he presented
about DVC at the
[Open Source Africa Conference](https://twitter.com/GiftOjeabulu_). He is also
extremely involved doing amazing work building the data Community in Africa
through [Data Fest Africa](https://datafestafrica.com/). We are lucky to have a
Gift as a member of our own Community.

<summary>✨Image Inspo✨</summary>
</details>

# First an apology

I first must share my sincere apologies. With all that was going on in the
Iterative Community last month, I ran out of time to finish the June Heartbeat.
With even more time passing there's lots to write about; let's do this!

![Send Tom Hanks GIF](https://media.giphy.com/media/CzbiCJTYOzHTW/giphy.gif)

## MLEM Release

On June 1st we released our latest open source tool in the Iterative ecosystem.
MLEM is a model registry and deployment tool connected to your Git repo.  
Together with [DVC](https://dvc.org) and [GTO](https://github.com/iterative/gto)
(Git Tag Ops), MLEM helps you maintain a model registry right in your git
repository. Now we have one more step in the process of fully syncing together
the software development and machine learning worlds. To learn more about MLEM,
visit [the website](https://mlem.ai),
[⭐️ the repository](https://github.com/iterative/mlem),
[read the blog post](https://dvc.org/blog/DVC-VS-Code-extension), or
[watch the video](https://youtu.be/a2Lc9kEgEM8) of
[**Mike Svehnikov's**](https://github.com/mike0sv) full presentation and demo on
MLEM at our Release Party.

https://youtu.be/a2Lc9kEgEM8

If pressed for time you can also catch a shorter version of the presentation
with [Alexey Grigorev](https://www.linkedin.com/in/agrigorev/) of
[Data Talks Club](https://datatalks.club/)
[here](https://www.youtube.com/watch?v=QQZUy0kSzOk).

## MLOps World 2022

I started writing this Heartbeat on the plane heading back from
[MLOps World](https://mlopsworld.com/) in Toronto. This conference was a real
treat! It was wonderful to meet so many Community members already using DVC and
also to see conference talks advocating for our tools that we didn't even know
were going to happen! Many thanks to [Interos'](https://www.interos.ai/)
[**Stephen Brown**](https://www.linkedin.com/in/stephanrb3/) and
[**Amy Bachir**](https://www.linkedin.com/in/amybachir/) for sharing about DVC
and CML in the talk, _A GitOps Approach to Machine Learning._

Additionally, it was great to finally meet in person all the people from the
greater MLOps Community that I'd previously only known virtually including
[**Demetrios Brinkman**](https://www.linkedin.com/in/dpbrinkm/) of
[MLOps Community Slack](https://mlops.community/), our friends from
[DAGsHub](https://dagshub.com/), and [Tryo-Labs](https://tryolabs.com/), and one
of our Community Champions
[**Sami Jawhar**](https://www.linkedin.com/in/sami-jawhar-a58b9849/) who
presented at one of our most engaging meetups on record, asking the question
_What IS an experiment?_ You can find this great talk below.

https://www.youtube.com/watch?v=DxZdWq3Weng&t=1309s

The conference talks were great. I was able to attend three:

- _Top 5 Lessons Learned in Helping Organizations Adopt MLOps practices_ from
  [**Shelbee Eigenbrode**](https://www.linkedin.com/in/shelbee-eigenbrode/),
  Principal AI/ML Specialist
- _Panel: What Every Product Manager Delivering AI Solutions Should Know_,
  moderated by
  [**Jessie Lamontagne**](https://www.linkedin.com/in/jessie-lamontagne-89b2a912b/)
  (who was lucky enough to take home her very own DeeVee, see below), Data
  Science Manager at Kinaxis; with
  [**Nahla Salem**](https://www.linkedin.com/in/nahlags/), Senior Product
  Manager at [Yelp](https://www.yelp.com/);
  [**Anneya Golob**](https://www.linkedin.com/in/anneya-golob/), Staff Data
  Scientist at [Shopify](https://www.shopify.com/), and
  [**Phillip Gorniki**](https://www.linkedin.com/in/phillipgornicki/), St.
  Product Manager at [Kinaxis](https://www.kinaxis.com/en). A particular quote
  that was a stand out for me from this panel from Nahla, was, "If everything is
  a priority, nothing is a priority." That was a lesson I needed to take to
  heart, hence a bumped Heartbeat. 😢

![Jessie Lamontagne](../uploads/images/2022-07-18/jessie-lamontagne.png '=800')
_Jessie Lamontagne of Kinaxis with DeeVee!
([Source link](https://www.linkedin.com/in/jessie-lamontagne-89b2a912b/))_

I heard great feedback from attendees on conference talks as well. In general,
the atmosphere at the conference had a fantastic, positive vibe with great
connections made through the event app, the conference itself, and parties and
networking opportunities 🥳🍻 We also thoroughly enjoyed being Expo Booth
neighbors with [Seldon](https://www.seldon.io/) (model serving) and
[Genesis Cloud](https://www.genesiscloud.com/) (environmentally sustainable
GPUs!) I must finally give hats off to the organizers
[**Faraz Thambi**](https://www.linkedin.com/in/farazthambi/) and
[**Tina Aprile**](https://www.linkedin.com/in/tinaaprile/), who delivered an
extremely well thought out and run, in-person Conference! If you didn't attend
this year, you should definitely put it on your radar for next, or attend their
[Toronto Machine Learning Summit](https://www.torontomachinelearning.com/) in
November! Plus Toronto was fun! Check out our team dinner the last night from
the CN Tower.

![Team Dinner at the CN Tower](../uploads/images/2022-07-18/team-toronto.jpeg '=800')
_Team dinner at the CN Tower - Pictured L to R: Gabriella Caraballo, Stephanie
Roy, Mike Moynihan, Jorge Orpinel Perez (forward), me, Mikhail Sveshnikov,
Milecia McGregor (forward), Max Aginsky, Alex Kim (forward), and Dmitry Petrov)_

## DVC Extension for VS Code

We just released our DVC extension for VS Code! It was so fun to let the cat out
of the bag to conference goers and watch their eyes light up! 😃 This was a
foreshadowing of events to come at the release! While it hadn't been completely
a secret since
[Paige Bailey's tweet](https://twitter.com/DynamicWebPaige/status/1430920240251035649)
about it a while ago and the fact that it's been on the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
for a couple of months so beta testers could try it out, we did finally,
officially release the tool June 12th.

And OH. MY. GOSH. The response has been amazing! Already over 3,400 people
watched the video below on YouTube. And 1000 more new users downloaded the
[DVC Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
from the marketplace, just within the first couple of days!

https://www.youtube.com/watch?v=LHi3SWGD9nc

You will find in this extension:

- tons of experiment tracking and table functionality over your regular CLI
- live metrics tracking
- the ability to run and queue experiments directly from the experiment table or
  the command tree
- sorting, drag and drop column and group movement
- expanded plot viewing capabilities - zoom into plots and save them as PNGs or
  SVGs for your reporting needs

If you are a DVC and VS Code user, you will be a happy camper! Please try it and
as always reach out with feedback! We want to make these tools better for you!

Since the release, [**Alex Kim**](https://twitter.com/alex000kim) talked with
[**Reynold Adolphe**](https://twitter.com/ReynaldAdolphe) on the VS Code
Livestream and showed off the tool. You can check that out here! 👇🏽

https://www.youtube.com/watch?v=Eq3100S3aHw

## Content from the Community

There's been lots of juicy content from the Community
[since the last Heartbeat](https://dvc.org/blog/may-22-heartbeat). When I first
started at Iterative over a year and a half ago, I would hope each month that
there would be enough content from the Community to write about. This is no
longer an issue; I sadly have to filter it now, so that these Heartbeats don't
go on for days. If you've written something about our tools and it hasn't
appeared in a Heartbeat, just know that we see it and we are grateful for all
the Community's efforts to share about our tools! 🙏🏼

### **Alex Strick van Linschoten** - More Data, More Problems: Using DVC to handle data versioning for a computer vision problem

[**Alex Strick van Linschoten**](https://www.linkedin.com/in/strickvl/) brings
us
[this great overview of DVC's versioning capabilities](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc)
on his use of DVC in a redaction identifier project. He goes through the pluses
of using DVC which he mentions as "be(ing) more or less unchallenged for what it
does in the data versioning domain." He had previously used Git LFS and found it
to be less robust so made the switch to DVC. In his post, he provides a
[tutorial on making the switch from Git LFS to DVC](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc:~:text=I%E2%80%99m%20missing%20out%E2%80%A6-,%F0%9F%8F%83%20Appendix%3A%20How%20to%20switch%20from%20git%2Dlfs%20to%20DVC,-When%20I%20first).
We are so grateful to Alex for sharing this guide with the Community!

Also super worthy of mention is Alex's shout-out about our welcoming Community.
We are thankful for this praise and for his contributions to our Community. 🙏🏼

![Iterative Community shout out from Alex Strick van Linshoten](../uploads/images/2022-07-18/alex-strick-van-linshoten.png '=800')
_Thanks for the shout-out Alex!
([Source link](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc))_

### MyMLOps Stack

[MyMLOps.com](https://mymlops.com/) provides a tool to help you build a cool
diagram for your MLOps Stack. There's no about page there or indication of who
made this for the greater MLOps Community, which is frankly a bit sus.
Nevertheless, we were excited to see DVC included in the section of Experiment
Tracking as it should! We know there are other great experiment tracking tools
out there, and we are content to see that the larger Community is starting to
recognize this capability with DVC! We like to think of it as taking a step
beyond tracking to versioning. To learn more about experiment versioning,
[visit this blog piece](https://dvc.org/blog/ml-experiment-versioning) from
Technical Product Manager - DVC,
[Dave Berenbaum](https://www.linkedin.com/in/david-berenbaum-20b6b424/).

Our team had an internal discussion about the absence of our tools from certain
categories, DVC and CML for artifact tracking, CML for Pipeline Orchestration
Runtime Engine, MLEM for Model Registry and Serving. But like everything in this
space, things are changing constantly. Thanks to whoever you are out there that
made this nifty tool!

![MyMLOps.com](../uploads/images/2022-07-18/mymlops.png '=800') _MLOps tool
stack diagram generator from MyMLOps.com ([Source link](https://mymlops.com/))_

### **Samson Zhang**: MLOps: How DVC smartly manages your data sets for training your machine learning models on top of Git

[**Samson Zhang**](https://www.linkedin.com/in/samson-zhang-887135115/) of
[LittleBigCode](www.littlebigcode.fr) writes an in-depth article in
[Medium](https://medium.com) on how DVC aptly manages large datasets. He
discusses why DVC is needed and how it is a better option compared to MLFlow
because MLflow does not optimize storage for file duplication like DVC does, as
well as Git-LFS for the same reasons mentioned by Alex Strick van Linschoten in
the piece mentioned above. Samson goes through a very thorough overview of the
tool, how it works and how to use it. He includes some best practices that he
has figured out while using the tool and goes over how to set up a dataset
registry which he finds particularly useful with DVC.

![Samson Zhang, DVC Workflow, Cache and Storage](../uploads/images/2022-07-18/samson-zhang.png '=800')
_DVC workflow, cache, and storage
([Source link](https://medium.com/hub-by-littlebigcode/mlops-how-dvc-smartly-manages-your-data-sets-for-training-your-machine-learning-models-on-top-of-b73857e54e52))_

### **Dror Atariah**: Getting to Know MLEM

![Awesome MLEM](../uploads/images/2022-07-18/awesome.png 'Getting to Know MLEM :wrap-left =100')
[**Dror Atariah**](https://www.linkedin.com/in/atariah/) is the first Community
member to write about MLEM! 🎉 In
[his piece](http://drorata.github.io/posts/2022/Jun/17/getting-to-know-mlem/) he
gives a review of the tool and starts with a general overview. Giving it a try
with the iris dataset, he ultimately builds a Docker image with MLEM to get
predictions from a trained model served by MLEM in an API. You can try out his
project [in this repo!](https://github.com/drorata/mlem-review)

### ✍🏼 New Docs

As you can imagine, with new tools come new docs! The docs and product teams
have been furiously busy making sure that you have the docs you need to try our
new tools. Of note please find:

- [MLEM Docs](https://mlem.ai/doc)
- [Machine Learning Model Registry](https://mlem.ai/doc/use-cases/model-registry)
  in [DVC.org docs](https://dvc.org/doc/use-cases/model-registry) as well as in
  the [MLEM docs](https://mlem.ai/doc/use-cases/model-registry)
- [VS Code docs and walkthrough](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)

## ✍🏼 Tons of new content on the blog

- [Moving Local Experiments to the Cloud with Terraform Provider Iterative (TPI) and Docker](https://dvc.org/blog/local-experiments-to-cloud-with-tpi-docker)

Have you ever or are you struggling with syncing data with one of the cloud
providers? We know that comes up a lot in the Discord server. So
[Milecia Mc Gregor](https://twitter.com/FlippedCoding) wrote three detailed
pieces to help you out.

- [Syncing Data to AWS S3](https://dvc.org/blog/aws-remotes-in-dvc)
- [Syncing Data to GCP](https://dvc.org/blog/using-gcp-remotes-in-dvc)
- [Syncing Data to Azure Blob Storage](https://dvc.org/blog/azure-remotes-in-dvc)  
  Whatever
  your flavor, she's got you covered. Look out for short videos covering the
  same topics this quarter.

Find more of your Discord questions answered in the latest editions of Community
Gems. 💎

- [May Community Gems](https://dvc.org/blog/may-22-community-gems)
- [June Community Gems](https://dvc.org/blog/june-22-community-gems)

## 🧑🏽‍💻 Online Course Updates

We have surpassed 1300 students in our
[Iterative Tools School!](https://learn.dvc.org) 🎉 We now have in place:

- Closed captions
- Course guides for each lesson. For some of these, you will find the video
  embedded into the lesson itself, but for the lessons that include code
  snippets, the guides are in PDF form so that you can copy and paste them to
  your heart's content! 😉

If you are in the course already or through social media you may have noticed
[Gema Perreño Piqueras'](https://twitter.com/SoyGema) amazing notes on the
modules she has created (see below). 🚨Spoiler alert: Gema's joining the DevRel
team next week! So look forward to more great content from her.

![Gema Perreño Piqueeras' Course Notes](../uploads/images/2022-07-18/gema-course-notes.jpeg '=800')
_Gema Perreño Piqueras' Course Notes
([Source link](https://twitter.com/SoyGema/status/1543210842749079554?s=20&t=DMCw3cN8rFbwlD1hD_rotA))_

## Upcoming Events

We'll be at [AI4](https://ai4.io/) from August 16-18.  
[Dmitry Petrov](https://twitter.com/fullstackml?lang=en) will give a talk as
well as participate in a panel discussion on MLOps. If you are attending, stop
by the booth and say hi or check out one of the in-booth demos we will have on
our tools throughout the day.

Additional conferences we will be attending this year:

- [ODSC West](https://odsc.com/california/) in San Francisco
- [Deep Learning World](https://deeplearningworld.de/) - Berlin
- [MLOps Summit - Re-work](https://www.re-work.co/events/mlops-summit-2022) -
  London
- [Toronto Machine Learning Summit](https://www.torontomachinelearning.com/)-
  Toronto

## Open Positions

[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the open positions. This month we are especially seeking
a fit for the Senior Software Engineer (Dataset Label Management, Python) role,
so if that fits you or someone else you know, get applying! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-07-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

Because I missed a month, there's just going to have to be two...

We were excited to see this project come up from
[Chansung](https://twitter.com/algo_diver) using DVC, Iterative Studio,
Huggingface and Jarvis Labs AI.  
Looking forward to seeing how it develops! 🍿

https://twitter.com/algo_diver/status/1530455733837647873?s=20&t=Z5bCod_oPf6VqHST6vbVBw

And we have this great Tweet thread from
[Leon Menkreo](https://twitter.com/LeonMenkreo) about how he's taken back
control of his data, models, and predictions with DVC!

https://twitter.com/LeonMenkreo/status/1545410381677531136?s=20&t=d1VGraE1PnkYaCdWQcylaQ

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
