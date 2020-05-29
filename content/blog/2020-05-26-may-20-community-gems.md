---
title: May '20 Community Gems
date: 2020-05-26
description: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  development best practices, sharing models and data across projects, 
  and using DVC with teams.
descriptionLong: |
  A roundup of technical Q&A's from the DVC community. This month, we discuss 
  development best practices, sharing models and data across projects, 
  and using DVC with teams.
picture: 2020-05-26/May_20_Gems_Header.png
author: elle_obrien
commentsUrl: https://discuss.dvc.org/t/may-20-community-gems/398
tags:
  - Discord
  - Gems
  - Cache
  - Google Cloud Storage
  - Import
---

## Discord gems

Here are some Q&A's from our Discord channel that we think are worth sharing.

### Q: [How do I completely delete a file from DVC?](https://discord.com/channels/485586884165107732/563406153334128681/710546561498873886)

To stop tracking a file with DVC, you can simply delete the file and its
corresponding `.dvc` file (if there is one) from your project. But, what if you
want to entirely erase a file from DVC?

After deleting the `.dvc` file, you'll usually want to
[clear your DVC cache](https://dvc.org/doc/command-reference/gc#gc). Ordinarily,
that's done with `dvc gc`. However, if there's any chance the file you wish to
remove might be referenced by another commit (even under a different name), be
sure to use the right flag: `dvc gc --all-commits`.

If you want to remove a single `.dvc` file without doing a cache cleanup, look
into the `.dvc` file and note the `md5` field inside. Then use this value to
identify the corresponding file in your `.dvc/cache` and delete it. For example:
if your target file has `md5`: 123456, the corresponding file in your cache will
be `.dvc/cache/12/3456`.

There's one last case worth mentioning: what if you're deleting a file inside a
DVC-tracked folder? For example, say you've previously run

```dvc
dvc add data_dir
```

and now want to remove a single file (say, `image_1.png`) from `data_dir`. When
DVC starts tracking a directory, it creates a corresponding `.dir` file inside
`.dvc/cache` that lists every file and subfolder, as well as an `md5` for each,
in a JSON format. You'll want to locate this `.dir` file in the cache, and then
find the entry corresponding to `image_1.png`. It'll give the `md5` for
`image_1.png`. Finally, go back to `.dvc/cache`, identify the file corresponding
to that `md5`, and delete it. For detailed instructions about `.dir` files,
where to find them and how they're used,
[see our docs about the structure of the cache](https://dvc.org/doc/user-guide/dvc-files-and-directories#structure-of-cache-directory).

Having said all this... please know that in the future, we plan to support a
function like `git rm` that will allow easier deletes from DVC!

### Q: [Is it safe to add a custom file to my DVC remote?](https://discord.com/channels/485586884165107732/563406153334128681/707551737745244230https://discord.com/channels/485586884165107732/563406153334128681/707551737745244230)

Definitely. Some people add additional files to their DVC remote, like a README
to explain to teammates what the folder is being used for. Having an additional
file in the remote that isn't part of DVC tracking won't pose any issues. You
would only encounter problems if you were manually modifying or deleting
contents of the remote managed by DVC.

### Q: [Are there limits to how many files DVC can handle? My dataset contains ~100,000 files.](https://discord.com/channels/485586884165107732/563406153334128681/706538115048669274)

We ourselves have stored datasets containing up to 2 million files, so 100,000
is certainly feasible. Of course, the larger your dataset, the more time data
transfer operations will take. Luckily, we have a
[DVC 1.0 contains several data transfer optimizations](https://dvc.org/blog/dvc-3-years-and-1-0-release#data-transfer-optimizations)
to substantially reduce the time needed to `dvc pull / push / status -c / gc -c`
for very large datasets.

### Q: [Two developers on my team are doing `dvc push` to the same remote. Should they `dvc pull` first?](https://discord.com/channels/485586884165107732/563406153334128681/704211629075857468)

It's safe to push simultaneously, no `dvc pull` needed. While some teams might
be in the habit of frequently pulling, like in Git flow, there are less risks of
"merge conflicts" in DVC. That's because DVC remotes stores files indexed by
`md5`s, so there's usually a very low probability of a collision (if two
developers have two different versions of a file, they'll be stored as two
separate files in the DVC remote- so no merge conflicts).

### Q: [What are `*.tmp` files in my DVC remote?](https://discord.com/channels/485586884165107732/563406153334128681/698163554095857745)

Inside your DVC remote, you might see `.tmp` files from incomplete uploads. This
can happen if a user killed a process like `dvc push`. You can safely remove
them; for example, if you're using an S3 bucket, `aws s3 rm ... *.tmp` will do
the trick.

One caveat: before you delete, make sure no one is actively running `dvc push`.

### Q: [I'm using a Google Cloud Platform (GCP) bucket as a DVC remote and getting an error. Any ideas?](https://discord.com/channels/485586884165107732/485596304961962003/705131622537756702)

If you're getting the error,

```
ERROR: unexpected error - ('invalid_grant: Bad Request', '{\n "error": "invalid_grant",\n "error_description": "Bad Request"\n}')
```

something is going wrong with your GCP authentication! A few things to check:
first,
[check out our docs](https://dvc.org/doc/command-reference/remote/add#supported-storage-types)
to `dvc remote add` a Google Cloud bucket as your remote. Note that before DVC
can use this type of remote, you have to configure your credentials through the
GCP CLI
([see docs here](https://dvc.org/doc/command-reference/remote/add#supported-storage-types)).

If you're still getting an error, DVC probably can't find the `.json`
credentials file for your GCP bucket. Try authenticating using
`gcloud beta auth application-default login`. This command obtains your access
credentials and places them in a `.json` in your local workspace.

### Q: [I'm working on several projects that all need involve the same saved model. One project trains a model and pushes it to cloud storage with `dvc push`, and another takes the model out of cloud storage for use. What's the best practice for doing this with DVC?](https://discord.com/channels/485586884165107732/485596304961962003/708318821253120040)

One of DVC's goals is to make it easy to move models and datasets in and out of
cloud storage. We had this in mind when we designed the function `dvc import` -
it lets you reuse artifacts from one project to another. And you can quickly
synchronize an artifact, like a model or dataset, with its latest version using
`dvc update`. Check out our
[docs about `import`](https://dvc.org/doc/command-reference/import), and also
our [data registry use case](https://dvc.org/doc/use-cases/data-registries) for
an example of sharing artifacts across projects.

![](/static/uploads/images/2020-05-26/data-registry.png) _Using DVC for sharing
artifacts like datasets and models across projects and teammates._
