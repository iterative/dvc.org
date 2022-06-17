---
title: June '22 Heartbeat
date: 2022-06-17
description: >
  What a month its been! This month you will find lots that's happening in
  IRL  conferences again and in case you missed it, we've had some new, exciting
  releases! In addtion you'll find a guide to migrate from Git-LFS to DVC, ,
  Welcome to June!

descriptionLong: |
  This month you will find:

    🎙 MLOps World,

    🚀 MLEM Release,

    🔥 DVC extension for VS Code
    
    🥰 Guide to migrate from Git-LFS to DVC

    🚀 Spotify MLOps playlist addition, and more!
picture: 2022-06-17/june-heartbeat-cover.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/june-2022-heartbeat/1215
tags:
  - Heartbeat
  - DVC
  - MLEM
  - VS Code
  - MLOps World
  - Git
  - Git-LFS
---

<details>

This month our cover image is inspired by a Community member
[Gift Ojebulu](https://twitter.com/GiftOjeabulu_). Gift is a champion of
Community and is a leader in the data movement in Nigeria. Recently he presented
about DVC at the
[Open Source Africa Conference](https://twitter.com/GiftOjeabulu_). He is also
extremely involved doing amazing work building the data science Community in
Africa through [Data Fest Africa](https://datafestafrica.com/). We are lucky to
have a Gift as a member of our own Community.

<summary>✨Image Inspo✨</summary>
</details>

# What's New in the Community

It has been quite a month since the last 💗 Heartbeat! I've got lots to write
about; let's do this!

[giphy - tom hanks typing from you've got mail]

## MLEM Release

May 31st we released our latest open source tool in the Iterative ecosytem:
MLEM. MLEM is a model registry and deployment tool connected to your git repo.  
Together with [DVC](https://dvc.org) and [GTO](https://github.com/iterative/gto)
(Git Tag Ops). MLEM helps you maintain a model registry right in your git
repository. Now we have one more step in the process to fully syncing together
the software development and machine learning worlds. To learn more about MLEM,
visit [the website](https://mlem.ai),
[⭐️ the repository](https://github.com/iterative/mlem), or
[watch the video](https://youtu.be/a2Lc9kEgEM8) of
[**Mike Svehnikov's**](https://github.com/mike0sv) full presentation on MLEM at
our Release Party.

https://youtu.be/a2Lc9kEgEM8

If pressed for time you can also catch a shorter version of the presentation
with [Alexey Grigorev](https://www.linkedin.com/in/agrigorev/) of
[Data Talks Club](https://datatalks.club/)
[here](https://www.youtube.com/watch?v=QQZUy0kSzOk).

## MLOps World 2022

I'm writing this Heartbeat on the plane heading back from
[MLOps World](https://mlopsworld.com/) in Toronto. This conference was a real
treat! It was wonderful to meet so many Community members already using DVC and
also to see conference talks advocating for our tools that we didn't even know
were going happen! Many thanks to
[**Stephen Brown**](https://www.linkedin.com/in/stephanrb3/) and
[**Amy Bachir**](https://www.linkedin.com/in/amybachir/) from
[Interos](https://www.interos.ai/) for sharing about DVC and CML witht he talk
_A GitOps Approach to Machine Learning._

Additionally it was great to finally meet in person all the people from the
greater MLOps Community that I'd previously only known virtually including
[Demetrios Brinkman](https://www.linkedin.com/in/dpbrinkm/) of
[MLOps Community Slack](https://mlops.community/), our friends from
[DAGsHub](https://dagshub.com/), and [Tryo-Labs](https://tryolabs.com/) and one
of our Community Champions
[Sami Jawhar](https://www.linkedin.com/in/sami-jawhar-a58b9849/) who presented
at one of our most engaging meetups on record, asking the question _What IS an
experiment?_ You can find this great talk below.

https://www.youtube.com/watch?v=DxZdWq3Weng&t=1309s

The conference talks were great. I was able to attend three

- Top 5 Lessons Learned in Helping Organizations Adopt MLOps practices from
  [Shelbee Eigenbrode](https://www.linkedin.com/in/shelbee-eigenbrode/),
  Principal AI/ML Specialist
- Panel: What Every Product Manager Delivering AI Solutions Should Know,
  moderated by
  [Jessie Lamontagne](https://www.linkedin.com/in/jessie-lamontagne-89b2a912b/)
  (who was lucky enough to take home her very own DeeVee, see below), Data
  Science Manager at Kinaxis; with
  [Nahla Salem](https://www.linkedin.com/in/nahlags/), Senior Product Manager at
  [Yelp](https://www.yelp.com/); [Anneya Golub](), Staff Data Scientist at
  [Shopify](https://www.shopify.com/), and [Phillip Gorniki](), St. Product
  Manager at [Kinaxis](https://www.kinaxis.com/en).
- I heard great feedback from attendees on conference talks as well. In general
  the atmospere at the conference had a fantastic, positive vibe with great
  connections made through the event app, the conference itself and parties and
  networking opportunites 🥳🍻 We also thoroughly enjoyed being Expo Booth
  neighbor with [Seldon](https://www.seldon.io/) (model serving) and
  [Genesis Cloud](https://www.genesiscloud.com/) (environmentally sustainable
  GPUs!) I must finally give hats off to the organizers
  [Faraz Thambi](https://www.linkedin.com/in/farazthambi/) and
  [Tina Aprile](https://www.linkedin.com/in/tinaaprile/), who delivered an
  extremely well thought out and run in person Conference! If you didn't attend
  this year, you should definitely put it on your radar for next! Plus Toronto
  was fun! Checkout our team dinner the last night from the CN Tower

![Team Dinner at the CN Tower](/uploads/images/2022-06-17/team-toronto.jpg '=800')
_Team dinner at the CN Tower - Pictured L to R: Gabriella Caraballo, Stephanie
Roy, Mike Moynihan, Jorge Orpinel Perez (forward), me, Mikhail Sveshnikov,
Milecia McGregor (forward), Max Aginsky, Alex Kim (forward) and Dmitry Petrov)_

<details>

Here's a little hack I worked out on the plane if you find yourself with an
outlet with this design on the the plane. I don't have a hack for typing like a
Tyranosaurus Rex sitting in the middle seat or my lap burning up, still working
on that.

![Travel Charging Hack](/uploads/images/2022-06-17/travel-hack.jpg '=800') _Use
the tray table to support the weight of the brick and keep it plugged in)_

<summary>Travel hack</summary>
</details>

## DVC Extension for VS Code

We just released our DVC extension for VS Code! (I'm in full Christopher Nolan
mode writing about something that hasn't happened yet.) It was so fun to let the
cat out of the bag to conference goers and watch their eyes light up! 😃 While
it hasn't been completely a secret since
[Paige Bailey's tweet](https://twitter.com/DynamicWebPaige/status/1430920240251035649)
about it a while ago and the fact that it's been on the
[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)
for a couple of month's so beta testers could try it out, we did finally,
officially release the tool this week.

https://www.youtube.com/watch?v=LHi3SWGD9nc

You will find in this extension:

- the ability to run and queue experiments directly from the experiment table or
  the command tree
- expanded experiment table functionality over your regular CLI, including
- sorting, drag and drop column and group movement
- expanded plot viewing capabilities - zoom into plots and save them as PNGs or
  SVGs for your reportin needs

If you are a DVC and VS Code user, you will be a happy camper! Please try it and
as always reach out with feedback! We want to make these tools better for you!

## Content from the Community

### **Alex Strick van Linschoten** - More Data, More Problems: Using DVC to handle data versioning for a computer vision problem

[Alex Strick van Linschoten](https://www.linkedin.com/in/strickvl/) brings us
[this great overview of DVC's versioning capabilities](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc)
on his use of DVC in a redaction identifier project. He goes through the pluses
of using DVC which he mentions as "\*\*\*". His had previously used Git LFS and
found it to be less robust so made the swithch to DVC. In his post he provides a
[tutorial on making the switch from Git LFS to DVC](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc:~:text=I%E2%80%99m%20missing%20out%E2%80%A6-,%F0%9F%8F%83%20Appendix%3A%20How%20to%20switch%20from%20git%2Dlfs%20to%20DVC,-When%20I%20first).
We are so grateful to Alex for sharing this guide with the Community!

Also super worthy of mention, is Alex's shout out about our welcoming Community.
We are thankful for this praise and for his contributions to our Community. 🙏🏼

![Iterative Community shout out from Alex Strick van Linshoten](/uploads/images/2022-06-17/alex-strick-van-linshoten.png '=800')
_Thanks for the shout out Alex!
([Source link](https://mlops.systems/tools/redactionmodel/computervision/mlops/2022/05/24/data-versioning-dvc.html#-appendix-how-to-switch-from-git-lfs-to-dvc))_

### MyMLOps Stack

[]() created theh [MyMLOps.com](mymlops.com) to blah We were excited to see DVC
included in the section of Experiment Tracking as should! We know there are
other great experiment tracking tools out there, and we are content to see that
the larger Community is starting to recognize this capability with DVC! We like
to think of it as taking a step beyond tracking to versioning. To learn more
about experiment versioning,
[visit this blog piece](https://dvc.org/blog/ml-experiment-versioning) from
Techinical Product Manager - DVC,
[Dave Berenbaum](https://www.linkedin.com/in/david-berenbaum-20b6b424/).

### **Samson Zhang**: MLOps: How DVC smartly manages your data sets for training your machine learning models on top of Git

![Samson Zhang, DVC Workflow, Cache and Storage](/uploads/images/2022-06-17/samson-zhang.png '=800')
_DVC workflow, cache, and storage
([Source link](https://medium.com/hub-by-littlebigcode/mlops-how-dvc-smartly-manages-your-data-sets-for-training-your-machine-learning-models-on-top-of-b73857e54e52))_

### New Docs

As you can iamgine, with new tools come new docs! The docs and product teams
have been furiously busy making sure that you have the docs you need to try our
new tools. Of note please find:

- [MLEM Docs](https://mlem.ai/doc)
- [Machine Learning Model Registry](https://mlem.ai/doc/use-cases/model-registry)
  in [DVC.org docs](https://dvc.org/doc/use-cases/model-registry) as well as the
  [MLEM docs](https://mlem.ai/doc/use-cases/model-registry)
- [VS Code docs and walkthrough](https://marketplace.visualstudio.com/items?itemName=Iterative.dvc)

## Open Positions

[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the open positions. This month we are especially seeking
a fit for the Senior Software Engineer (Dataset Label Management, Python) role,
so if that fits you or someone else you know, get applying! 🚀

![Iterative.ai is Hiring](/uploads/images/2022-06-17/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

We were excited to see this project come up from
[Chansung](https://twitter.com/algo_diver) using DVC, Iterative Studio,
Huggingface and Jarvis Labs AI.  
Looking forward to seeing how it develops! 🍿

## https://twitter.com/algo_diver/status/1530455733837647873?s=20&t=Z5bCod_oPf6VqHST6vbVBw

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
