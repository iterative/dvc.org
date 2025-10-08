---
title: March '22 Heartbeat
date: 2022-03-17
description: >
  Monthly updates are here! You will find a special note in regards to the war
  in Ukraine, the usual great tutorials and workflows from the
  Community,  online course updates, MLOps maturity models, new docs and more!
  Welcome to Spring!

descriptionLong: |
  This month you will find:

    🇺🇦 A special note on the war in Ukraine,

    🧘🏻‍♀️ MLOps is a mess, but that's ok,
    
    🥰 Tutorials and workflows from the Community,

    🗣 Upcoming Events,

    🔺 MLOps Maturity Models,

    💻 Online Course(s) updates,

    📖 New doc,

    🚀 Info on our growing team, and more!
picture: 2022-03-17/heartbeat-march.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/march-22-heartbeat/1117
tags:
  - Heartbeat
  - DVC
  - CML
  - Twine.net
  - Git
---

# On the war in Ukraine 🇺🇦

While the war in Ukraine has impacted the world, it has also greatly impacted
our company as we have team members living in Ukraine and Russia, and many with
family ties to both. Our hearts are with our Iterative family in Ukraine and we
are committed to doing everything we can to support the safety of our Ukrainian,
as well as the transition of our Russian colleagues during this crisis.

We as a company are against this war. We have donated to the humanitarian
efforts to help the people of Ukraine and are matching our team members'
donations as well. We are proud of the perseverance, care, and support coming
from our team at this time.

If you are able, we ask that you consider these resources as ways to help. Our
hope is that the world will find a quick and peaceful end to this war and
Ukraine will be restored, even stronger than before. 🇺🇦

## 🪙 Donations

