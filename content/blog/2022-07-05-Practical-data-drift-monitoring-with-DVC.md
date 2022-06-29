---
title: 'Practical data drift monitoring with DVC'
date: 2022-07-05
description: >
  Showing how to implement data drift detection with DVC.

descriptionLong: >
  Detection of data drift has recently been put in the spotlight as a very
  important step in the ML system, as we already discussed in [Preventing Stale
  Models in Production](https://dvc.org/blog/stale-models). We will go deeper in
  this blog post and set up an automatic drift detector as part of the ML
  pipeline. Quite a few libraries, even open-source, provide  users with drift
  detection capabilities. We will show how we may integrate  them into the ML
  system with DVC and how, in general, DVC features are  beneficial for data
  drift detection.
picture: TODO
author: dan_martinec
commentsUrl: TODO

tags:
  - Data Validation
  - Machine Learning
  - MLOps
  - Productionization
---

# Introduction

## Data distribution shift

There is a large boom of ML systems deployed to production these days. This
brings many demands to ML engineers. ML pipeline automation is possibly the most
important one. However, there is also one less known but very important aspect.
That is the validation of inputs and outputs of the ML system. In fact, data
validation is listed as one of the
[hidden technical debts in machine learning systems](https://proceedings.neurips.cc/paper/2015/file/86df7dcfd896fcaf2674f757a2463eba-Paper.pdf).
There is a long history of projects that end up in a disaster and that could be
most likely saved by a proper data validation process.

One of the common problems is a data distribution shift. In short, the data the
model uses has significantly changed over time. This results in poor performance
of an ML model. Therefore, detecting a data distribution shift is essential as
soon as possible. There are several types of data distribution shifts. We will
discuss two: a) covariate shift which we’ll cover later and b) concept drift,
which you can see in the figure below. The figure shows the average number of
rented bikes during non-working hours for the last two weekends of April and the
first weekend in May (blue line) vs. the second weekend in May (orange line). We
can see a significant change of pattern in the afternoon hours.

![Example of concept drift](/uploads/images/2022-07-05/example_of_concept_drift.png '=800')

Data validation is a vast topic to cover. We refer to an excellent
[Data Distribution Shifts and Monitoring post](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html)
for a detailed overview and precise definition of covariate shift and concept
drift.

## Project description

