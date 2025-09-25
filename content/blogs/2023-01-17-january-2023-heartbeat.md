---
title: January '23 Heartbeat
date: 2023-01-17
description: >
  Monthly updates are here! Great content from the Community, including a new
  tutorial video on MLEM and shout out from Tryolabs for MLEM, great new
  tutorial on DVC, Casper da Costa-Luis' video on CML from MLOps Summit and
  more! Happy 2023!

descriptionLong: |
  This month you will find:

    🎥 MLEM tutorial video from Community member,

    🥇 Top Python tools for 2022 from Tryolabs,
    
    🎅🏼 Naughty or Nice MLEM project,

    ❣️ Unstructured Data Query Language coming,

    🎥 Sami Jawhar's Running Parallel Pipelines with DVC & TPI Video,

    🎥 Casper da Costa-Luis' MLOps Summit presentation video,

    👀 DVC tutorial, and more!
picture: 2023-01-17/january-cover.jpg
author: jeny_defigueiredo
commentsUrl: https://discuss.dvc.org/t/january-23-heartbeat/1456
tags:
  - Heartbeat
  - DVC
  - MLEM
  - Tryolabs
  - Tensorflow
  - Kernel
  - MLOps Summit
  - Huggingface
  - LineaPy
---

Happy New Year! We are looking forward to what’s going to be a stellar year for
us and for all of you! We are hoping for peace to reign, the recession to
subside, and success aplenty. 🤞🏼 Are you ready? Let’s do this!

