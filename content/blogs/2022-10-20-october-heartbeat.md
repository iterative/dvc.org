---
title: October '22 Heartbeat
date: 2022-10-20
description: >
  Monthly updates are here! Andrew Ng on Democratizing AI with a Data Centric
  approach, White House Blueprint for AI Bill of Rights, loads of content from
  the community, Nadia Nahar Meetup video and more!  Welcome to October!

descriptionLong: |
  This month you will find:

    🎙 Andrew Ng Intel Keynote talk,

    🇺🇸 White House Blueprint for AI Bill of Rights,
    
    🧐 CML in research,

    🎥 Nadia Nahar video: Collaboration Challenges in ML-Enabled Systems,

    🐉 DVC-Hydra integration,

    🗣 CI/CD for Machine Learning upcoming webinar,

    🚀 New hire, and more!
picture: 2022-10-20/october-cover.png
authors:
  - jeny_defigueiredo
  - rob_dewit
commentsUrl: https://discuss.dvc.org/t/heartbeat-october-22/1367
tags:
  - Heartbeat
  - DVC
  - CML
  - MLEM
  - AI Bill of Rights
  - Andrew Ng
  - Hydra
  - ODSC
---

Welcome to October! As the days grow shorter or longer depending on your
hemisphere, we bring you the latest and greatest from the Iterative Community.

# In AI News

## Andrew Ng at Intel's Innovation Conference - Democratizing AI through Data-Centric AI

https://youtu.be/G3MaIMrR6Ms

