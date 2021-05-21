---
title: April '21 Community Gems
date: 2021-04-30
description: |
  A roundup of technical Q&A's from the [DVC](#dvc) and [CML](#cml) community. 
  This month: remote storage integration, removing old experiments,
  ideas for running CML pipeline reports and more.
descriptionLong: |
  A roundup of technical Q&A's from the [DVC](#dvc) and [CML](#cml) community. 
  This month: remote storage integration, removing old experiments,
  ideas for running CML pipeline reports and more.
picture: 2021-04-30/gems-cover.png
author: milecia_mcgregor
commentsUrl: https://discuss.dvc.org/t/april-21-community-gems/
tags:
  - Discord
  - Gems
  - DVC
  - CML
  - Remote Storage
---

Each month we go through our Discord messages to pull out some of the best
questions from our community. AKA: Community Gems. 💎 This month we'd like to
thank @asraniel, @PythonF, @mattlbeck, @Ahti, @yikeqicn, @lexzen, @EdAb,
@FreshLettuce for inspiring this month's gems!

As always, [join us in Discord](https://discord.com/invite/dvwXA2N) to get all
your DVC and CML questions answered!

## DVC

### [What is the best way, to commit 2 experiment runs?](https://discord.com/channels/485586884165107732/485596304961962003/836626346544594995)

You want to use `dvc exp branch` if you want to keep multiple experiments. That
way, each one is in a separate branch rather than trying to apply one experiment
on top of another.

### [How can I clean up the remote caches after a lot of experiments and branches have been pushed?](https://discord.com/channels/485586884165107732/485596304961962003/831142466169733120)

`dvc exp gc` requires some kind of flags to operate. At the very least,
`--workspace`. So, with `--workspace`, `dvc` will try to read all of the pointer
files: _.dvc_ files and _dvc.yaml_ files in the workspace. It will read all of
them and will determine all the cache objects/files that need to be preserved
(since they are being used in the current workspace). The rest of the files in
the _.dvc/cache_ are removed.

_This does not require any Git operations!_

You can also use the `--all-branches` flag. It will read all of the files
present in the current workspace and from the commits in the branches you have
locally. Then it will use that list to determine what to keep and what to
remove.

If you need to read pointer files from given tags you have locally, the
`--all-tags` flag is the best option.

The `--all-commits` flag reads pointer files from every commit and it will make
a list of all the files that are in the cache/remote and if the _.dvc_ file
isn't found in any commits of the Git repo, it will delete those files.

It doesn't check if the directories are empty and you can find info and comment
on this known issue, head to
[Issue #3375 here.](https://github.com/iterative/dvc/issues/3375) Your input is
ALWAYS valuable to us! 🙏🏼

### [If I have two cloud folder links added to the DVC config, I'm able to push the data to the default one. How could I push the data to the other cloud folder?](https://discord.com/channels/485586884165107732/563406153334128681/833176227762274364)

You're looking for the `-r / --remote` option for `dvc push`. The command looks
like this:

```dvc
$ dvc push --remote <name_of_remote_storage>
```

It will push directly to the remote storage you defined in the command above.

### [What's the current recommended way to automate hyperparameter search when using DVC pipelines?](https://discord.com/channels/485586884165107732/563406153334128681/829803720190590986)

Take a look at the new
[experiments feature](https://dvc.org/doc/start/experiments)! It enables you to
easily experiment with different parameter values.

You could script a grid search pretty easily by queueing an experiment for each
set of parameter values you want to try. For example:

```dvc
$ dvc exp run --queue -S alpha={alpha},beta={beta}
$ dvc exp run --run-all --jobs 2
```

Then you can compare the results with `dvc exp show`.

```
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
┃ Experiment    ┃ avg_prec ┃ roc_auc ┃ train.n_est┃ train.min_split ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
│ workspace     │  0.56191 │ 0.93345 │ 50         │ 2               │
│ master        │  0.55259 │ 0.91536 │ 50         │ 2               │
│ ├── exp-bfe64 │  0.57833 │ 0.95555 │ 50         │ 8               │
│ ├── exp-b8082 │  0.59806 │ 0.95287 │ 50         │ 64              │
│ ├── exp-c7250 │  0.58876 │ 0.94524 │ 100        │ 2               │
│ ├── exp-b9cd4 │  0.57953 │ 0.95732 │ 100        │ 8               │
│ ├── exp-98a96 │  0.60405 │  0.9608 │ 100        │ 64              │
│ └── exp-ad5b1 │  0.56191 │ 0.93345 │ 50         │ 2               │
└───────────────┴──────────┴─────────┴────────────┴─────────────────┘
```

We are working on developing experiments to have features or documented patterns
explicitly for grid search support, so definitely share any feedback to help
drive the future direction of that! You can find
[Issue #4283 here.](https://github.com/iterative/dvc/issues/4283)

### [When importing/getting data from a repo, how do I provide credentials to the source repo remote storage without saving it into that Git repo?](https://discord.com/channels/485586884165107732/563406153334128681/830021022337073185)

There's a bit of context behind this question that might give it more meaning.

---

I set up a private GitHub repo to be a data registry and I have set up a private
Azure remote where I have pushed some datasets.

I am now trying to read those datasets from another repository
("my-project-repo"), using `dvc get` (e.g.
`dvc get git@github.com:data-registry-repo.git path/data.csv`) but I get this
error:

```bash
ERROR: failed to get 'path/data.csv' from 'git@github.com:data-registry-repo.git' - Authentication to Azure Blob Storage via default credentials (https://azuresdkdocs.blob.core.windows.net/$web/python/azure-identity/1.4.0/azure.identity.html#azure.identity.DefaultAzureCredential) failed.
Learn more about configuration settings at <https://man.dvc.org/remote/modify>: unable to connect to account for Must provide either a connection_string or account_name with credentials!!
```

---

Generally, there are two ways solve this issue:

- [ENV vars](https://dvc.org/doc/user-guide/contributing/docs#env-variables)
- Setup some options using the `--global` or `--system` flags to update the DVC
  config

If you remove the old remotes (with the same name) from your project repo and
try to pull from the data registry using `AZURE_STORAGE_CONNECTION_STRING` and
`AZURE_STORAGE_CONTAINER_NAME`, it should work!

### [Is there any way to ensure that `dvc import` uses the cache from the config file?](https://discord.com/channels/485586884165107732/563406153334128681/827574712825413672)

This is another great question where a little context might be useful.

---

I'm trying to import a dataset project into another DVC project, let's call it
_dvcdata_.

The config for _dvcdata_ is:

```ini
[core]
    remote = awsremote
[cache]
    type = symlink
    dir = /home/user/dvc_cache
['remote "awsremote"']
    url = s3://...
```

When I run `dvc import git@github.com:user/dvcdata.git my_data`, it starts to
redownload it. I have double checked that I have pushed this config file to
master.

I have also checked that if I manually clone the repo and run
`cd /tmp/dvcdata; dvc pull`, the files are symlinked.

The command output says it's downloading to
`../../../../../../../tmp/tmphlgqpv9zdvc-clone/<file name>` so the cache isn't
being updated.

---

The repo you are importing into has its own cache directory. We recommend you
use the `--global` or `--system` flags for all of your projects across all
machines.

## CML

[I have an ML model that retrains every 24 hours with updated data, but I do not want to create a merge request every time. I just need a nice way to look at the results. Is there a solution on how to report the results of a pipeline in Gitlab?](https://discord.com/channels/485586884165107732/728693131557732403/827099289372983336)

Great question! CML doesn't currently have a feature that takes care of this,
but here are a couple of solutions (only one is needed):

1. Keep a separate branch with unrelated history for committing the reports.
2. Keep a single report file on the repository and update it with each commit.

[I've run into an error trying to get CML to orchestrate runs in my AWS account. It doesn't seem to be a permissions issue as the AWSEc2FullAccess policy seems to have worked, but I can't see the security group. What could be going wrong?](https://discord.com/channels/485586884165107732/728693131557732403/818450988084101160)

Check to make sure you are deploying to the correct region. Use the argument
`--cloud-region <region>` (`us-west` for example) to mark the region where the
instance is deployed.

[Head to these docs]([https://discord.com/channels/485586884165107732/728693131557732403/818450988084101160)
for more information on the optional arguments that the CML runner accepts.

Until next month...

https://media.giphy.com/media/XcAa52ejGuNqdb5SFQ/giphy.gif

[Join us in Discord](https://discord.com/invite/dvwXA2N) to get all your DVC and
CML questions answered and contribute to the MLOps community! 🚀