![Lets Do This GIF by National Geographic Channel](https://media.giphy.com/media/JykvbWfXtAHSM/giphy.gif)

# From the Community

We always start with DVC, but this month, in this new year, we’ll start with
MLEM! We released MLEM in June of last year and have made
[some advances to it already](https://iterative.ai/blog/mlem-k8s-sagemaker). It
seems the Community is learning about it and recognizing its benefits. We are
thrilled to see that!

## MLEM Tutorial Video from JCharis Jesse

[**JCharis Jesse**](https://twitter.com/JCharisTech) created the
[FIRST video tutorial from the Community for MLEM!](https://www.youtube.com/watch?v=vEoc64xJaK4)
In this very well-explained and recorded video, Jesse takes you through what
MLEM is and where it fits in the machine learning to production process. He
follows that by showing the different options of saving a model, where to find
the model metadata and how it works, loading the ML model, examples of serving
with FastAPI and Docker, and finally applying the model to data for prediction.
If you are interested in using MLEM for serving your models, this will
definitely help get you started! You can find a ton of other great content on
his [YouTube site](https://www.youtube.com/@JCharisTech).

https://www.youtube.com/watch?v=vEoc64xJaK4

## Tryolabs Top Python Libraries of 2022

From our friends at [Tryolabs](https://tryolabs.com/),
[**Alan Descoins**](https://www.linkedin.com/in/alan-descoins/) and
[**Facundo Lezama**](https://www.linkedin.com/in/facundo-lezama/) round out 2022
with
[Tryolabs’ annual picks for the best Python Libraries of 2022](https://tryolabs.com/blog/2022/12/26/top-python-libraries-2022).
The requirements to make the cut are for libraries that were launched or gained
popularity within the year. They have a list of top 10 picks that you will want
to take a look at, including [LineaPy](https://lineapy.org/) which helps you
convert notebooks to production pipelines. MLEM also made the list in the
category of _Tools & Enablers_.

![Tryolabs](../uploads/images/2023-01-17/tryolabs.png '=800') _Tryolabs Best
Python Libraries of 2022
([Source link](https://tryolabs.com/blog/2022/12/26/top-python-libraries-2022))_

## Bex Tuychiev - Data Version Control: Learn What Other Data Scientists Are Ignoring

![Learn What Other Data Scientists are Ignoring with DVC](../uploads/images/2023-01-17/fiona-art.jpg 'Photo by Fiona Art from Pexels :wrap-left =300')
In the first part of a new series on DVC,
[**Bex Tuychiev**](https://www.linkedin.com/in/bextuychiev/) writes a fire 🔥
tutorial on DVC in
[Towards Data Science](https://towardsdatascience.com/how-to-version-gigabyte-sized-datasets-just-like-code-with-dvc-in-python-5197662e85bd)
with a computer vision project using the German Traffic Sign Recognition
Benchmark Dataset and Tensorflow. He guides you on getting the project properly
set up, then how to start adding, tracking, pulling, and pushing files with DVC.
Next, he goes over building the image classification model and then concludes
with how to create a shared cache if you are working on a large project with a
team. Reproducibility and Collaboration for the win! We are looking forward to
the next parts of the series!

![It Crowd Popcorn GIF](https://media.giphy.com/media/epxDzItQhxAzK/giphy.gif)

## Aryan Jadon - Survey of Data Versioning Tools for Machine Learning Operations

For a very nice comparison of Data Versioning Tools, look to
[**Aryan Jadon’s**](https://www.linkedin.com/in/aryan-jadon/)
[recent post on the subject](https://medium.com/@aryanjadon/analysis-of-data-versioning-tools-for-machine-learning-operations-1cb27146ce49).
He seems to hit them all, providing information about their benefits and things
of which to be cautious. Naturally, DVC makes this list with the only caution
being, “you need to use a Git repository to use DVC’s versioning features."
Isn’t Git a part of every modern tech stack? 😉 Staying true to our mission to
deliver the best developer experience for machine learning teams by creating an
ecosystem of open, modular ML tools!

![Survey of Data Versioning Tools for Machine Learning Operations](../uploads/images/2023-01-17/aryan-jadon.png '=800')
_Deciding on Data Versioning Tools?
([Source link by Mary Amato ](https://medium.com/@aryanjadon/analysis-of-data-versioning-tools-for-machine-learning-operations-1cb27146ce49))_

## Sami Jawhar - Running Parallel Pipelines with DVC and TPI

If you couldn’t make the December Meetup, good news!
[The video](https://youtu.be/X3M1UfMn2Kk) is already out!
[**Sami Jawhar**](https://www.linkedin.com/in/sami-jawhar-a58b9849/) joined us
to share a solution he built to run parallel pipelines with DVC and TPI to save
time processing the massive amount of data they use in their brain research at
[Kernel](https://www.kernel.com/). He describes the context of his situation as
well as all of its constraints and finally the details of the solution, coined
“Neuromancer” after the famous sci-fi novel. Get ready for some mind-blowing
engineering! 🤯

https://youtu.be/X3M1UfMn2Kk

# Company News

## MLEM Christmas Project

<img src="https://media.giphy.com/media/KtrhyNGwNCSYM4pVRq/giphy.gif" alt="Have you been Naughty or Nice?" title="Naughty or Nice MLEMMing" style="width: 300px; float: right; clear: left; padding: 0.5rem"></img>
In case you missed it while you were out for the holidays,
[**Alex Guschin**](https://www.linkedin.com/in/1aguschin/) and
[**Mike Sveshnikov**](https://www.linkedin.com/in/mike0sv/), your friendly
neighborhood MLEM creators, put together
[a fun project using MLEM](https://medium.com/@mike0sv/i-trained-a-model-to-tell-if-you-were-naughty-this-year-11a36ca6d472)
to determine if you had been naughty or nice just ahead of Santa’s trot around
the globe in 2022. In the blog post, you will learn how they DDOS’ed Santa’s
website, Trained a Christmas (decision) tree, and Deployed a ML service with
MLEM to [Streamlit](https://streamlit.io/) to see the predictions.

You can try it out [here](https://mlem-nice-or-naughty.fly.dev/). And check out
how some of our team members fared in
[this LinkedIn post](https://www.linkedin.com/posts/1aguschin_streamlit-activity-7012056418816036864-k9hv?utm_source=share&utm_medium=member_desktop).
Spoiler alert: I’m naughty and nice?

## Casper da Costa-Luis at MLOps Summit - Painless cloud experiments without leaving your IDE

Our CML Product Manager,
[**Casper da Costa-Luis'**](https://github.com/casperdcl) presented in November
at MLOps Summit on _Painless cloud experiments without leaving your IDE_. The
presentation is now available on YouTube
[here](https://www.youtube.com/watch?v=PaBQF89URuI). If Full lifecycle
management of computing resources (including GPUs and auto-respawning spot
instances) from several cloud vendors (AWS, Azure, GCP, K8s)... without needing
to be a cloud expert appeals, this talk is for you! He discusses how to move
experiments seamlessly between a local laptop, a powerful cloud machine, and
your CI/CD of choice.

https://www.youtube.com/watch?v=PaBQF89URuI

## New Unstructured Data Query Language

**Do you use Amazon S3, Azure Blob Storage, or Google Cloud Storage? We have a
new solution for finding and managing your datasets of unstructured data like
images, audio files, and PDFs!** Extend your DVC environment with the first
unstructured data query language (think SQL -> DQL) for machine learning. We are
looking for beta customers for this new tool.

[Schedule a meeting with us](https://calendly.com/gtm-2/iterative-datamgmt-overview)
if that's what you're needing! Find more info
[here.](https://iterative.ai/data-catalog-for-ml)

![Unstructured Data Query Language from the makers of DVC](../uploads/images/2023-01-17/dvc-cloud.png '=800')
_Unstructured Data Query Language Prototype_

## ✍🏼 Doc Updates!

## Tweet Love ❤️

Our favorite Tweet this month is from
[**Osman Bayram**](https://twitter.com/the_osbm) who mentions he plans to use
CML with [Huggingface](https://huggingface.co/) GPU. We are looking forward to
that! 🍿 I'm seeing a lot of popcorn eating in our future. See you next month!

[Link to Tweet](https://twitter.com/the_osbm/status/1606018332175478786?s=20&t=uTKIsTjTv5frJPz2yNPqUw)

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