We demonstrate the data validation concept on a
[bike-sharing dataset](https://archive.ics.uci.edu/ml/datasets/bike+sharing+dataset)
(same as in
[Preventing Stale Models in Production](https://dvc.org/blog/stale-models)) from
a bike-rental company. The tricky part about this project is that it is highly
correlated to the environmental and seasonal settings. This makes both the ML
model and the drift detector training rather complicated as the input data is
changing all the time, and we need to consider it during ML system design.

| Timestamp        | temp | hum  | windspeed | hour | weekday | season | holiday | workingday | cnt |
| ---------------- | ---- | ---- | --------- | ---- | ------- | ------ | ------- | ---------- | --- |
| 2012-01-01 00:00 | 0.36 | 0.66 | 0         | 0    | 0       | 1      | 0       | 0          | 48  |
| 2012-01-01 01:00 | 0.36 | 0.66 | 0.1343    | 1    | 0       | 1      | 0       | 0          | 93  |
| 2012-01-01 02:00 | 0.32 | 0.76 | 0         | 2    | 0       | 1      | 0       | 0          | 75  |

Due to the seasonality aspect of the data, we cannot apply the drift detector
directly to the input data as we would likely get a drift alert every couple of
weeks. Instead, we need to find another “stable” pattern in the data. There are
three in our case.

The first pattern we need to watch for is the training/test dataset split during
the training of the ML model. Although the test dataset is usually smaller than
the training dataset, we need to ensure that those datasets are similar. A
significantly different feature distribution, the so-called
**[covariate shift](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html#covariate-shift)**
, would either cause bad performance of the model or imprecise evaluation of the
test dataset.

The second and the third patterns are specific to this dataset. We have observed
that working days have two peeks of rented bikes, one in the morning and one in
the afternoon. The non-working days, on the other hand, have a peak in the
afternoon hours. In the figures below, you can see the pattern of March and
April data. The ML model should learn these patterns and also should be
monitored for any change. If these patterns change, then
**[concept drift](https://huyenchip.com/2022/02/07/data-distribution-shifts-and-monitoring.html#concept-drift)**
happens, and our model accuracy significantly drops.

![Daily patterns of rented bikes](/uploads/images/2022-07-05/rented_bikes_days.png)

# Drift detection with DVC

## Drift detectors

We choose to use an open-source library
[Alibi-detect](https://docs.seldon.io/projects/alibi-detect/en/latest/) for the
drift detection. This library provides a unified API for various drift and
outlier detection algorithms. Picking the suitable one depends on the type of
input data and on the pattern we would like to detect. This library supports
both structured and unstructured data.

We will use two different algorithms in our pipeline:

- The
  [MMD drift detector](https://docs.seldon.io/projects/alibi-detect/en/latest/cd/methods/mmddrift.html)
  for the detection of covariate shift (train/test split validation) as it is
  easy to use and gave us good results.
- The
  [Seq2Seq detector](https://docs.seldon.io/projects/alibi-detect/en/latest/examples/od_seq2seq_ecg.html)
  for the detection of concept drift in working and non-working days.

We need to note that the Seq2Seq detector is not a drift detector per se; the
Alibi-detect library categorizes it as an outlier detector. It works with
time-series sequences of data. First, it learns a pattern on a batch of training
data. Then, during the inference phase, it classifies whether the time-series
sequence is an outlier or whether it recognizes its pattern. In our case, one
time-series sequence represents one day of data. We will classify each day as an
outlier/non-outlier, and if we see multiple subsequent outliers, it may signal
that the underlying pattern has changed. This way, we will use an outlier
detector to check for concept drift.

In fact, one of the main difficulties in the drift/outlier detection is that
usually, we can’t use the detection algorithms out of the box as in our case.
But we need to understand what is in the data and apply the algorithm
accordingly.

## DVC pipeline

To use the detectors, we need to train them first. The training process is very
similar to the training of the ML model. Typically, this process consists of 1)
preparing training/test datasets, 2) running the training, and 3) saving the
trained detector for later use.

Although these steps can be done ‘manually’, for example, in a Jupyter notebook,
it quickly becomes challenging to manage the whole process. Particularly if we
would like to use the same training dataset for the ML model and the detectors.
Fortunately, we have a tool called DVC that is a great helper for these
scenarios as we can utilize its three core features. That is:

### 1) Create an ML system pipeline

DVC allows us to create an ML training pipeline that we can run from the
beginning to the end with a single command. We can implement the drift detector
training as part of the pipeline. Then, every time we train a new ML model, we
also train a new drift detector for the input data. This saves us from having
multiple scripts that would have to be run manually.

### 2) Using dvc exp for comparison of different drift detectors

The `dvc exp` command helps us easily compare the performance of different drift
detector configurations during the training phase.

### 3) Versioning and collaboration on drift detectors

In some cases, we may want to train several different drift detectors and use
them either interchangeably or use multiple of them in the production. It may
even happen that another team member prepares each drift detector. DVC helps us
in this effort by allowing us to easily version the detectors and share them
with our colleagues.

The ML pipeline we will create with DVC will consist of several stages. In our
case, we will be utilizing the input dataset for both preparing data for an ML
model as well as drift detectors. Therefore, it makes sense to keep all the data
preprocessing in a single stage. Training of ML model and drift detectors,
however, are independent actions and we may put them into dedicated stages. The
overall pipeline is shown in the figure below

```bash
$ dvc dag
                                                                  +------------------+
                                                            ******| data_preparation |******
                                                 ***********      +------------------+      ***********
                                    *************            *****                    *****            ************
                         ***********                      ***                              ***                     ***********
                  *******                              ***                                    ***                             ***********
+----------------+              +-----------------------------------+              +---------------------------------+                   ******
| model_training |*******       | covariate_drift_detector_training |              | concept_drift_detector_training |      *************
+----------------+       *******+-----------------------------------+              +---------------------------------+******
                                     *************           *****                    *****         *************
                                                  ************    ***              ***   ***********
                                                              **********        *********
                                                                    +------------+
                                                                    | evaluation |
                                                                    +------------+
```

# Training of detectors

We have described why it is necessary to validate data in an ML system and how
DVC could be useful for this task. Now, we will demonstrate how the data
validation, in our case drift detection, is being used in the project.

## Detect drift in the train vs test dataset

First, we will detect covariate shift in the train/test split for ML training.
We would like to use four months of bike-sharing data (January - April), and we
would like to know a good strategy for splitting this data into training and
test datasets. There are many possibilities for how to achieve that. Two
intuitive strategies would be:

- Use January-March data for training and April data for testing.
- Take all months and randomly split the data.

We have set the split strategy as one of the parameters in `params.yaml`, we can
compare them as follows

```bash
$ dvc exp run -S data_preparation.data_split=random -n data-split-random
...
$ dvc exp run -S data_preparation.data_split=month -n data-split-month
...
$ dvc plots diff data-split-month data-split-random --targets plots/temp_feature_distribution.png
```

Below you can see histogram plots that compare two data splits. For simplicity,
we show the plots of value distributions for a single feature, `temp` (
temperature). On the horizontal axis is the value of the `temp` feature. It
ranges from 0 to 1 because it is normalized in the dataset. On the vertical axis
is a relative prevalence of the bin. This prevalence is also normalized, meaning
that the sum of all bins for one dataset is equal to 1.

![Value distributions of 'temp' feature](/uploads/images/2022-07-05/data_distribution.png)

We can see that the covariate shift detector also confirms a drift between the
training and test datasets in the case of the “month” split strategy.

## Detect drift in the day patterns

A concept drift occurs when there is a change in the pattern that the ML model
learns and new data. To learn and detect the pattern, we need to use more
training data, in our case one extra year. With this historical data, we have
learned that there are two bike-rental patterns, one for a working day and one
for a non-working day.

The most important configuration parameter is for us the `latent_dim` , which
represents the latent dimension of the Seq2Seq encoder and decoder, we will
experiment with three different values for each detector. In DVC, we do it as
follows.

```bash
$ dvc exp run --queue -S detector.concept_drift.latent_dim_working=24 -S detector.concept_drift.latent_dim_noworking=6
$ dvc exp run --queue -S detector.concept_drift.latent_dim_working=48 -S detector.concept_drift.latent_dim_noworking=12
$ dvc exp run --queue -S detector.concept_drift.latent_dim_working=96 -S detector.concept_drift.latent_dim_noworking=24
$ dvc exp run --run-all
```

A comparison of the experiments in the VS Code extension looks as follows.

![Experiments comparison in VS Code](/uploads/images/2022-07-05/vs_code_experiments_comparison.png)

We plot the three configurations in a single plot to make the comparison more
transparent. What you can see in the figures below is how well the detectors
learn the pattern in the data. The blue line shows the average relative ratio of
rented bikes daily. The other lines show the reconstructed patterns from the
detector. The more significant the difference between the input and output, the
less accurate the detector is.

![Effect of various latent_dim values on concept drift detector](/uploads/images/2022-07-05/training_concept_drift.png)

# Detection of concept drift in data

At this point, we have trained both the ML model and drift detectors and we are
ready to deploy them. A detailed description of how to deploy these models is
beyond scope of this blog post but you may find inspiration in the
[MLEM blog post](https://dvc.org/blog/MLEM-release). To show how the concept
drift detector performs on the ‘production’ data, we have prepared another DVC
pipeline that is shown in the diagram below. This pipeline has only two stages.
In the first stage, we prepare data that shall mimic production data. In the
second stage, we generate plots. Note that the second stage depends on the
concept drift detector generated by the training pipeline.

```bash
$ dvc dag concept_drift_demo/dvc.yaml
           +------------------+
           | data_preparation |
           +------------------+
                     *
                     *
                     *
    +---------------------------------+
    | concept_drift_detector_training |
    +---------------------------------+
                     *
                     *
                     *
+------------------------------------------------+
| concept_drift_demo\dvc.yaml:evaluation_cd_demo |
+------------------------------------------------+
+------------------------------------------------------+
| concept_drift_demo\dvc.yaml:data_preparation_cd_demo |
+------------------------------------------------------+
```

This pipeline shall represent the following imaginary business scenario. We
train our ML model on January-April data, and it seems to work fine. Let’s
modify the original dataset to simulate the following business scenario: _A new
competitor in the area starts to offer significant discounts for afternoon hours
during weekends. This will have a tremendous effect on the number of rented
bikes. Estimate says that this decreased the number of rented bikes by 70%._ We
can reproduce this scenario by running:

```bash
$ dvc repro concept_drift_demo/dvc.yaml
```

This is the use case where the concept drift detector shall detect that the
pattern has changed. As shown in the figure below, the large reconstruction
error of the detector causes the detector’s feature score to surpass the
detector’s threshold. Therefore, we would detect that there is a concept drift.

![Effect of various latent_dim values on concept drift detector](/uploads/images/2022-07-05/concept_drift_effect.png)

You can further see how this drift affects the error of ML model prediction. It
is almost doubled. ![ML error](/uploads/images/2022-07-05/ML_error.png)

# Conclusion

In this blog post, we showed an example of monitoring data for two cases of data
distribution shift: covariate shift and concept drift. We demonstrated how drift
might affect the data in a possible business scenario. The pivot of the post was
about how DVC is beneficial in drift detection. We saw that we can integrate the
drift detector into the DVC pipeline. This way, as new data will be coming and
we will be re-training the ML model, we will automatically detect if there is a
drift in it. Another benefit of DVC was that we could easily performance of
detectors for various configurations. This will be also important in the future
if we would have to retrain the drift detector.

# Links

- [GitLab project with source codes](https://gitlab.com/iterative.ai/cse/solutions/data-validation-scenario/)
