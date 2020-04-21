---
title: February '20 Community Gems
date: 2020-02-19
description: |
  Great discussions and technical Q&A's from our users.
descriptionLong: |
  Look here every month for great discussions and technical Q&A's from our users 
  and core development team.
picture: 2020-02-19/feb20_gems_header_gr.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/feb-20-community-gems/330
tags:
  - Discord
  - Google Drive
  - Azure
  - Gems
  - Homebrew
---

## Discord gems

Welcome to the Februrary roundup of useful, intriguing, and good-to-know
discussions going on with DVC users and developers. Let's dive right in with
some questions from our Discord channel.

### Q: [If I have multiple outputs from a DVC pipeline and only want to checkout one, what command would I run?](https://discordapp.com/channels/485586884165107732/563406153334128681/670233820326264843)

By defult, `dvc checkout` is written for a
[Git-like experience](https://dvc.org/doc/command-reference/checkout), meaning
that it will sync your local workspace with all the model files, dependencies,
and outputs specified by a project's `.dvc` files. If you only want to access
one artifact from the project, you can do this with
`dvc checkout <path to file>`. This will deliver the specified file to your
workspace.

If you're interested in sharing specific artifacts (like data files or model
binaries) with other users, you might also consider `dvc get` and `dvc import`.
These functions are ideal for downloading a single file (or a few files) to the
local workspace, instead of the whole project.

### Q: [I have a complicated use case.](https://discordapp.com/channels/485586884165107732/563406153334128681/668773484549242890) We're trying to set up a system where users act as data scientists. They'd select data, which would be cleaned/transformed in the backend, and experiment with model hyperparameters until they're happy with the model result. Then they can "save" the model, including artifacts like the input data used, metrics, and binary model file, placing the experiment under version control. Later they can "load" the model again and select new input data from our database, change parameters, and "update it". There might be hundreds of separate models. Can DVC do this?

