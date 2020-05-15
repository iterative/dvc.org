---
title: January '20 Community Gems
date: 2020-01-20
description: |
  Great discussions and technical Q&A's from our users.
descriptionLong: |
  Every month we share news, findings, interesting reads, community takeaways,
  and everything else along the way. Some of those are related to our brainchild
  [DVC](https://dvc.org) and its journey. The others are a collection of
  exciting stories and ideas centered around ML best practices and workflow.
picture: 2020-01-20/Community_Gems.png
pictureComment:
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/january-20-community-gems/315
tags:
  - Discord
  - Gems
---

## Discord gems

There's a lot of action in our Discord channel these days. Ruslan, DVC's core
maintainer, said it best with a gif.

https://twitter.com/rkuprieiev/status/1144008869414342658?ref_src=twsrc%5Etfw

It's a lot to keep up with, so here are some highlights. We think these are
useful, good-to-know, and interesting conversations between DVC developers and
users.

### Q: [What pros does DVC have compared to Git LFS?](https://discordapp.com/channels/485586884165107732/563406153334128681/657590900754612284)

For an in-depth answer, check out this
[Stack Overflow discussion](https://stackoverflow.com/questions/58541260/difference-between-git-lfs-and-dvc).
But in brief, with DVC you don't need a special server, and you can use nearly
any kind of storage (S3, Google Cloud Storage, Azure Blobs, your own server,
etc.) without a fuss. There are also no limits on the size of the data that you
can store, unlike with GitHub. With Git LFS, there are some general LFS server
limits, too. DVC has additional features for sharing your data (e.g.,
`dvc import`) and has pipeline support, so it does much more than LFS. Plus, we
have flexible and quick checkouts, as we utilize different link types (reflinks,
symlinks, and hardlinks). We think there are lots of advantages; of course, the
usefulness will depend on your particular needs.

### Q: [How do I use DVC with SSH remote storage?](https://discordapp.com/channels/485586884165107732/563406153334128681/656016145119182849) I usually connect with a .pem key file. How do I do the same with DVC?

DVC is built to work with the SSH protocol to access remote storage (we provide
some
[examples in our official documentation](https://dvc.org/doc/user-guide/external-dependencies#ssh)).
When SSH requires a key file, try this:

```dvc
$ dvc remote modify myremote keyfile <path to *.pem>
```

### Q: [If you train a TensorFlow model that creates multiple checkpoint files, how do you establish them as dependencies in the DVC pipeline?](https://discordapp.com/channels/485586884165107732/563406153334128681/651098762466426891)

You can specify a directory as a dependency/output in your DVC pipeline, and
store checkpointed models in that directory. It might look like this:

```dvc
$ dvc run \
     -f train.dvc \
     -d data \
     -d train.py \
     -o models python code/train.py
```

where `models` is a directory created for checkpoint files. If you would like to
preserve your models in the data directory, though, then you would need to
specify them one by one. You can do this with bash:

```dvc
$ dvc run $(for file in data/*.gz; do echo -n -d $file; done)
```

Be careful, though: if you declare checkpoint files to be an output of the DVC
pipeline, you won’t be able to re-run the pipeline using those checkpoint files
to initialize weights for model training. This would introduce circularity, as
your output would become your input.

Also keep in mind that whenever you re-run a pipeline with `dvc repro`, outputs
are deleted and then regenerated. If you don't wish to automatically delete
outputs, there is a `--persist` flag (see discussion
[here](https://github.com/iterative/dvc/issues/1214) and
[here](https://github.com/iterative/dvc/issues/1884)), although we don't
currently provide technical support for it.

Finally, remember that setting something as a dependency (`-d`) doesn't mean it
is automatically tracked by DVC. So remember to `dvc add` data files in the
beginning!

### Q: [Is it possible to use the same cache directory for multiple DVC repos that are used in parallel?](https://discordapp.com/channels/485586884165107732/485596304961962003/655012135973158942) Or do I need external software to prevent potential race conditions?

This is absolutely possible, and you don't need any external software to safely
use multiple DVC repos in parallel. With DVC, cache operations are atomic. The
only exception is cleaning the cache with `dvc gc`, which you should only run
when no one else is working on a shared project that is referenced in your cache
(and also, be sure to use the `--projects` flag
[as described in our docs](https://dvc.org/doc/command-reference/gc)). For more
about using multiple DVC repos in parallel, check out some discussions
[here](https://discuss.dvc.org/t/setup-dvc-to-work-with-shared-data-on-nas-server/180)
and [here](https://dvc.org/doc/use-cases/shared-development-server).

### Q: [What are some strategies for reproducibility if parts of our model training pipeline are run on our organizations's HPC?](https://discordapp.com/channels/485586884165107732/485596304961962003/652380507832844328)

Using DVC for version control is entirely compatible with using remote computing
resources, like high performance computing (HPC), in your model training
pipeline. We think a great example of using DVC with parallel computing is
provided by [Peter Fogh](http://www.peterfogh.dk/) Take a
[look at his repo](https://github.com/PeterFogh/dvc_dask_use_case) for a
detailed use case. Please keep us posted about how HPC works in your pipeline,
as we'll be eager to pass on any insights to the community.

### Q: Say I have a Git repository with multiple projets inside (one classification, one object detection, etc.). [Is it possible to tell DVC to just pull data for one particular project?](https://discordapp.com/channels/485586884165107732/563406153334128681/646760832616890408)

Absolutely, DVC supports pulling data from different DVC-files. An example would
be having two project subdirectories in your Git repo, `classification` and
`detection`. You could use `dvc pull -R classification` to only pull files in
that project to your workspace.

If you prefer to be even more granular, you can `dvc add` files individually.
Then you can use `dvc pull <filename>.dvc` to retrieve the outputs specified
only by that file.

### Q: [Is it possible to set an S3 remote without the use of AWS credentials with DVC?](https://discordapp.com/channels/485586884165107732/563406153334128681/623234659098296348) I want to publicly host a dataset so that everybody who clones my code repo can just run `dvc pull` to fetch the dataset.

Yes, and we love the idea of publicly hosting a dataset. There are a few ways to
do it with DVC. We use one method in our own DVC project repository on Github.
If you run `git clone https://github.com/iterative/dvc` and then `dvc pull`,
you’ll see that DVC is downloading data from an HTTP repository, which is
actually just an S3 repository that we've granted public HTTP read-access to.

So you would need to configure two remotes in your config file, each pointing to
the same S3 bucket through different protocols. Like this:

```dvc
$ dvc remote add -d --local myremote s3://bucket/path
$ dvc remote add -d mypublicemote http://s3-external-1.amazonaws.com/bucket/path
```

Here's why this works: the `-d` flag sets the default remote, and the `--local`
flag creates a set of configuration preferences that will override the global
settings when DVC commands are run locally and won't be shared through Git (you
can read more about this
[in our docs](https://dvc.org/doc/command-reference/remote/add)).

This means that even though you and users from the public are accessing the
stored dataset by different protocols (S3 and HTTPS), you'll all run the same
command: `dvc pull`.
