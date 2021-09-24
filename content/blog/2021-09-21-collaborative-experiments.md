---
title: Running Collaborative Experiments
date: 2021-09-21
description: |
  Sharing experiments with teammates can help you build models more efficiently.
descriptionLong: |
  You can use DVC remotes to share experiments and their data across machines.
picture: 2021-09-21/collaborative-experiments.png
pictureComment: Running Collaborative Experiments
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/tuning-hyperparameters-with-reproducible-experiments/821
tags:
  - MLOps
  - DVC
  - Git
  - Experiments
  - Collaboration
---

## Intro

Sharing experiments to build machine learning model is important in order to
create the best model as quickly as possible. You might have a new engineer join
the team and you want to get their workspace ready quickly. Situations come up
where you want to run experiments in differnt environments and you need to
reproduce them.

Setting up DVC remotes lets you share all of the data, code, and hyperparameters
associated with each experiment so anyone can pick up where you left off in the
training process. We'll go through an example of sharing an experiment with DVC
remotes.

## Getting the project

To follow along, you can fork
[this repo](https://github.com/iterative/example-dvc-experiments) as one of your
own GitHub repos. That way you'll have push and pull access when we start
working with DVC. You do need to run the following command to be able to use the
DVC CLI.

```dvc
dvc init
```

This project already has DVC files set up to run experiments, but if you want to
follow along with a project you're currently working on, make sure to check out
the steps to initialize a DVC pipeline in
[the Getting Started doc](https://dvc.org/doc/start).

## Setting up your DVC remotes

When you want to share the progress you've made with training your model, that
usually means you need to find a way to bundle the code, data, and
hyperparameters. This could be a complicated process if you're working with GBs
worth of data or you have a large number of hyperparameters.

That's one of the uses for DVC and why we'll be working with remotes. To start
with, make sure your GitHub remote is configured correctly. It should use the
SSH version of the URL. This is so DVC can authenticate the pushes and pulls
from GitHub it needs as part of experiment sharing.

The way DVC works is by storing custom Git refs in your repo with metadata that
defines the experiment. You can learn more about how DVC uses custom Git refs in
[this post](https://dvc.org/blog/experiment-refs).

Next, you'll need to set up a remote to your data location. This could be an AWS
S3 bucket, a Google Drive, or
[one of the other supported storage types](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).
For this example, we'll be using a Google Drive folder as the remote to handle
data storage.

You can learn more about the Google Drive setup in
[the docs](https://dvc.org/doc/command-reference/remote/add). The main thing you
need to know is that you need the folder id for the remote location you want to
set up. You can find that id in the URL for that folder. It'll look similar to
this.

```dvc
https://drive.google.com/drive/folders/1k6aUYWphOulJlXgq4XbfKExWGyymTpEl?usp=sharing
```

Now that you know what we're doing, let's run the command to set up our DVC
remote.

```dvc
dvc remote add -d cloud_remote gdrive://1k6aUYWphOulJlXgq4XbfKExWGyymTpEl
```

This adds the remote storage named `cloud_remote` for DVC to track and we'll be
able to push and pull the exact code and data to reproduce any experiment from
end to end. With your Git remote and DVC remote in place, you can start pulling
data and experiments from the cloud to your local machine.

## Listing your remote experiments

When you're working with a team on an existing project, you might want to see
the experiments already in the remotes so you know what's available. You can
take a look at all of the experiments with the following command.

```dvc
dvc exp list origin --all
```

You'll get a list of all of the experiments across different Git branches that
have been pushed with DVC. The output will look similar to this.

```dvc
21784fa:
        exp-c8dcf
main:
        exp-b3667
        exp-d382a
```

Now you'll be able to pick which experiment you want to reproduce and start
testing with.

## Pulling experiments

If you're picking up an existing project, there will likely be a specific
experiment you'll get started with. To pull an experiment to your local machine,
you'll need an experiment id for the following command.

```dvc
dvc exp pull origin exp-b3667
```

The `exp-b3667` comes from the `dvc exp list` command we ran earlier and now you
have all of the data and code associated with that experiment on your machine.

From here, you can start running new experiments with different models,
hyperparameters, or even datasets.

## Pushing experiments

Once you're done with your new experiments, you can push these to the same
remote you pulled from. DVC handles both the GitHub and data storage pushes with
this command.

```dvc
dvc exp push origin exp-p4202
```

This will push the custom Git refs to your repo and it will push any artifacts,
like your data or model output, to the DVC remote location. If you have
checkpoints enabled, it will also push the checkpoints of an experiment. Now you
can easily share your work with other engineers to get feedback faster and
finish projects sooner.

## Conclusion

It's a lot easier to get help from someone on a project when you can share
everything with them. When you use DVC, you can bundle your data and code
changes for each experiment and push those to a remote for somebody else to
check out.
