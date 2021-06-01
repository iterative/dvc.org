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
(or network) storage will compound with each project that's added.

![](/img/shared-server.png) _One data store shared among people or projects_

A central [remote storage](/doc/command-reference/remote) (Amazon S3, SSH,
Google Drive, etc.) can also be used by many projects to synchronize cached data
(see `dvc push` and `dvc pull`). It these caches are not set up in a shared
location, then the DVC remote can be the primary storage instead.

> 💡 Another way to centralize the data requirements of your projects is to
> implement a [data registry](/doc/use-cases/data-registries) pattern and
> leverage `dvc import`.

Data science teams may also need a specialized execution environment (with
abundant memory and GPUs, for example) to test
[experiments](/doc/start/experiments) on large data loads. This lets different
members confirm whether promising [data pipeline](/doc/start/data-pipelines)
improvements developed locally scale up.

To this end, you can deploy the <abbr>DVC repository</abbr> on a shared server
(easy using Git). The familiar DVC [CLI](/doc/command-reference) can be used
there to checkout specific project versions (e.g. branches or tags), plug in
full datasets, and reproduce the experiments in question (see `dvc exp run`).

![]() _TO-DO: Do we want a 3rd figure here?_

> 💡 Integrate this part of the workflow to a regular development process (on
> platforms like GitHub or GitLab) using [CML](https://cml.dev/). This can be
> part of your CI/CD setup, and include automatic performance reports.

Finally, there's the question of handling residual data objects left behind by
different people and processes. This can be a challenging and risky task without
a clear mapping of who-uses-what in a collaborative setting. DVC provides this
exact map through human-readable [metafiles](/doc/user-guide/project-structure)
that you can analyze and manipulate as needed. Garbage collection becomes as
simple as typing `dvc gc` with this approach.
