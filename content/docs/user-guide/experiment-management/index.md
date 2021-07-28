# Experiment Management

_New in DVC 2.0_

Data science and ML are iterative processes that require a large number of
attempts to reach a certain level of a metric. Experimentation is part of the
development of data features, hyperspace exploration, deep learning
optimization, etc. DVC helps you codify and manage all of your
<abbr>experiments</abbr>, supporting these main approaches:

1. Create [experiments](#experiments) that derive from your latest project
   version without having to track them manually. DVC does that automatically,
   letting you list and compare them. The best ones can be made persistent, and
   the rest archived.
2. Place in-code [checkpoints](#checkpoints-in-source-code) that mark a series
   of variations, forming a deep experiment. DVC helps you capture them at
   runtime, and manage them in batches.
3. Make experiments or checkpoints [persistent](#persistent-experiments) by
   committing them to your <abbr>repository</abbr>. Or create these versions
   from scratch like typical project changes.

   At this point you may also want to consider the different
   [ways to organize](#organization-patterns) experiments in your project (as
   Git branches, as folders, etc.).

DVC also provides specialized features to codify and analyze experiments.
[Parameters](/doc/command-reference/params) are simple values you can tweak in a
human-readable text file, which cause different behaviors in your code and
models. On the other end, [metrics](/doc/command-reference/metrics) (and
[plots](/doc/command-reference/plots)) let you define, visualize, and compare
meaningful measures for the experimental results.

> 👨‍💻 See [Get Started: Experiments](/doc/start/experiments) for a hands-on
> introduction to DVC experiments.
