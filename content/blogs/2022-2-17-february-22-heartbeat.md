---
title: February '22 Heartbeat
date: 2022-02-17
description: >
  Monthly updates are here! You will find great tutorials and workflows from  
  the Community, Online course is now open, decision making strategies
  for  MLOps tools, and more! Happy February!

descriptionLong: |
  This month you will find:
    
    🥰 Tutorials and workflows from the Community,

    🗣 Upcoming Events,

    📰 DVC helps in COVID research,

    🧐 More MLOps tool decision strategies,

    😎 GitHub Goodness and Integrations,

    💻 Online Course is live,

    🚀 Info on our growing team, and more!
picture: 2022-02-17/heartbeat-february.png
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/february-2022-heartbeat/1064
tags:
  - Heartbeat
  - DVC
  - CML
  - DataChain Studio
  - FuzzyLabs
  - Twine.net
  - Scientiometrics
  - BatteryDEV Hackathon
  - TFIR
  - Guild AI
  - Git
---

<details>

This month's Heartbeat image is inspired by Community member Daniel Barnes.  
Daniel has been a great contributor to CML and helps out folks with questions in
Discord as well as frequently attends our Meetups. This image is inspired from
his
[GitHub profile image](https://app.orbit.love/dvc-community/members/danielbarnes)
and the fact that he used to be a competitive paraglider. His record being 9.5
hours in the air! 😳 Many thanks to Daniel for his contributions to the
Community that keeps us all flying high! 🪂

<summary>✨Image Inspo✨</summary>
</details>

# Community News

![Stranger Things Math GIF by Wetpaint](https://media.giphy.com/media/d3mn5mnDkwECLmnK/giphy.gif)

The year is already flying by! Check out what's new this month!

## FuzzyLabs Open Source MLOps is Awesome

So let me guess, still overwhelmed with MLOps tool choices? This past month
[**Matt Squire**](https://www.linkedin.com/in/matt-squire-a19896125/) of
[Fuzzy Labs.ai](http://FuzzyLabs.ai) reviewed their
[Awesome Open Source MLOps repo,](github.com/fuzzylabs/awesome-open-mlops)
[in this blog](https://fuzzylabs.ai/blog/open-source-mlops-is-awesome/) and
[this video](https://youtu.be/HIAPoKEDXrg). Matt breaks down the tool space into
categories of SaaS platforms, fully open source tools, and partly open source
tools. He describes how they define open source and why they think open source
is the best choice in the MLOps space, which includes its trait of being
_flexible_, _ownable_, _cost-effective_, and _agile_.

> "Turn key solutions quickly become inflexible." - Matt Squire

Fuzzy Labs, a small AI company in Manchester, England, had a need for
flexibility in their work with their clients, so they did a deep dive into MLOps
tooling and established an MLOps Platform meeting the open source and flexible
criteria they required. This stack includes our own _DVC_, as well as
[Sacred](https://github.com/IDSIA/sacred), [ZenML](https://zenml.io/),
[Seldon Core](https://www.seldon.io/tech/products/core), and
[Evidently AI.](https://evidentlyai.com/)

The blog and the video are definitely good material to review if you're choosing
your ML tools.

https://youtu.be/HIAPoKEDXrg

## Continuous Machine Learning on Huggingface Transformer with DVC including Weights & Biases Implementation and Converting Weights to ONNX.

As the title would suggest,
[this jam packed article](https://medium.com/@arjunkumbakkara/continuous-machine-learning-on-huggingface-transformer-with-dvc-including-weights-biases-1bc4520d210)
from [**Nabarun Barua**](https://github.com/nabarunbaruaAIML), and
[**Arjun Kumbakkara**](https://github.com/arjunKumbakkara) focuses in on how CML
can be implemented into an NLP project. They assume knowledge of DVC,
Transformers, ONNX and Weights & Biases, so be ready to take your skills to the
next level automating parts of the process with CML.

They begin with the all-important setups of AWS IAM user with EC2 & S3 Developer
access, the S3 bucket to store the dataset, and requesting an EC2 spot instance.
They then continue into a detailed description of all the stages of the project,
outlining the use of all the tools including DVC Studio. You can find
[the repo for the project here.](https://github.com/nabarunbaruaAIML/CML_with_DVC_on_Transformer_NLP)
Looking forward to the next installment from Nabarun and Arjun on a Dockerized
Container Application cluster with Kubernetes Orchestration. 🍿

![Training, Deployment and Retraining Architecture](../uploads/images/2022-02-17/arjun-kumbakkara-architecture.png '=800')
_Total architecture with the Training, Deployment, and Retraining Pipelines in
the same order.
([Source link](https://medium.com/@arjunkumbakkara/continuous-machine-learning-on-huggingface-transformer-with-dvc-including-weights-biases-1bc4520d210))_

## DVC Used to help extract knowledge from COVID-19 research

In case you missed it in our
[Twitter feed](https://twitter.com/ivanovitchm/status/1482742970461863939?s=20&t=QrfDTRHcZOKWIe5n5mb7ZQ),
a group of scientists
[published an article](https://link.springer.com/article/10.1007/s11192-021-04260-y)
in [Scientometrics Journal](https://link.springer.com/journal/11192) entitled,
_Discovering temporal scientometric knowledge in COVID-19 scholarly production_.
The authors,
[**Breno Santana Santos**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Breno_Santana-Santos),
[**Ivanovitch Silva**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Ivanovitch-Silva),
[**Luciana Lima**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Luciana-Lima),
[**Patricia Takako Endo**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Patricia_Takako-Endo),
[**Gisliany Alves**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Gisliany-Alves),
&
[**Marcel da Câmara Ribeiro-Dantas**](https://link.springer.com/article/10.1007/s11192-021-04260-y#auth-Marcel_da_C_mara-Ribeiro_Dantas),
used DVC to create a reproducible workflow that combined machine learning and
Complex Network Analysis techniques to extract implicit and temporal knowledge
from Scientific production bases on COVID-19.

> "The presented methodology has the potential to instrument and expand
> strategic and proactive decisions of the scientific community aiming at
> knowledge extraction that supports the fight against the pandemic."

We are so happy to be helpful in the fight against the pandemic! Be sure to
check out the paper and keep your eyes out for a Meetup in the future where they
present this work!

![DVC in Scientometric Covid Research](../uploads/images/2022-02-17/scientometric.png '=800')
_Discovering temporal scientometric knowledge in COVID-19 scholarly production
([Source link](https://link.springer.com/article/10.1007/s11192-021-04260-y))_

# GitHub Goodness and Integrations

- If you're a [**Guild.Ai**](https://guild.ai/) user, you'll be happy to know
  that Guild now supports DVC! Find out more in
  [this article](https://my.guild.ai/t/using-guild-ai-with-dvc/803) by
  [**Garret Smith**](https://www.linkedin.com/in/gar1t/)and the
  [corresponding repo](https://github.com/guildai/guildai/tree/dvc/examples/dvc)
  for an example.

- [**Luca Moschella**](https://github.com/lucmos) created
  [this **NN template**](https://github.com/grok-ai/nn-template) for your neural
  network projects where you want to combine PyTorch Lightning, Hydra, DVC,
  Weights and Biases and Streamlit.

- Just a reminder for your NLP projects, [**SpaCy**](https://spacy.io/)
  integrates with DVC as well. You can find out more info on
  [the integration here.](https://spacy.io/usage/projects#integrations)

![Seal Of Approval Thumbs Up GIF](https://media.giphy.com/media/13zeE9qQNC5IKk/giphy.gif)

# In Other Data Science and AI News

## 10 Most Important Jobs for ML Products in 2022

![10 Most Important Jobs for ML Products in 2022](../uploads/images/2022-02-17/roles-in-ai.png '10 Most Important Jobs for ML Products in 2022 :wrap-left ==300')
People new to the data science/ml space are often overwhelmed by all that there
is to learn, and determining the path to get there. When I get this question
from Community members, I always have the same advice: try to figure out what
part of DS/AI is most interesting to you and then work to building your skills
toward that. In this article on the
[10 Most Important Jobs for ML Products in 2022](https://medium.datadriveninvestor.com/the-10-most-important-jobs-for-ml-products-in-2022-7bf844d62423),
[**Ágoston Török**](https://www.linkedin.com/in/agoston-torok/) does a great job
of defining the different roles in the space, how they interrelate, and how they
show up in AI companies in the product development process. See his breakdown of
the roles above, with rows defining the stage, and columns, the aspects the
roles focus on. If you find you are drawn to the space where the DS prototypes
become the software product, then you may want to check out
[our new course!](https://learn.iterative.ai) 😉

## Engineering Best Practices for Machine Learning

Diving deeper into these roles, the team was a buzz recently, reviewing
[this slide deck](https://se.ewi.tudelft.nl/remla/slides/07_ASerban_mleng_practices.pdf)
on _Engineering Best Practices for Machine Learning_ by
[**Alex Serban**](https://www.linkedin.com/in/serbanac/). In it Alex discusses
the challenges of creating software from machine learning projects, the
differences between these projects and traditional software development, and the
need for developing robust and ethical practices. He and his colleagues,
[**Koen van der Blom**](https://liacs.leidenuniv.nl/~blomkvander/),
[**Holger Hoos**](https://ada.liacs.nl/members/), and
[**Joost Visser**](https://jstvssr.github.io/) created a survey to determine
current adoption of best practices in the industry. Along with the great review
of the survey results in the slides, a number of resources were provided
including
[the corresponding Awesome list, ](https://github.com/SE-ML/awesome-seml/blob/master/readme.md)
a
[Catalog of Best ML Engineering Practices](https://se-ml.github.io/practices/),
and their [project website](https://se-ml.github.io/) for more information on
the whole project. Definitely worth your review! ✅

![Engineering Best Practices for Machine Learning](../uploads/images/2022-02-17/alex-serban.png '=800')
_29 Machine Learning Engineering practices ranked by adoption
([Source link](https://se.ewi.tudelft.nl/remla/slides/07_ASerban_mleng_practices.pdf))_

## Twine Ethical Datasets

Are you in need of ethically sourced audio or video data for your ML project?
[Twine](https://www.twine.net/ai) has created a way to accomplish this, while
simultaneously freeing ML teams of the project management lift associated with
the collection of these datasets.  
You can learn more about Twine's efforts in ethical data collection through
these articles,
[The Importance of Ethically Sourced Data,](https://www.twine.net/blog/the-importance-of-ethically-sourced-data/)
[Bias in Data Collection, ](https://www.twine.net/blog/bias-in-data-collection/)
[Collecting Diversity Data: How to Ensure an Inclusive Workforce,](https://www.twine.net/blog/diversity-data-inclusive-workforce/)
and
[The Hidden Costs of Bad Data.](https://www.twine.net/blog/the-hidden-costs-of-bad-data/)
Twine also provides
[100 open audio and video datasets](https://www.twine.net/blog/100-audio-and-video-datasets/)
for anyone working on these types of projects. Check it out! 👇🏽

<external-link 
href="https://www.twine.net/blog/100-audio-and-video-datasets/"
title="Twine Ethically Sourced Datasets"
description="100 Ethically sourced audio and video datasets from Twine."
link="https://twine.net/"
image="../uploads/images/2022-02-17/twine.png"/>

## BatteryDEV Hackathon 2022

Are you interested in battery technology and in participating in a Hackathon
using battery data? The
[growth of battery technology](https://www.tfir.io/how-experiment-versioning-is-going-to-solve-big-problems-of-ai-ml-world/)
is climbing quickly as the world is looking to solve some of the world's
emissions issues with electronic vehicles. Additionally the demand for electric
vehicles
[is outpacing](https://www.mckinsey.com/business-functions/operations/our-insights/unlocking-growth-in-battery-cell-manufacturing-for-electric-vehicles)
the manufacturers' ability to supply the needed batteries. Datasets in the space
are kept proprietary as companies work independently to develop patents.
BatteryDEV 2022 aims to accelerate battery innovation through open source
competitions. This year they are expecting 300 participants for the event from
March 20-26. Community member
[Raymond Gasper](https://www.linkedin.com/in/raymond-james-gasper/) is one of
the organizers of [Battery.dev](https://battery.dev), and is creating a DVC
template for participants to use during the Hackathon. You can
[register for the event here!](https://www.battery.dev/registration-form)

<external-link 
href="https://battery.dev"
title="BatteryDEV 2022 Hackathon"
description="A global innovation challenge for battery, data and machine learning enthusiasts."
link="https://battery.dev/"
image="../uploads/images/2022-02-17/battery-dev.png"/>

# Company News

[**Dmitry Petrov**](https://twitter.com/FullStackML) talked to
[**Swapnil Bhartiya**](https://twitter.com/SwapBhartiya) recently about how
experiment versioning can help to solve the big problems of the AI/ML world. In
this interview you will learn how experiment versioning tracks everything you
need for a particular experiment so that the result is reproducible from
prototyping to production. This solution enables data science and engineering
teams to work more productively together.

https://www.youtube.com/watch?v=y5zp54LiAqg

## Upcoming Events

### March Office Hours!

Be sure to join us at the
[March Office Hours Meetup,](https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/)
where [**Fabian Zills**,](https://github.com/PythonFZ/) PhD student at
[University of Stuttgart,](https://www.uni-stuttgart.de/en/) will present his
ZnTrack project which creates, runs and benchmarks DVC pipelines in Python and
Jupyter Notebooks.

<external-link
href="https://www.meetup.com/Machine-Learning-Engineer-Community-Virtual-Meetups/events/283998696/"
title="March Office Hours - ZnTrack"
description="RSVP for DVC Office Hours - ZnTrack - Create, Visualize, Run and Benchmark DVC Pipelines in Python & Jupyter Notebooks "
link="https://meetup.com"
image="../uploads/images/2022-02-17/office-hours-meetup.png"/>

## New Hires

We are extremely excited to welcome our new Director of Engineering,
[**Oded Messer**](https://www.linkedin.com/in/odedmesser/). Oded lives in Israel
and plans to pour his time and attention into the people/processes/structures of
the engineering org to facilitate healthy growth and culture.💗 He brings
hands-on and managerial industry experience in the backend/tooling/infra and
MLOps domains (ex. Intel and Iguazio). In his spare time Oded remembers
traveling being a favorite activity, and also admits to being a sci-fi geek.
He's in good company here! 😉

We welcome [**Alex Kim**](https://twitter.com/alex000kim) who joins us as a
Field Data Scientist from Montreal, Canada. Alex's previous professional
experience has been at the intersection of Software Engineering and Data Science
across a few different industries. He has also done consulting work to develop
Data Science curriculums for EdTech companies. Alex speaks Russian and a little
French in addition to English. In his free time, Alex likes to bake, his
specialty being pizza! 🍕

<details>

We now have three Alex's on the team to match our three Davids!

<summary>🎉Fun Fact!</summary>

</details>

[**Jesper Svendsen**](https://github.com/jesper7) joins the team as a Platform
Engineer from Denmark.  
Previously, Jesper worked as an SRE for Evaxion Biotech (another ML-driven
company). Prior to that, he was a self-employed IT consultant, where he did
full-stack development. Jesper's hobbies include reading books, (particularly
medicine and psychology books), weightlifting, running, and photography. 📸

<details>

Jesper makes the eighth employee joining [Iterative.AI](https://iterative.ai)
with a name starting with the letter 'j.' I thought this was odd, as words that
start with 'j' have one of the
[lowest frequencies in the English language](https://funbutlearn.com/2012/06/which-english-letter-has-maximum-words.html).
But as it turns out, 'J' is
[one of the more common first initials.](https://www.quora.com/What-letter-of-the-English-alphabet-are-used-most-as-the-first-letter-of-the-first-name)

<summary>🎉Fun Fact!</summary>

</details>

[**Gabriella Caraballo**](https://github.com/erudin) joins Iterative as a
Backend Engineer. She is originally from Venezuela, but is currently living in
Canada! Programming was a hobby that became a professional path for Gabriella.
She loves everything related to security, privacy and open source. In her free
time, Gabriella enjoys cooking and eating, playing video/board games,
crocheting, photography, and music. Now that she's in Canada, she has added
skiing to her hobbies! ⛷

## Open Positions

Even with these amazing new additions to the team, we're still hiring!
[Use this link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22)
to find details of all the positions and share with anyone you think may be
interested! 🚀

![Iterative.ai is Hiring](../uploads/images/2022-01-18/hiring.jpeg '=800')
_Iterative is Hiring
([Source link](https://iterative.notion.site/Iterative-ai-is-Hiring-852cb978129645e1906e2c9a878a4d22))_

## Tweet Love ❤️

https://twitter.com/GiftOjeabulu_/status/1490771330949599234

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