Most of this functionality is supported by DVC already. We recommend
`dvc import` as a method for giving users access to data in a repostiory (and
also check out our
[tutorial on data registries](https://dvc.org/doc/use-cases/data-registries)).
For pre-processing data,
[DVC pipelines](https://dvc.org/doc/get-started/pipeline) can automate a
procedure for transforming and cleaning inputs (i.e., you can use bash scripts
to `dvc run` the pipeline whenever a user selects a dataset). Saving the
workspace after experimentation, including model files, metrics, and outputs, is
a core function of DVC (see `dvc add` and `dvc push` functions). We also have a
[Python API](https://dvc.org/doc/use-cases/data-registries#programatic-reusability-of-dvc-data)
so users can load artifacts like datasets and model files into their local
Python session. When they're done experimenting, they can `dvc add` and
`dvc push` their progress. Users can later "pull" a saved workspace and all
associated files using `dvc checkout`

As for how to organize hundreds of separate experiments, we're still evolving
our strategy and best-practice recommendations. It's conceivable that each
experiment could be carried out and saved on a separate branch of a project
repository. Our thoughts about structuring version control around architecture
search and hyperparameter tuning could fill up a whole blog (and probably will
in the not-so-distant future); check out one of our
[recent conversation threads](https://github.com/iterative/dvc/issues/2799) if
you'd like to see where we're currently at. And please let us know how your use
case goes—at this stage, we'd love to hear what works for you.

### Q: [What's the difference](https://discordapp.com/channels/485586884165107732/563406153334128681/666708671333400599) between `config` and `config.local` files? Is it safe to do git commit without including my config file?

There are indeed two kinds of config files you might come across in your project
directory's `.dvc` folder and `.gitignore` file. The key difference is that
`config` is intended to be committed to Git, while `config.local` is not. You'd
use `config.local` to store sensitive information (like personal credentials for
SSH or another kind of authenticated storage) or settings specific to your local
environment—things you wouldn't want to push to a GitHub repo. DVC only modifies
`config.local` when you explicitly use the `--local` flag in the `dvc config` or
`dvc remote *` commands, so outside of these cases you shouldn't have to worry
about it.

As for using `git commit` without the `config` file, it is safe. _But_ you
should check if there are any settings in `config.local` that you actually want
to save to `config`. This would be rare, since as we mentioned, you'd only have
settings in `config.local` if you expressly called for them with the `--local`
flag.

### Q: I have an Azure storage account container, and the only link I can see in my Azure portal for the container is an `http://` link. But the tutorial on DVC shows Azure storage accessed with the `azure://` protocol. [Which is right?](https://discordapp.com/channels/485586884165107732/563406153334128681/675087897661276169)

What you're describing is exactly as it should be. `azure://` is an internal URL
protocol that tells DVC which API to use to connect to your remote storage, not
the exact address of your Blob. You can use the format
`azure://<container-name>/<optional-path>`. For more details, you can refer to
our documentation about
[supported storage types](https://dvc.org/doc/command-reference/remote/add#supported-storage-types).

### Q: [I'm using DVC to version my data with Google Drive storage.](https://discordapp.com/channels/485586884165107732/563406153334128681/667198775361536019) If I want a developer to be able to download the data, can I give them my `gdrive_client_id` and `gdrive_client_secret`, or maybe give them permission to access my Google Drive folder?

For Google Drive, `gdrive_client_id` and `gdrive_client_secret` aren't used to
access a specific user's Google Drive disk; they're predominantly used by
Google's API to
[track usage and set appropriate rate limits](https://rclone.org/drive/#making-your-own-client-id).
So the risk in sharing them is not that your personal files will be vulnerable,
but that your API usage limits could be negatively affected if others are using
it with your credentials. Whether this risk is acceptable is up to you. It's not
unusual for teams and organizations to share a set of credentials, so a
reasonable level of security may mean ensuring that the `config` file for your
project (which typically contains Google Drive credentials) is only visible to
team members.

Please check out our
[docs about Google Drive](https://dvc.org/doc/user-guide/setup-google-drive-remote),
too, for more about how DVC uses the Google Drive API.

### Q: I just tried to upgrade DVC via `homebrew` and got a "SHA256 mismatch" error. [What's going on](https://discordapp.com/channels/485586884165107732/485596304961962003/672930535261339669)?

What most likely happened is that you first installed DVC via
`brew install iterative/homebrew-dvc/dvc`, which is no longer supported—because
DVC is now a core Homebrew formula! Please uninstall and reinstall using
`brew install dvc` for uninterrupted upgrades in the future.

### Q: [I still can't convince myself to version-control the data rather than meta-data.](https://www.reddit.com/r/datascience/comments/aqkg59/does_anyone_use_data_version_control_dvc_thoughts/eq62lkt?utm_source=share&utm_medium=web2x) Can anyone give me a strong argument against version controlling data file paths in config files instead of using DVC?

_This question is from a [Reddit discussion.](https://bit.ly/38HOEcj)_

Versioning the meta-data associated with your dataset is certainly a workable
strategy. You can use prefixes and suffixes to distinguish models trained on
different versions of data, and keep your data files in one `.gitignored`
directory. That may be enough for some projects. In our experience, though,
we've found this comes with a host of complications that don't scale well:

1. You'll have to write custom code to support this configuration, specifying
   filepaths to your dataset with hardcoded links.
2. For files that are outputs of your analysis pipeline, you'll need to agree on
   conventions for suffixes/prefixes for naming to specify which version of the
   dataset was used.
3. Depending on the meta-data you use to version data files, you may not detect
   changes made by users. Even if you can tell a change has occurred, you may
   not be able to track _who_ did it _when_.

We designed DVC to optimize data management from the user's perspective: users
can change the dataset version without changing their code, so organizations
don't have to adhere to explicit filenaming conventions and hardcoded links that
are prone to human error. Furthermore, versioning data similar to how Git
versions code provides a largely immutable record of every change that has
occurred. We think this is important as teams and projects grow in complexity.
And from a systems-level perspective, DVC does more than track data: it
dedpulicates files behind the scenes, provides simple interfaces for sharing
datasets (and models!) with collaborators and users, and connects specific model
files with the dataset versions they were trained on.

To summarize, DVC is not the only way to version your data. But we think it's
one way to reduce the overhead of managing data infrastructure when your project
involves experimentation or collaboration.
