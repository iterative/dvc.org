---
title: January '22 Community Gems
date: 2022-01-31
description: >
  A roundup of technical Q&A's from the DVC and CML communities. This month: DVC
  Studio data, DVC for non-ML projects, getting started with CML, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML communities. This month: DVC
  Studio data, DVC for non-ML projects, getting started with CML, and more.
picture: 2022-01-31/jan-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/january-22-community-gems/1020
tags:
  - DataChain Studio
  - CML
  - DVC Remotes
  - Pipelines
  - Community Gems
---

### [Is it possible to stream objects to and from remote caches?](https://discord.com/channels/485586884165107732/563406153334128681/919567459189682177)

Thanks for asking @mihaj!

You can stream files using the [DVC API](https://dvc.org/doc/api-reference).
There are two methods that you'll likely want to check out. First there's
`dvc.api.open()`. This opens a file tracked by DVC and generates a corresponding
file object. Here's a quick example:

```python
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
        # do things with the file object here
```

The simplest way to return the contents from a DVC tracked file would be to use
`dvc.api.read()`. The returned content can be a bytearray or string. Here's a
little example of this being used:

```python
import pickle
import dvc.api

model = pickle.loads(
    dvc.api.read(
        'model.pkl',
        repo='https://github.com/iterative/example-get-started'
        mode='rb'
        )
    )
```

### [One of the steps in my DVC pipeline uses a `pip` installed package. What is the best way to make sure that DVC re-runs the steps that depend on that package?](https://discord.com/channels/485586884165107732/563406153334128681/920139825284280381)

Thanks for the question @alphaomega!

The best way to handle any package dependencies is to include a
`requirements.txt` file with the specific versions your pipeline needs.

Another approach you can take is having a stage that dumps the package version
as an intermediate output. It doesn't have to be saved in Git or DVC because
it's easily reproduced and DVC should be able to take care of detecting that the
package didn't change. Here's an example of a stage that does this.

```yaml
stages:
  package_version:
    cmd: pip freeze | grep "package_name==" > package_name_version.txt
    outs:
      - package_name_version.txt
  train:
    cmd: python train.py
    deps:
      - package_name_version.txt
```

### [Does DVC save dependencies which are in the `dvc.yaml` pipeline to the cache?](https://discord.com/channels/485586884165107732/563406153334128681/920659549835370497)

Thanks for another great question @rie!

DVC doesn't track the pipeline dependencies in the cache or storage, only the
outputs. If you want DVC to track a pure data dependency that's not an output of
a different stage, you need to track it with `dvc add ...`

The output of a pipeline might be something like `data.dvc`, while a pure
dependency might be a file that's just a part of the project, like `script.py`.
That's why you'll need to use the `dvc add` command to track this.

### [What is the difference between Kubeflow pipelines and DVC pipelines?](https://discord.com/channels/485586884165107732/563406153334128681/922728960478035978)

This is a fantastic question! Thanks for asking @ramakrishnamamidi!

A major difference is that DVC focuses primarily on ML _development_ and adding
lightweight functionality on top of existing projects, which may be reusable in
deployment in some cases.

Kubeflow focuses on _deployment_ and building on top of Kubernetes, which could
be used during development but requires more up-front effort.

### [Could DVC be a good alternative to LFS for game development?](https://discord.com/channels/485586884165107732/485586884165107734/928336349487067196)

Thanks for such an interesting question @CB!

Yes! We have community members that use DVC to handle their large files in game
development.

There are several other use cases we've seen for DVC outside of machine learning
and data science. Some people have used DVC to track build artifacts for
deployment systems and to track performance data alongside design iterations and
simulation tools.

You should check out our
[#beyond-ml](https://discord.com/channels/485586884165107732/918159153824952320)
Discord channel to stay up to date with the other use cases the community is
coming p with!

### [Does DVC run on JSON/YAML configuration files for all things?](https://discord.com/channels/485586884165107732/563406153334128681/928779586622332938)

This is a great question about large projects with a lot of dependencies from
@SolemnSimulacrum!

All of the dependencies you list in `dvc run` are in fact configured in the
`dvc.yaml` file. `dvc run` is a convenience for adding a pipeline stage to this
file and then doing `dvc repro` on that stage. It's completely acceptable and
even encouraged to directly edit `dvc.yaml` if that's easier.

For example, if you are currently executing a command like this:

```dvc
$ dvc run -n prune \
        -o model.pt \
        -d ./DepFiles_0/ \
        -d ./DepFiles_1/ \
        -d ./DepFiles_2/ \
        -d ./src/.py \
        -d ./packages/.py \
        -d ./scripts/.py \
        -d ./data/.npy \
        python script.py
```

You could add those directly to the `dvc.yaml` like this:

```yaml
stages:
  prune:
    cmd: python script.py
    deps:
      - ./DepFiles_0/
      - ./DepFiles_1/
      - ./DepFiles_2/
      - ./src/.py
      - ./packages/.py
      - ./scripts/.py
      - ./data/.npy
    outs:
      - model.pt
```

### [I'm setting up MLOps at my company from scratch and we use GitLab and Cloudera DS workbench. What are the best resources to get started with CML?](https://discord.com/channels/485586884165107732/728693131557732403/923785806848614461)

This is a great question from @dvc!

We recommend you start with the [CML docs website](https://cml.dev/).

You can find some tutorials on [our blog](https://dvc.org/blog).

Or you can check out the videos on
[our YouTube channel](https://www.youtube.com/channel/UC37rp97Go-xIX3aNFVHhXfQ)

And of course, you can always ask questions in the Discord community!

### [I understand that DVC Studio is a discoverability layer over my DVC repo in GitHub. Will any of my data be stored on your servers?](https://discord.com/channels/485586884165107732/841856466897469441/923714473603256420)

This is a great question about DVC Studio from @johnnyaug!

DVC Studio only stores metrics, plots, and metadata about your pipelines in the
databases to be able to serve this as a table. We don't read actual data and we
don't store code.

An important thing to note is that if you have plots from `dvc plots show` that
are images, JSON files, or vega specs, those could be saved on our end as well
to serve them to UI.

We're working on documentation for this as well!

---

![The Lord Of The Rings GIF](https://media.giphy.com/media/zCME2Cd20Czvy/giphy.gif)

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
