---
title: Data Version Control in Analytics DevOps Paradigm
date: 2017-07-27
description: |
  Why DevOps matters in data science, what specific challenges data scientists
  face in the day to day work, and how do we setup a better environment for the
  team.
descriptionLong: |
  The eternal dream of almost every Data Scientist today is to spend all the
  time exploring new datasets, engineering new features, inventing and
  validating cool new algorithms and strategies. However, daily routines of a
  Data Scientist include raw data pre-processing, dealing with infrastructure,
  bringing models to production. That's where good DevOps practices and skills
  are essential and will certainly be beneficial for industrial Data Scientists
  as they can address the above-mentioned challenges in a self-service manner.
picture: 2017-07-27/post-image.jpeg
author: george_vyshnya
commentsUrl: https://discuss.dvc.org/t/data-version-control-in-analytics-devops-paradigm/297
tags:
  - DevOps
---

## Data Science and DevOps Convergence

The primary mission of DevOps is to help the teams to resolve various Tech Ops
infrastructure, tools and pipeline issues.

At the other hand, as mentioned in the conceptual review by
[Forbes](https://www.forbes.com/sites/teradata/2016/11/14/devops-for-data-science-why-analytics-ops-is-key-to-value/)
in November 2016, the industrial analytics is no more going to be driven by data
scientists alone. It requires an investment in DevOps skills, practices and
supporting technology to move analytics out of the lab and into the business.
There are even
[voices](https://www.computing.co.uk/ctg/news/2433095/a-lot-of-companies-will-stop-hiring-data-scientists-when-they-realise-that-the-majority-bring-no-value-says-data-scientist)
calling Data Scientists to concentrate on agile methodology and DevOps if they
like to retain their jobs in business in the long run.

## Why DevOps Matters

The eternal dream of almost every Data Scientist today is to spend all (well,
almost all) the time in the office exploring new datasets, engineering decisive
new features, inventing and validating cool new algorithms and strategies.
However, reality is often different. One of the unfortunate daily routines of a
Data Scientist work is to do raw data pre-processing. It usually translates to
the challenges to

1.  **Pull all kinds of necessary data from a variety of sources**

    - Internal data sources like ERP, CRM, POS systems, or data from online
      e-commerce platforms

    - External data, like weather, public holidays, Google trends etc.

2.  **Extract, transform, and load the data**

    - Relate and join the data sources

    - Aggregate and transform the data

3.  **Avoid technical and performance drawbacks** when everything ends up in
    “one big table” at the end

4.  **Facilitate continuous machine learning and decision-making in a
    business-ready framework**

    - Utilize historic data to train the machine learning models and algorithms

    - Use the current, up-to-date data for decision-making

    - Export back the resulting decisions/recommendations to review by business
      stakeholders, either back into the ERP system or some other data warehouse

Another big challenge is to organize **collaboration and data/model sharing**
inside and across the boundaries of teams of Data Scientists and Software
Engineers.

DevOps skills as well as effective instruments will certainly be beneficial for
industrial Data Scientists as they can address the above-mentioned challenges in
a self-service manner.

## Can DVC Be a Solution?

[Data Version Control](https://dvc.org) or simply DVC comes to the scene
whenever you start looking for effective DevOps-for-Analytics instruments.

DVC is an open source tool for data science projects. It makes your data science
projects reproducible by automatically building data dependency graph (DAG).
Your code and the dependencies could be easily shared by Git, and data — through
cloud storage (AWS S3, GCP) in a single DVC environment.

> Although DVC was created for machine learning developers and data scientists
> [originally](https://dvc.org/doc/understanding-dvc/what-is-dvc), it appeared
> to be useful beyond it. Since it brings proven engineering practices to not
> well defined ML process, I discovered it to have enormous potential as an
> Analytical DevOps instrument.

It clearly helps to manage a big fraction of DevOps issues in daily Data
Scientist routines

1. **Pull all kinds of necessary data from a variety of sources**. Once you
   configure and script your data extraction jobs with DVC, it will be
   persistent and operable across your data and service infrastructure

2. **Extract, transform, and load the data**. ETL is going to be easy and
   repeatable once you configure it with DVC scripting. It will become a solid
   pipeline to operate without major supportive effort. Moreover, it will track
   all changes and trigger an alert for updates in the pipeline steps via DAG.

3. **Facilitate continuous machine learning and decision-making.** The part of
   the pipeline facilitated through DVC scripting can be jobs to upload data
   back to any transactional system (like ERP, ERM, CRM etc.), warehouse or data
   mart. It will then be exposed to business stakeholders to make intelligent
   data-driven decisions.

4. **Share your algorithms and data**. Machine Learning modeling is an iterative
   process and it is extremely important to keep track of your steps,
   dependencies between the steps, dependencies between your code and data files
   and all code running arguments. This becomes even more important and
   complicated in a team environment where data scientists’ collaboration takes
   a serious amount of the team’s effort. DVC will be the arm to help you with
   it.

One of the ‘juicy’ features of DVC is ability to support multiple technology
stacks. Whether you prefer R or use promising Python-based implementations for
your industrial data products, DVC will be able to support your pipeline
properly. You can see it in action for both
[Python-based](https://blog.dvc.org/how-data-scientists-can-improve-their-productivity)
and
[R-based](https://blog.dvc.org/r-code-and-reproducible-model-development-with-dvc)
technical stacks.

As such, DVC is going to be one of the tools you would enjoy to use if/when you
embark on building continual analytical environment for your system or across
your organization.

## Continual Analytical Environment and DevOps

Building a production pipeline is quite different from building a
machine-learning prototype on a local laptop. Many teams and companies face the
challenges there.

At the bare minimum, the following requirements shall be met when you move your
solution into production

1. Periodic re-training of the models/algorithms

2. Ease of re-deployment and configuration changes in the system

3. Efficiency and high performance of real-time scoring the new out-of-sample
   observations

4. Availability of the monitor model performance over time

5. Adaptive ETL and ability to manage new data feeds and transactional systems
   as data sources for AI and machine learning tools

6. Scaling to really big data operations

7. Security and Authorized access levels to different areas of the analytical
   systems

8. Solid backup and recovery processes/tools

This goes into the territory traditionally inhabited by DevOps. Data Scientists
should ideally learn to handle the part of those requirements themselves or at
least be informative consultants to classical DevOps gurus.

DVC can help in many aspects of the production scenario above as it can
orchestrate relevant tools and instruments through its scripting. In such a
setup, DVC scripts will be sharable manifestation (and implementation) of your
production pipeline where each step can be transparently reviewed, easily
maintained, and changed as needed over time.

## Will DevOps Be Captivating?

If you are further interested in understanding the ever-proliferating role of
DevOps in the modern Data Science and predictive analytics in business, there
are good resources for your review below

1. [DevOps For Data Science: Why Analytics Ops Is Key To Value](https://www.forbes.com/sites/teradata/2016/11/14/devops-for-data-science-why-analytics-ops-is-key-to-value/)
   (Forbes, Nov 14, 2016)

2. [Bridging the Gap Between Data Science and DevOps](https://www.packtpub.com/books/content/bridging-gap-between-data-science-and-devops)

3. [Is DevOps Making Life Better for Data Scientists?](https://devops.com/devops-life-better-data-scientists/)

By any mean, DVC is going to be a useful instrument to fill the multiple gaps
between the classical in-lab old-school data science practices and growing
demands of business to build solid DevOps processes and workflows to streamline
mature and persistent data analytics.