At
[Intel’s Innovation](https://www.intel.com/content/www/us/en/events/on-event-series/innovation.html)
conference, [**Andrew Ng**](https://www.linkedin.com/in/andrewyng/) gave a
keynote on democratizing AI. He posits that while large companies have embraced
AI, most smaller companies outside of the consumer-based domains still struggle.
He provides two main reasons for this: small datasets and customization.

According to Ng, data-centric AI will be the key to unlocking that potential,
forcing a paradigm shift away from code-centric AI. In this scenario, people
could take mostly ready-built ML tech and focus on the data to ensure it
captures all necessary domain knowledge.

For example, two companies that produce cornflakes and medication could take the
same ML model and train it on their respective datasets. As long as they have
the right tools and practices and provide a domain representative dataset, the
same model can reproduce effective results. If you want to see some of the tools
Ng uses, make sure to check out his keynote.

What do you think? Does the average data scientist need a different set of
skills in the near future? Are you in one of these smaller industries that are
starting to embrace AI? We'd love to read your thoughts! Join us in our
[discussion of this topic on Discord](https://discord.com/invite/dvwXA2N)!

## Blueprint for an AI Bill of Rights

![Blueprint for an AI Bill of Rights](../uploads/images/2022-10-20/blue-print.png 'White House Blueprint for an AI Bill of Rights :wrap-left =300')
If you will recall from
[last month's Heartbeat](https://iterative.ai/blog/september-22-heartbeat#european-ai-act)
we called to your attention the EU AI Act. This act proposes new rules that
would require that open source developers adhere to guidelines across a spectrum
of categories including risk management, data governance, technical
documentation and transparency, standards and accuracy, and cyber security. Not
to be outdone, the US White House declared a
[Blue Print for an AI Bill of Rights](https://www.whitehouse.gov/ostp/ai-bill-of-rights/).
[The White House Office of Science and Technology Policy (OSTP)](https://www.whitehouse.gov/ostp/)
has defined 5 categories for these rights:

1. Safe and Effective Systems
2. Algorithmic Discrimination Protection
3. Data Privacy
4. Notice and Explanation
5. Human Alternatives, Consideration, and Fallback

There's definitely some overlap here with the EU AI Act and some catching up
with Data Privacy in the mix. There's lots to unpack, compare, and contrast on
scope and philosophy between the two. It's nice to see that major attention is
given to these issues.

We could think of the relationship between AI rights and Andrew Ng's talk in the
sense of the AI space maturing. To Andrew Ng's points, as we move from the
frenzied all-important model development to an understanding of the need for a
data-centric approach and this democratization, we are changing the focus to
enable us to adequately address these hard and important issues. Improving the
efficiency of tooling will help with this too. That's why we are here.

What do you think? Do the efficiencies we are gaining open up room for improved
time/attention to bake protections into the process or am I too hopeful? Head to
[Discord](https://discord.com/invite/dvwXA2N) and share your thoughts!

# Company News

![DVC-Hydra integration](../uploads/images/2022-10-20/hydra.jpeg '=800') _AI
generated image of rainbow feathered dragon (DeeVee + Hydra)_

## DVC-Hydra Integration

Did you hear? DVC has a new integration with Hydra. Now you can use Hydra
composition to configure your DVC experiments. You can also apend and remove
parameters on the fly as well as do a grid search of parameters. Random search
functionlity is coming,
[weigh in on the issue here.](https://github.com/iterative/dvc/issues/8258) Find
out more in [**David de la Iglesia's**](https://twitter.com/daviddelachurch)
[blog post](https://iterative.ai/blog/dvc-hydra-integration).

## October Meetup

If you missed the October Meetup with
[**Nadia Nahar**](https://www.linkedin.com/in/nadia-nahar-iit/) presenting her
team's research on _Collaboration Challenges in Building ML-Enabled Systems:
Communication, Documentation, Engineering, and Process_ don't worry, there's a
video! Catch it below!

https://youtu.be/FKdVSNfnD_M

## November Meetup

Join us for our next meetup on November 16th. We will have
[**Dmytro Filatov**](https://www.linkedin.com/in/dim25/) of
[DeepX](https://deepxhub.com/) presenting _Continous Computer Vision with DVC
and CML_

<external-link
href="https://www.meetup.com/machine-learning-engineer-community-virtual-meetups/events/289088542/"
title="Continuous Computer Vision with DVC and CML"
description="Join us on November 16th. Come see the possibilities with DVC, CML for Computer Vision!"
link="https://meetup.com"
image="../uploads/images/2022-10-20/meetup.png"/>

## Alex Kim - CI/CD for Machine Learning Webinar with ODSC

Join [**Alex Kim**](https://twitter.com/alex000kim) on November 30th with
[ODSC](https://opendatascience.com/) to learn about CI/CD for Machine Learning.
This webinar shares how CML is a project to help ML and data science
practitioners automate their ML model training and model evaluation, using best
practices and tools from software engineering, such as GitLab CI/CD (as well as
GitHub Actions and BitBucket Pipelines). The idea is to automatically train your
model and test it in a production-like environment every time your data or code
changes. In this talk, you'll learn how to:

- Automatically allocate cloud instances (AWS, Azure, GCP) to train ML models.
  And automatically shut the instance down when training is over
- Automatically generate reports with graphs and tables in pull/merge requests
  to summarize your model's performance, using any visualization library
- Transfer data between cloud storage and computing instances with DVC
- Customize your automation workflow with GitLab CI/CD

Sign up for the talk
[here](https://register.gotowebinar.com/register/6817359546805649932?utm_campaign=Webinars&utm_source=Community&utm_medium=Community&utm_content=Webinar%2030th%20Nov%202022).

![Alex Kim ODSC webinar](../uploads/images/2022-10-20/alex-kim.png '=800') _Alex
Kim webinar CI/CD for Machine Learning for ODSC
([Source link](https://register.gotowebinar.com/register/6817359546805649932?utm_campaign=Webinars&utm_source=Community&utm_medium=Community&utm_content=Webinar%2030th%20Nov%202022))_

## It's Hacktoberfest!

![Iterative Hacktoberfest](../uploads/images/2022-10-20/hacktoberfest.png 'Iterative Hacktoberfest :wrap-left =200')
It's Hacktoberfest month and we are participating! Find out all the information
in [**Mert Bozkir's**](https://twitter.com/mertbozkirr)
[blog post](https://iterative.ai/blog/iterative-x-hacktoberfest-2022). But if
you just want to jump in, find all the open HackToBerFest issues
[here.](https://github.com/search?o=desc&q=org%3Aiterative+label%3Ahacktoberfest&s=comments&state=open&type=Issues)
Follow along in the `#hacktoberfest` channel in Discord to keep up to date for
the rest of the month and be sure to read next month's Heartbeat to learn of the
contributions!

## New Hires

[**Ivan Longin**](https://www.linkedin.com/in/ivan-longin/) joins us as a Senior
Software Engineer on the Iterative Studio team from Zadar, Croatia. When Ivan's
not working he likes to spend time doing outdoor activities, swimming in good
weather, and or just walking or often running after his one-year-old! Been there
three times over! ❤️ Welcome Ivan!

# From the Community

This month was full of great content. We wanted to give a shout-out to all of
it, so we are trying out a more abbreviated list.  
Thanks to all these amazing Community members that are sharing their knowledge!
🚀

## DVC

### Data management

- [Data and Machine Learning Model Versioning with DVC](https://towardsdatascience.com/data-and-machine-learning-model-versioning-with-dvc-34fdadd06b15)
  by [**Ruben Winastwan**](https://www.linkedin.com/in/marcellusrubenwinastwan/)
  Nice visuals! ⭐️
- A great guide from [**Willem Meints**](https://www.linkedin.com/in/wmeints/) -
  [Managing Machine Learning Datasets with DVC.](https://fizzylogic.nl/2022/10/14/managing-machine-learning-datasets-with-dvc)
  Also, find his
  [Tweets on Twitter](https://twitter.com/willem_meints/status/1580898467097980932?s=20&t=SD8k9hZ7ygzEFlGBNTyJSA)
- [**Jorge Namour**](https://www.linkedin.com/in/jorgehabibnamour/) will give a
  Webinar on
  [Tracking Data with Git + DVC](https://www.facebook.com/facet.unt/posts/pfbid03ABqt5v1tUhRJJowSZgvjaYdFYfyirxGu9aph6LstYu8rVPJsYeuTBPio9srMn4hl)
  en Español on October 27th
  [at this YouTube link.](https://www.youtube.com/watch?v=pYLEf9FsFic)
- Some GitHub goodness:
  [MLOps - tutorial with DVC, MLFlow, and Pycaret](https://github.com/datarootsio/tutorial-mlops)
  from [**Murilo Cunha**](https://github.com/murilo-cunha),
  [**vspara**](https://github.com/vspara), and
  [**virginiemar**](https://github.com/virginiemar)
- Updated Udemy course that includes DVC -
  [Complete MLOps Bootcamp | From Zero to Hero in Python 2022](https://www.udemy.com/course/complete-mlops-bootcamp-from-zero-to-hero-in-python-2022/?utm_source=aff-campaign&utm_medium=udemyads&LSNPUBID=McqLy3Lfq44&ranMID=47901&ranEAID=McqLy3Lfq44&ranSiteID=McqLy3Lfq44-MTrInsWY4oEt0kDxUzExAg)
- [How to Version Control Your Data and Models with DVC](https://mathdatasimplified.com/2022/10/07/how-to-version-control-your-data-and-models-with-dvc/?utm_source=rss&utm_medium=rss&utm_campaign=how-to-version-control-your-data-and-models-with-dvc)
  (**Video included**) by
  [**Khuyen Tran**](https://www.linkedin.com/in/khuyen-tran-1401/) Dig the DVC
  color-themed command line! 🤩
- NLP and CV with DVC!
  [From UNet to BERT: Extraction of Important Information from Scientific Papers](https://pub.towardsai.net/from-unet-to-bert-extraction-of-important-information-from-scientific-papers-ef0f737e45e9)
  by [**Eman Shemsu**](https://www.linkedin.com/in/eman-shemsu-83473684/)
- [[MLOps] How to use DVC (Data Version Control) data versioning](https://minimin2.tistory.com/m/185)
  in Korean 🇰🇷 by Minimin2

### Data Pipelines

- Great guide from
  [**Déborah Mesquita**](https://www.linkedin.com/in/deborahmesquita/) -
  [The ultimate guide to building maintainable Machine Learning pipelines using DVC](https://towardsdatascience.com/the-ultimate-guide-to-building-maintainable-machine-learning-pipelines-using-dvc-a976907b2a1b)
  (**Video Included**) ⭐️
- Also from [**Khuyen Tran**](https://www.linkedin.com/in/khuyen-tran-1401/):
  [Create a Maintainable Data Pipeline with Prefect and DVC](https://towardsdatascience.com/create-a-maintainable-data-pipeline-with-prefect-and-dvc-1d691ea5bcea)

### Experimentation

- In-depth tutorial covering Data Management, Pipelines and Experimentation with
  DVC [**Gleb Ivashkevich**](https://www.linkedin.com/in/givashkevich/) -
  [Creating Reproducible data Science Workflows with DVC](https://medium.com/y-data-stories/creating-reproducible-data-science-workflows-with-dvc-3bf058e9797b)
  ⭐️
- [Data Version Control (DVC): Beginner's Guide](https://iblog.ridge-i.com/entry/2022/10/11/102033)
  by [**Ajmain Inqiad Alam**](https://www.linkedin.com/in/ajmain-inqiad-alam/)

### Other mentions

- There is now a
  [**DVC Wikipedia page!**](https://en.wikipedia.org/w/index.php?title=Data_Version_Control&diff=1114227867&oldid=1114227707)
- Great discussion around challenges in Machine learning from
  [**Dmytro Samchuk**](https://medium.com/@dvsamchuk) -
  [Machine Learning Done Right in Your Business.](https://medium.com/@dvsamchuk/machine-learning-done-right-in-your-business-130acd3a093e)

## CML

- CML in research! 🤩
  [A Preliminary Investigation of MLOps Practices in GitHub](https://arxiv.org/abs/2209.11453),
  [PDF](https://arxiv.org/pdf/2209.11453.pdf) by
  [**Fabio Calefato**](https://www.linkedin.com/in/fcalefato/),
  [**Filippo Lanubile**](https://www.linkedin.com/in/lanubile/), and
  [**Luigi Quaranta**](https://www.linkedin.com/in/luigi-quaranta-007a6112a/)
- Part III in [**Matt Upson's**:](https://twitter.com/m_a_upson) series
  [MLOps for Conversational AI with Rasa, DVC, and CML (Part III)!](https://medium.com/mantisnlp/mlops-for-conversational-ai-with-rasa-dvc-and-cml-part-iii-f56a29c428f3?source=rss----72ea48936cdc---4)
- [Zen ML adds CML to its Awesome Data Science with Python list.](https://mail-redir.mention.com/api/url?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczpcL1wvZ2l0aHViLmNvbVwvcjBmMVwvZGF0YXNjaWVuY2VcL2NvbW1pdFwvNzMzMTU0YTdjYWJlOGY2MDRlMmMwYzQwOWI2NzRhY2QyODg3NWJhMCIsImFjY291bnRfaWQiOjEwMDMyNDIsImFsZXJ0X2lkIjoyNDM1MTgwLCJzb3VyY2VfaWQiOjY3LCJtZW50aW9uX2lkIjoxNDAzNzIzOTkwMzV9.AQcSYPdGzKBJemSgTDlyPcSeWL7dJTIlULRJaDqDVRg)
  😎
- [**Alessandro Paticchio**](https://www.linkedin.com/in/alessandro-paticchio/)
  (Casavo)
  [Using AI to automatically estimate the status of a façade.](https://medium.com/casavo/using-ai-to-automatically-estimate-the-status-of-a-fa%C3%A7ade-c84c2a90549e)
  ⭐️
- [CI/CD for Machine Learning Model Training with GitHub Actions](https://cmtech.live/2022/08/31/ci-cd-for-machine-learning-model-training-with-github-actions-by-zoumana-keita-aug-2022/)
  by [**Zoumana Keita**](https://www.linkedin.com/in/zoumana-keita/)

## MLEM

- [MLEM Instagram](https://www.instagram.com/tv/Cjnl8CuK2K0/). If you're on IG,
  follow [the_ai_dot](https://www.instagram.com/the_ai_dot/) for AI & ML New,
  Tools & Libraries

## ❤️ Tweet Love

I had a really hard time choosing this month, but I was excited to see this
Tweet from [**Nick Sorros**](https://twitter.com/nsorros) announcing the post
from his colleague [Matt Upson](https://twitter.com/m_a_upson).

https://twitter.com/nsorros/status/1571844138575843331?s=20&t=bsca-6qt4Q1bdmffbSC8Tw

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._

---

📰 [Join our Newsletter](https://share.hsforms.com/1KRL5_dTbQMKfV7nDD6V-8g4sbyq)
to stay up to date with news and contributions from the Community!
