# Fast Data Storage Layer

Datasets used in data science tend to exceed typical storage and networking
capacities. Storage needs expand rapidly as more people and projects acquire the
same data, creating duplication and increasing cost. Valuable time is wasted
waiting for downloads, and the wait repeats across environments. Is there an
effective way to perform this process?

![](/img/dataset-copies.png) _Manual organization of data files_

DVC's built-in data <abbr>caching</abbr> enables you to implement a simple and
efficient storage layer globally — for all your team's projects. This approach
can help in situations such as:

- You want to speed up data transfers from a massive object store which is
  currently on the cloud, or to move a growing dataset out of your machine
  without slowing things down. How can you use something in the middle (like a
  NAS drive)?

- Upgrading your entire storage platform is expensive. Can you pay only for fast
  access to frequently-used data?

- You want to de-duplicate files automatically when multiple people are working
  on the same data (for example, on a
  [shared development server](#example-shared-development-server)).

- Your team shares access to a GPU server for machine learning
  [experiments](/doc/user-guide/experiment-management). How can you switch the
  data inputs quickly, without re-downloading every time?

**You can unify all your data across <abbr>projects</abbr> by setting up a
[shared DVC cache].** This deduplicates your entire data store and minimizes
transfers by linking your files and directories. DVC can also manage
[remote storage](/doc/command-reference/remote) on platforms like Amazon S3 or
Google Drive, in order to [share](/doc/use-cases/sharing-data-and-model-files)
and back up your datasets or ML models.

> 📖 See more information on the
> [dataset optimization](/doc/user-guide/large-dataset-optimization) built into
> DVC.

![](/img/storage-layers.png) _Data storage middleware for multiple projects_

Now that your team shares a primary storage, it can be managed independently as
part of your infrastructure -- provisioned depending on data access speed
requirements. It also lets you implement _data security_ policies in a central
location. And importantly, you have the flexibility to change storage providers
at any time, without having to change the directory structures or code of your
projects.

## Example: Shared development server

Some teams prefer using a single shared machine to run their experiments. This
allows better resource utilization (quick transfers, central storage, GPU
access, etc.) in a simple way. Each person can work in separate
<abbr>workspaces</abbr>, and DVC will handle the data linking.

![](/img/shared-server.png) _Data storage shared by DVC projects_

⚙️ Start by configuring a [shared DVC cache].

[shared dvc cache]: /doc/user-guide/how-to/share-a-dvc-cache

> ⚠️ It's not recommended to share a single workspace among users, as it may
> produce file permission issues.

Let's say you are cleaning up raw data for later stages:

```dvc
$ dvc add raw
$ dvc stage add -n clean_data -d cleanup.py -d raw -o clean \
                ./cleanup.py raw clean
$ dvc repro

$ git add cleanup.py raw.dvc dvc.yaml dvc.lock .gitignore
$ git commit -m "Cleanup raw data"
$ git push
```

> 📖 Learn more about `dvc add`, `dvc stage add`, and `dvc repro`.

The data gets <abbr>cached</abbr> in the shared location. Your colleagues can
`dvc checkout` your work, and have both the `raw` and `clean` data file-linked
to their workspace automatically. Imagine that they then decide to continue
building this [pipeline](/doc/command-reference/dag), and process the clean
data:

```dvc
$ git pull
$ dvc checkout
A       raw
A       clean
# ... work on processing clean data ...

$ dvc stage add -n process_data
                -d process.py -d clean -o processed
                ./process.py clean processed
$ dvc repro

$ git add process.py dvc.yaml dvc.lock .gitignore
$ git commit -m "Process data"
$ git push
```

You can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```
