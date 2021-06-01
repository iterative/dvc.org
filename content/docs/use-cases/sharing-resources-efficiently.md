# Sharing Resources Efficiently

Data science teams need to handle large amounts of data, share limited
processing units (GPUs), avoid multiple data transfers, etc. It's not always
clear how to connect and utilize resources such as massive data stores or
powerful machines for an effective collaboration. An over-engineered solution
may involve clustering servers, load balancing software, etc.

![](/img/resource-pool.png) _Fragile and disjointed pool of limited resources_

Minimizing cost and complexity can make the difference, for example, when:

- Multiple users work on the same shared server.
- There's a centralized data storage unit or cluster.
- There's a single environment with access to the data needed to reproduce full
  [pipelines](/doc/start/data-pipelines).
- Distributing GPU time among people for training machine learning models

DVC's approach keeps it simple: you work with a set of intuitive terminal
commands that interact directly with your files and directories (data, models,
metrics, code, etc.). A built-in <abbr>caching</abbr> mechanism provides basic
[dataset optimization](/doc/user-guide/large-dataset-optimization), which
de-duplicates file contents automatically. And by linking files from the cache
to your <abbr>workspace</abbr>, DVC achieves near-instantaneous switching
between [versions of data](/doc/use-cases/versioning-data-and-model-files),
results, etc.

These benefits can extend to multiple copies of a <abbr>DVC project</abbr>, or
even different ones altogether. Just configure
[the same cache](/doc/user-guide/how-to/share-a-dvc-cache) directory in all of
them so that they share a central data location! The optimization of this local
(or network) storage will compound with each project that's added. This is a
useful pattern when [sharing a development server](#example-shared-cache), for
example.

![](/img/shared-server.png) _One data store shared among several parties_

A central [remote storage](/doc/command-reference/remote) (Amazon S3, SSH,
Google Drive, etc.) can also be used by many projects to synchronize cached data
(see `dvc push` and `dvc pull`). It these caches are not set up in a shared
location, then the DVC remote can be the primary storage instead.

> 💡 Another way to centralize the data requirements of your projects is to
> implement a [data registry](/doc/use-cases/data-registries) pattern and
> leverage `dvc import`.

You can also optimize your data processing with DVC. This is made possible by
codifying your [data pipelines](/doc/start/data-pipelines). You can then deploy
the same project on one or more environments (using Git), and reproduce any
variation of the pipeline(s) with a few commands. This enables a range of
processing workflows, from distributing the execution of [experiment
queues][queueing-experiments], to rotating an ML model training environment
among team members (or batches of data).

[queueing-experiments]:
  /doc/command-reference/exp/run#queueing-and-parallel-execution

![](/img/remote-execution.png) _Remote execution of ML pipelines_

> ♾️ You can use [CML](https://cml.dev/) to integrate your desired workflow on
> platforms like GitHub or GitLab. This can be part of your CI/CD (MLOps), along
> with automatic performance reports, among other benefits!

Finally, there's the question of handling residual data objects left behind by
different people and processes. This can be a challenging and risky task without
a clear mapping of who-uses-what in a collaborative setting. DVC provides this
exact map through human-readable [metafiles](/doc/user-guide/project-structure)
that you can analyze and manipulate as needed. Garbage collection becomes as
simple as typing `dvc gc` with this approach.
