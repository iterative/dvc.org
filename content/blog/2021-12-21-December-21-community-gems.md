---
title: December '21 Community Gems
date: 2021-12-21
description: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  runners, working with data, DVC Studio, and more.
descriptionLong: >
  A roundup of technical Q&A's from the DVC and CML community. This month: CML
  runners, working with data, DVC Studio, and more.
picture: 2021-12-21/dec-community-gems.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/december-21-community-gems/964
tags:
  - Data Versioning
  - DVC Studio
  - DVC
  - CML
  - Community
---

### [While doing a `dvc pull`, I accidentally entered the verification from the wrong Google account. How can I edit that?](https://discord.com/channels/485586884165107732/563406153334128681/908437162150739978)

No problem @fireballpoint1! This happens sometimes.

You should be able to run the following command in your terminal and then re-enter your credentials.

```bash
$ rm .dvc/tmp/gdrive-user-credentials.json
```

That should give you a chance to enter the correct credentials when you try to `dvc pull` again.

### [Can I add a `dvc remote` which refers to NAS by IP so I don't have to mount on every computer?](https://discord.com/channels/485586884165107732/563406153334128681/912667503283564544)

That's a new question for us @Krzysztof Begiedza!

If you enable the SSH service on your NAS, you can configure DVC to use it as an SSH remote.

There should also be DSM packages for webdav as well, if you prefer that over SSH. Just make sure that your URL looks similar to this.

```dvc
url = webdav://<ip>/<path>
```

### [Can you selectively "dvc pull" data files?](https://discord.com/channels/485586884165107732/563406153334128681/913713923667148850)

Great question @Clemens!

You would `dvc import` the relevant files into each of your individual projects and run `dvc pull` in there. DVC will then only pull the relevant files.

The command for that pull would be similar to this.

```dvc
$ dvc pull path/to/specific/file
```

### []()

### []()

### []()

### []()

### []()

---

https://media.giphy.com/media/jS27LWasgUIYrXtP83/giphy.gif

At our January Office Hours Meetup we will be doing a new thing!
[RSVP for the Meetup here]()
to stay up to date with specifics as we get closer to the event!

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered!
