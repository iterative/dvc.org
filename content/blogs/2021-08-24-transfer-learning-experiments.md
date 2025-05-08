---
title: Using Experiments for Transfer Learning
date: 2021-08-24
description: >
  You can work with pretrained models and fine-tune them with DVC experiments.
descriptionLong: >
  DVC experiments help fine-tune models by tracking code and data changes.
picture: 2021-08-24/pretrained-models.png
pictureComment: Using Experiments to Improve Pre-trained Models
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/using-experiments-for-transfer-learning/846
tags:
  - MLOps
  - Experiments
  - Reproducibility
  - DVC
  - Pre-trained Models
  - Tutorial
---

## Intro

There are plenty of machine learning models available that have been trained to
solve one problem and the knowledge gained from that can be applied to a new,
yet related problem. For example, a model like AlexNet has been trained on
millions of images so you could potentially use this to classify cars, animals,
or even people. This is called
[transfer learning](https://towardsdatascience.com/a-comprehensive-hands-on-guide-to-transfer-learning-with-real-world-applications-in-deep-learning-212bf3b2f27a)
and it can save a lot of time on developing a model from scratch.

https://youtu.be/S3Hm_BPLie0

For us to take advantage of transfer learning, we can use fine-tuning to adopt
the model to our new problem. In many cases, we start by replacing the last
layer of the model. With the AlexNet example, this might mean the last layer was
previously used to classify cars but our new problem is classifying animals.

Even though we already have the bulk of the model defined, we'll still have to
do some experimentation to determine whether we need to replace more layers in
the model or if any other changes need to be made.

In this post, we'll go through an example of fine-tuning
[AlexNet](https://towardsdatascience.com/alexnet-the-architecture-that-challenged-cnns-e406d5297951)
and
[SqueezeNet](https://towardsdatascience.com/review-squeezenet-image-classification-e7414825581a)
to classify bees and ants. We'll use DVC to handle experiments for us and we'll
compare the results of both models at the end.

## Initialize the pre-trained model

We'll be fine-tuning the AlexNet model and the SqueezeNet model to classify
images of bees and ants. You can find the project we're working with in
[this repo](https://github.com/iterative/pretrained-model-demo), which is based
on the tutorial over at
[this post](https://pytorch.org/tutorials/beginner/finetuning_torchvision_models_tutorial.html).

In the `pretrained_model_tuner.py` file, you'll find the code that defines both
the AlexNet and SqueezeNet models. We start by initializing these models so we
can get the number of model features and the input size we need for fine-tuning.

Since the project has everything we need to initialize the models, we can start
training and comparing the differences between them with the ants/bees dataset.
Running experiments to get the best tuning for each model can make it difficult
to see which changes led to a better result. That's why we will be using DVC to
track changes in the code and the data.

## Adding the train stage

Stages in DVC let us define individual data processes and can be used to build
detailed machine learning pipelines. You have the ability to define the
different steps of model creation like preprocessing, featurization, and
training.

We currently have a `train` stage in the `dvc.yaml` file. If you take a look at
it, you'll see something like:

```yaml
stages:
  train:
    cmd: python pretrained_model_tuner.py
    deps:
      - data/hymenoptera_data
      - pretrained_model_tuner.py
    params:
      - lr
      - momentum
      - model_name
      - num_classes
      - batch_size
      - num_epochs
    outs:
      - model.pt:
          checkpoint: true
    live:
      results:
        summary: true
        html: true
```

The reason we need this `dvc.yaml` file is so DVC knows what to pay attention to
in our workflow. It will start managing data, understand which metrics to pay
attention to, and what the expected output for each step is.

You'll typically add stages to `dvc.yaml` using the `dvc stage add` command and
this is one of the ways you can add new stages or update existing ones.

With the `train` stage defined, let's look at where the metrics actually come
from in the code. If you open `pretrained_model_tuner`, you'll see a line where
we dump the accuracy and loss for the training epochs into the `results.json`
file. We're also saving the model on the epoch run and recording metrics for
each epoch using `dvclive` logging.

```python
if phase == 'train':
    torch.save(model.state_dict(), "model.pt")

    dvclive.log('acc', epoch_acc.item())
    dvclive.log('loss', epoch_loss)
    dvclive.log('training_time', epoch_time_elapsed)

if phase == 'val':
    dvclive.log('val_acc', epoch_acc.item())
    dvclive.log('val_loss', epoch_loss)

    val_acc_history.append(epoch_acc)

    dvclive.next_step()
```

This code is needed to let DVC access the metrics in the project because it will
read the metrics from the `dvclive.json` file.

Since we have several hyperparameters set in the `params.yaml`, we need to use
those values when we run the training stage. The following code makes the
hyperparameter values accessible in the `train` function.

```python
with open("params.yaml") as f:
    yaml=YAML(typ='safe')
    params = yaml.load(f)
```

With all of this in place, we can finally start running experiments to fine-tune
the two models.

## Fine-tuning AlexNet

You can find the code that initializes the AlexNet model in the
`initialize_model` function in `pretrained_model_tuner.py`. Since we have DVC
set up, we can jump straight into fine-tuning this model to see which
hyperparameters give us the best accuracy.

We'll run the first experiment with the following command.

```dvc
$ dvc exp run
```

This will execute the `pretrained_model_tuner.py` script and run for 5 epochs
since that's what we defined in `params.yaml`. When this finishes, you can check
out the metrics from this run with the current hyperparameter values.

```dvc
$ dvc exp show
```

You'll see a table similar to this.

```dvctable
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                neutral:**Created**    metric:**step**       metric:**acc**      metric:**loss**   metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**      param:**momentum**   param:**model_name**   param:**num_classes**   param:**batch_size**   param:**num_epochs**
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                 -             **4**   **0.92623**   **0.19567**          **229.18**    **0.9085**    **0.25145**   **0.001**   **0.09**       **alexnet**      **2**             **8**            **5**
  **main**                      **01:58 PM**      -         -         -               -         -          -   **0.001**   **0.09**       **alexnet**      **2**             **8**            **5**
  │ ╓ bf81637 [exp-a1f53]   02:05 PM      4   0.92623   0.19567          229.18    0.9085    0.25145   0.001   0.09       alexnet      2             8            5
  │ ╟ 9ca3fb8               02:04 PM      3   0.89344   0.27423          178.34   0.90196    0.26965   0.001   0.09       alexnet      2             8            5
  │ ╟ a34ead1               02:03 PM      2   0.87295   0.29018          127.36    0.9085     0.2796   0.001   0.09       alexnet      2             8            5
  │ ╟ ae382c7               02:02 PM      1   0.89754   0.26993          76.419   0.89542    0.31113   0.001   0.09       alexnet      2             8            5
  ├─╨ a95260d               02:01 PM      0   0.73361    0.5271           25.71   0.86928    0.36408   0.001   0.09       alexnet      2             8            5
 ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Now let's update the hyperparameters and run another experiment. There are
several ways to do this with DVC:

- Change the hyperparameter values directly in `params.yaml`
- Update the values using the `--set-param` or the shorthand `-S` option on
  `dvc exp run`
- Queue multiple experiments with different values using the `--queue` option on
  `dvc exp run`

We'll do an example of each of these throughout the rest of this article.

Let's start by updating the hyperparameter values in `params.yaml`. You should
have these values in your file.

```yaml
lr: 0.009
momentum: 0.017
```

Now run another experiment with `dvc exp run`. To make the table more readable,
we're going to specify the parameters we want to show and take a look at the
metrics with:

```dvc
$ dvc exp show --no-timestamp --include-params lr,momentum,model_name
```

Your table should look something like this now. Since we're using checkpoints,
note that we continue training additional epochs on top of your previous
experiment. You'll see what it takes to start training from scratch later.

```dvctable
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**      metric:**loss**   metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**      param:**momentum**   param:**model_name**
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                    **9**   **0.91803**   **0.27989**          **228.59**   **0.82353**    **0.69077**   **0.009**   **0.017**      **alexnet**
  **main**                         **-**         **-**         **-**               **-**         **-**          **-**   **0.001**   **0.09**       **alexnet**
  │ ╓ 2361cff [exp-c0b11]      9   0.91803   0.27989          228.59   0.82353    0.69077   0.009   0.017      alexnet
  │ ╟ 7686d2f                  8   0.90984   0.23496          177.65   0.87582    0.50887   0.009   0.017      alexnet
  │ ╟ 671f8cd                  7   0.88934   0.39237           126.7   0.86928    0.47856   0.009   0.017      alexnet
  │ ╟ ea1bf61                  6   0.84836    0.4195          75.834   0.91503    0.30885   0.009   0.017      alexnet
  │ ╟ a9f8dab (bf81637)        5   0.79508   0.72891          25.219   0.66667     1.0311   0.009   0.017      alexnet
  │ ╓ bf81637 [exp-a1f53]      4   0.92623   0.19567          229.18    0.9085    0.25145   0.001   0.09       alexnet
  │ ╟ 9ca3fb8                  3   0.89344   0.27423          178.34   0.90196    0.26965   0.001   0.09       alexnet
  │ ╟ a34ead1                  2   0.87295   0.29018          127.36    0.9085     0.2796   0.001   0.09       alexnet
  │ ╟ ae382c7                  1   0.89754   0.26993          76.419   0.89542    0.31113   0.001   0.09       alexnet
  ├─╨ a95260d                  0   0.73361    0.5271           25.71   0.86928    0.36408   0.001   0.09       alexnet
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Finding good values for hyperparameters can take a few iterations, even when
you're working with a pretrained model. So we'll run one more experiment to
fine-tune this AlexNet model. This time we'll do it using the `-S` option.

```dvc
$ dvc exp run -S lr=0.025 -S momentum=0.5 -S num_epochs=2
```

The updated table will have values similar to this.

```dvctable
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**      metric:**loss**    metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**      param:**momentum**   param:**model_name**
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                   **11**   **0.88525**    **1.1355**           **76.799**    **0.9085**     **1.7642**   **0.025**   **0.5**        **alexnet**
  **main**                         **-**         **-**          **-**               **-**         **-**          **-**   **0.001**   **0.09**       **alexnet**
  │ ╓ 54e87bc [exp-52406]     11   0.88525    1.1355           76.799    0.9085     1.7642   0.025   0.5        alexnet
  │ ╟ b2b9ad0 (2361cff)       10   0.79098    2.9427           25.715    0.8366     1.4148   0.025   0.5        alexnet
  │ ╓ 2361cff [exp-c0b11]      9   0.91803   0.27989           228.59   0.82353    0.69077   0.009   0.017      alexnet
  │ ╟ 7686d2f                  8   0.90984   0.23496           177.65   0.87582    0.50887   0.009   0.017      alexnet
  │ ╟ 671f8cd                  7   0.88934   0.39237            126.7   0.86928    0.47856   0.009   0.017      alexnet
  │ ╟ ea1bf61                  6   0.84836    0.4195           75.834   0.91503    0.30885   0.009   0.017      alexnet
  │ ╟ a9f8dab (bf81637)        5   0.79508   0.72891           25.219   0.66667     1.0311   0.009   0.017      alexnet
  │ ╓ bf81637 [exp-a1f53]      4   0.92623   0.19567           229.18    0.9085    0.25145   0.001   0.09       alexnet
```

If you take a look at the metrics and the corresponding hyperparameter values,
you'll see which direction you should try next with your values. That's one way
we can use DVC to fine-tune AlexNet for this particular dataset.

## Fine-tuning SqueezeNet

We'll switch over to fine-tuning SqueezeNet now that you've seen how the process
works in DVC. You'll need to update the `model_name` hyperparameter in
`params.yaml` to `squeezenet` if you're following along. The other
hyperparameter values can stay the same for now.

This is a good time to note that DVC is not only tracking the changes of your
hyperparameters for each experiment, it also tracks any code changes and dataset
changes as well.

Let's run one experiment with `dvc exp run --reset` just to show the difference
in the metrics between the two models. Remember, since we're using checkpoints
it continues training on top of the previous experiment. That's why we're using
the `--reset` option here so that we can start a fresh experiment for the new
model. You should see results similar to this in your table.

```dvctable
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**      metric:**loss**   metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**      param:**momentum**   param:**model_name**
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                    **1**   **0.85656**   **0.35667**          **83.414**   **0.87582**    **0.34273**   **0.025**   **0.5**        **squeezenet**
  **main**                         -         -         -               -         -          -   **0.001**   **0.09**       **squeezenet**
  │ ╓ 87ccd2e [exp-95f0f]      1   0.85656   0.35667          83.414   0.87582    0.34273   0.025   0.5        squeezenet
  ├─╨ 7d2fafc                  0   0.80328   0.50723          29.165   0.89542     0.3987   0.025   0.5        squeezenet
  │ ╓ 54e87bc [exp-52406]     11   0.88525    1.1355          76.799    0.9085     1.7642   0.025   0.5        alexnet
  │ ╟ b2b9ad0 (2361cff)       10   0.79098    2.9427          25.715    0.8366     1.4148   0.025   0.5        alexnet
  │ ╓ 2361cff [exp-c0b11]      9   0.91803   0.27989          228.59   0.82353    0.69077   0.009   0.017      alexnet
```

The newest experiment has an accuracy that's significantly different since we
switched models. That tells us that the hyperparameter values that were good for
AlexNet might not work the best for SqueezeNet.

So we'll need to run a few experiments to find the best hyperparameter values.
This time, we'll take advantage of queues in DVC to set up the experiments and
then run them at the same time. To set up a queue, we'll run this command.

```dvc
$ dvc exp run --queue -S lr=0.0001 -S momentum=0.9 -S num_epochs=2
```

Running this sets up an experiment for future execution so we'll go ahead a run
this command one more time with different values.

```dvc
$ dvc exp run --queue -S lr=0.001 -S momentum=0.09 -S num_epochs=2
```

You can check out the details for the queues you have in place by looking at the
experiments table with `dvc exp show`. You'll see something like this.

```dvctable
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**      metric:**loss**   metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**      param:**momentum**   param:**model_name**
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                    **1**   **0.85656**   **0.35667**          **83.414**   **0.87582**    **0.34273**   **0.025**   **0.5**        **squeezenet**
  **main**                         -         -         -               -         -          -   **0.001**   **0.09**       **squeezenet**
  │ ╓ 87ccd2e [exp-95f0f]      1   0.85656   0.35667          83.414   0.87582    0.34273   0.025   0.5        squeezenet
  ├─╨ 7d2fafc                  0   0.80328   0.50723          29.165   0.89542     0.3987   0.025   0.5        squeezenet
  │ ╓ 54e87bc [exp-52406]     11   0.88525    1.1355          76.799    0.9085     1.7642   0.025   0.5        alexnet
  │ ╟ b2b9ad0 (2361cff)       10   0.79098    2.9427          25.715    0.8366     1.4148   0.025   0.5        alexnet
  │ ╓ 2361cff [exp-c0b11]      9   0.91803   0.27989          228.59   0.82353    0.69077   0.009   0.017      alexnet
  │ ╟ 7686d2f                  8   0.90984   0.23496          177.65   0.87582    0.50887   0.009   0.017      alexnet
  │ ╟ 671f8cd                  7   0.88934   0.39237           126.7   0.86928    0.47856   0.009   0.017      alexnet
  │ ╟ ea1bf61                  6   0.84836    0.4195          75.834   0.91503    0.30885   0.009   0.017      alexnet
...
  ├── *2df7fa5                -          -          -         -         -               -   0.0001  0.9        squeezenet
  ├── *699dcae                -          -          -         -         -               -   0.001   0.09       squeezenet
 ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

Then you can execute all of the queues with this command.

```dvc
$ dvc exp run --run-all
```

Now if you take a look at your table, you'll see the metrics from those 3
experiments.

```dvctable
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  neutral:**Experiment**                metric:**step**       metric:**acc**      metric:**loss**   metric:**training_time**   metric:**val_acc**   metric:**val_loss**   param:**lr**       param:**momentum**   param:**model_name**
 ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
  **workspace**                    **5**   **0.76639**   **0.49865**          **85.705**   **0.81699**     **0.4518**   **0.001**    **0.09**       **squeezenet**
  **main**                         -         -         -               -         -          -   **0.001**    **0.09**       **squeezenet**
  │ ╓ 699dcae [exp-8322f]      5   0.76639   0.49865          85.705   0.81699     0.4518   0.001    0.09       squeezenet
  │ ╟ d26c25b (2df7fa5)        4   0.60246   0.68464          29.243   0.69935    0.55156   0.001    0.09       squeezenet
  │ ╓ 2df7fa5 [exp-d1c65]      3   0.78689     0.488          83.929   0.83007    0.41527   0.0001   0.9        squeezenet
  │ ╟ 05e1b41 (87ccd2e)        2   0.59016   0.76999          28.455   0.75163    0.49807   0.0001   0.9        squeezenet
  │ ╓ 87ccd2e [exp-95f0f]      1   0.85656   0.35667          83.414   0.87582    0.34273   0.025    0.5        squeezenet
  ├─╨ 7d2fafc                  0   0.80328   0.50723          29.165   0.89542     0.3987   0.025    0.5        squeezenet
  │ ╓ 54e87bc [exp-52406]     11   0.88525    1.1355          76.799    0.9085     1.7642   0.025    0.5        alexnet
  │ ╟ b2b9ad0 (2361cff)       10   0.79098    2.9427          25.715    0.8366     1.4148   0.025    0.5        alexnet
  │ ╓ 2361cff [exp-c0b11]      9   0.91803   0.27989          228.59   0.82353    0.69077   0.009    0.017      alexnet
  │ ╟ 7686d2f                  8   0.90984   0.23496          177.65   0.87582    0.50887   0.009    0.017      alexnet
```

Then you'll be able to make a decision on which way to go with your fine-tuning
efforts and make a decision on which model works best for your project. In this
case, it seems like SqueezeNet might be the winner!

You can take all of the DVC setup and apply this to your own custom fine-tuning
use case.

## Conclusion

When you're working with pretrained models, it can be hard to fine-tune them to
give you the results you need. You might end up replacing the last layer of the
model to fit your problem or you might need to dig deeper. Then you have to
consider updating the hyperparameter values until you get the best model you
can.

That's why it's important to research tools that make this process more
efficient. Using DVC to help with this kind of experimentation will give you the
ability to reproduce any experiment you run, making it easier to collaborate
with others on a project. It will also help you keep track of what you've
already tried in previous experiments.
