# Data Science Experiment Bookkeeping

Mature data science required constant research and improvement. This implies
continuous experimentation on any stage of the data lifecycle, from acquisition
to processing and usage, for example to train machine learning models. But
keeping track of all these experiments is challenging, not to mention being able
to reproduce them again in the future.

At it's core, DVC helps you version not only data but the
[entire pipeline](/doc/user-guide/project-structure/pipelines-files) that
transforms and utilizes it. On top of this, DVC includes a layer of
[experiment management](/doc/user-guide/experiment-management) features to
capture any variations to your pipeline automatically. These
<abbr>experiment</abbr> can then be handled easily, either individually or in
bulk. Note that at no point so far will you need to worry about the underlying
versioning layer (Git). Some things you can do:

- Automatic bookkeeping of all changes to the project before you run each
  experiment.
- Define one or more experiments for future execution (locally or on a remote
  machine).
- List and compare previous experiments in a consolidated way (order and filter
  by <abbr>parameters</abbr> or <abbr>metrics</abbr>).
- Restore experimental results instantly to continue working on that idea.
- Reproduce any experiment in other environments or in the future if needed.
- Select the experiments that you want to preserve as regular project versions
  (Git commits).
- Discard project variations that are no longer useful, either individually or
  in bulk.
