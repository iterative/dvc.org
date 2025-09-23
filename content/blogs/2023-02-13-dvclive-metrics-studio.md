---
title:
  Real-time visualization of Computer Vision model training with DVC and
  Iterative Studio
date: 2023-02-13
description: >
  Save time and resources by tracking your deep learning experiments
  in  real-time with DVC and Iterative Studio.
descriptionLong: >
  The ability to track machine learning experiments in real time has become
  essential in AI. DVC makes it possible for you to visualize the progress of
  the experiment, share it with team members, and find out early if the
  experiment isn't progressing as planned. You can then stop the experiment if
  needed. Collaboration, time, and resource savings are yours with Iterative
  Studio.
picture: 2023-02-13/dvclive-metrics-studio.jpg
authors:
  - maxim_shmakov
  - alex_kim
  - diglesia
commentsUrl: https://discuss.dvc.org/t/track-computer-vision-experiments-in-real-time-with-dvclive-in-iterative-studio/1478
tags:
  - Live metrics
  - DVCLive
  - Computer vision
  - MLOps
  - DataChain Studio
  - Release
---

Computer vision is a complex field requiring much experimentation and trial and
error to achieve optimal results. However, managing and tracking the progress of
these experiments has not been easy. You can't see it once you've sent it to the
server for training. Keeping an eye on its progress over (often) days makes it
possible to miss something. This makes it difficult to effectively manage your
time and reduce unnecessary resource use. Moreover, a team working on the same
project needs to be able to easily share their results with colleagues. This can
be challenging with existing (or non-existent) tooling.

That's where DVCLive and Iterative Studio come in. These tools offer live
experiment tracking and efficient result sharing, making it easy to optimize
your experimentation process and streamline the workflow with your team.

![Real-time experiment tracking in Iterative Studio](../uploads/images/2023-02-13/live_plots.gif)
_See experiment results in real-time in Iterative Studio_

### The tools at work

