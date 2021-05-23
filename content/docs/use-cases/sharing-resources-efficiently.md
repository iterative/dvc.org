# Sharing Resources Efficiently

Data science teams need to handle large files, rotate the use of special
processors, and minimize data transfers. This involves provisioning and managing
resources such as massive on-prem data stores and powerful servers, which can be
expensive and time consuming.

![](/img/resource-pool.png) _Fragile and disjointed pool of data resources_

Minimizing this cost and complexity can make the difference, for example, when:

- Multiple users work on the same shared server.
- There's a centralized data storage unit or single-entry cluster.
- There's a single computing environment with access to the data needed to
  reproduce full [experiments](/doc/user-guide/experiment-management).
- Distributing GPU time among people or processes for training machine learning
  models

In DVC, a built-in <abbr>caching</abbr> mechanism already provides individual
<abbr>projects</abbr> with basic
[dataset optimization](/doc/user-guide/large-dataset-optimization). It
de-duplicates file contents automatically. And by linking files from cache to
<abbr>workspace</abbr>, it achieves near-instantaneous switching between
[versions of data](/doc/use-cases/versioning-data-and-model-files), results,
etc. (think **Git for data**).

These benefits can extend to multiple DVC repository clones, or even to
different projects altogether. Just set up
[the same external cache](/doc/user-guide/how-to/share-a-dvc-cache) directory so
they all share a central data location, optimizing local (or network) storage.

![](/img/shared-server.png) _One data store shared among people or projects_

Additionally/Alternatively, [remote storage](/doc/command-reference/remote) (on
Amazon S3, SSH, Google Drive, etc.) can also be shared by multiple projects to
synchronize their data caches (see `dvc push` and `dvc pull`). This can reduce
service costs by consolidating data backups.

> 💡 Another way to centralize some or all of the data requirements of your
> projects is to implement a [data registry](/doc/use-cases/data-registries)
> pattern.

Something else that data-driven teams may need is a specialized execution
environment (such as a server with abundant memory and GPUs) to test experiments
on large data loads. This lets different members confirm whether promising
[data pipeline](/doc/start/data-pipelines) improvements they have developed
locally scale up.

To this end, you can deploy the <abbr>DVC repository</abbr> on a shared server
(easy using Git). The familiar DVC [CLI](/doc/command-reference) can be used
there to checkout specific project versions (e.g. Git branches or tags), plug in
full datasets, and reproduce the experiments in question (see `dvc exp run`).

![]() _TO-DO: Do we want a 3rd figure here?_

> 💡 Integrate this part of the team's workflow to a regular development process
> (on platforms like GitHub or GitLab) using [CML](https://cml.dev/). This can
> be part of your CI/CD setup, and include automatic performance reports.

Finally, there's the question of managing residual data objects left behind by
different people and processes. This can be a challenging and risky task without
a clear mapping of who-uses-what in a collective work effort. DVC provides this
exact map through human-readable [metafiles](/doc/user-guide/project-structure)
that you can analyze and manipulate as needed. Garbage collection becomes as
simple as typing `dvc gc` with this approach.

<!--

Your colleagues can [checkout](/doc/command-reference/checkout) the data (from
the shared <abbr>cache</abbr>), and have both `raw` and `clean` data files
appear in their workspace without moving anything manually. After this, they
could decide to continue building this [pipeline](/doc/command-reference/dag)
and process the clean data:

```dvc
$ git pull
$ dvc checkout
A       raw  # Data is linked from cache to workspace.
$ dvc run -n process_clean_data -d process.py -d clean -o processed
          ./process.py clean processed
$ git add dvc.yaml dvc.lock
$ git commit -m "process clean data"
$ git push
```

And now you can just as easily make their work appear in your workspace with:

```dvc
$ git pull
$ dvc checkout
A       processed
```

-->
