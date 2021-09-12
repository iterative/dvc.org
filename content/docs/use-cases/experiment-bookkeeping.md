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
capture any variations to your pipeline automatically. These `dvc experiments`
can then be handled easily, either individually or in bulk. Note that at no
point so far will you need to worry about the underlying versioning layer (Git).