[DVCLive](https://dvc.org/doc/dvclive) is a Python library connected to DVC that
provides a real-time experiment logger that allows machine learning engineers to
track the metrics and parameters of their experiments. It is beneficial for
long-running experiments, which can take hours or even days to complete.

[Iterative Studio](https://studio.datachain.ai/) is a
[SaaS](https://en.wikipedia.org/wiki/Software_as_a_service) platform that
displays logged experiments with their metrics, parameters, and plots all tied
together and tracked using DVC and Git under the hood. It allows for rich,
visual, real-time tracking and sharing of the results, making it easy to
collaborate with others and be production-ready efficiently.

![Real-time, nested experiment tracking in Iterative Studio](../uploads/images/2023-02-13/live_metrics.gif)
_Real-time, nested experiment tracking in Iterative Studio_

### Use case: Identifying and segmenting pools from satellite imagery

In this computer vision project (see repo
[here](https://github.com/iterative/example-get-started-experiments)), we embark
on an exciting journey to uncover swimming pools, often obscured from
street-level views, right in the middle of our neighborhoods and cities. Using
[ResNet-18](https://www.mathworks.com/help/deeplearning/ref/resnet18.html) and
[Fast.ai](https://www.fast.ai/), we will be able to accurately identify and
segment pools from satellite images.

![BH-Pools Dataset](../uploads/images/2023-02-13/bh-pools-dataset.png '=800')
_Images and ground truth segmentation of BH-Pools Dataset
([Source link](http://patreo.dcc.ufmg.br/2020/07/29/bh-pools-watertanks-datasets/))_

<admon type="info">

It's worth noting that the experiment in this example is beyond a toy project by
design. It may take around one hour to run on an ordinary laptop, and the time
may vary depending on the specific configuration and settings. However, you can
use a GPU to speed up the process.

</admon>

### Dataset, Methods & Tools

We will use a modified version of the
[BH-Pools dataset](http://patreo.dcc.ufmg.br/2020/07/29/bh-pools-watertanks-datasets/),
which consists of high-resolution 4K images of various neighborhoods in the city
of Belo Horizonte, Brazil. These images were captured through Google Earth Pro
and come pre-annotated with swimming pools and water tanks. For this project, we
will focus on just the swimming pools.

We have made the dataset more manageable with some pre-processing to crop the
images into smaller tiles of 1024x1024 pixels.

When using DVCLive in Iterative Studio, we will be able to see the progress of
our experiments. Let’s get started!

### Getting Set up

Follow the initial setup instructions in the
[README](https://github.com/iterative/example-get-started-experiments). Next, we
need to run `dvc pull` in our root directory to fetch the dataset from our
remote. This command retrieves the data from the remote storage and makes it
available locally for our experiments. Once the download is complete, we will
create a data loader using the label function with `SegmentationDataLoaders`
from the `fastai` library. This data loader allows us to easily load and
preprocess the images (e.g. resizing the images to the desired resolution). You
can dig deeper into the code
[here.](<https://github.com/iterative/example-get-started-experiments/blob/main/src/train.py#:~:text=/%20%22train_data%22-,data_loader%20%3D%20SegmentationDataLoaders.from_label_func(,),-model_names%20%3D%20%5B>)

![BH-Pools Dataset](../uploads/images/2023-02-13/swimming-pools-dataset.png '=800')
_Sample of Belo Horizonte Pools Dataset from `data_loader`
([Source link](http://patreo.dcc.ufmg.br/2020/07/29/bh-pools-watertanks-datasets/))_

After creating the data loader and resizing the images, we train a ResNet-18
model with unet_learner with varying hyperparameters and utilizing the
DVCLiveCallback. The DVCLiveCallback is a built-in logger provided by DVCLive
that allows us to track the intermediate results of the training process, such
as the loss and accuracy of the model, in real-time. By logging these metrics,
we can easily monitor the progress of our model and make adjustments as needed
to optimize the training process and improve the performance of the model.

```python
    learn = unet_learner(
        data_loader, arch=getattr(models, params.train.arch), metrics=DiceMulti
    )

    learn.fine_tune(
        **params.train.fine_tune_args,
        cbs=[DVCLiveCallback(dir="results/train", report="md", dvcyaml=False)],
    )
```

Additionally, we can also use Studio to analyze and visualize the results of our
experiments, making it easy to share and collaborate with others. By providing
the STUDIO_TOKEN, DVCLive will automatically post the results of the experiment
to Studio. To do this, first, let’s obtain an individual token from the user
profile page in Studio.

![Generate Iterative Studio Access token](../uploads/images/2023-02-13/studio-access-token.png '=800')
_Generating Studio Access Token in the Iterative Studio Profile page
([Source link](https://studio.datachain.ai))_

By providing this token as an environment variable, we can access the results of
our experiments in an DVC Studio project. The project lets you compare them with
previous experiments, helps you find insights to improve our model and share it
with others.

![Comparison in DVC Studio](../uploads/images/2023-02-13/iterative-studio-live-metrics.png '=800')
_Compare with previous experiments in DVC Studio
([Source link](https://studio.datachain.ai))_

To export the token run the command below with the token obtained from your
Studio profile:

```bash
export STUDIO_TOKEN=<your-token>
```

Running an experiment locally using DVC will now automatically live-update the
Studio project(s) associated with your git remote (the one named "origin")

You may want to change the parameters and run the experiment again.

```bash
dvc exp run -S train.fine_tune_args.epochs=16 -S train.img_size=512
```

![Experiment tracking in Iterative Studio](../uploads/images/2023-02-13/exp-run.gif '=800')
_Real-time Experiment tracking in Iterative Studio
([Source link](https://studio.datachain.ai))_

As you can see, the change to the epochs and image size brought improvement to
the metrics.

It's safe to say that if you provide the model with a satellite image of any
neighborhood, it will pretty accurately identify all swimming pools in that
image! And by using DVCLive and Studio, we were able to track and efficiently
control the model training process, without squandering expensive training
resources on unfruitful training runs.

### Conclusion

Our work has produced a model which is able to accurately identify and segment
swimming pools from satellite images! With the help of DVCLive and Iterative
Studio, we've been able to visualize results in real-time to make
resource-saving decisions. And finally, this work is readily visible for the
entire team to review!

We’d like to express our gratitude to the creators of the incredible
[BH-Pools dataset](http://patreo.dcc.ufmg.br/about-us/), without which there
would have been less fun and less impressive results!

You can give Iterative Studio a try by signing up
[here](https://studio.datachain.ai). Try out
the [repo](https://github.com/iterative/example-get-started-experiments)
or [colab notebook](https://colab.research.google.com/drive/1NTivljRYiySMJn-SHeWQSycBmSOVUbvA)
for this project and let us know what you think
in [Discord](https://discordapp.com/invite/dvwXA2N) or
[Discourse](https://discuss.dvc.org/t/track-computer-vision-experiments-in-real-time-with-dvclive-in-iterative-studio/1478)!

<admon type="info">

Learn more about enhancing your machine learning experimentation with these blog
posts:

- [Experiment Tracking with DVC and Python](https://iterative.ai/blog/exp-tracking-dvc-python)
- [DVC and Hydra Integration](https://iterative.ai/blog/dvc-hydra-integration/).

</admon>

---

_Have something great to say about our tools? We'd love to hear it! Head to
[this page](https://testimonial.to/iterative-open-source-community-shout-outs)
to record or write a Testimonial! Join our
[Wall of Love ❤️](https://testimonial.to/iterative-open-source-community-shout-outs/all)_

_Do you have any use case questions or need support? Join us in
[Discord](https://discord.com/invite/dvwXA2N)!_

_Head to the [DVC Forum](https://discuss.dvc.org/) to discuss your ideas and
best practices._