- [A list of charities with direct connections to Ukrainian people endorsed](https://www.reddit.com/r/ukraine/comments/s6g5un/want_to_support_ukraine_heres_a_list_of_charities/)
  by the [Kyiv Independent](https://kyivindependent.com/). Everything on this
  list except for the "Charities that help the war effort” section is for
  humanitarian efforts only.
- [Humanitarian Assistance to Ukrainians by National Bank of Ukraine](https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-rahunok-dlya-gumanitarnoyi-dopomogi-ukrayintsyam-postrajdalim-vid-rosiyskoyi-agresiyi)
- [UNICEF USA](https://www.unicefusa.org/?form=ukraine-emergency-match) (2x
  additional match)
- [UNICEF](https://www.unicef.org.uk/donate/donate-now-to-protect-children-in-ukraine/)
  UK
- [UNHCR](https://donate.unrefugees.org.uk/general/~my-donation?_cv=1)
- [RedCross Ukraine](https://donate.redcrossredcrescent.org/ua/donate/~my-donation?_cv=1)
  (there are some concerns about this org - see
  [one](https://twitter.com/ptico/status/1502192685364531204),
  [two](https://twitter.com/KyivIndependent/status/1501136976447168512))
- [RedCross UK](https://donate.redcross.org.uk/appeal/ukraine-crisis-appeal)
- [International Medical Corps](https://give.internationalmedicalcorps.org/page/99837/donate/1)
- [WFP](https://www.wfp.org/support-us/stories/ukraine-appeal)
- [UKRAINECHARITY](https://www.ukrainecharity.org/war-crisis-692518.html)
- [NOVA UKRAINE](https://novaukraine.org/)
- [GOFUNDME / Support Ukrainian Refugees Arriving In Poland](https://www.gofundme.com/f/support-ukrainian-refugees-arriving-in-poland)
- [Doctors Without Borders](https://www.doctorswithoutborders.org/what-we-do/countries/ukraine)
- [Save the Children](https://support.savethechildren.org/site/Donation2?df_id=5751&mfc_pref=T&5751.donation=form1)
- [ICRC](https://www.icrc.org/en/donate/ukraine)
- [Project Hope](https://secure.projecthope.org/site/SPageNavigator/2022_02_Ukraine_Response_Web_UNR.html&s_subsrc=oth)
- [Flexport](https://www.flexport.org/donate-now)

## ❤️‍🩹 Other ways to help

- [I Can Help (hosting)](https://icanhelp.host/)
- [Airbnb - host a refugee](https://www.airbnb.org/help-ukraine)

---

# AI/ML News

![Excited Marie Kondo GIF](https://media.giphy.com/media/5YiRHZtcSeiEyOpSV7/giphy.gif)

## Mihail Eric: MLOps is a Mess But That's to be Expected

[**Mihail Eric**](https://twitter.com/mihail_eric) writes a long, but _really
worth it_ piece entitled
[MLOps is a Mess But That’s to be Expected.](https://www.mihaileric.com/posts/mlops-is-a-mess/)
In it he discusses the allure of seeking a machine learning career, only run
smack into the giant wall of learning that encompasses the space, not the least
of which is the multitude of tools to pick through once you get there. The state
of machine learning is reviewed and some history of DevOps for perspective on
MLOps is added.  
You will find advice for newcomers and some final, thorough, thoughts and
predictions especially as they relate to “ML at a reasonable scale” companies.  
Definitely worth your review!

![Gartner Hype cycle for MLOps](../uploads/images/2022-03-17/hype-cycle-mihail-eric.png '=800')
_Gartner Hype cycle for MLOps
([Source link](https://www.mihaileric.com/posts/mlops-is-a-mess/))_

# Community News

## Kevin Lu: Learn how to use Data Version Control to remove the third wheel from your relationship

![Learn how to use Data Version Control to remove the third wheel from your relationship](../uploads/images/2022-03-17/kevin.png 'Learn how to use Data Version Control to remove the third wheel from your relationships :wrap-right ==300')
In
[this hilarious post,](https://medium.com/@kevinylu/learn-how-to-use-data-version-control-to-remove-the-third-wheel-from-your-relationship-ce4c2afa649c)
[**Kevin Lu**](https://medium.com/@kevinylu) teaches us how to use DVC to enable
us to disconnect from our unhealthy addictive relationships with our computers
and make room for more human relationships! You don't want to miss the humor,
productivity and wisdom here, all while helping you understand how each of DVC's
commands help your machine learning engineering exploits.

## Thanakorn Panyapiang: Putting A Machine Learning model into production with Google Cloud Platform and DVC

Are you a data scientist new to putting models into production?  
[In this piece](https://towardsdatascience.com/putting-machine-learning-model-into-production-with-google-cloud-platform-and-dvc-f6a22cdcf4a5) [**Thanakorn Panyapiang**](https://www.linkedin.com/in/tpanyapiang/)
describes various model deployment strategies to put projects into production
including model-as-service, batch prediction and model-on-edge. In his example
he uses a batch prediction approach with an image segmentation model to identify
clouds. He uses DVC as a model registry with Google Cloud storage and GitHub
actions to automate the Cloud Functions deployment. See all the steps he
outlines in his piece to get real value out of your machine learning projects.

![Data Pipeline](../uploads/images/2022-03-17/panyapiang.jpeg '=800') _Data
Pipeline
([Source link: Author](https://towardsdatascience.com/putting-machine-learning-model-into-production-with-google-cloud-platform-and-dvc-f6a22cdcf4a5))_

## Matthew Upson: MLOps for Conversational AI with Rasa, DVC, and CML (PartII)

In the [December Heartbeat,](https://dvc.org/blog/december-21-heartbeat) I told
you about [**Matt Upson's**](https://twitter.com/m_a_upson) first post in his
series on using DVC, CML and Rasa together.
[In this second post](https://medium.com/mantisnlp/mlops-for-conversational-ai-with-rasa-dvc-and-cml-part-ii-3a70fe2f357d)
he goes through some Rasa basics and gets the DVC pipeline setup, with its train
and test stages, params, dependencies, outs and metrics. He also covers syncing
with DVC, making changes, the `dvc repro` command, the `.dvc-lock` file, and
pushing to remote storage. We're looking forward to the next installment when we
will see how CML can be used to automatically train the model.

![Rasa DVC metrics diff](../uploads/images/2022-03-17/upson.png '=800') _DVC
metrics diff in Rasa project
([Source link](https://medium.com/mantisnlp/mlops-for-conversational-ai-with-rasa-dvc-and-cml-part-ii-3a70fe2f357d))_

## Sibanjan Das: MLOps for Enterprise AI

[**Sibanjan Das**](https://www.linkedin.com/in/sibanjan/) notes the trending of
the MLOps keyword in
[his piece](https://dzone.com/articles/mlops-for-enterprise-ai) in
[DZone.](https://dzone.com) Sibanjan gives an overview of MLOps and how it
supports the AI/ML ecosystem to deliver return on investment for ML projects. He
reviews the components of MLOps, including automated ML model building
pipelines, model serving, model version control, model/data monitoring, and
security and governance. He also discusses the MLOps maturity models of Google
and Microsoft (see below). I found this part especially interesting as it
mirrors what we see in our Community and how they develop using our tools as
well. Finally, he outlines some tools that help in the process, including DVC.

![Comparing Google's and Microsoft's maturity models](../uploads/images/2022-03-17/das.jpeg '=800')
_Comparing Google's and Microsoft's maturity models
([Source link](https://dzone.com/articles/mlops-for-enterprise-ai))_

## Jagreet Kaur: Implementing DevOps for Machine Learning - A Quick Guide

![Tensorflow, PyTorch, DVC, Docker, CI/CD](../uploads/images/2022-03-17/jagreet-kaur.png 'Continuous Development Life Cycle Guide from Xenostack :wrap-left ==300')
[**Jagreet Kaur**](https://www.linkedin.com/in/jagreetkaur/) of
[Xenonstack](https://www.xenonstack.com/) authors
[a guide](https://www.xenonstack.com/blog/devops-for-machine-learning) on
applying DevOps to machine learning and generally what the continuous
development life cycle is as it relates to machine learning projects. Jagreet
goes over all the fun continuous topics including, continuous integration,
continuous testing, continuous retraining, and continuous deployment. She gives
an overview of the use of Tensor Flow, PyTorch, and Docker, as well as DVC for
version control, experiment management deployment, and collaboration. Additional
resources from Xenonstack are provided for further review.

### Yuqi Li: Why MLOps should be Open Source

![Why MLOps Tools should be Open Source](../uploads/images/2022-03-17/yuqi-li.jpeg 'Why MLOps Tools should be Open Source :wrap-right ==300')
[**Yuqi Li**](https://www.linkedin.com/in/yuqiliofficial/)
[in this opinion piece,](https://towardsdatascience.com/why-mlops-tools-should-be-open-source-5ad696463f54)
in [Towards Data Science.](https://towardsdatascience.com/) overviews the
meaning and components of MLOps and identifies a number of good open-source
tools in the space which of course includes DVC. He also outlines a number of
reasons why MLOps should be open source. Among the reasons making the cut:

1. Cost-Effectiveness
2. Ownership
3. No privacy concern
4. Build Community around the tool Examine these reasons to determine if open
   source makes sense for your MLOps work. We think you will.

## And speaking of Community…

## Mert Bozkir: Community-Driven Learning

If you’ve been in our Discord server, been to one of our Meetups, or interacted
with us on Twitter, you’ve surely come across DVC Community All-Star
[**Mert Bozkir**](https://github.com/mertbozkir). Mert has written
[a great piece](https://medium.com/@mertbozkir/community-driven-learning-2481103aa190)
Entitled _Community Driven Learning_ and describes how it is the best way to
learn. He outlines his reasoning for this including the support, encouragement,
and motivation you can get from the Community to be persistent in your learning
efforts. He also includes eight communities that are great for learning, with
invites included. Be sure to check it out!

![Community Driven Learning](../uploads/images/2022-03-17/community.jpeg '=800')
_Community Driven Learning
([Source link: Unsplash by john_cameron](https://unsplash.com/@john_cameron))_

## And speaking of learning…

# Company News

![GIF by Star Wars](https://media.giphy.com/media/3ohuAxV0DfcLTxVh6w/giphy.gif)

## Online Course(s) Updates

- We now have over **250** students taking the course and **10** students that
  have completed the course! 🎉 Thank you to all who have given us feedback. We
  are actively working on making adjustments to the course and improving the
  next one.

- We have a new look! The website for our online course, Iterative Tools for
  Data Scientists and Analysts has been updated to be more streamlined to more
  clearly identify what our students need in the course!

- We have already begun working on the second course which will be more advanced
  (remember those maturity models outlined in the article from DZone above?) and
  will cover scenarios with CML. We are also working on creating an ebook for
  each video that will provide relevant information, diagrams, and links with
  the video content instead of being batched at the end of the module. The ebook
  format will also let you take your own notes as you study!

## New Hires

![My Team GIF by The Voice](https://media.giphy.com/media/lQ0LC603dA96Gs2Hfx/giphy.gif)

[**Mike Moynihan**](https://www.linkedin.com/in/michael-moynihan/) joins us from
Brooklyn, NY as an Account Executive. He previously worked at Code Climate as
the Manager of Business Development and an Account Executive. Mike's really into
biking and will be participating in the 5-Boro Bike Tour in NYC this year. He's
also a baker and has been baking bread and other baked goods consistently for
about 3 years now. Finally, when not working or biking or baking, you may find
him playing one of the video or board games in his 500-strong collection.

[**Rob De Wit**](https://www.linkedin.com/in/rcdewit/) joins our team from
Utrecht, the Netherlands as a Developer Advocate. Rob's first focus will be on
developing those new ebooks for our new online courses mentioned above. He has a
background in Information Sciences and previously worked at bol.com and
Devoteam. When not working, Rob likes photo and video editing, board games,
organizing meetups, and hiking (the Peaks of the Balkans are on his bucket
list).  
He also stays busy by learning Spanish and dabbling in local politics.

## Upcoming Events

### March Office Hours!

Be sure to join us at the
[March Office Hours Meetup,](https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/)
where [**Fabian Zills**,](https://github.com/PythonFZ/) PhD student at
[University of Stuttgart,](https://www.uni-stuttgart.de/en/) will present his
ZnTrack ("zinc track") project which creates, runs and benchmarks DVC pipelines
in Python and Jupyter Notebooks.  
[Find the repo here!](https://github.com/zincware/ZnTrack)

<external-link
href="https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/"
title="March Office Hours - ZnTrack"
description="RSVP for DVC Office Hours - ZnTrack - Create, Visualize, Run and Benchmark DVC Pipelines in Python & Jupyter Notebooks "
link="https://meetup.com"
image="../uploads/images/2022-03-17/office-hours-meetup.png"/>

## Conferences/Hackathons

- We will be sponsoring [ODSC East](https://odsc.com/boston/) and
  [MLOps World](https://mlopsworld.com/) this year, so if you are attending,
  we'd love to meet you IRL! Stop by our booth!
- [**Milecia McGregor**](https://twitter.com/FlippedCoding) will be speaking at
  [PythonWeb Conference](https://2022.pythonwebconf.com/) March 22nd on "Using
  Reproducible Experiments to Creat Better Machine Learning Models."
- [**David de la Iglesia Castro**](https://github.com/daavoo) will be presenting
  his workshop "Making MLOps Uncool Again" at
  [MLOps World New York](https://mlopsworld.com/newyork/) on March 29th and at
  [PyCon Berlin](https://2022.pycon.de/) April 11th.
- Community member [**Gift Ojeabulu**](https://twitter.com/GiftOjeabulu_) will
  be giving a talk on "MLops Exploration with Git and DVC for Machine Learning
  Project" at [Open Source Festival 2022](https://festival.oscafrica.org/) March
  24-26.
- [BatteryDev Hackathon](https://www.battery.dev/) will take place next week and
  [**Milecia McGregor**](https://twitter.com/FlippedCoding) will hold an Office
  Hours for those needing help with DVC on March 21st
- [**Antoine Toubhans**](https://twitter.com/AntoineToubhans) will be presenting
  his DVC integration with Streamlit at [PyCon Berlin](https://2022.pycon.de/)
  as well.

## 📖 New Docs

### CML CI

CML has a new command line reference that lets you prepare the Git repository
for CML operations. For more info on `cml ci`,
[check out the docs](https://cml.dev/doc/ref/ci#command-reference-ci)

## Open Positions

Even with our amazing new additions to the team, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions and share with anyone you think may be
interested! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-01-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

We were really excited to the the [Sicara](https://www.sicara.ai/) team all
decked out in their DVC swag this month in this Tweet. If you haven't seen the
video of [Antoine Toubhans](https://twitter.com/AntoineToubhans) integration
with Streamlit, you can
[see it on our YouTube channel](https://www.youtube.com/watch?v=F318uN01v7M&t=2s)
or catch the presentation at this year's [PyCon Berlin.](https://2022.pycon.de/)

https://twitter.com/AntoineToubhans/status/1497254983963660292

How do you get some DVC swag you ask? Write us some great content, contribute to
our tools, give a presentation at one of our Meetups! We'd love to have you!

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
