---
title: January '22 Community Gems
date: 2022-01-31
description: >
  A roundup of technical Q&A's from the DVC community. This month: comparing
  experiments, working with data, working with pipelines, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC community. This month: comparing
  experiments, working with data, working with pipelines, and more.
picture: 2021-12-21/dec-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/january-22-community-gems/1001
tags:
  - Data Versioning
  - DVC Remotes
  - DVC API
  - DVC Stages
  - Community
---

### [Is it possible to stream objects to and from remote caches?](https://discord.com/channels/485586884165107732/563406153334128681/919567459189682177)

Thanks for asking @mihaj!

You can stream files using the DVC API. The are two methods that you'll likely
want to check out. First there's `dvc.api.open`. This opens a file tracked by
DVC and generates a corresponding file object. Here's a quick example:

```python
import dvc.api

with dvc.api.open(
        'get-started/data.xml',
        repo='https://github.com/iterative/dataset-registry'
        ) as fd:
        # do things with the file object here
```

The simplest way to return the contents from a DVC tracked file would be to use
`dvc.api.read`. The returned content can be a bytearray or string. Here's a
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

The best way to handle any package dependencies will be to include a
requirements.txt file with the specific versions your pipeline needs.

Another approach you can take is having a stage that dumps the package version
as an intermediate output. It doesn't have to be saved in Git or DVC becasue
it's easily reproduced and the DVC internals should be able to take care of
detecting that the package didn't change.

### []()

### []()

### []()

### []()

### []()

### []()

---

https://media.giphy.com/media/h5Ct5uxV5RfwY/giphy.gif

At our February Office Hours Meetup we will be ...!
[RSVP for the Meetup here](https://www.meetup.com/DVC-Community-Virtual-Meetups/events/282663146/)
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
